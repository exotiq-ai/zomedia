/**
 * Stat counter — animated count-up with character.
 * Re-binds on every Astro page-load so it survives View Transitions.
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
  const phaseOneDuration = 1400;
  const phaseTwoDuration = 280;
  const totalDuration = phaseOneDuration + (useOvershoot ? phaseTwoDuration : 0);
  const start = performance.now();

  function tick(now: number) {
    const elapsed = now - start;
    if (elapsed < phaseOneDuration) {
      const t = elapsed / phaseOneDuration;
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(eased * overshootMax);
      el.textContent = prefix + current.toLocaleString() + suffix;
      requestAnimationFrame(tick);
    } else if (useOvershoot && elapsed < totalDuration) {
      const t = (elapsed - phaseOneDuration) / phaseTwoDuration;
      const eased = 1 - Math.pow(1 - t, 2);
      const current = Math.round(overshootMax - eased * (overshootMax - target));
      el.textContent = prefix + current.toLocaleString() + suffix;
      requestAnimationFrame(tick);
    } else {
      el.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]:not([data-counter-init])');
  if (counters.length === 0) return;

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

  counters.forEach((el) => {
    el.dataset.counterInit = 'true';
    counterObserver.observe(el);
  });
}

// Initial load + every Astro View Transitions navigation
initCounters();
document.addEventListener('astro:page-load', initCounters);
