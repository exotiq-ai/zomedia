import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContactEmail, buildAutoReply, esc, isEmail, recipientFor, subscribe } from '../lib/forms.mjs';

const env = { CONTACT_FROM: 'Zo Media <noreply@zomediaproductions.com>', CONTACT_TO: 'info@zomediaproductions.com' };

test('esc neutralises HTML', () => assert.equal(esc('<img src=x onerror="a">'), '&lt;img src=x onerror=&quot;a&quot;&gt;'));
test('isEmail', () => {
  assert.ok(isEmail('a@b.co'));
  assert.ok(!isEmail('nope'));
  assert.ok(!isEmail('a@b'));
});
test('routes by inquiry type, falls back to CONTACT_TO', () => {
  const e = { ...env, CONTACT_ROUTES: '{"press":"press@x.org"}' };
  assert.equal(recipientFor('press', e), 'press@x.org');
  assert.equal(recipientFor('film', e), 'info@zomediaproductions.com');
  assert.equal(recipientFor('press', { ...env, CONTACT_ROUTES: '{bad json' }), 'info@zomediaproductions.com');
});
test('contact email escapes user input and sets reply_to', () => {
  const m = buildContactEmail({ name: 'A <b>', email: 'a@b.co', 'inquiry-type': 'press', subject: 'Hi', message: '<script>x</script>' }, env);
  assert.equal(m.reply_to, 'a@b.co');
  assert.ok(!m.html.includes('<script>'));
  assert.match(m.subject, /^\[Zo Media\] Press \/ media: Hi/);
});
test('auto-reply greets by first name', () => assert.match(buildAutoReply({ name: 'Maya Lee', email: 'm@l.co' }, env).text, /^Hi Maya,/));
test('subscribe skips without provider', async () => assert.deepEqual(await subscribe('a@b.co', 'footer', {}), { skipped: true }));
test('subscribe → buttondown request shape', async () => {
  let call;
  const f = async (url, init) => ((call = { url, init }), { ok: true, status: 201 });
  const r = await subscribe('a@b.co', 'wire', { NEWSLETTER_PROVIDER: 'buttondown', NEWSLETTER_API_KEY: 'k' }, f);
  assert.equal(r.ok, true);
  assert.equal(call.url, 'https://api.buttondown.com/v1/subscribers');
  assert.equal(call.init.headers.Authorization, 'Token k');
});
test('subscribe → mailchimp uses md5 hash + dc from key', async () => {
  let call;
  const f = async (url, init) => ((call = { url, init }), { ok: true, status: 200 });
  await subscribe('A@B.co', 'home', { NEWSLETTER_PROVIDER: 'mailchimp', NEWSLETTER_API_KEY: 'abc-us21', MAILCHIMP_LIST_ID: 'L1' }, f);
  assert.match(call.url, /^https:\/\/us21\.api\.mailchimp\.com\/3\.0\/lists\/L1\/members\/[0-9a-f]{32}$/);
  assert.equal(JSON.parse(call.init.body).status_if_new, 'pending');
});
