// Website walkthrough recorder.
// Drives a headless Chromium against the local preview build and records a
// timed screen capture (home above-the-fold hold -> scroll -> Cell Power ->
// About founder quote). Output is a raw .webm; encode to MP4 with ffmpeg.
//
// Usage: BASE_URL=http://localhost:4327 node tools/record-walkthrough.mjs
import { chromium } from 'playwright';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:4327';
const OUT_DIR = process.env.OUT_DIR || path.resolve('walkthrough-raw');
const W = 1920, H = 1080;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function playAllVideos(page) {
  await page.evaluate(() => {
    document.querySelectorAll('video').forEach((v) => {
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
  });
}

async function smoothScrollTo(page, targetY, duration) {
  await page.evaluate(
    ({ targetY, duration }) =>
      new Promise((resolve) => {
        const startY = window.scrollY;
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        const endY = Math.max(0, Math.min(targetY, maxY));
        const dist = endY - startY;
        const start = performance.now();
        const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
        function frame(now) {
          const t = Math.min(1, (now - start) / duration);
          window.scrollTo(0, startY + dist * ease(t));
          if (t < 1) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      }),
    { targetY, duration }
  );
}

async function smoothScrollToSelector(page, selector, duration, offset = 90) {
  const y = await page.evaluate(
    ({ selector, offset }) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return window.scrollY + rect.top - offset;
    },
    { selector, offset }
  );
  if (y === null) {
    console.warn('WARN selector not found:', selector);
    return;
  }
  await smoothScrollTo(page, y, duration);
}

const browser = await chromium.launch({
  headless: true,
  args: [
    '--autoplay-policy=no-user-gesture-required',
    '--disable-blink-features=AutomationControlled',
    '--hide-scrollbars',
  ],
});
const context = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
  recordVideo: { dir: OUT_DIR, size: { width: W, height: H } },
});
const page = await context.newPage();
const video = page.video();

// --- 1. HOME: hold on the hero for a few seconds ---
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(600);
await playAllVideos(page);
await sleep(4000);

// --- 2. HOME: slow scroll down the page ---
await smoothScrollTo(page, 100000, 7500);
await sleep(500);

// --- 3. CELL POWER: pause on the logline long enough to read it ---
await page.goto(BASE + '/film-projects/documentaries/', { waitUntil: 'load' });
await page.waitForTimeout(700);
await playAllVideos(page);
await smoothScrollToSelector(page, '.film-feature__header', 2500, 200);
await sleep(4500);

// --- 4. CELL POWER: scroll to Ivan's bio below the video ---
await smoothScrollToSelector(page, '.director-bio', 3000);
await sleep(4000);

await context.close();
await browser.close();

const finalPath = await video.path();
console.log('VIDEO:' + finalPath);
