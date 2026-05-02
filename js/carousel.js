/* js/carousel.js — book carousel arrow controls (CSS scroll-snap does the rest) */
(function () {
  'use strict';
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.carousel__track');
    const prev = carousel.querySelector('.carousel__btn--prev');
    const next = carousel.querySelector('.carousel__btn--next');
    if (!track) return;
    const scrollDistance = () => track.clientWidth * 0.8;
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -scrollDistance(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: scrollDistance(), behavior: 'smooth' }));
  });
})();
