// Generates the static brand assets that can't be produced by Astro at build time:
//   • public/assets/og/*.jpg       1200×630 social cards (default + one per page + one per book)
//   • public/apple-touch-icon.png  180×180
//   • public/icon-192.png / icon-512.png / icon-maskable-512.png   (web app manifest)
// Rendered with headless Chromium so the real site fonts (Instrument Serif / Space Mono) are used.
//
// Usage: node tools/generate-brand-assets.mjs         (re-run when titles/books/logo change)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'public');
const font = (pkg, file) =>
  `data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64')}`;
const img = (p) => {
  const abs = path.join(PUB, p);
  const ext = path.extname(abs).slice(1).replace('jpg', 'jpeg');
  return `data:image/${ext};base64,${fs.readFileSync(abs).toString('base64')}`;
};

const FONTS = `
@font-face{font-family:'IS';src:url(${font('instrument-serif', 'instrument-serif-latin-400-normal.woff2')}) format('woff2');font-style:normal}
@font-face{font-family:'IS';src:url(${font('instrument-serif', 'instrument-serif-latin-400-italic.woff2')}) format('woff2');font-style:italic}
@font-face{font-family:'SM';src:url(${font('space-mono', 'space-mono-latin-400-normal.woff2')}) format('woff2')}
`;

const LOGO = img('assets/images/Zo-Media-primary-white-transparent.png');

const card = ({ eyebrow, title, sub, cover }) => `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0A0A0B;color:#E8E2D9;font-family:'IS',Georgia,serif;position:relative;overflow:hidden}
.grain{position:absolute;inset:0;background:radial-gradient(ellipse at 15% 85%,rgba(214,64,69,.16),transparent 60%),radial-gradient(ellipse at 90% 10%,rgba(200,168,78,.07),transparent 55%)}
.rule{position:absolute;left:72px;top:72px;bottom:72px;width:6px;background:#D64045}
.body{position:absolute;left:120px;top:72px;bottom:72px;width:${cover ? 640 : 900}px;display:flex;flex-direction:column;justify-content:center}
.eyebrow{font-family:'SM',monospace;font-size:22px;letter-spacing:.28em;text-transform:uppercase;color:#C8A84E;margin-bottom:28px}
h1{font-weight:400;font-size:${title.length > 38 ? 78 : title.length > 22 ? 92 : 112}px;line-height:1;letter-spacing:-.02em;margin-bottom:30px}
.sub{font-family:'SM',monospace;font-size:26px;line-height:1.5;color:#9C9CA6;max-width:760px}
.logo{position:absolute;right:72px;bottom:56px;height:84px;opacity:.95}
.cover{position:absolute;right:96px;top:72px;height:486px;aspect-ratio:2/3;object-fit:cover;box-shadow:0 30px 60px rgba(0,0,0,.6)}
</style></head><body><div class="grain"></div><div class="rule"></div>
<div class="body"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div>
${cover ? `<img class="cover" src="${cover}">` : `<img class="logo" src="${LOGO}">`}
</body></html>`;

const icon = (size, { maskable = false } = {}) => `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0}
body{width:${size}px;height:${size}px;background:#0A0A0B;display:flex;align-items:center;justify-content:center;flex-direction:column;overflow:hidden}
.z{font-family:'IS',serif;font-style:italic;color:#E8E2D9;font-size:${size * (maskable ? 0.5 : 0.66)}px;line-height:1;letter-spacing:-.03em;margin-top:-${size * 0.04}px}
.bar{width:${size * (maskable ? 0.3 : 0.32)}px;height:${size * 0.05}px;background:#D64045;margin-top:${size * 0.02}px}
</style></head><body><div class="z">Zo</div><div class="bar"></div></body></html>`;

// ── what to generate ────────────────────────────────────────────────
const PAGES = [
  ['default', 'A UBFSF 501(c)(3) Cooperative', 'Zo Media Productions', 'Literature, film, and art by incarcerated creators.'],
  ['about', 'About', 'A cooperative built from inside', 'How Zo Media shares economic power with incarcerated creators.'],
  ['books', 'Literature from inside', 'Books', 'Memoir, essays, poetry, and anthologies that carry incarcerated voices beyond the wall.'],
  ['film-projects', 'Film', 'Film Projects', 'Screenplays, theatrical works, and documentaries by incarcerated filmmakers.'],
  ['the-wire', 'The Publication', "The Phuckin' Wire", 'Advocacy journalism written by and for incarcerated people.'],
  ['support', 'Get Involved', 'Support the movement', 'Help advance creator-led literature, film, and art from inside the system.'],
  ['contact', 'Contact', 'Get in touch', 'Partnerships, press, projects, and ways to support incarcerated creators.'],
  ['special-projects', 'Special Projects', 'Special Projects', 'Original work at the intersection of art and advocacy.'],
  ['staff-and-volunteers', 'About', 'Staff & Volunteers', 'The people who power the cooperative.'],
  ['board-of-directors', 'About', 'Board of Directors', 'Governance and leadership.'],
  ['advisory-board', 'About', 'Advisory Board', 'Advisors guiding the work.'],
  ['screenplays', 'Film Projects', 'Screenplays', 'Original scripts by incarcerated creators.'],
  ['theatrical-works', 'Film Projects', 'Theatrical Works', 'Stage plays and performances by incarcerated artists.'],
  ['documentaries', 'Film Projects', 'Documentaries & Film Shorts', 'Documentary films and short works by incarcerated filmmakers.'],
];

const books = fs
  .readdirSync(path.join(ROOT, 'src/content/books'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const fm = fs.readFileSync(path.join(ROOT, 'src/content/books', f), 'utf8').split('---')[1];
    const get = (k) => (fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm')) || [])[1];
    return { slug: f.replace(/\.md$/, ''), title: get('title'), author: get('author'), category: get('category'), cover: get('coverImage') };
  });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const shoot = async (html, file, size = [1200, 630]) => {
  await page.setViewportSize({ width: size[0], height: size[1] });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const jpeg = file.endsWith('.jpg');
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: size[0], height: size[1] }, ...(jpeg ? { type: 'jpeg', quality: 86 } : {}) });
  console.log('✓', path.relative(ROOT, file));
};

for (const [slug, eyebrow, title, sub] of PAGES) {
  await shoot(card({ eyebrow: esc(eyebrow), title: esc(title), sub: esc(sub) }), path.join(PUB, 'assets/og', `${slug}.jpg`));
}
for (const b of books) {
  let cover;
  try { cover = img(b.cover); } catch { cover = undefined; }
  await shoot(
    card({ eyebrow: esc(`Book · ${b.category}`), title: esc(b.title), sub: esc(`by ${b.author}`), cover }),
    path.join(PUB, 'assets/og', `book-${b.slug}.jpg`)
  );
}
await shoot(icon(180), path.join(PUB, 'apple-touch-icon.png'), [180, 180]);
await shoot(icon(192), path.join(PUB, 'icon-192.png'), [192, 192]);
await shoot(icon(512), path.join(PUB, 'icon-512.png'), [512, 512]);
await shoot(icon(512, { maskable: true }), path.join(PUB, 'icon-maskable-512.png'), [512, 512]);

await browser.close();
