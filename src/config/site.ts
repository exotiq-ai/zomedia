/**
 * Single source of truth for site-wide facts. Used by the layout (meta + JSON-LD),
 * footer, robots.txt, llms.txt and anywhere else that needs the org's identity.
 * When the Sanity `siteSettings` document goes live these become its fallbacks.
 */

export const SITE = {
  name: 'Zo Media Productions',
  legalName: 'Zo Media Productions, LLC',
  url: 'https://zomediaproductions.com',
  tagline: 'Amplifying incarcerated voices through literature, film, and art.',
  description:
    'A media cooperative publishing literature, film, and art by incarcerated creators. A subsidiary of UBFSF.',
  longDescription:
    'Zo Media Productions is a cooperative that publishes literature, produces film, and exhibits art created by incarcerated people, building economic power and driving justice reform from behind the wall.',
  parent: {
    name: 'United Black Family Scholarship Foundation',
    shortName: 'UBFSF',
    note: 'a 501(c)(3) organization',
  },
  email: 'info@zomediaproductions.com',
  phone: '+1-918-924-5872',
  phoneDisplay: '1-918-924-5872',
  address: {
    streetAddress: 'P.O. Box 862',
    addressLocality: 'Bristow',
    addressRegion: 'OK',
    postalCode: '74010',
    addressCountry: 'US',
  },
  /** Default social card, 1200×630. Per-page cards live in /assets/og/. */
  ogImage: '/assets/og/default.jpg',
  themeColor: '#0A0A0B',
} as const;

/** `href: null` renders a disabled "coming soon" icon instead of a link. */
export const SOCIAL_LINKS: Array<{ label: string; icon: string; href: string | null }> = [
  { label: 'Facebook', icon: 'fb', href: 'https://www.facebook.com/unitedblack.familyscholarshipfoundation' },
  { label: 'Instagram', icon: 'ig', href: 'https://www.instagram.com/ubfsforg/' },
  { label: 'X / Twitter', icon: 'x', href: null },
  { label: 'YouTube', icon: 'yt', href: null },
];

/**
 * AI / answer-engine crawler policy for robots.txt.
 * 'allow' = welcome (maximum visibility in AI answers). 'block' = disallow named AI training/answer bots.
 * DECISION PENDING — see docs/LAUNCH-PLAN.md (C1). Search-engine crawlers are always allowed.
 */
export const AI_CRAWLER_POLICY: 'allow' | 'block' = 'allow';

export const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'Meta-ExternalAgent',
  'Amazonbot',
  'cohere-ai',
  'DuckAssistBot',
];
