# Zo Media Website — Launch Status & Human To-Do

_Updated 2026-10-06 · branch `feat/launch-prep` (nothing committed or pushed yet) · Astro 6 static site → Netlify_

This replaces the May `IMPROVEMENTS.md` / QA punch list. First section = what's done and how it was verified; second = **what only you can do**.

---

## 1. What was done in this pass

### Bugs fixed (all were reproduced before fixing)
| Was | Fix |
| --- | --- |
| **Mobile menu collapsed to a 160px strip** (nav's `will-change`/transform trapped the `position:fixed` overlay) **and stopped working after the first page navigation** (View Transitions swap the `<nav>`; listeners were bound once) | Nav script rebuilt around delegated listeners; no transform at rest; Escape/focus-trap/`visibility` so the closed menu isn't tab-reachable; regression test in `tools/audit.mjs` |
| Horizontal scroll on tablet `/books/`, `/support/`, phone `/the-wire/` | Grid tracks `minmax(0,1fr)` + one breakpoint ladder; long button labels wrap |
| Book filter buttons dead after client-side navigation | `astro:page-load` instead of `DOMContentLoaded` |
| Home hero headline 30px next to a 20px subhead on phones; contact hero cramped/illegible | Mobile type scale fixed; compact heroes stay compact; stronger overlay |
| 20+ tap targets under 44px on every page | 44px minimum on touch/tablet |
| Invalid `<link rel=preload as=video>`, dead `ContactForm`/`DonateBox`, 53 MB of unused WordPress images shipping in every build | Removed / moved out of `public/` into `_legacy/` (gitignored). `public/assets` 80 MB → 28 MB, `dist` 114 MB → 37 MB |
| Two untracked AI images of a real person were publicly downloadable from `/assets/images/` | Moved to `_legacy/unused-assets/` (see decision C3) |
| Axe found 80 issue groups: primary-button text 3.5:1, red text on dark 4.1:1, mislabelled pending social icons, skipped heading levels | Fixed (`--color-signal` nudged to `#CF3E43` so white text hits 4.75:1; new `--color-signal-text`) |

### New capabilities
| Ask | Delivered | Needs to go live |
| --- | --- | --- |
| **Forms backend** | Shared `SubscribeForm` + contact form with inline success/error (`aria-live`), no-JS fallback → `/thanks/`, honeypots, Netlify Forms + an optional `submission-created` function: Resend email routed by inquiry type, auto-reply, and Buttondown/Beehiiv/Mailchimp signup. 8 unit tests. → `docs/FORMS.md` | Netlify notifications (2 min) · Resend key + DNS · mailing-list choice |
| **Give Lively** | Dormant widget on `/support/` (`#give`), env-driven, falls back to the contact flow when unset. → `docs/GIVE-LIVELY.md` | Your Give Lively embed values |
| **Sanity CMS** | `studio/` (schemas: Book, Team member, Special project, Site settings; singleton settings; validation and plain-language help text), build-time loaders that switch on by env var (Markdown fallback), Netlify rebuild-on-publish design, one-command migration of all 36 existing documents + images, editor guide. Verified against a mock Sanity API (loaders → book page → home stats). → `docs/SANITY.md`, `docs/EDITOR-GUIDE.md` | Project ID/dataset, login, Ms. Kilgore's invite, Netlify build hook |
| **SEO / SEM / LLM** | Per-book pages (7 new indexable URLs); JSON-LD graph (Organization, WebSite, WebPage, BreadcrumbList, Book, ItemList, DonateAction); branded OG cards per page/book; generated `robots.txt` (+ explicit AI-crawler section), `/llms.txt`, `/llms-full.txt`; sitemap filters; manifest + icons; analytics loader (GA4 or Plausible, off by default) with form/outbound events; Search Console/Bing meta slots; Privacy + Terms pages. → `docs/SEO.md` | Analytics choice + IDs, Search Console, Ad Grants account |
| **Scroll motion** | Reading-progress bar, hero parallax (books/film, fine-pointer only), word-by-word scrubbed mission quote, mask reveals on book covers, horizontal snap "bookshelf" on the home page with arrow buttons, single rAF scroll scheduler. All gated by `prefers-reduced-motion`. | — |
| **Front-end polish** | Everything in the bug table plus book detail pages, legal pages, footer legal links, sitemap/OG consistency | — |

### Verification (run on the production build)
- `astro check`: 0 errors / 0 warnings / 0 hints · `npm test`: 8/8 · `astro build`: 25 pages.
- `tools/audit.mjs` (19 pages × 6 viewports 360→1920px, plus mobile-menu test): **all clear in Chromium and WebKit** (WebKit ≈ iOS Safari engine). Firefox couldn't launch in this sandbox — not tested.
- `tools/a11y.mjs` (axe-core, WCAG 2.1 A/AA + best practice, phone + desktop): **0 violations**.
- Lighthouse (mobile, simulated throttling): Accessibility **100**, Best Practices **100**, SEO **100** on all 7 pages tested. Performance: home 93, about 95, contact 99, film 97, book page 91, support 91, **books 81** (the hero poster is the limiter; real-browser LCP is ~50 ms locally).
- Contact + newsletter submit flows exercised in a browser (dev mode simulates the POST).

### NOT verified / not done — be aware
- **Nothing has been tested against live services**: real Netlify form delivery, Resend, any newsletter provider, Give Lively, the real Sanity project. Each has a "test after you add keys" step in its doc.
- No real-device testing (iPhone/Android/iPad), no Firefox.
- Not built: the pinned scroll-scene on About, Cloudflare Turnstile, Wire issues as CMS content, a Content-Security-Policy, smaller mobile versions of hero images, the film-subpage design-system migration (old QA item M7), per-page editable copy.
- The old WordPress redirect map still needs your sign-off (list in `docs/SEO.md` and the runbook); I did not add any new `_redirects` rules.
- Legal pages are drafts for counsel review (Oklahoma governing law is a placeholder choice).

---

## 2. What I need from you

### A. Sanity — mostly DONE (2026-10-07)
**Done:** project `shuf0j25` connected, 36 documents imported, Studio deployed at https://zomedia.sanity.studio/, `halima@ubfsf.org` invited as Editor, Netlify env vars set, Netlify Forms enabled. **Remaining for you:** (1) create a Netlify **Build Hook** (Site configuration → Build & deploy → Build hooks → Add; copy the URL) and send it to me so I can create the Sanity webhook; (2) Halima accepts the invitation email; (3) **rotate the Sanity API token** you pasted in chat (manage → API → Tokens → delete) and issue a new one only when needed; (4) merge the branch so production reads Sanity.

_Original list, for reference:_
1. **Project ID** and **dataset** (sanity.io/manage → the project). If the project already contains other content, tell me and we'll use a **new dataset** so nothing is overwritten.
2. **Access for the import/deploy**: either run `npx sanity login` in `studio/` yourself (steps in `docs/SANITY.md`), or add me/a machine user as an **Administrator** and give me a **deploy token** (manage → API → Tokens). A **read token** is only needed if the dataset is private.
3. **Ms. Kilgore's email** (invite as **Editor**) — and confirm "Ms. Kilgore" = Halima Kilgore on the staff list.
4. **Netlify**: access to the real production site, or a **Build Hook URL** (Build & deploy → Build hooks) to paste into the Sanity webhook.
5. Confirm the Studio address you'd like (default `zomedia.sanity.studio`).

### B. Give Lively _(waiting on credentials — tracked)_
- Widget **script URL** (and, for a Branded widget, the `data-widget-src` URL) from the widget's embed code → `docs/GIVE-LIVELY.md`.
- Confirm gifts go to **UBFSF (501(c)(3))** and approve the wording under the widget and in Privacy/Terms.
- Make one **test donation** after it's on.

### C. Accounts & credentials (each unlocks a feature)
| Item | Unlocks |
| --- | --- |
| Netlify site access / who owns it | everything below |
| Netlify **form notification emails** for `contact` + `newsletter` (2 minutes, no code) | you receive submissions at all |
| Resend account + API key + DNS access for `zomediaproductions.com` (SPF/DKIM) | routed contact email, auto-reply |
| Newsletter provider decision (Buttondown / Beehiiv / Mailchimp) + API key; import of any existing list (`iJXThOdLSzKbjahbRLDRrA/email_list.zomediaproductions.csv` — confirm it was consented) | real mailing list |
| Analytics choice (Plausible vs GA4) + ID | measurement; GA4 needed for Ad Grants |
| Search Console + Bing Webmaster verification value (or DNS TXT) | indexing, sitemap submission |
| Google for Nonprofits / Ad Grants for UBFSF (EIN, TechSoup validation) | free search ads |
| Google Business Profile | local/entity SEO |

### D. Domain & hosting (runbook roles — all still "TBD")
Who owns the registrar, HostGator, Netlify, GitHub org; who has launch authority; canonical host (`zomediaproductions.com` vs `www`); **full WordPress backup** before any DNS change; legacy-store decision; sign-off on the redirect/410 map; 30-day rollback window.

### E. Decisions only you can make
- ~~C1~~ **Decided:** AI crawlers allowed (`AI_CRAWLER_POLICY = 'allow'`).
- **C2** True **"books published"** (home says 12; 7 titles listed, 2 forthcoming) and the **profit-share %** (home says 50%) — written sign-off; these are now editable in Sanity → Site Settings.
- ~~C3~~ **Decided (house rule):** no AI images of Ivan. All AI portraits removed from the site (archived in `_legacy/ai-ivan/`); his team card and the documentaries bio show a monogram until you send his **original photo**.
- **C5** Where each book is sold → I add purchase links (they unlock "Buy" buttons and `Offer` markup). Verify prices.
- **C6** Consent to publish each board/advisory/staff name, bio and photo. (Dr. Kexiah Poole's bio is still "coming soon".)
- Legal: have counsel review `/privacy/` and `/terms/`.
- Approve the **commit/PR plan**: all work is uncommitted on branch `feat/launch-prep`. Say the word and I'll commit it in logical chunks and open a PR.

### F. Content & assets
Real headshots; final logo files (the two new transparent PNGs are in `public/assets/images/` — confirm final); X/Twitter + YouTube URLs (or remove the icons); special-project copy; testimonials/press quotes with permission; Wire back issues; the legacy McKuin article — republish or retire.

### G. Real-device checks (I can't do these)
After deploy to staging: iPhone Safari (menu, forms, Low-Power-Mode video), mid-range Android Chrome (scroll smoothness), iPad portrait + landscape; then **send real test submissions** and confirm they land. Final go/no-go before DNS cutover.

### H. After launch
Submit sitemap to Google/Bing; watch 404s for 7 days; keep HostGator through the rollback window; 30-minute Sanity training for Ms. Kilgore using `docs/EDITOR-GUIDE.md`.

---

## 3. Handy commands
```bash
npm run dev            # local site
npm run build && npx astro preview --port 4399
npm run audit          # responsive health check (needs a running preview: BASE_URL=http://localhost:4399)
ENGINE=webkit npm run audit
node tools/a11y.mjs    # axe accessibility scan
npm test               # forms-function unit tests
npm run brand-assets   # regenerate OG cards + app icons
npm run cms:export     # Markdown → Sanity import file
```
