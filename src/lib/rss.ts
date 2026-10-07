/**
 * Minimal RSS 2.0 item parser (no dependencies, erasable TypeScript so it can be unit tested
 * with plain `node --test`). Handles CDATA, entities and enclosure images — enough for Substack feeds.
 */

export interface FeedItem {
  title: string;
  url: string;
  /** Subtitle / description shown under the title. */
  summary: string;
  date: Date;
  image?: string;
  author?: string;
}

const decode = (s: string): string =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const stripTags = (s: string): string => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function tag(block: string, name: string): string | undefined {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  if (!m) return undefined;
  const raw = m[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return cdata ? cdata[1].trim() : decode(raw);
}

export function parseFeed(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = m[1];
    const title = tag(block, 'title');
    const url = tag(block, 'link') ?? tag(block, 'guid');
    const pub = tag(block, 'pubDate');
    if (!title || !url || !pub) continue;
    const date = new Date(pub);
    if (Number.isNaN(date.getTime())) continue;
    const image = block.match(/<enclosure[^>]*\surl="([^"]+)"[^>]*type="image\//i)?.[1];
    items.push({
      title: stripTags(title),
      url: url.trim(),
      summary: stripTags(tag(block, 'description') ?? ''),
      date,
      image: image ? decode(image) : undefined,
      author: tag(block, 'dc:creator'),
    });
  }
  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}
