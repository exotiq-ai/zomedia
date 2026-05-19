/**
 * Scroll-reveal system — three variants (default lift, --unmask, --stagger).
 * Re-binds on every Astro page-load so it survives View Transitions.
 */

export {};

document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveals() {
  const selector = '.reveal:not(.is-visible), .reveal--unmask:not(.is-visible), .reveal--stagger:not(.is-visible)';
  const targets = document.querySelectorAll(selector);
  if (targets.length === 0) return;

  if (reduceMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

initReveals();
document.addEventListener('astro:page-load', initReveals);
