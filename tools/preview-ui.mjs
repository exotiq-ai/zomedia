import { chromium } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const base = process.env.BASE_URL || 'http://127.0.0.1:4403';
const browser = await chromium.launch();
const axe = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const out = 'output/launch';
fs.mkdirSync(out, { recursive: true });
try {
  for (const [width, height] of [[360, 740], [390, 844], [820, 1180], [1024, 768], [1440, 900], [1920, 1080]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${base}/coming-soon/`, { waitUntil: 'networkidle' });
    await page.locator('#access summary').click();
    await page.locator('#password').fill('example-only');
    await page.addScriptTag({ content: axe });
    const result = await page.evaluate(async () => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      titleCount: document.querySelectorAll('h1').length,
      broken: [...document.images].filter((image) => !image.complete || !image.naturalWidth).length,
      // @ts-ignore - axe is injected above.
      violations: (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } })).violations.map((v) => v.id),
    }));
    assert.equal(result.overflow, false, `Overflow at ${width}`);
    assert.equal(result.titleCount, 1);
    assert.equal(result.broken, 0);
    assert.deepEqual(result.violations, [], `Accessibility at ${width}`);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: `${out}/coming-soon-${width}.png`, fullPage: true });
    await page.close();
    console.log(`PASS ${width}×${height}: open password form, images, layout, reduced motion, accessibility`);
  }
} finally { await browser.close(); }
