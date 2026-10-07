import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Hostname for `sanity deploy` → https://<studioHost>.sanity.studio
  studioHost: process.env.SANITY_STUDIO_HOST || 'zomedia',
  deployment: { appId: 'tsgi4y1u5nzxjv4ilei4uqnh', autoUpdates: true },
});
