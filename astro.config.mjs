import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://zomediaproductions.com',
  output: 'static',
  build: {
    assets: '_astro',
  },
});
