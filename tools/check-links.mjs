import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(process.argv[2] || 'dist');
const files = fs.readdirSync(root, { recursive: true }).filter((file) => file.endsWith('.html'));
const browser = await chromium.launch();
const context = await browser.newContext({ javaScriptEnabled: false });
await context.route('**/*', (route) => route.abort());
const page = await context.newPage();
const errors = [];
let checked = 0;
try {
  for (const file of files) {
    await page.setContent(fs.readFileSync(path.join(root, file), 'utf8'), { waitUntil: 'domcontentloaded' });
    const refs = await page.evaluate(() => [...document.querySelectorAll('a[href],img[src],script[src],link[href]')].map((el) => el.getAttribute('href') || el.getAttribute('src')));
    const route = '/' + file.replace(/index\.html$/, '');
    for (const ref of refs) {
      if (!ref || /^(?:mailto:|tel:|data:|#)/.test(ref)) continue;
      const url = new URL(ref, 'https://zomediaproductions.com' + route);
      if (url.origin !== 'https://zomediaproductions.com') continue;
      const target = path.join(root, decodeURIComponent(url.pathname));
      const exists = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')));
      checked++;
      if (!exists) errors.push(`${route} → ${url.pathname}`);
    }
  }
} finally { await browser.close(); }
console.log(`${files.length} HTML documents; ${checked} internal link/resource references checked`);
if (errors.length) { console.error([...new Set(errors)].join('\n')); process.exitCode = 1; }
else console.log('All internal destinations exist. External payment/retailer links require separate verification.');
