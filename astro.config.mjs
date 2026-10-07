import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pages that must never appear in the sitemap (thank-you pages, the 404).
const EXCLUDED = ['/thanks/', '/404'];

export default defineConfig({
  site: 'https://zomediaproductions.com',
  output: 'static',
  trailingSlash: 'always',
  // Remote images we're allowed to download + optimise at build time (Wire cover art from Substack).
  image: {
    domains: ['substackcdn.com', 'substack-post-media.s3.amazonaws.com'],
  },
  build: {
    assets: '_astro',
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.some((p) => page.includes(p)),
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        // Home and the main sections matter most; legal pages least.
        const path = new URL(item.url).pathname;
        if (path === '/') item.priority = 1.0;
        else if (['/books/', '/film-projects/', '/support/', '/about/', '/the-wire/'].includes(path)) item.priority = 0.9;
        else if (['/privacy/', '/terms/'].includes(path)) item.priority = 0.2;
        return item;
      },
    }),
  ],
});
