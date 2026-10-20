import { createSession, envValue, equalSecret, isPreviewHost, previewHeaders, safeReturnTo, sessionCookie } from '../lib/preview-auth.mjs';

export function createLogin(readEnv = envValue) {
  return async (request) => {
    const url = new URL(request.url);
    const respond = (status, headers = {}, body = null) => new Response(body, { status, headers: { ...previewHeaders, ...headers } });
    if (!isPreviewHost(url.hostname)) return respond(404);
    if (request.method !== 'POST') return respond(405, { Allow: 'POST' });
    if (request.headers.get('origin') !== url.origin) return respond(403);
    if (Number(request.headers.get('content-length')) > 4096) return respond(413);
    const text = await request.text();
    if (text.length > 4096) return respond(413);
    const data = new URLSearchParams(text);
    if (data.get('action') === 'logout') return respond(303, { Location: '/coming-soon/', 'Set-Cookie': sessionCookie('', 0) });
    const password = readEnv('PREVIEW_PASSWORD');
    const secret = readEnv('PREVIEW_SESSION_SECRET');
    if (!password || !secret) return respond(503, {}, 'Preview access is temporarily unavailable.');
    const returnTo = safeReturnTo(data.get('returnTo'));
    if (!await equalSecret(data.get('password') ?? '', password)) {
      return respond(303, { Location: `/coming-soon/?error=password&returnTo=${encodeURIComponent(returnTo)}#access` });
    }
    return respond(303, { Location: returnTo, 'Set-Cookie': sessionCookie(await createSession(secret, url.hostname)) });
  };
}

export default createLogin();
// Platform-enforced per-IP limit; no unreliable per-instance in-memory counter.
export const config = { path: '/preview/login', rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
