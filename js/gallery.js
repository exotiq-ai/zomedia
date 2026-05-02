(function () {
  var items = document.querySelectorAll('.masonry__item');
  var lightbox = document.getElementById('lightbox');
  if (!items.length || !lightbox) return;

  var titleEl = lightbox.querySelector('.lightbox__title');
  var metaEl = lightbox.querySelector('.lightbox__meta');
  var closeBtn = lightbox.querySelector('.lightbox__close');

  function openLightbox(item) {
    titleEl.textContent = item.dataset.title || '';
    metaEl.textContent = (item.dataset.medium || '') + (item.dataset.price ? ' — ' + item.dataset.price : '');
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () { openLightbox(item); });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
})();
