import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createUploadHandler } from '../lib/contact-upload.mjs';

const origin = 'https://zomediaproductions.com';
function setup() {
  const writes = [];
  const handler = createUploadHandler(() => ({ set: async (...args) => writes.push(args) }));
  return { handler, writes };
}
function request(file = new File(['Sample manuscript'], 'pitch.txt', { type: 'text/plain' }), extra = {}) {
  const data = new FormData();
  data.set('document', file);
  if (extra.trap) data.set('bot-field', extra.trap);
  return new Request(origin + '/.netlify/functions/contact-upload', { method: 'POST', headers: { Origin: extra.origin || origin }, body: data });
}
test('stores manuscript privately, returns only a reference, and preserves exact bytes', async () => {
  const { handler, writes } = setup();
  const res = await handler(request());
  assert.equal(res.status, 201);
  const result = await res.json();
  assert.deepEqual(Object.keys(result), ['reference']);
  assert.match(result.reference, /^contact-documents\//);
  assert.equal(writes.length, 1);
  assert.equal(new TextDecoder().decode(writes[0][1]), 'Sample manuscript');
  assert.equal(writes[0][2].metadata.filename, 'pitch.txt');
  assert.match(res.headers.get('cache-control'), /no-store/);
});
test('never provides a public download or listing route', async () => {
  const { handler, writes } = setup();
  for (const method of ['GET', 'HEAD', 'PUT', 'DELETE']) {
    assert.equal((await handler(new Request(origin + '/.netlify/functions/contact-upload?key=anything', { method }))).status, 405);
  }
  assert.equal(writes.length, 0);
});
test('rejects cross-origin, honeypot, unsupported, disguised and oversized files without storage', async () => {
  const { handler, writes } = setup();
  assert.equal((await handler(request(undefined, { origin: 'https://elsewhere.test' }))).status, 403);
  assert.equal((await handler(request(undefined, { trap: 'spam' }))).status, 400);
  for (const file of [new File(['code'], 'pitch.html'), new File(['not a pdf'], 'pitch.pdf'), new File([new Uint8Array(4 * 1024 * 1024 + 1)], 'large.txt')]) {
    assert.ok([400, 413].includes((await handler(request(file))).status));
  }
  assert.equal(writes.length, 0);
});
test('malformed payload and storage failure do not claim upload success', async () => {
  const { handler } = setup();
  assert.equal((await handler(new Request(origin+'/.netlify/functions/contact-upload', { method:'POST', headers:{Origin:origin}, body:'broken' }))).status,400);
  const broken = createUploadHandler(() => ({ set: async () => { throw Error('private service error'); } }));
  const res = await broken(request());
  assert.equal(res.status,503);
  assert.doesNotMatch(await res.text(), /private service error/);
});
