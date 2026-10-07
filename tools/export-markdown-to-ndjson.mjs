// One-time (and repeatable) migration: converts the Markdown content in src/content into a
// Sanity NDJSON file, uploading local images via `image@file://` asset references.
//
//   node tools/export-markdown-to-ndjson.mjs        → studio/migration/zomedia.ndjson
//   cd studio && npx sanity dataset import migration/zomedia.ndjson production --replace
//
// Document IDs are deterministic (book-<slug>, teamMember-<group>-<slug>, …) so re-running the
// import with --replace updates documents instead of duplicating them.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'studio/migration/zomedia.ndjson');

function readMd(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return { data: parse(m[1]), body: (m[2] ?? '').trim() };
}
const listMd = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listMd(path.join(dir, e.name)) : e.name.endsWith('.md') ? [path.join(dir, e.name)] : []
  );
const slugOf = (file) => path.basename(file, '.md');

const image = (publicPath, alt) => {
  if (!publicPath) return undefined;
  const abs = path.join(ROOT, 'public', publicPath);
  if (!fs.existsSync(abs)) {
    console.warn('! missing image', publicPath);
    return undefined;
  }
  return { _type: 'image', _sanityAsset: `image@${pathToFileURL(abs).href}`, ...(alt ? { alt } : {}) };
};
const slug = (s) => ({ _type: 'slug', current: s });
const clean = (o) => JSON.parse(JSON.stringify(o)); // drop undefined

const docs = [];

for (const f of listMd(path.join(ROOT, 'src/content/books'))) {
  const { data, body } = readMd(f);
  const s = slugOf(f);
  docs.push({
    _id: `book-${s}`,
    _type: 'book',
    title: data.title,
    slug: slug(s),
    author: data.author,
    category: data.category,
    description: data.description,
    longDescription: body && body !== data.description.trim() ? body : undefined,
    cover: image(data.coverImage, `Cover of ${data.title}`),
    priceHardcover: data.priceHardcover,
    priceEbook: data.priceEbook,
    purchaseUrl: data.purchaseUrl,
    isForthcoming: Boolean(data.isForthcoming),
    order: data.order,
  });
}

for (const f of listMd(path.join(ROOT, 'src/content/team'))) {
  const { data } = readMd(f);
  const s = slugOf(f);
  docs.push({
    _id: `teamMember-${data.category}-${s}`,
    _type: 'teamMember',
    name: data.name,
    slug: slug(s),
    role: data.role,
    category: data.category,
    bio: String(data.bio ?? '').trim(),
    photo: image(data.photo, data.name),
    order: data.order,
  });
}

for (const f of listMd(path.join(ROOT, 'src/content/projects'))) {
  const { data } = readMd(f);
  docs.push({
    _id: `specialProject-${data.slug}`,
    _type: 'specialProject',
    title: data.title,
    slug: slug(data.slug),
    tagline: data.tagline,
    description: data.description,
    status: data.status,
    externalUrl: data.externalUrl,
    heroImage: image(data.heroImage, data.title),
    order: data.order,
  });
}

// Matches the numbers currently hard-coded on the home page. Edit them in the Studio afterwards.
docs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  stats: { booksPublished: 12, profitsToCommunity: 50, creators: 100, projects: 4 },
  socialLinks: [
    { _key: 'fb', label: 'Facebook', url: 'https://www.facebook.com/unitedblack.familyscholarshipfoundation' },
    { _key: 'ig', label: 'Instagram', url: 'https://www.instagram.com/ubfsforg/' },
  ],
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, docs.map((d) => JSON.stringify(clean(d))).join('\n') + '\n');
const counts = docs.reduce((a, d) => ((a[d._type] = (a[d._type] || 0) + 1), a), {});
console.log(`Wrote ${docs.length} documents → ${path.relative(ROOT, OUT)}`, counts);
