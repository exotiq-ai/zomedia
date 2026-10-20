import test from 'node:test';
import assert from 'node:assert/strict';

test('book sales require reviewed records and explicit ebook rights clearance', async () => {
  const { purchaseOptions } = await import('../../src/lib/book-commerce.mjs');
  const book = { printPurchaseUrl: 'https://retailer.test/print', ebookPurchaseUrl: 'https://store.test/ebook', priceHardcover: '$9.95', priceEbook: '$4.99' };
  assert.deepEqual(purchaseOptions(book), []);
  assert.deepEqual(purchaseOptions({ ...book, commerceReviewed: true }).map(o => o.format), ['print']);
  assert.deepEqual(purchaseOptions({ ...book, commerceReviewed: true, ebookRightsCleared: true }).map(o => o.format), ['print', 'ebook']);
  assert.deepEqual(purchaseOptions({ ...book, commerceReviewed: true, isForthcoming: true }), []);
  assert.deepEqual(purchaseOptions({ ...book, commerceReviewed: true, printPurchaseUrl: 'javascript:alert(1)' }), []);
});
test('legacy single purchase link remains a reviewed print destination only', async () => {
  const { purchaseOptions } = await import('../../src/lib/book-commerce.mjs');
  assert.equal(purchaseOptions({ purchaseUrl: 'https://store.test/book', commerceReviewed: true })[0].format, 'print');
});
test('Sanity loader refuses empty, duplicate, draft and incomplete records', async () => {
  const { validateDocuments } = await import('../../src/lib/sanity-validation.mjs');
  const good = { _id: 'book-a', slug: 'book-a', cover: { asset: { _ref: 'image-a' }, alt: 'Book A cover' } };
  assert.doesNotThrow(() => validateDocuments([good], 'books'));
  for (const bad of [[], [good, good], [{ ...good, _id: 'drafts.book-a' }], [{ ...good, slug: '' }], [{ ...good, cover: {} }]]) {
    assert.throws(() => validateDocuments(bad, 'books'));
  }
});

test('impact claims require complete explicitly approved CMS values', async () => {
  const { approvedImpactStats } = await import('../../src/lib/book-commerce.mjs');
  assert.equal(approvedImpactStats({ claimsApproved: true, stats: { booksPublished: 12 } }), null);
  const stats = { booksPublished: 7, profitsToCommunity: 50, creators: 100, projects: 4 };
  assert.equal(approvedImpactStats({ stats }), null);
  assert.deepEqual(approvedImpactStats({ claimsApproved: true, stats }), stats);
  assert.equal(approvedImpactStats({ claimsApproved: true, stats: { ...stats, creators: -1 } }), null);
});
