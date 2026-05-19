/**
 * Cooperative model interactive (Phase 4)
 * Re-binds on every Astro page-load so it survives View Transitions.
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

  const pcts = section.querySelectorAll<HTMLElement>('[data-coop-pct]');
  pcts.forEach((el, i) => {
    const target = parseInt(el.dataset.target || '0', 10);
    const startDelay = i === 0 ? 700 : 1000;
    countUp(el, target, 600, startDelay);
  });
}

function initCoopReveal() {
  const sections = document.querySelectorAll<HTMLElement>(
    '[data-coop-reveal]:not([data-coop-init])'
  );
  if (sections.length === 0) return;

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

  sections.forEach((el) => {
    el.dataset.coopInit = 'true';
    coopObserver.observe(el);
  });
}

initCoopReveal();
document.addEventListener('astro:page-load', initCoopReveal);
