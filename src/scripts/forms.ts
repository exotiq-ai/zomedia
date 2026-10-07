/**
 * Progressive enhancement for every <form data-enhance>.
 *
 * Without JS the form posts natively to Netlify Forms and lands on /thanks/.
 * With JS we submit the same payload via fetch (the standard Netlify Forms AJAX
 * pattern), keep the visitor on the page, and report success/failure in an
 * aria-live region. A single delegated listener on `document` survives Astro
 * View Transitions, which replace the <body> on every navigation.
 */

export {};

const FALLBACK_EMAIL = 'info@zomediaproductions.com';

const MESSAGES = {
  sending: 'Sending…',
  newsletter: "You're on the list. Thank you — watch your inbox.",
  contact: "Message sent. Thank you — we'll be in touch soon.",
  generic: 'Thank you — your submission was received.',
  invalid: 'Please check the highlighted fields and try again.',
  error: `Something went wrong and your message was not sent. Please try again, or email ${FALLBACK_EMAIL}.`,
} as const;

function statusEl(form: HTMLFormElement): HTMLElement | null {
  return form.querySelector<HTMLElement>('[role="status"]');
}

function setStatus(form: HTMLFormElement, kind: 'success' | 'error' | 'info', text: string, focus = false) {
  const el = statusEl(form);
  if (!el) return;
  el.textContent = text;
  el.className = `${el.className.replace(/\bform-status--\w+\b/g, '').trim()} form-status form-status--${kind}`.trim();
  if (focus) el.focus();
}

function setBusy(form: HTMLFormElement, busy: boolean) {
  form.classList.toggle('is-sending', busy);
  form.setAttribute('aria-busy', String(busy));
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (btn) {
    if (busy) {
      btn.dataset.label = btn.textContent ?? '';
      btn.textContent = MESSAGES.sending;
    } else if (btn.dataset.label) {
      btn.textContent = btn.dataset.label;
    }
    btn.disabled = busy;
  }
}

async function send(form: HTMLFormElement) {
  const body = new URLSearchParams();
  new FormData(form).forEach((value, key) => {
    if (typeof value === 'string') body.append(key, value);
  });

  // `astro dev` has no Netlify Forms endpoint; simulate so the UI can be tested locally.
  if (import.meta.env.DEV) {
    console.info('[forms] dev mode — simulated submit', Object.fromEntries(body));
    await new Promise((r) => setTimeout(r, 600));
    return;
  }

  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
}

document.addEventListener('submit', async (event) => {
  const form = (event.target as Element | null)?.closest<HTMLFormElement>('form[data-enhance]');
  if (!form) return;
  event.preventDefault();

  if (form.classList.contains('is-sending')) return;
  if (!form.checkValidity()) {
    form.reportValidity();
    setStatus(form, 'error', MESSAGES.invalid);
    return;
  }

  // Honeypot: a filled bot-field means a bot. Pretend success, send nothing.
  const trap = form.querySelector<HTMLInputElement>('input[name="bot-field"]');
  const label = form.dataset.formLabel ?? 'form';
  if (trap?.value) {
    setStatus(form, 'success', MESSAGES.generic);
    return;
  }

  setBusy(form, true);
  setStatus(form, 'info', MESSAGES.sending);
  try {
    await send(form);
    form.reset();
    const msg = label === 'newsletter' ? MESSAGES.newsletter : label === 'contact' ? MESSAGES.contact : MESSAGES.generic;
    setStatus(form, 'success', msg, label === 'contact');
    window.dispatchEvent(new CustomEvent('zo:form-success', { detail: { form: label } }));
  } catch (err) {
    console.error(err);
    setStatus(form, 'error', MESSAGES.error, true);
    window.dispatchEvent(new CustomEvent('zo:form-error', { detail: { form: label } }));
  } finally {
    setBusy(form, false);
  }
});
