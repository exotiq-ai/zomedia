import { COOKIE_NAME, envValue, isPreviewHost, previewHeaders, safeReturnTo, verifySession } from '../lib/preview-auth.mjs';

const PUBLIC_PATHS = new Set([
  '/coming-soon/',
  '/preview-assets/logo.png', '/preview-assets/typewriter.jpg',
  '/preview-assets/satoshi.woff2', '/preview-assets/preview.css', '/preview-assets/preview.js',
  '/preview-assets/instrument-serif.woff2',
  '/preview/login',
]);

export function createGate(readSecret = () => envValue('PREVIEW_SESSION_SECRET')) {
  return async (request, context) => {
    const url = new URL(request.url);
    if (!isPreviewHost(url.hostname)) return context.next();
    let response;
    if (url.pathname === '/robots.txt') {
      response = new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    } else {
      const cookie = request.headers.get('cookie')?.split(';').map((s) => s.trim()).find((s) => s.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
      const allowed = PUBLIC_PATHS.has(url.pathname) || await verifySession(cookie, readSecret(), url.hostname);
      if (!allowed) {
        const returnTo = safeReturnTo(url.pathname + url.search);
        response = new Response(null, { status: 303, headers: { Location: `/coming-soon/?returnTo=${encodeURIComponent(returnTo)}` } });
      } else {
        response = await context.next();
        // Apply preview metadata even when the same artifact later serves the public domain.
        if (request.method !== 'HEAD' && ![204, 205, 304].includes(response.status) && response.headers.get('content-type')?.includes('text/html')) {
          let html = (await response.text()).replace(/<meta name="robots" content="[^"]*"\s*\/?>/g, '<meta name="robots" content="noindex, nofollow">');
          if (!url.pathname.startsWith('/coming-soon/')) {
            html = html.replace('</body>', '<form action="/preview/login" method="post" enctype="application/x-www-form-urlencoded" data-astro-reload style="padding:16px;text-align:center;background:#141416;color:#e8e2d9"><input type="hidden" name="action" value="logout"><button type="submit" style="min-height:44px;padding:8px 20px;color:inherit;border:1px solid #777;background:transparent;cursor:pointer">End preview session</button></form></body>');
          }
          response = new Response(html, { status: response.status, headers: response.headers });
          response.headers.delete('content-length');
          response.headers.delete('etag');
        }
      }
    }
    const result = new Response(response.body, response);
    for (const [key, value] of Object.entries(previewHeaders)) result.headers.set(key, value);
    result.headers.set('Vary', 'Cookie');
    return result;
  };
}

export default createGate();
