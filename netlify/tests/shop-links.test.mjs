import test from 'node:test';
import assert from 'node:assert/strict';
import * as commerce from '../../src/lib/book-commerce.mjs';

test('a verified existing shop product can be opened without claiming catalog, price or ebook approval', () => {
  const book = {printPurchaseUrl:'https://shop.zomediaproductions.com/product/domestic-genocide/',commerceReviewed:false,ebookRightsCleared:false,isForthcoming:true};
  assert.equal(commerce.shopProductUrl(book),book.printPurchaseUrl);
  assert.deepEqual(commerce.purchaseOptions(book),[]);
});

test('direct shop navigation accepts only an HTTPS product page on the exact shop origin', () => {
  for(const url of [undefined,'http://shop.zomediaproductions.com/product/book/','https://shop.zomediaproductions.com.evil.test/product/book/','https://evil.test/product/book/','https://shop.zomediaproductions.com/store/','https://reader:secret@shop.zomediaproductions.com/product/book/','https://shop.zomediaproductions.com:8443/product/book/']) {
    assert.equal(commerce.shopProductUrl({printPurchaseUrl:url}),undefined);
  }
  assert.equal(commerce.shopProductUrl({purchaseUrl:'https://shop.zomediaproductions.com/product/book/'}),undefined);
});
