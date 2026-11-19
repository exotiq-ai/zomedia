import test from 'node:test';
import assert from 'node:assert/strict';

const auth = await import('../lib/preview-auth.mjs').catch(() => ({}));
test('preview auth module exists', () => assert.equal(typeof auth.createSession, 'function'));
test('preview hosts include deploy aliases, never the WordPress domain', () => {
  assert.equal(auth.isPreviewHost('zomedia.netlify.app'), true);
  assert.equal(auth.isPreviewHost('abc--zomedia.netlify.app'), true);
  assert.equal(auth.isPreviewHost('zomediaproductions.com'), false);
  assert.equal(auth.isPreviewHost('www.zomediaproductions.com'), false);
});
test('public launch hold gates main hosts while preserving existing preview hosts', () => {
  assert.equal(auth.isPreviewHost('zomediaproductions.com', 'true'), true);
  assert.equal(auth.isPreviewHost('www.zomediaproductions.com', 'true'), true);
  assert.equal(auth.isPreviewHost('zomediaproductions.com', 'false'), false);
  assert.equal(auth.isPreviewHost('zomedia.netlify.app', 'false'), true);
});
test('public hold reuses secure login and blocks anonymous main-domain content', async () => {
  const previous = process.env.PUBLIC_LAUNCH_HOLD;
  process.env.PUBLIC_LAUNCH_HOLD = 'true';
  try {
    const { createGate } = await import('../edge-functions/preview-gate.js');
    const { createLogin } = await import('../functions/preview-login.mjs');
    const host = 'https://zomediaproductions.com';
    const blocked = await createGate(() => 'test-secret')(new Request(host + '/books/'), { next: () => { throw Error('leak'); } });
    assert.equal(blocked.status, 303);
    const login = createLogin(key => ({ PUBLIC_LAUNCH_HOLD: 'true', PREVIEW_PASSWORD: 'test-password', PREVIEW_SESSION_SECRET: 'test-secret' })[key]);
    const response = await login(new Request(host + '/preview/login', { method: 'POST', headers: { origin: host }, body: new URLSearchParams({ password: 'test-password' }) }));
    assert.equal(response.status, 303);
    assert.match(response.headers.get('set-cookie'), /HttpOnly; Secure; SameSite=Lax/);
    const allowed = await createGate(() => 'test-secret')(new Request(host + '/books/', { headers: { cookie: response.headers.get('set-cookie').split(';')[0] } }), { next: async () => new Response('review content') });
    assert.equal(allowed.status, 200);
  } finally {
    if (previous === undefined) delete process.env.PUBLIC_LAUNCH_HOLD;
    else process.env.PUBLIC_LAUNCH_HOLD = previous;
  }
});
test('session signatures enforce expiry, host binding and secret rotation', async () => {
  const token = await auth.createSession('secret-long-enough-for-testing', 'preview.test', 100);
  assert.equal(await auth.verifySession(token, 'secret-long-enough-for-testing', 'preview.test', 101), true);
  assert.equal(await auth.verifySession(token, 'wrong', 'preview.test', 101), false);
  assert.equal(await auth.verifySession(token, 'secret-long-enough-for-testing', 'another.test', 101), false);
  assert.equal(await auth.verifySession(token, 'secret-long-enough-for-testing', 'preview.test', 100 + auth.SESSION_SECONDS), false);
  assert.equal(await auth.verifySession(token + 'tampered', 'secret-long-enough-for-testing', 'preview.test', 101), false);
});
test('redirect targets cannot escape to another origin or auth endpoints', () => {
  for (const unsafe of ['//evil.test', '/\\evil.test', 'https://evil.test', '/%2f%2fevil.test', '/.netlify/functions/preview-login', '/preview/login', '/coming-soon/']) {
    assert.equal(auth.safeReturnTo(unsafe), '/');
  }
  assert.equal(auth.safeReturnTo('/books/domestic-genocide/?format=ebook'), '/books/domestic-genocide/?format=ebook');
});
test('edge blocks feeds, encoded URLs, assets and deep links without a session', async () => {
  const { createGate } = await import('../edge-functions/preview-gate.js');
  const gate = createGate(() => 'test-secret');
  for (const path of ['/', '/books/', '/llms.txt', '/sitemap-index.xml', '/assets/images/book.jpg', '/%63oming-soon/../books/', '/coming-soon/index.html', '/.netlify/functions/preview-login']) {
    const response = await gate(new Request(`https://zomedia.netlify.app${path}`), { next: () => { throw Error('leaked content'); } });
    assert.equal(response.status, 303, path);
    assert.match(response.headers.get('location'), /^\/coming-soon\//);
    assert.match(response.headers.get('cache-control'), /no-store/);
  }
});
test('edge authenticates, sets noindex, never shares cached private content', async () => {
  const { createGate } = await import('../edge-functions/preview-gate.js');
  const token = await auth.createSession('test-secret', 'zomedia.netlify.app');
  const response = await createGate(() => 'test-secret')(new Request('https://zomedia.netlify.app/books/', { headers: { cookie: `${auth.COOKIE_NAME}=${token}` } }), {
    next: async () => new Response('<meta name="robots" content="index, follow">private', { headers: { 'content-type': 'text/html', 'cache-control': 'public' } }),
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.match(await response.text(), /content="noindex, nofollow"/);
});
test('login enforces same-origin POST, correct password, secure cookies and logout', async () => {
  const { createLogin, config } = await import('../functions/preview-login.mjs');
  const handler = createLogin((key) => ({ PREVIEW_PASSWORD: 'test-password', PREVIEW_SESSION_SECRET: 'test-secret' })[key]);
  const req = (body, origin = 'https://zomedia.netlify.app') => new Request('https://zomedia.netlify.app/.netlify/functions/preview-login', {
    method: 'POST', headers: { origin, 'content-type': 'application/x-www-form-urlencoded' }, body,
  });
  assert.equal((await handler(req('password=test-password', 'https://evil.test'))).status, 403);
  const wrong = await handler(req('password=wrong'));
  assert.equal(wrong.status, 303);
  assert.equal(wrong.headers.get('set-cookie'), null);
  const ok = await handler(req('password=test-password&returnTo=%2Fbooks%2F'));
  assert.equal(ok.headers.get('location'), '/books/');
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Path=/']) assert.ok(ok.headers.get('set-cookie').includes(flag));
  assert.deepEqual(config.rateLimit, { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] });
  const logout = await handler(req('action=logout'));
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
});

test('edge preserves bodyless conditional responses', async () => {
  const { createGate } = await import('../edge-functions/preview-gate.js');
  const token = await auth.createSession('test-secret', 'zomedia.netlify.app');
  const response = await createGate(() => 'test-secret')(new Request('https://zomedia.netlify.app/books/', { headers: { cookie: `${auth.COOKIE_NAME}=${token}` } }), {
    next: async () => new Response(null, { status: 304, headers: { 'content-type': 'text/html' } }),
  });
  assert.equal(response.status, 304);
  assert.equal(await response.text(), '');
});

test('rendered sign-out form bypasses client routing and preserves the login endpoint encoding', async () => {
  const { createGate } = await import('../edge-functions/preview-gate.js');
  const { createLogin } = await import('../functions/preview-login.mjs');
  const token = await auth.createSession('test-secret', 'zomedia.netlify.app');
  const page = await createGate(() => 'test-secret')(new Request('https://zomedia.netlify.app/contact/', {
    headers: { cookie: `${auth.COOKIE_NAME}=${token}` },
  }), { next: () => new Response('<html><body>Contact</body></html>', { headers: { 'content-type': 'text/html' } }) });
  const form = (await page.text()).match(/<form\b[^>]*action="\/preview\/login"[^>]*>/)?.[0];
  assert.ok(form);
  assert.match(form, /\bdata-astro-reload(?:\s|>)/, 'Astro must leave session-ending POSTs to the browser');
  assert.match(form, /enctype="application\/x-www-form-urlencoded"/);
  const logout = await createLogin(() => 'unused')(new Request('https://zomedia.netlify.app/preview/login', {
    method: 'POST', headers: { origin: 'https://zomedia.netlify.app', 'content-type': 'application/x-www-form-urlencoded' }, body: 'action=logout',
  }));
  assert.equal(logout.headers.get('location'), '/coming-soon/');
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
});
