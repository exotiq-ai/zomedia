# SEO, SEM & AI-visibility

## What the build does automatically
| Area | Implementation |
| --- | --- |
| Titles / descriptions / canonicals | `src/layouts/BaseLayout.astro` — one canonical per page (trailing-slash, `https://zomediaproductions.com`), `robots` meta with large-preview directives, `noindex` for `/thanks/`. |
| Social cards | Branded 1200×630 JPEG per page and per book in `public/assets/og/` (`npm run brand-assets` regenerates). Open Graph + Twitter large-image tags with alt text. |
| Structured data (JSON-LD `@graph`) | `Organization` (logo, contact, parent org, `sameAs`), `WebSite`, `WebPage`, `BreadcrumbList` on every page; `Book` on each `/books/<slug>/` (adds `Offer` only once a real purchase link exists); `ItemList` on `/books/`; `DonateAction` on `/support/` once Give Lively is on. |
| Per-book pages | `/books/<slug>/` — indexable pages for every title, linked from the home bookshelf, the books grid and related-books. |
| Sitemap | `/sitemap-index.xml` (all public routes; excludes `/thanks/` and the 404). Linked from `robots.txt` and `<head>`. |
| robots.txt | Generated (`src/pages/robots.txt.ts`). Search engines allowed. AI crawlers: policy in `src/config/site.ts` → `AI_CRAWLER_POLICY` (`'allow'` today). |
| LLM / answer-engine files | `/llms.txt` (summary) and `/llms-full.txt` (books, projects, board, advisory) generated from the same content as the pages, so they never drift. |
| Performance | Lighthouse (mobile, lab) on the built site — Accessibility 100, Best Practices 100, SEO 100, Performance 76→81–99 depending on page (hero imagery is the limiter). Hero videos only load on wide screens; heroes' LCP images are preloaded. |
| Icons | SVG + ICO favicon, 180px apple-touch-icon, 192/512 + maskable icons, `site.webmanifest`. |

## You need to do (accounts)
1. **Google Search Console** → add `https://zomediaproductions.com` (Domain property is best; DNS TXT) *or* use the HTML-tag method: put the content value in `PUBLIC_GOOGLE_SITE_VERIFICATION` (Netlify env) → redeploy → Verify. Then **Sitemaps → submit `sitemap-index.xml`**.
2. **Bing Webmaster Tools** → import from Search Console, or put the value in `PUBLIC_BING_SITE_VERIFICATION`.
3. **Analytics** — choose one and set the env var (see `src/config/analytics.ts`):
   - `PUBLIC_PLAUSIBLE_DOMAIN` — cookie-free, no banner needed.
   - `PUBLIC_GA4_ID` — required if you want Google Ad Grants conversion tracking. It sets cookies; the Privacy Policy text adapts automatically. For EU visitors you would also need a consent banner.
   Events already emitted: `page_view` (GA4), `newsletter_signup`, `form_submit`, `outbound_click`.
4. **Google Business Profile** for Zo Media (mail address P.O. Box means a service-area/online listing) — keeps name, phone, URL consistent with the site's structured data.
5. **Google Ad Grants** (up to $10,000/mo of free search ads for eligible 501(c)(3)s): register UBFSF with Google for Nonprofits (TechSoup validation), then apply. Site-readiness items already covered: HTTPS, privacy page, clear mission, no placeholder pages (finish the placeholders listed in LAUNCH-PLAN.md). Ad Grants requires conversion tracking → GA4.

## Decisions
- **AI crawlers**: allow (current) = maximum chance of being cited by ChatGPT/Claude/Perplexity/Google AI; block = flip `AI_CRAWLER_POLICY` to `'block'`. Search-engine indexing is unaffected either way.

## Checks to run after launch
- Google's **Rich Results Test** on `/`, `/books/`, one book page.
- `https://zomediaproductions.com/robots.txt`, `/sitemap-index.xml`, `/llms.txt` load.
- Search Console → Pages: no "Excluded by noindex" except `/thanks/`.
- Redirects (from the WordPress inventory in `site-distribution-and-wordpress-retirement.md`) return one-hop 301s. **Proposed, awaiting sign-off:** WooCommerce product URLs → the matching `/books/<slug>/` page (domestic-genocide, king-the-early-years → king-early-years, mayhem-murder-and-magnificence → mayhem-murder-magnificence, black-lives-matter-essays-and-poems → my-comrades-thoughts, kill-the-bastard, social-justice-autobiographies-… → social-justice-autobiographies, no-rhyme-or-reason); WordPress theme/demo pages → 410.
