# Zo Media Website Distribution and WordPress Retirement Runbook

**Status:** Draft — implementation preparation complete; production cutover is blocked pending access, service, and business decisions listed below.  
**Scope:** Technical launch of the Astro website at `zomediaproductions.com`, migration away from the legacy WordPress installation, and safe HostGator retirement. This is not a marketing-distribution plan.

## 1. Current state

| Area | Confirmed status | Source of truth |
| --- | --- | --- |
| Replacement site | Astro static site, built with `npm run build` into `dist` | `package.json` |
| Intended production hostname | `https://zomediaproductions.com` | `astro.config.mjs`, `robots.txt` |
| Staging URL | `https://zomedia.netlify.app/` returned `HTTP/2 200` from Netlify with the configured security headers | Read-only live-header check on 2026-07-30 |
| Intended hosting | Netlify; build command is `npm run build`, publish directory is `dist`, Node.js 22 | `netlify.toml` |
| Legacy site | Live WordPress site at `zomediaproductions.com` | Live HTTP headers |
| Legacy infrastructure | `50.87.149.90`, DNS delegated to HostGator nameservers `ns6053.hostgator.com` and `ns6054.hostgator.com` | DNS lookup on 2026-07-30 |
| Existing redirects | Eight explicit permanent redirects | `public/_redirects` |
| Forms | Two Netlify Forms: `contact` and `newsletter` (footer, home, Wire page share one component). A `submission-created` function optionally relays to Resend + a mailing-list provider; see `docs/FORMS.md` | `src/pages/contact.astro`, `src/components/forms/SubscribeForm.astro`, `netlify/functions/` |
| Donations | Give Lively widget is built and dormant; the contact flow is used until credentials are added (`docs/GIVE-LIVELY.md`) | `src/pages/support.astro`, `src/components/forms/GiveLively.astro` |
| Analytics | Env-driven loader (GA4 or Plausible) is built but off until an ID is set; see `docs/SEO.md` | `src/config/analytics.ts` |

Do not interpret the current HostGator nameservers as proof that HostGator is the domain registrar. The registrar and billing owner must be confirmed from the domain account before any DNS or cancellation action.

## 2. Roles and approvals

Assign a named person and backup before the launch window. Do not store passwords or recovery codes in this document.

| Responsibility | Primary owner | Backup | Evidence required |
| --- | --- | --- | --- |
| Domain registrar and DNS | **TBD** | **TBD** | Registrar login, recovery email, renewal date |
| HostGator / WordPress | **TBD** | **TBD** | Hosting login, WordPress administrator login, invoice/renewal date |
| Netlify production site | **TBD** | **TBD** | Netlify team/site access and deploy permissions |
| Source repository | **TBD** | **TBD** | `main` branch and GitHub organization access |
| Content / redirect approval | **TBD** | **TBD** | Approved old-to-new URL map |
| Forms and newsletter recipient | **TBD** | **TBD** | Successful test messages received |
| Store, donations, and finance | **TBD** | **TBD** | Decision and export/processor confirmation |
| Search and analytics | **TBD** | **TBD** | Google Search Console and Bing Webmaster ownership |
| Launch authority | **TBD** | **TBD** | Written go/no-go approval |

## 3. Decisions required before cutover

| Decision | Required answer | Default / current behavior | Blocks |
| --- | --- | --- | --- |
| Production host | Confirm Netlify and the owning Netlify site/team, or select an alternative | Netlify is configured; staging is `zomedia.netlify.app` | Domain attachment and deployment |
| Canonical hostname | Choose `zomediaproductions.com` or `www.zomediaproductions.com`; redirect the other host | The codebase uses the apex hostname | SSL, redirects, SEO |
| Legacy store | Migrate, replace, or archive WordPress/WooCommerce products, orders, and customer data | The new site has a books page but no checkout | WordPress cancellation |
| Donations | Select the processor and recipient organization, or keep the contact-flow model | Contact-flow model | Launch approval |
| Newsletter | Select the email provider and consent/data-import approach | Netlify captures a form submission only; it does not operate a mailing list | Newsletter launch |
| Analytics | Choose GA4, Plausible, Fathom, or no analytics; identify historical data to preserve | No analytics | Measurement |
| Privacy and retention | Define retention for backups, inquiries, subscribers, orders, and payment data | Undecided | Archive and deletion |
| Rollback period | Set the legacy-host retention period after launch | Recommended: 30 days after stable launch | HostGator cancellation |
| Search crawler policy | Confirm whether AI crawlers should be allowed | Current `robots.txt` allows all crawlers | SEO policy |

## 4. Legacy-site preservation

Complete this before changing DNS. Retain the final archive according to the approved policy, with access limited to authorized staff.

### 4.1 Capture

- [ ] Record HostGator account number, service plan, renewal date, billing owner, support PIN, and cancellation procedure.
- [ ] Record WordPress administrator users, roles, active theme, plugins, PHP version, cron jobs, and any external API keys or SMTP settings.
- [ ] Create a full HostGator account backup.
- [ ] Export the WordPress database as SQL.
- [ ] Archive `wp-content/uploads/`, custom themes, plugins, and any non-standard files.
- [ ] Export WordPress content (`Tools → Export → All content`) as WXR/XML.
- [ ] Export users, form submissions, newsletter subscribers, WooCommerce products, orders, coupons, customers, tax settings, and reports if those functions exist.
- [ ] Save site SEO settings: titles, meta descriptions, redirects, sitemap settings, robots settings, Search Console verification method, and analytics IDs.
- [ ] Save a crawl of all public legacy URLs, including status code, title, canonical URL, inbound links if available, and proposed destination.
- [ ] Confirm an authorized person can restore the archive to a non-production environment.

### 4.2 Archive record

For each archive, record:

| Artifact | Date/time | Storage location | Checksum | Restorable by | Retain until |
| --- | --- | --- | --- | --- |
| Full hosting backup | **TBD** | **TBD** | **TBD** | **TBD** | **TBD** |
| WordPress SQL export | **TBD** | **TBD** | **TBD** | **TBD** | **TBD** |
| WordPress media archive | **TBD** | **TBD** | **TBD** | **TBD** | **TBD** |
| WXR content export | **TBD** | **TBD** | **TBD** | **TBD** | **TBD** |
| Store/customer exports | **TBD** | **TBD** | **TBD** | **TBD** | **TBD** |

## 5. URL migration and redirects

The committed redirects are a starting point, not a complete migration. Preserve query strings unless a documented exception is approved. A redirect must be either an actual equivalent or the closest useful replacement; a blanket redirect to the home page is not acceptable.

### 5.1 Public legacy inventory — observed 2026-07-30

This is a read-only public-web snapshot, not a WordPress export. `https://zomediaproductions.com/wp-sitemap.xml` was fetched successfully on 2026-07-30 and listed 181 public URLs across ten child sitemaps. The legacy home page returned `HTTP/2 200`, Apache headers, and WordPress API links. The sitemap index, child-sitemap counts, and intended dispositions below are concrete evidence for the launch URL map; it does **not** cover URLs known only to WordPress, redirects plugins, analytics, Search Console, social profiles, newsletters, PDFs, uploaded media, or external links.

| Legacy sitemap | URLs | Public inventory and proposed disposition |
| --- | ---: | --- |
| `wp-sitemap-posts-post-1.xml` | 1 | `/2025/03/22/michael-l-mckuin-fighting-injustice-through-science-fiction-and-horror/` → **TBD**. No matching article exists in the replacement; retain or republish the article before assigning a redirect. |
| `wp-sitemap-posts-page-1.xml` | 107 | Current organization paths: `/about/` and `/contact/` are served directly by matching replacement routes; `/studio/` → `/film-projects/` and `/join-our-cooperative/` → `/support/` are proposed. The commerce paths `/shop/`, `/store/`, `/online-shop/`, `/store-with-sidebar/`, `/cart/`, `/cart-2/`, `/checkout/`, `/checkout-2/`, and `/my-account/` require the store-retention decision. The remaining entries are WordPress theme/demo or boilerplate pages, including `/sample-page/`, `/create-your-website-with-blocks/`, `/business/`, `/company/`, `/minimal/`, `/static-header/`, `/corporate/`, `/one-page/`, `/creative/`, `/fashion-brand/`, `/our-services/our-services-2/`, `/elements/*`, `/features/*`, `/portfolio-page/*`, and the named theme-demo home pages. Verify they are unneeded, then return `410 Gone`; do not redirect them to Zo Media content. |
| `wp-sitemap-posts-product-1.xml` | 14 | All listed WooCommerce products are book titles or duplicate product records: `domestic-genocide`, `king-the-early-years`, `mayhem-murder-and-magnificence`, `black-lives-matter-essays-and-poems`, `domestic-genocide-2`, `king-the-early-years-2`, `black-lives-matter-essays-and-poems-2`, `murder-mayhem-ddl`, `kill-the-bastard`, `kill-the-bastard-2`, `social-justice-autobiographies-inequality-injustice-americas-incarcerated-e-book`, `social-justice-autobiographies-inequality-injustice-americas-incarcerated`, `no-rhyme-or-reason-e-book`, and `no-rhyme-or-reason`. The replacement has matching book titles in its local book collection, but no per-book routes; proposed destination is `/books/` after verifying every purchase link and the store decision. |
| `wp-sitemap-posts-project-1.xml` | 25 | `/portfolio/my-comrades-thoughts-on-blm/`, `/portfolio/domestic-genoicide/` (legacy spelling), and `/portfolio/social-justice-autobiographies/` → `/books/` are proposed title-level matches. `/portfolio/project-layout-*`, `/portfolio/heli-studio/`, and `/portfolio/ilus-*` are theme/demo records and should become `410` once approved. |
| `wp-sitemap-posts-testimonial-1.xml` | 3 | `/testimonial/jane-doe/`, `/testimonial/frankie-kao/`, and `/testimonial/selena-johansson/` are unverified legacy testimonials with no replacement counterpart; preserve/export first, then use `410` unless approved content is republished. |
| `wp-sitemap-taxonomies-category-1.xml` | 1 | `/category/uncategorized/` is WordPress taxonomy residue; proposed `410`. |
| `wp-sitemap-taxonomies-product_cat-1.xml` | 3 | `/product-category/books/`, `/product-category/amazon/`, and `/product-category/downloadable-books/` → `/books/` are proposed, subject to the commerce decision. |
| `wp-sitemap-taxonomies-product_tag-1.xml` | 16 | The legacy tags (`social-sciences`, `autobiographies`, `collections`, `compilations`, `essays`, `collection`, `poetry`, `short-story`, `science-fiction`, `short-stories`, `fiction`, `social-commentary`, `urban-culture`, `black-lives-matter`, `memoir`, `research`) describe books. The replacement only filters client-side, so `/books/` is the proposed useful destination rather than an invented filter URL. |
| `wp-sitemap-taxonomies-project-category-1.xml` | 8 | `/projects/books/` and `/projects/anthologies/` → `/books/` are proposed. `/projects/branding/`, `/projects/print/`, `/projects/portfolio-slider/`, `/projects/animation/`, `/projects/illustration/`, and `/projects/web/` are theme/demo taxonomies; proposed `410` after approval. |
| `wp-sitemap-users-1.xml` | 3 | `/author/ikilgore/`, `/author/laurietang/`, and `/author/paulae/` have no author-archive equivalent. Do not redirect until the content owner selects an author or editorial destination. |

The legacy sitemap also exposes two legacy paths that are already represented in the source redirect file: `/gallery/` and the currently served root (`/`). The previously committed `/bookstore`, `/our-story`, `/get-involved`, `/blog.html`, and `/hundred-stories.html` rules were not present in the observed WordPress sitemap, so they remain important historic/inbound-link candidates rather than evidence of the current public sitemap.

### 5.2 Committed redirect rules

| Legacy path | New destination | Configuration status | Validation status |
| --- | --- | --- | --- |
| `/bookstore` and `/bookstore/` | `/books` | 301 in `public/_redirects` | Syntax copied into local `dist/_redirects`; requires Netlify deploy-preview test |
| `/our-story` and `/our-story/` | `/about` | 301 in `public/_redirects` | Same |
| `/gallery` and `/gallery/` | `/` | 301 in `public/_redirects` | Same |
| `/get-involved` and `/get-involved/` | `/support` | 301 in `public/_redirects` | Same |
| `/blog.html` | `/` | 301 in `public/_redirects` | Same |
| `/hundred-stories.html` | `/` | 301 in `public/_redirects` | Same |

### 5.3 Required redirect-map completion

1. Export URL, redirect-plugin, menu, product, media, and taxonomy data from WordPress. Compare it with the 181-URL public-sitemap snapshot above and retain the source exports with the migration archive.
2. Add URLs surfaced by a crawler, analytics, Search Console, social profiles, PDFs, newsletters, partner links, and server logs. Record whether each URL has traffic, backlinks, or business value.
3. Obtain content/business sign-off for every proposed target and every `410`. In particular, do not publish a `410` for checkout, account, product, newsletter, or author URLs until retention and customer-service obligations are known.
4. Add only signed-off permanent rules to `public/_redirects`. Keep direct replacements such as `/about/` and `/contact/` as normal static routes, not self-redirects.
5. Test every old URL on a Netlify deploy preview and again after cutover: one-hop `301` where applicable, destination `200`, correct canonical URL, and retained query parameters. Test `410` responses explicitly.
6. Keep the completed CSV with: legacy URL, source (`sitemap`, crawl, analytics, etc.), traffic/backlink evidence, disposition, new URL, owner, rationale, test date, expected status, actual status, and sign-off.

## 6. Netlify production setup

Complete this only after the team confirms the production Netlify account.

- [ ] Add the source repository to the authorized Netlify team; set `main` as the production branch.
- [ ] Confirm build settings: `npm run build`, publish directory `dist`, Node.js 22.
- [ ] Restrict production deploy permissions and configure at least one backup administrator.
- [ ] Attach `zomediaproductions.com` and, if applicable, `www.zomediaproductions.com`.
- [ ] Verify Netlify-issued TLS certificates are active for every served host.
- [ ] Configure the canonical host and a permanent redirect from the alternate host.
- [ ] Verify security and cache headers from `netlify.toml` are served.
- [ ] Configure Netlify Forms notifications for `contact` and `newsletter` (or the Resend/provider env vars in `docs/FORMS.md`); document recipients and escalation coverage.
- [ ] Submit successful test entries for both forms (and a newsletter signup from the footer, home page and Wire page) on the actual production domain. Confirm confirmation/error behavior and the receiver's access to each submission.
- [ ] Add spam controls appropriate for the chosen form workflow; the contact form already includes a honeypot.
- [ ] Confirm preview-deploy and production rollback procedures, including who can promote a prior successful deploy.

## 7. Pre-launch quality gate

All checks must pass in production-like preview before setting production DNS.

### 7.1 Completed local validation evidence

The following was verified on 2026-07-30 without changing any account, DNS record, or deployment:

| Check | Result | Limit |
| --- | --- | --- |
| `npm run build` | Passed; Astro generated 15 static pages and `dist/sitemap-index.xml`. | A successful local build does not prove the production deploy contains this revision. |
| Generated sitemap | Confirmed that `/about/`, `/contact/`, `/books/`, `/film-projects/`, and `/support/` use the intended `https://zomediaproductions.com` canonical URLs. | Does not validate every link or page visually. |
| Redirect artifact | `public/_redirects` was copied byte-for-byte to `dist/_redirects` during the local build. | Netlify must still parse and serve the rules in a deploy preview. |
| Staging endpoint | `https://zomedia.netlify.app/` returned `200` from Netlify and served `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` headers consistent with `netlify.toml`. | It was not authenticated to identify the production site/team or to confirm that staging contains the just-built revision. |

### Site and content

- [ ] `npm run build` succeeds from a clean install.
- [ ] Every navigation, footer, book, support, contact, and special-project link has a valid intended destination.
- [ ] Replace or approve all placeholder team, book, project, logo, social, and open-graph content listed in `IMPROVEMENTS.md`.
- [ ] Verify published contact information: `info@zomediaproductions.com`, phone, and P.O. box.
- [ ] Approve the support-page language and revenue-distribution claims.
- [ ] Resolve or deliberately defer current QA findings, including broken/dead anchors and mobile/accessibility issues.

### Search, analytics, and discovery

- [ ] Verify generated `sitemap-index.xml` contains every intended public route.
- [ ] Confirm `robots.txt` points to `https://zomediaproductions.com/sitemap-index.xml`.
- [ ] Confirm canonical URLs use the selected production hostname.
- [ ] Add the approved analytics implementation and confirm it does not collect data before the required consent, if consent applies.
- [ ] Verify Google Search Console and Bing Webmaster Tools ownership with the selected canonical property.
- [ ] Preserve legacy analytics/Search Console access until post-launch comparison is complete.
- [ ] Confirm titles, descriptions, social metadata, and structured data represent actual approved content.

### Security, accessibility, and browser checks

- [ ] Test current Chrome, Safari, Firefox, and mobile Safari/Chrome.
- [ ] Test 375px, 480px, 768px, 1024px, and desktop layouts.
- [ ] Keyboard-test navigation, forms, filters, and footer controls; validate visible focus treatment.
- [ ] Run an automated accessibility scan and manually check headings, image alternatives, contrast, and form labels/errors.
- [ ] Scan for broken internal/external links and mixed content.
- [ ] Run performance testing against the production-like build; record scores and largest assets.

## 8. DNS cutover runbook

### 8.1 One to three days before launch

1. Set the relevant existing DNS record TTLs to 300 seconds, if the registrar/DNS provider permits it.
2. Create the Netlify custom-domain configuration and complete its DNS verification without replacing the live record early.
3. Capture current DNS records: A/AAAA, CNAME, MX, TXT, SPF, DKIM, DMARC, and any subdomain records.
4. Protect email: copy mail-related records exactly and do not replace nameservers unless every existing DNS record has been inventoried and recreated.
5. Prepare an approved rollback action: restore the prior site-origin A/CNAME record and retain the prior values in the launch record.
6. Freeze WordPress content changes or define a final-content export time so content is not lost during migration.

### 8.2 Launch window

1. Confirm the go/no-go approval and that the backup, URL map, Netlify deploy, form tests, and rollback instructions are complete.
2. Publish the approved production deploy on Netlify.
3. Change only the web-host records required to point the canonical and alternate web hosts to Netlify's documented values. Do not alter MX/TXT email records unless separately approved.
4. Wait for DNS propagation and validate from independent networks.
5. Test:
   - `https://zomediaproductions.com`
   - `https://www.zomediaproductions.com` if used
   - HTTP-to-HTTPS behavior
   - Canonical-host redirects
   - Each approved legacy redirect
   - Contact and newsletter submissions
   - Sitemap and robots files
   - Error pages and direct deep links
6. Record exact launch time, DNS changes, Netlify deploy ID, validators, and exceptions in the launch log.

### 8.3 Rollback

Trigger rollback if the production hostname has certificate failures, widespread 5xx/404 errors, broken forms, a failed critical revenue path, or an approved business stop decision.

1. Revert the web DNS record(s) to the recorded HostGator origin values, or restore the prior working DNS zone if nameservers were changed.
2. Re-publish the prior known-good configuration if the failure is Netlify-only and DNS does not need reverting.
3. Notify launch owners, record the incident, and keep HostGator active.
4. Correct the failure in a deploy preview; repeat the complete pre-launch quality gate before another cutover.

## 9. Post-launch monitoring

### First hour

- [ ] Confirm every host is reachable with a valid certificate.
- [ ] Check Netlify deploy, function/form, and error logs.
- [ ] Submit and receive contact and newsletter tests.
- [ ] Validate the top 20 legacy URLs and every high-value shop, donation, press, or partner URL.
- [ ] Confirm analytics events/pageviews, if analytics was approved.

### First 7 days

- [ ] Monitor 404s, redirect counts, form spam/delivery, crawl errors, uptime, and Core Web Vitals.
- [ ] Submit the sitemap to Google Search Console and Bing Webmaster Tools.
- [ ] Inspect Search Console coverage and crawl errors daily; add missing redirects where evidence supports them.
- [ ] Update external profiles, newsletter links, social links, partner sites, and any paid listings to use the canonical URL.
- [ ] Keep a change log for fixes made after launch.

### End of rollback period

- [ ] Obtain written technical and business acceptance.
- [ ] Verify the WordPress archive can be restored and that needed store, contact, and subscriber data was exported.
- [ ] Confirm no traffic, forms, scheduled jobs, webhooks, payment flows, or email service depends on HostGator/WordPress.
- [ ] Confirm DNS is no longer delegated to HostGator before cancelling hosting. If HostGator still hosts DNS, move DNS first and validate the full zone.

## 10. WordPress and HostGator retirement

Do not delete the WordPress site or cancel the HostGator service merely because the new site is live. Cancellation happens only after the rollback-period acceptance checklist is complete.

1. Create and verify the final archive described in section 4.
2. Remove or rotate WordPress administrator access, plugin/API credentials, payment keys, SMTP credentials, and webhooks after their replacement is confirmed.
3. Disable scheduled jobs, auto-renewal, and any paid add-ons only after recording their effect.
4. Cancel the WordPress/HostGator hosting product according to the account owner's approved procedure.
5. Save cancellation confirmation numbers, final billing statement, end date, and archive retention date.
6. Review the domain registration separately. Keep the domain registered and auto-renewal enabled with the approved registrar; hosting cancellation must not expire the domain.

## 11. Launch record

| Item | Value |
| --- | --- |
| Planned launch date/time and time zone | **TBD** |
| Actual launch date/time and time zone | **TBD** |
| Production Netlify site/team | **TBD** |
| Canonical host | **TBD** |
| DNS owner | **TBD** |
| Registrar | **TBD** |
| Netlify production deploy ID | **TBD** |
| WordPress archive location | **TBD** |
| Rollback deadline | **TBD** |
| Technical approver | **TBD** |
| Business approver | **TBD** |
| HostGator cancellation confirmation | **TBD** |

