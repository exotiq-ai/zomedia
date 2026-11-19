import test from 'node:test';
import assert from 'node:assert/strict';

const redirect = async (request, context) => {
  const { default: handler } = await import('../edge-functions/commerce-redirects.js');
  return handler(request, context);
};
const noNext = { next: () => { throw Error('Commerce URL fell through to the editorial site'); } };

test('legacy products preserve encoded paths and query parameters on the fixed HTTPS shop origin', async () => {
  const response = await redirect(new Request('https://zomediaproductions.com/product/a%20book/?format=ebook&utm_source=letter&next=https%3A%2F%2Fevil.test'), noNext);
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), 'https://shop.zomediaproductions.com/product/a%20book/?format=ebook&utm_source=letter&next=https%3A%2F%2Fevil.test');
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
});

test('cart, checkout and account links use the actual WooCommerce pages, including nested payment endpoints', async () => {
  const examples = [
    ['/cart/?remove_item=example', '/cart-2/?remove_item=example'],
    ['/cart-2/', '/cart-2/'],
    ['/checkout/order-pay/123/?key=example', '/checkout-2/order-pay/123/?key=example'],
    ['/checkout-2/order-received/123/?key=example', '/checkout-2/order-received/123/?key=example'],
    ['/my-account', '/my-account/'],
    ['/my-account/lost-password/?key=example', '/my-account/lost-password/?key=example'],
    ['/shop/', '/store/'],
    ['/store/', '/store/'],
  ];
  for (const [from, to] of examples) {
    const response = await redirect(new Request('https://www.zomediaproductions.com' + from), noNext);
    assert.equal(response.headers.get('location'), 'https://shop.zomediaproductions.com' + to);
  }
});

test('checkout POST redirects preserve method semantics and do not consume the request body', async () => {
  const request = new Request('https://zomediaproductions.com/checkout-2/?pay_for_order=true', { method: 'POST', body: 'test-only=1' });
  const response = await redirect(request, noNext);
  assert.equal(response.status, 307);
  assert.equal(await request.text(), 'test-only=1');
});

test('WordPress download and callback query strings are preserved without exposing them to caching', async () => {
  for (const query of ['download_file=9080&order=example&email=reader%40example.test&key=example', 'wc-api=example', 'wc-ajax=example', 'add-to-cart=9080', 'p=9080']) {
    const response = await redirect(new Request('https://zomediaproductions.com/?' + query), noNext);
    assert.equal(response.headers.get('location'), 'https://shop.zomediaproductions.com/?' + query);
    assert.match(response.headers.get('cache-control'), /no-store/);
  }
});

test('old WordPress assets and administrative links keep their exact paths', async () => {
  for (const path of ['/wp-content/uploads/2025/cover.jpg', '/wp-includes/js/example.js', '/wp-admin/admin.php?page=wc-settings', '/wp-login.php?action=lostpassword', '/wp-json/wc/store/v1/products']) {
    const response = await redirect(new Request('https://zomediaproductions.com' + path), noNext);
    assert.equal(response.headers.get('location'), 'https://shop.zomediaproductions.com' + path);
  }
});

test('editorial pages, ordinary queries and Netlify Forms POSTs continue to the site', async () => {
  const untouched = new Response('editorial');
  for (const path of ['/', '/?utm_source=letter', '/books/domestic-genocide/', '/contact/', '/cartography/', '/productivity/', '/wp-contentious/']) {
    const request = new Request('https://zomediaproductions.com' + path, { method: 'POST', body: 'form-name=contact&message=test' });
    assert.equal(await redirect(request, { next: () => untouched }), untouched);
  }
});

test('preview hosts, lookalike domains and the shop itself never bypass the next handler', async () => {
  const untouched = new Response('next');
  for (const host of ['deploy-preview-5--zomedia.netlify.app', 'zomedia.netlify.app', 'shop.zomediaproductions.com', 'zomediaproductions.com.evil.test']) {
    assert.equal(await redirect(new Request('https://' + host + '/product/example/'), { next: () => untouched }), untouched);
  }
});

test('commerce compatibility routing leaves alternate Netlify hosts behind the preview gate', async () => {
  const { createGate } = await import('../edge-functions/preview-gate.js');
  const request = new Request('https://deploy-preview-5--zomedia.netlify.app/checkout/?key=example');
  const response = await redirect(request, { next: () => createGate(() => 'test-secret')(request, { next: () => { throw Error('Preview was exposed'); } }) });
  assert.equal(response.status, 303);
  assert.match(response.headers.get('location'), /^\/coming-soon\//);
});
