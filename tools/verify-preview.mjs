import assert from 'node:assert/strict';

const base = process.env.BASE_URL;
const password = process.env.PREVIEW_PASSWORD;
if (!base || !password || !new URL(base).hostname.endsWith('.netlify.app')) throw new Error('Set BASE_URL to a Netlify preview and PREVIEW_PASSWORD (never a live store).');
const get = (route, cookie) => fetch(base + route, { redirect: 'manual', headers: cookie ? { cookie } : {} });
const post = (data) => fetch(base + '/preview/login', {
  method: 'POST', redirect: 'manual', headers: { origin: base, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data),
});
for (const route of ['/', '/books/', '/llms.txt', '/sitemap-index.xml', '/assets/images/Zo-Media-primary-white-transparent.png', '/.netlify/functions/preview-login', '/%62ooks/']) {
  const response = await get(route);
  assert.equal(response.status, 303, route);
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
}
assert.match(await (await get('/robots.txt')).text(), /Disallow: \//);
const wrong = await post({ password: 'deliberately-wrong' });
assert.equal(wrong.status, 303);
assert.equal(wrong.headers.get('set-cookie'), null);
const login = await post({ password, returnTo: '/books/' });
assert.equal(login.status, 303);
assert.equal(login.headers.get('location'), '/books/');
const setCookie = login.headers.get('set-cookie');
for (const flag of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Path=/']) assert.ok(setCookie?.includes(flag));
const cookie = setCookie.split(';')[0];
const authenticated = await get('/books/', cookie);
assert.equal(authenticated.status, 200);
assert.match(await authenticated.text(), /noindex, nofollow/);
assert.match(authenticated.headers.get('cache-control'), /no-store/);
assert.equal((await get('/books/')).status, 303, 'Anonymous response after authenticated cache warming');
assert.equal((await get('/books/', cookie + 'tampered')).status, 303);
const logout = await post({ action: 'logout' });
assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
console.log('PASS: login, logout, host assets, deep links, feeds, tampered cookie, noindex and cache isolation');
if (process.env.PROBE_RATE_LIMIT === 'true') {
  const statuses = [];
  for (let i = 0; i < 20; i++) {
    const response = await post({ password: 'rate-limit-test' });
    statuses.push(response.status);
    if (response.status === 429) break;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  console.log('Rate-limit probe statuses:', statuses.join(', '));
  assert.ok(statuses.includes(429), 'Rate-limit configuration exists, but live enforcement was not observed');
}
