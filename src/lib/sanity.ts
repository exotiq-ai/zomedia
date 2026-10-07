/**
 * Sanity client + content loaders.
 *
 * The site reads from Sanity at BUILD time (static output stays fast and cheap). A Sanity
 * webhook → Netlify build hook rebuilds the site whenever an editor publishes. When
 * PUBLIC_SANITY_PROJECT_ID is not set, content.config.ts falls back to the Markdown files
 * in src/content, so the site always builds. See docs/SANITY.md.
 */
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { Loader } from 'astro/loaders';

const env = import.meta.env as Record<string, string | undefined>;

export const SANITY_ENABLED = Boolean(env.PUBLIC_SANITY_PROJECT_ID);

export const sanityClient = SANITY_ENABLED
  ? createClient({
      projectId: env.PUBLIC_SANITY_PROJECT_ID!,
      dataset: env.PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2025-01-01',
      // Test hook: point at a local mock instead of api.sanity.io (see docs/SANITY.md → Testing).
      ...(env.PUBLIC_SANITY_API_HOST ? { apiHost: env.PUBLIC_SANITY_API_HOST, useProjectHostname: false } : {}),
      useCdn: false, // build-time reads must always be fresh
      perspective: 'published', // never leak drafts into the public site
      token: env.SANITY_API_READ_TOKEN || undefined, // only needed for a private dataset
    })
  : null;

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

/** Sanity image field → optimized CDN URL (auto format, capped width). */
export function sanityImage(source: unknown, width = 1200): string {
  if (!source || !builder) return '';
  return builder.image(source as never).width(width).auto('format').quality(82).url();
}

type Mapped = { id: string; data: Record<string, unknown>; body?: string };

/** Build an Astro content-layer loader from a GROQ query. */
export function sanityLoader(opts: { name: string; query: string; map: (doc: any) => Mapped }): Loader {
  return {
    name: `sanity-${opts.name}`,
    async load({ store, parseData, generateDigest, renderMarkdown, logger }) {
      if (!sanityClient) throw new Error('Sanity loader used without PUBLIC_SANITY_PROJECT_ID');
      const docs: any[] = await sanityClient.fetch(opts.query);
      logger.info(`Loaded ${docs.length} ${opts.name} document(s) from Sanity`);
      store.clear();
      for (const doc of docs) {
        const { id, data, body } = opts.map(doc);
        const parsed = await parseData({ id, data });
        store.set({
          id,
          data: parsed,
          body,
          digest: generateDigest({ id, data, body }),
          rendered: body ? await renderMarkdown(body) : undefined,
        });
      }
    },
  };
}

const PUBLISHED = '!(_id in path("drafts.**"))';

export const queries = {
  books: `*[_type == "book" && ${PUBLISHED}] | order(order asc){
    _id, title, "slug": slug.current, author, category, description, longDescription,
    cover, priceHardcover, priceEbook, purchaseUrl, isForthcoming, order
  }`,
  team: `*[_type == "teamMember" && ${PUBLISHED}] | order(order asc){
    _id, name, "slug": slug.current, role, category, bio, photo, order
  }`,
  projects: `*[_type == "specialProject" && ${PUBLISHED}] | order(order asc){
    _id, title, "slug": slug.current, tagline, description, heroImage, externalUrl, status, order
  }`,
  siteSettings: `*[_type == "siteSettings"][0]{
    stats, socialLinks, announcement
  }`,
};

export const mappers = {
  book: (d: any): Mapped => ({
    id: d.slug,
    data: {
      title: d.title,
      author: d.author,
      category: d.category,
      description: d.description,
      coverImage: sanityImage(d.cover, 900),
      priceHardcover: d.priceHardcover ?? '',
      priceEbook: d.priceEbook ?? '',
      purchaseUrl: d.purchaseUrl || undefined,
      isForthcoming: Boolean(d.isForthcoming),
      order: d.order ?? 999,
    },
    body: d.longDescription || undefined,
  }),
  team: (d: any): Mapped => ({
    id: `${d.category}/${d.slug}`,
    data: {
      name: d.name,
      role: d.role,
      category: d.category,
      bio: d.bio ?? '',
      photo: d.photo ? sanityImage(d.photo, 600) : undefined,
      order: d.order ?? 999,
    },
  }),
  project: (d: any): Mapped => ({
    id: d.slug,
    data: {
      title: d.title,
      slug: d.slug,
      tagline: d.tagline ?? '',
      description: d.description ?? '',
      heroImage: d.heroImage ? sanityImage(d.heroImage, 1400) : undefined,
      externalUrl: d.externalUrl || undefined,
      status: d.status ?? 'placeholder',
      order: d.order ?? 999,
    },
  }),
};

/** Site-wide editable settings (stats, social links). Returns null when Sanity is off or unset. */
type SiteSettings = {
  stats?: { booksPublished?: number; profitsToCommunity?: number; creators?: number; projects?: number };
  socialLinks?: Array<{ label: string; url: string }>;
};

// Cached for the whole build: the footer asks on every page.
let settingsPromise: Promise<SiteSettings | null> | undefined;

export function getSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityClient) return Promise.resolve(null);
  settingsPromise ??= sanityClient
    .fetch(queries.siteSettings)
    .then((r: SiteSettings | null) => r ?? null)
    .catch((err: unknown) => {
      console.warn('[sanity] siteSettings fetch failed — using defaults', err);
      return null;
    });
  return settingsPromise;
}
