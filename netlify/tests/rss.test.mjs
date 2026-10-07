import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseFeed } from '../../src/lib/rss.ts';

const xml = `<?xml version="1.0"?><rss><channel><title>T</title>
<item><title><![CDATA[Older & <b>bolder</b>]]></title><link>https://x.substack.com/p/older</link><pubDate>Mon, 25 Aug 2025 12:00:00 GMT</pubDate><description>Ivan says &amp; more</description></item>
<item><title><![CDATA[Newer post]]></title><description>Sub &quot;title&quot;</description><link>https://x.substack.com/p/newer</link><dc:creator><![CDATA[The Wire]]></dc:creator><pubDate>Thu, 20 Aug 2026 05:48:52 GMT</pubDate><enclosure url="https://cdn.example/img.jpeg?a=1&amp;b=2" length="0" type="image/jpeg"/></item>
<item><title>No date</title><link>https://x/p/broken</link></item>
</channel></rss>`;

test('parses, decodes, sorts newest first and skips broken items', () => {
  const items = parseFeed(xml);
  assert.equal(items.length, 2);
  assert.equal(items[0].title, 'Newer post');
  assert.equal(items[0].summary, 'Sub "title"');
  assert.equal(items[0].author, 'The Wire');
  assert.equal(items[0].image, 'https://cdn.example/img.jpeg?a=1&b=2');
  assert.equal(items[1].title, 'Older & bolder');
  assert.equal(items[1].summary, 'Ivan says & more');
  assert.equal(items[1].image, undefined);
});

test('parses the real Substack feed shape (if a snapshot is present)', () => {
  let real;
  try { real = readFileSync('/tmp/ss-feed.xml', 'utf8'); } catch { return; }
  const items = parseFeed(real);
  assert.ok(items.length >= 1);
  assert.ok(items.every((i) => i.title && i.url.startsWith('https://') && i.date instanceof Date));
});
