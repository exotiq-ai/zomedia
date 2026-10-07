/**
 * Navigation behaviour — mobile menu + hide-on-scroll.
 *
 * Astro's <ClientRouter /> swaps the <body> on every navigation, which
 * replaces the <nav> element. Listeners are therefore bound once on
 * `document`/`window` and the nav elements are looked up at event time, so
 * nothing goes stale across page transitions.
 */

export {};

const MOBILE_QUERY = window.matchMedia('(max-width: 1024px)');
const HIDE_THRESHOLD = 120; // px scrolled before hide-on-scroll engages
const DELTA = 6; // px of movement required to flip state (anti-jitter)

const getNav = () => document.querySelector<HTMLElement>('.nav');
const getToggle = () => document.querySelector<HTMLButtonElement>('.nav__toggle');
const getMenu = () => document.querySelector<HTMLElement>('.nav__menu');

function setMenuOpen(open: boolean, returnFocus = false) {
  const toggle = getToggle();
  const menu = getMenu();
  if (!toggle || !menu) return;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  } else if (returnFocus) {
    toggle.focus();
  }
}

document.addEventListener('click', (e) => {
  const target = e.target as Element | null;
  if (!target) return;

  if (target.closest('.nav__toggle')) {
    const menu = getMenu();
    setMenuOpen(!menu?.classList.contains('is-open'));
    return;
  }
  // Any link inside the open mobile menu closes it.
  if (target.closest('.nav__menu a')) setMenuOpen(false);
});

document.addEventListener('keydown', (e) => {
  const menu = getMenu();
  if (!menu?.classList.contains('is-open')) return;

  if (e.key === 'Escape') {
    setMenuOpen(false, true);
    return;
  }

  // Keep keyboard focus inside the open full-screen menu.
  if (e.key === 'Tab') {
    const focusables = [getToggle(), ...menu.querySelectorAll<HTMLElement>('a[href]')].filter(
      (el): el is HTMLElement => !!el
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Leaving the mobile breakpoint (rotate / resize) must never strand a locked body.
MOBILE_QUERY.addEventListener('change', (e) => {
  if (!e.matches) setMenuOpen(false);
});

let lastScrollY = window.scrollY;
let ticking = false;

function onScroll() {
  const nav = getNav();
  if (!nav) {
    ticking = false;
    return;
  }
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 60);

  // Hide-on-scroll-down, reveal-on-scroll-up. Never hide while at the top,
  // while the mobile menu is open, or while focus is inside the nav.
  const menuOpen = getMenu()?.classList.contains('is-open');
  if (!menuOpen) {
    if (y > HIDE_THRESHOLD && y - lastScrollY > DELTA && !nav.contains(document.activeElement)) {
      nav.classList.add('is-hidden');
    } else if (lastScrollY - y > DELTA || y <= HIDE_THRESHOLD) {
      nav.classList.remove('is-hidden');
    }
  }
  lastScrollY = y;
  ticking = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true }
);

// Every navigation gets a fresh <nav>: reset state and sync scroll classes.
document.addEventListener('astro:page-load', () => {
  document.body.style.overflow = '';
  lastScrollY = window.scrollY;
  onScroll();
});
