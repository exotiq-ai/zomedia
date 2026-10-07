import type { APIRoute } from 'astro';
import { AI_CRAWLER_POLICY, AI_CRAWLERS } from '../config/site';

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://zomediaproductions.com')).origin;
  const lines = [
    '# robots.txt for Zo Media Productions',
    '# Search engines are always welcome. AI crawler policy is set in src/config/site.ts.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
  ];

  if (AI_CRAWLER_POLICY === 'block') {
    lines.push('# AI training / answer-engine crawlers: blocked');
    for (const bot of AI_CRAWLERS) lines.push(`User-agent: ${bot}`);
    lines.push('Disallow: /', '');
  } else {
    lines.push('# AI crawlers: explicitly welcome. A plain-language site summary lives at /llms.txt');
    for (const bot of AI_CRAWLERS) lines.push(`User-agent: ${bot}`);
    lines.push('Allow: /', '');
  }

  lines.push(`Sitemap: ${origin}/sitemap-index.xml`, '');
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
