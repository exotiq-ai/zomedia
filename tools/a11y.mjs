// Automated accessibility scan (axe-core, WCAG 2.1 A/AA + best-practice) over every page at
// phone and desktop widths.   Usage:  BASE_URL=http://localhost:4399 node tools/a11y.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:4399';
const axeSource = fs.readFileSync(path.resolve(import.meta.dirname, '../node_modules/axe-core/axe.min.js'), 'utf8');
const PAGES = (process.env.PAGES ||
  '/,/about/,/books/,/books/king-early-years/,/film-projects/,/film-projects/documentaries/,/film-projects/screenplays/,/film-projects/theatrical-works/,/the-wire/,/special-projects/,/support/,/contact/,/staff-and-volunteers/,/board-of-directors/,/advisory-board/,/privacy/,/terms/,/thanks/,/404.html'
).split(',');

const browser = await chromium.launch();
let total = 0;
for (const [name, w, h] of [['phone', 390, 844], ['desktop', 1440, 900]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  for (const p of PAGES) {
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(1800); // let entrance animations settle so contrast is measured on final colors
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate(() =>
      // @ts-ignore
      axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } })
    );
    for (const v of res.violations) {
      total++;
      console.log(`[${v.impact}] ${name} ${p}  ${v.id}: ${v.help}  (${v.nodes.length}) e.g. ${v.nodes[0].target.join(' ')}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(total ? `\n${total} violation group(s)` : '\nno violations');
process.exit(total ? 1 : 0);
