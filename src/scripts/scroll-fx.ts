/**
 * Scroll-linked motion — one rAF-throttled scroll listener drives every effect, so the
 * main thread does a single cheap pass per frame. Everything is opt-in via data attributes
 * and disabled entirely under prefers-reduced-motion.
 *
 *   [data-parallax="0.08"]   slow vertical drift for hero media (needs an overflow:hidden parent)
 *   [data-scrub-words]       words light up as the element scrolls through the viewport
 *   html::after progress bar uses native scroll-driven CSS where supported; this script
 *                            only sets --scroll-p as a fallback for browsers without it.
 *
 * Uses transform/opacity only (no layout work), re-binds on Astro's `astro:page-load`.
 */

export {};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const nativeProgress = CSS.supports('animation-timeline: scroll()');

type Parallax = { el: HTMLElement; host: HTMLElement; speed: number };
type Scrub = { el: HTMLElement; words: HTMLElement[]; lit: number };

let parallax: Parallax[] = [];
let scrubs: Scrub[] = [];
let ticking = false;

function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.scrubReady) return Array.from(el.querySelectorAll<HTMLElement>('.scrub-word'));
  const text = el.textContent?.trim().replace(/\s+/g, ' ') ?? '';
  el.textContent = '';
  const words = text.split(' ').map((w, i, all) => {
    const span = document.createElement('span');
    span.className = 'scrub-word';
    span.textContent = w + (i < all.length - 1 ? ' ' : '');
    el.appendChild(span);
    return span;
  });
  el.dataset.scrubReady = 'true';
  return words;
}

function collect() {
  parallax = [];
  scrubs = [];
  if (reduceMotion.matches) return;

  // Parallax only with a fine pointer: touch devices already feel the scroll, and the extra
  // per-frame transforms are the first thing to jank on a mid-range phone.
  if (finePointer.matches) {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const host = el.parentElement;
      if (!host) return;
      const speed = parseFloat(el.dataset.parallax || '0.08');
      el.style.willChange = 'transform';
      parallax.push({ el, host, speed });
    });
  }

  document.querySelectorAll<HTMLElement>('[data-scrub-words]').forEach((el) => {
    scrubs.push({ el, words: splitWords(el), lit: -1 });
  });
}

function frame() {
  ticking = false;
  const vh = window.innerHeight;

  if (!nativeProgress) {
    const max = document.documentElement.scrollHeight - vh;
    document.documentElement.style.setProperty('--scroll-p', max > 0 ? String(Math.min(1, window.scrollY / max)) : '0');
  }

  for (const p of parallax) {
    const r = p.host.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) continue;
    // 0 when the host is centred in the viewport; ± as it scrolls away.
    const offset = (r.top + r.height / 2 - vh / 2) * -p.speed;
    p.el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.1)`;
  }

  for (const s of scrubs) {
    const r = s.el.getBoundingClientRect();
    // Only dim the text once it is about to enter the viewport, so the page is full-contrast
    // at rest (and for tools/readers that never scroll it into view).
    s.el.classList.toggle('is-scrubbing', r.top < vh);
    const start = vh * 0.88; // words begin lighting when the block's top crosses 88% of the viewport
    const end = vh * 0.5; //   all lit when its bottom reaches the middle
    const progress = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
    const lit = Math.round(progress * s.words.length);
    if (lit !== s.lit) {
      s.words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
      s.lit = lit;
    }
  }
}

function schedule() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(frame);
  }
}

window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule, { passive: true });
reduceMotion.addEventListener('change', () => {
  collect();
  schedule();
});

document.addEventListener('astro:page-load', () => {
  collect();
  schedule();
});
