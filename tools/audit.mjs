// Responsive / health audit. Loads every page at phone, tablet and desktop
// widths and reports horizontal overflow, broken images, console errors,
// missing alt text, small tap targets, heading counts and mobile-menu behaviour.
//
// Usage:
//   npm run build && npx astro preview --port 4399   (or `npm run dev`)
//   BASE_URL=http://localhost:4399 node tools/audit.mjs
// Options (env):
//   ENGINE=chromium|webkit|firefox   (default chromium; webkit ≈ iOS Safari)
//   SHOTS=dir                        save full-page screenshots there
//   PAGES=/,/about/                  limit to specific paths
import { chromium, webkit, firefox } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:4399';
const ENGINE = { chromium, webkit, firefox }[process.env.ENGINE || 'chromium'];
const SHOTS = process.env.SHOTS;
const PAGES = (process.env.PAGES ||
  '/,/about/,/books/,/books/king-early-years/,/film-projects/,/film-projects/documentaries/,/film-projects/screenplays/,/film-projects/theatrical-works/,/the-wire/,/special-projects/,/support/,/contact/,/staff-and-volunteers/,/board-of-directors/,/advisory-board/,/privacy/,/terms/,/thanks/,/404.html'
).split(',');
const VIEWPORTS = [
  ['phone-s', 360, 740],
  ['phone', 390, 844],
  ['tablet', 820, 1180],
  ['tablet-l', 1024, 768],
  ['desktop', 1440, 900],
  ['wide', 1920, 1080],
];

if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const browser = await ENGINE.launch();
let failures = 0;

for (const [vn, w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 1024 });
  for (const p of PAGES) {
    const page = await ctx.newPage();
    const errs = [];
    const devNoise = (t) => /dev-toolbar|Outdated Optimize Dep|\[vite\]/.test(t);
    page.on('console', (m) => ['error', 'warning'].includes(m.type()) && !devNoise(m.text()) && errs.push(`${m.type()}: ${m.text().slice(0, 140)}`));
    page.on('requestfailed', (r) => !devNoise(r.url()) && errs.push(`REQFAIL ${r.url().slice(0, 100)}`));
    const res = await page.goto(BASE + p, { waitUntil: 'networkidle' });
    if (res && res.status() >= 400 && !p.includes('404')) {
      console.log(`${vn.padEnd(9)} ${p.padEnd(34)} HTTP ${res.status()}`);
      failures++;
      await page.close();
      continue;
    }
    await page.evaluate(async () => {
      const H = document.documentElement.scrollHeight;
      for (let y = 0; y < H; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const vw = de.clientWidth;
      const over = [...document.querySelectorAll('body *')]
        .filter((e) => {
          if (e.closest('.ticker')) return false;
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.right > vw + 1 && getComputedStyle(e).position !== 'fixed';
        })
        .slice(0, 4)
        .map((e) => e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 30));
      return {
        hScroll: de.scrollWidth > vw + 1,
        over,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
        noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
        h1: document.querySelectorAll('h1').length,
        tiny: [...document.querySelectorAll('a,button,input,select,textarea,summary')].filter((e) => {
          if (e.closest('.sr-only, .skip-link') || e.type === 'hidden') return false;
          const r = e.getBoundingClientRect();
          const inline = getComputedStyle(e).display === 'inline';
          return !inline && r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44);
        }).length,
      };
    });
    const bad = m.hScroll || m.broken || m.noAlt || m.h1 !== 1 || errs.length;
    if (bad) failures++;
    console.log(
      `${bad ? '✗' : '✓'} ${vn.padEnd(9)} ${p.padEnd(34)}`,
      m.hScroll ? `H-SCROLL ${JSON.stringify(m.over)}` : '',
      m.broken ? `broken-img=${m.broken}` : '',
      m.noAlt ? `no-alt=${m.noAlt}` : '',
      m.h1 !== 1 ? `h1=${m.h1}` : '',
      `tap<44=${m.tiny}`,
      errs.length ? JSON.stringify([...new Set(errs)]) : ''
    );
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${vn}-${p.replace(/\//g, '_') || 'home'}.png`), fullPage: true });
    await page.close();
  }
  await ctx.close();
}

// Mobile menu must open, overlay the whole viewport, and survive client-side navigation.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const probe = async () => {
    await page.click('.nav__toggle');
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => {
      const el = document.querySelector('.nav__menu');
      const b = el.getBoundingClientRect();
      return { open: el.classList.contains('is-open'), h: Math.round(b.height), vh: innerHeight };
    });
    return r.open && r.h >= r.vh - 1 ? 'ok' : `FAIL ${JSON.stringify(r)}`;
  };
  const first = await probe();
  await page.click('.nav__menu a[href="/about/"]');
  await page.waitForURL('**/about/');
  await page.waitForTimeout(700);
  const second = await probe();
  console.log(`mobile menu: first load = ${first}; after client-side navigation = ${second}`);
  if (first !== 'ok' || second !== 'ok') failures++;
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} problem(s)` : '\nall clear');
process.exit(failures ? 1 : 0);
