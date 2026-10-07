// Runs automatically after EVERY Netlify Forms submission that passes Netlify's
// spam filtering (honeypot + Akismet). Netlify keeps the submission in its
// dashboard regardless; this function additionally:
//   • contact form  → emails the right inbox (by inquiry type) via Resend + optional auto-reply
//   • newsletter    → adds the address to the configured mailing-list provider
// Every integration is OPTIONAL: with no environment variables set it does nothing
// and Netlify's own form notifications keep working. See docs/FORMS.md.
import { buildAutoReply, buildContactEmail, isEmail, sendEmail, subscribe } from '../lib/forms.mjs';

export const handler = async (event) => {
  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch {
    return { statusCode: 400, body: 'Bad payload' };
  }
  const { form_name: form, data = {} } = payload;
  const env = process.env;

  try {
    if (form === 'contact') {
      if (!env.RESEND_API_KEY || !env.CONTACT_FROM) {
        console.log('[contact] RESEND_API_KEY/CONTACT_FROM not set — relying on Netlify form notifications.');
        return { statusCode: 200, body: 'ok' };
      }
      const res = await sendEmail(buildContactEmail(data, env), env);
      if (!res.ok) console.error('[contact] Resend failed', res.status, await res.text());
      if (res.ok && env.CONTACT_AUTOREPLY === 'true' && isEmail(data.email)) {
        const ar = await sendEmail(buildAutoReply(data, env), env);
        if (!ar.ok) console.error('[contact] auto-reply failed', ar.status);
      }
    } else if (form === 'newsletter') {
      if (!isEmail(data.email)) return { statusCode: 200, body: 'ignored' };
      const result = await subscribe(data.email.trim(), data.source || 'site', env);
      if (result.skipped) console.log('[newsletter] no provider configured — address stored in Netlify Forms only.');
      else if (!result.ok) console.error('[newsletter] provider rejected', result.status);
    }
  } catch (err) {
    // Never fail the submission because a downstream integration is down.
    console.error(`[${form}] integration error`, err);
  }
  return { statusCode: 200, body: 'ok' };
};
