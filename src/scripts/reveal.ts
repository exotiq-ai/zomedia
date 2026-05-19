export {};

document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Under reduced-motion preference, immediately mark every reveal element visible
// so they show their final state without animation.
if (reduceMotion) {
  document.querySelectorAll('.reveal, .reveal--unmask, .reveal--stagger').forEach((el) => {
    el.classList.add('is-visible');
  });
} else {
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

  document
    .querySelectorAll('.reveal, .reveal--unmask, .reveal--stagger')
    .forEach((el) => observer.observe(el));
}
