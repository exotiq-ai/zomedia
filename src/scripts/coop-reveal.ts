/**
 * Cooperative model interactive (Phase 4)
 *
 * When the .coop section enters viewport:
 *   1. Add .is-revealing — CSS handles cascaded pillar + splitbar animations
 *   2. Count the splitbar percentages up from 0 → target (timed to match the
 *      bar's scaleX transition so the number lands when the fill completes)
 *
 * Respects prefers-reduced-motion: skips animation, sets final state.
 */

export {};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function countUp(el: HTMLElement, target: number, duration: number, startDelay: number) {
  const start = performance.now() + startDelay;

  function tick(now: number) {
    if (now < start) {
      requestAnimationFrame(tick);
      return;
    }
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Same ease-out cubic as the rest of the site
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + '%';
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function revealCoop(section: HTMLElement) {
  if (reduceMotion) {
    section.classList.add('is-revealing');
    section.querySelectorAll<HTMLElement>('[data-coop-pct]').forEach((el) => {
      const target = parseInt(el.dataset.target || '0', 10);
      el.textContent = target + '%';
    });
    return;
  }

  section.classList.add('is-revealing');

  // Count the two percentage labels in sync with the CSS bar-fill timings.
  // UBFSF bar transition-delay: 400ms, duration 700ms → number arrives ~1100ms.
  // Coop bar transition-delay: 700ms, duration 700ms → number arrives ~1400ms.
  const pcts = section.querySelectorAll<HTMLElement>('[data-coop-pct]');
  pcts.forEach((el, i) => {
    const target = parseInt(el.dataset.target || '0', 10);
    const startDelay = i === 0 ? 700 : 1000;
    const duration = 600;
    countUp(el, target, duration, startDelay);
  });
}

const coopObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealCoop(entry.target as HTMLElement);
        coopObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3, rootMargin: '0px 0px -80px 0px' }
);

document.querySelectorAll<HTMLElement>('[data-coop-reveal]').forEach((el) => {
  coopObserver.observe(el);
});
