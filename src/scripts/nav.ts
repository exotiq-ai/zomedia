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
  let lastScrollY = window.scrollY;
  const HIDE_THRESHOLD = 120; // px scrolled before hide-on-scroll engages
  const DELTA = 6; // px of movement required to flip state (anti-jitter)

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        nav.classList.toggle('is-scrolled', y > 60);

        // Hide-on-scroll-down, reveal-on-scroll-up. Never hide while
        // at top or while the mobile menu is open.
        const mobileMenuOpen = menu?.classList.contains('is-open');
        if (!mobileMenuOpen) {
          if (y > HIDE_THRESHOLD && y - lastScrollY > DELTA) {
            nav.classList.add('is-hidden');
          } else if (lastScrollY - y > DELTA || y <= HIDE_THRESHOLD) {
            nav.classList.remove('is-hidden');
          }
        }

        lastScrollY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
