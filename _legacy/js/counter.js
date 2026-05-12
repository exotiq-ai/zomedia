/* js/counter.js — animated stat counters via IntersectionObserver */
(function () {
  'use strict';
  const stats = document.querySelectorAll('[data-counter]');
  if (!stats.length) return;

  const animate = (el) => {
    const target = el.dataset.counter;
    if (isNaN(parseFloat(target))) {
      // Non-numeric like "50 / 50" — show as-is
      el.textContent = target;
      return;
    }
    const num = parseFloat(target);
    const suffix = el.dataset.counterSuffix || '';
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(num * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    stats.forEach(animate);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => io.observe(s));
})();
