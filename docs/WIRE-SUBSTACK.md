# The Phuckin' Wire × Substack

The Wire is published on Substack (https://zomediaproductions.substack.com). **Substack stays the home of the newsletter** — it writes, sends and archives the issues and owns the subscriber list. The website does two things around it:

## 1. Latest-issues preview (built in)
`/the-wire/` shows the three newest issues (cover image, date, title, subtitle) as cards that link to Substack; the home-page Wire promo shows the latest issue title. Nothing is copied: full articles stay on Substack (one canonical home, no duplicate-content SEO penalty).

- **How:** at build time `src/lib/substack.ts` reads Substack's public RSS feed (`/feed`). Substack sends no CORS headers, so a browser can't read it directly — build time is the clean way. Cover images are downloaded and optimised at build, so visitors make no requests to Substack's CDN.
- **Stays fresh:** `netlify/functions/scheduled-rebuild.mjs` rebuilds the site every 6 hours. It does nothing until you set `BUILD_HOOK_URL` (a Netlify build hook; the same hook can also serve the Sanity webhook).
- **Fail-safe:** 3 attempts per build; if Substack is unreachable the section just hides — a feed outage never breaks a deploy.
- **SEO:** the page gets `Blog` / `BlogPosting` structured data pointing at the Substack URLs; `llms.txt` / `llms-full.txt` list the latest issues; Substack is added to the organisation's `sameAs`.

## 2. Email signup that ends on Substack (built in)
All signup forms (footer, home, Wire page) work the same way:
1. Visitor enters an email in our own, on-brand form.
2. We **capture it ourselves** (Netlify Forms → your dashboard/CSV). This is a backup list you own.
3. The form then shows **"Confirm on Substack →"** (new tab, email prefilled) so the visitor lands on Substack's own subscribe page and finishes there. Substack then sends the confirmation and the issues.

### Why not write straight into Substack's list?
Substack has **no official public API** for adding subscribers, and a third-party site can't post to its subscribe endpoint (no CORS; I probed it — it returns an error page to server-side and cross-site requests). The two supported routes are (a) Substack's own embed or subscribe page, or (b) the publisher importing a CSV. So the design above guarantees:
- no signup is ever lost (we have it, even if the visitor abandons the Substack step);
- the on-site experience is on-brand (Substack's embed is a white 320px box);
- you can bulk-add anyone who didn't finish: Substack → **Subscribers → Import** with the Netlify Forms CSV export (only people who asked for the Wire).

### Options considered
| Option | Pros | Cons |
| --- | --- | --- |
| **Our form + Substack handoff (chosen)** | On-brand, we keep a backup list, always works | One extra click on Substack |
| Substack's official embed iframe (`/embed`) | One step, officially supported | White Substack-styled box on a dark site; no backup list on our side |
| Plain "Subscribe on Substack" button | Simplest | Leaks every visitor to another site, no capture |
| Direct POST to Substack's endpoint | One step | **Tested: rejected by Substack** when posted from another site |

## Optional upgrades
- **Custom domain for the publication** (Substack → Settings → Domain, a one-time fee): e.g. `wire.zomediaproductions.com`. Links and the subscribe page then feel like part of the site. Update `SUBSTACK` in `src/config/site.ts` after.
- **One-step signup — tested 2026-10-07, not possible.** A form on our live domain posting to Substack's own embed endpoint (`/api/v1/free?nojs=true`) with a real address is rejected by Substack ("Something has gone terribly wrong"), so a third-party site can't add subscribers directly. The handoff *does* work: `…/subscribe?email=…` opens Substack's subscribe page with the address prefilled, one click from done. That is why the site uses the handoff.
- **Weekly digest / more issues on the home page:** change `getWirePosts(…)` limits.

## Config
Everything lives in `src/config/site.ts` → `SUBSTACK` (publication URL, feed URL, subscribe URL).
