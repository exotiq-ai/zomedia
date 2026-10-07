import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site';

/** /llms-full.txt — the same facts as /llms.txt with full book and people details inline. */
export const GET: APIRoute = async () => {
  const books = (await getCollection('books')).sort((a, b) => a.data.order - b.data.order);
  const team = await getCollection('team');
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  const u = (p: string) => `${SITE.url}${p}`;
  const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

  const people = (cat: string) =>
    team
      .filter((t) => t.data.category === cat)
      .sort((a, b) => a.data.order - b.data.order)
      .map((t) => `- **${t.data.name}**, ${t.data.role}${/coming soon/i.test(t.data.bio) ? '' : `: ${clean(t.data.bio)}`}`);

  const out = [
    `# ${SITE.name}: full site text`,
    '',
    `> ${SITE.longDescription}`,
    '',
    `Canonical site: ${SITE.url}. Parent organization: ${SITE.parent.name} (${SITE.parent.shortName}), ${SITE.parent.note}.`,
    '',
    '## What Zo Media does',
    '- **Literature:** publishes books by incarcerated authors and shares revenue with them.',
    '- **Film & theatre:** develops screenplays, stage works, and documentaries made by incarcerated creators.',
    "- **The Phuckin' Wire:** a free newsletter of advocacy journalism written by and for incarcerated people.",
    '- **Special projects:** original work at the intersection of art and advocacy.',
    '- **Cooperative model:** incarcerated members and outside co-chairs partner directly, so creators share in the economic value of their work.',
    '',
    '## Books',
    ...books.flatMap((b) => [
      '',
      `### ${b.data.title}`,
      `- URL: ${u(`/books/${b.id}/`)}`,
      `- Author: ${b.data.author}`,
      `- Category: ${b.data.category}${b.data.isForthcoming ? ' (forthcoming)' : ''}`,
      `- Print: ${b.data.priceHardcover}; eBook: ${b.data.priceEbook}`,
      `- ${clean(b.data.description)}`,
    ]),
    '',
    '## Special projects',
    ...projects.map((p) => `- **${p.data.title}**: ${clean(p.data.tagline)}. ${clean(p.data.description)}${p.data.status === 'placeholder' ? ' (coming soon)' : ''}`),
    '',
    '## Board of Directors',
    ...people('board'),
    '',
    '## Advisory Board',
    ...people('advisory'),
    '',
    '## How to help',
    `- Donate, volunteer, or sponsor: ${u('/support/')}`,
    `- Subscribe to updates: ${u('/the-wire/')}`,
    `- Contact: ${SITE.email}, ${SITE.phoneDisplay}`,
    '',
  ];

  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
