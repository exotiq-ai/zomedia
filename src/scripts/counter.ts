/**
 * Stat counter — animated count-up with character.
 *
 * Improvements:
 *   - Eased deceleration (cubic ease-out)
 *   - Tiny overshoot — count to N+2 then settle back to N (only for targets ≥10)
 *   - Locale-aware number formatting
 *   - Honors prefers-reduced-motion (skips animation, sets final value)
 *
 * Element contract: <span data-counter data-target="100" data-suffix="+">0</span>
 */

export {};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el: HTMLElement) {
  const target = parseInt(el.dataset.target || '0', 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';

  if (reduceMotion) {
    el.textContent = prefix + target.toLocaleString() + suffix;
    return;
  }

  const useOvershoot = target >= 10;
  const overshootMax = useOvershoot ? target + 2 : target;
  const phaseOneDuration = 1400; // count up to peak
  const phaseTwoDuration = 280;  // settle from peak to target
  const totalDuration = phaseOneDuration + (useOvershoot ? phaseTwoDuration : 0);
  const start = performance.now();

  function tick(now: number) {
    const elapsed = now - start;

    if (elapsed < phaseOneDuration) {
      // Phase 1: count up to overshoot peak with ease-out cubic
      const t = elapsed / phaseOneDuration;
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(eased * overshootMax);
      el.textContent = prefix + current.toLocaleString() + suffix;
      requestAnimationFrame(tick);
    } else if (useOvershoot && elapsed < totalDuration) {
      // Phase 2: settle from peak back to target
      const t = (elapsed - phaseOneDuration) / phaseTwoDuration;
      const eased = 1 - Math.pow(1 - t, 2);
      const current = Math.round(overshootMax - eased * (overshootMax - target));
      el.textContent = prefix + current.toLocaleString() + suffix;
      requestAnimationFrame(tick);
    } else {
      // Done — pin to exact target
      el.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target as HTMLElement);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
  counterObserver.observe(el);
});
