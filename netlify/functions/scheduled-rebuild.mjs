// Rebuilds the site on a schedule so new Phuckin' Wire issues (read from Substack's feed at build
// time) appear without anyone clicking deploy. Does nothing until BUILD_HOOK_URL is set to a Netlify
// build hook (Site configuration → Build & deploy → Build hooks). See docs/WIRE-SUBSTACK.md.
export default async () => {
  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) {
    console.log('[scheduled-rebuild] BUILD_HOOK_URL not set — skipping.');
    return new Response('skipped');
  }
  const res = await fetch(hook, { method: 'POST' });
  console.log(`[scheduled-rebuild] triggered build hook → HTTP ${res.status}`);
  return new Response(res.ok ? 'triggered' : 'failed', { status: res.ok ? 200 : 502 });
};

// Every 6 hours.
export const config = { schedule: '0 */6 * * *' };
