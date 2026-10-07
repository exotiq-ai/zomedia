// Pure helpers behind the `submission-created` function. Kept free of Netlify
// specifics so they can be unit tested (see netlify/tests/forms.test.mjs).
import { createHash } from 'node:crypto';

export const INQUIRY_LABELS = {
  general: 'General inquiry',
  film: 'Film collaboration',
  book: 'Book / publishing',
  donation: 'Donation / sponsorship',
  press: 'Press / media',
  volunteer: 'Volunteering',
  other: 'Other',
};

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const isEmail = (s) => typeof s === 'string' && s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** CONTACT_ROUTES='{"film":"films@x.org","press":"press@x.org"}' → recipient per inquiry type. */
export function recipientFor(inquiry, env) {
  let routes = {};
  try {
    routes = env.CONTACT_ROUTES ? JSON.parse(env.CONTACT_ROUTES) : {};
  } catch {
    routes = {};
  }
  return routes[inquiry] || env.CONTACT_TO || 'info@zomediaproductions.com';
}

export function buildContactEmail(data, env) {
  const label = INQUIRY_LABELS[data['inquiry-type']] || 'Inquiry';
  const rows = [
    ['Name', data.name],
    ['Email', data.email],
    ['Organization', data.organization],
    ['Inquiry type', label],
    ['Subject', data.subject],
  ].filter(([, v]) => v);
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${data.message ?? ''}\n`;
  const html =
    `<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px">` +
    rows.map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`).join('') +
    `</table><p style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:15px">${esc(data.message)}</p>`;
  return {
    from: env.CONTACT_FROM,
    to: [recipientFor(data['inquiry-type'], env)],
    reply_to: isEmail(data.email) ? data.email : undefined,
    subject: `[Zo Media] ${label}: ${String(data.subject ?? '').slice(0, 120)}`,
    text,
    html,
  };
}

export function buildAutoReply(data, env) {
  const first = String(data.name ?? '').trim().split(/\s+/)[0] || 'there';
  return {
    from: env.CONTACT_FROM,
    to: [data.email],
    reply_to: env.CONTACT_TO || 'info@zomediaproductions.com',
    subject: 'We received your message — Zo Media Productions',
    text: `Hi ${first},\n\nThank you for contacting Zo Media Productions. We've received your message and a member of our team will reply as soon as we can.\n\nIf you didn't send this, you can ignore this email.\n\n— Zo Media Productions\nzomediaproductions.com\n`,
  };
}

/** Send via Resend. Returns the Response. */
export async function sendEmail(message, env, fetchImpl = fetch) {
  return fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
}

/**
 * Add an address to the configured mailing-list provider.
 * NEWSLETTER_PROVIDER = buttondown | beehiiv | mailchimp
 * Returns { ok, status } or { skipped } when no provider is configured.
 */
export async function subscribe(email, source, env, fetchImpl = fetch) {
  const provider = (env.NEWSLETTER_PROVIDER || '').toLowerCase();
  const key = env.NEWSLETTER_API_KEY;
  if (!provider || !key) return { skipped: true };

  let res;
  if (provider === 'buttondown') {
    res = await fetchImpl('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: { Authorization: `Token ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_address: email, tags: ['website', source], metadata: { source } }),
    });
  } else if (provider === 'beehiiv') {
    res = await fetchImpl(`https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: 'zomediaproductions.com',
        utm_medium: source,
      }),
    });
  } else if (provider === 'mailchimp') {
    const dc = env.MAILCHIMP_SERVER_PREFIX || key.split('-').pop();
    const hash = createHash('md5').update(email.toLowerCase()).digest('hex');
    res = await fetchImpl(`https://${dc}.api.mailchimp.com/3.0/lists/${env.MAILCHIMP_LIST_ID}/members/${hash}`, {
      method: 'PUT',
      headers: { Authorization: `Basic ${Buffer.from(`zomedia:${key}`).toString('base64')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_address: email,
        status_if_new: env.NEWSLETTER_DOUBLE_OPT_IN === 'false' ? 'subscribed' : 'pending',
        tags: ['website', source],
      }),
    });
  } else {
    return { skipped: true, reason: `unknown provider ${provider}` };
  }
  return { ok: res.ok, status: res.status };
}
