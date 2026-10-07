/**
 * Sends the few events that matter to whichever analytics tool is configured
 * (src/config/analytics.ts). No-ops when none is.
 *   • page views on every View Transitions navigation (GA4 only; Plausible handles SPA itself)
 *   • form_submit      — contact / newsletter success (from forms.ts)
 *   • outbound_click   — clicks to external domains (book purchase links, social, donate)
 */

export {};

type Win = Window & {
  gtag?: (...a: unknown[]) => void;
  plausible?: (name: string, opts?: { props?: Record<string, string> }) => void;
};
const w = window as Win;

function track(name: string, props: Record<string, string> = {}) {
  w.plausible?.(name, { props });
  w.gtag?.('event', name, props);
}

document.addEventListener('astro:page-load', () => {
  w.gtag?.('event', 'page_view', { page_location: location.href, page_title: document.title });
});

window.addEventListener('zo:form-success', (e) => {
  const form = (e as CustomEvent<{ form: string }>).detail.form;
  track(form === 'newsletter' ? 'newsletter_signup' : 'form_submit', { form });
});

document.addEventListener('click', (e) => {
  const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
  if (!a || a.origin === location.origin || !/^https?:$/.test(a.protocol)) return;
  track('outbound_click', { host: a.hostname, path: location.pathname });
});
