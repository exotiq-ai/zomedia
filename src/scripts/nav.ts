export {};

const nav = document.querySelector<HTMLElement>('.nav');
const toggle = document.querySelector<HTMLButtonElement>('.nav__toggle');
const menu = document.querySelector<HTMLElement>('.nav__menu');

function closeMenu() {
  if (toggle && menu) {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('is-open');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
}

if (nav) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('is-scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
}
