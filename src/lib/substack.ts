/**
 * The Phuckin' Wire lives on Substack. We read its public RSS feed at BUILD time (Substack's feed
 * sends no CORS headers, so browsers can't read it directly) and show the latest issues as a preview
 * that links out to Substack, where the full article lives. A scheduled rebuild keeps it fresh
 * (netlify/functions/scheduled-rebuild.mjs). If Substack is unreachable the section simply hides —
 * a feed outage never breaks a deploy.
 */
import { parseFeed, type FeedItem } from './rss.ts';
import { SUBSTACK } from '../config/site';

let cache: Promise<FeedItem[]> | undefined;

export function getWirePosts(limit = 6): Promise<FeedItem[]> {
  cache ??= fetchPosts();
  return cache.then((posts) => posts.slice(0, limit));
}

async function fetchPosts(): Promise<FeedItem[]> {
  // A couple of retries: a single transient network blip at build time shouldn't hide the section
  // until the next scheduled rebuild.
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(SUBSTACK.feedUrl, {
        headers: { 'User-Agent': 'zomediaproductions.com site build (+https://zomediaproductions.com)' },
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return parseFeed(await res.text());
    } catch (err) {
      lastError = err;
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 1500));
    }
  }
  console.warn(`[substack] could not load ${SUBSTACK.feedUrl} after 3 attempts — hiding the latest-issues section`, lastError);
  return [];
}

export const formatIssueDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
