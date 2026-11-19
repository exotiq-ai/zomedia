# Shop Subdomain and Website Launch Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retain the existing WooCommerce store at `shop.zomediaproductions.com` and prepare the Astro website for the main domain without losing orders, downloads or email service.

**Architecture:** Keep the current WordPress installation and database on HostGator. Add the shop hostname to that installation, coordinate its WordPress URL migration with the main-domain release, and point reviewed purchase links at the corresponding shop products. Netlify hosts editorial pages; Sanity stores editorial content; Netlify handles form capture and notifications.

**Tech Stack:** HostGator/cPanel, WordPress/WooCommerce, Astro, Sanity, Netlify, Google Workspace DNS.

**Spec:** `docs/BOOK-COMMERCE.md`, approved hosting split dated November 19, 2026.

## Global Constraints

- Keep HostGator active while WooCommerce runs there.
- Preserve the existing WordPress database, orders, customer accounts and download entitlements.
- No live payment or refund is performed by the agent; use gateway test facilities and owner participation.
- Never expose backups, ebook masters, API keys or customer records in public web roots or public Sanity content.
- Preserve all existing mail-related DNS records. Current web origin is `50.87.149.90`; authority is HostGator; MX records point to Google.
- Do not unlock the Netlify preview until its production branch contains the preview gate.
- Catalog and rights review flags remain subject to publisher approval.

## Review Focus

- Existing download URLs can use main-domain query parameters; retain their full parameters and entitlements after cutover.
- Payment callbacks can use POST requests and cannot be assumed to follow browser redirects.
- WordPress serializes some stored settings; use serialization-aware URL replacement after a restorable backup.
- A hostname pointing at the same WordPress installation may redirect to the configured home URL until migration; verify this before declaring the shop ready.
- Changes to the shared HostGator account must be scoped to ZoMedia, preserving the other hosted websites.

### Task 1: Establish access and recovery

- [x] Locate the correct ZoMedia website in the owner's signed-in HostGator account.
- [x] Capture public DNS before changes in ignored `output/launch/2026-11-19/dns-before.json`.
- [x] Owner completes HostGator's mandatory support-PIN creation; browser security rules require owner entry.
- [x] Inspect ZoMedia's document root, WordPress administration, database, enabled gateways and existing backups.
- [x] Create private file/database backups and verify archive integrity, critical files and SHA-256 checksums; save rollback settings. A full restore into a separate environment remains untested.

### Task 2: Establish the shop hostname

- [x] Configure `shop.zomediaproductions.com` on HostGator with the verified existing ZoMedia document root.
- [x] Add the shop DNS record at the authoritative DNS service; do not alter main-domain or mail records yet.
- [x] Obtain and verify a valid TLS certificate for the shop hostname.
- [x] Verify the hostname reaches the existing installation and migrate WordPress's home/site URLs. All 14 product IDs remain unchanged; root, store, cart and account respond successfully on the new host. An empty checkout redirects to the shop cart.

### Task 3: Prepare commerce migration and release routing

**Files:** `public/_redirects` and, only if required by verified gateway behavior, a dedicated Netlify edge handler and focused regression tests. Do not activate rules before the destination is ready.

- [x] Refresh public WooCommerce/Sanity evidence using `node tools/catalog-audit.mjs` (14 products, seven books).
- [x] Record exact store, cart, checkout and account routes: `/store/`, `/cart-2/`, `/checkout-2/`, `/my-account/`. No historical order/download permissions exist in this database. Payment callbacks remain pending organization-owned gateway activation.
- [x] Draft and test product/category/cart/checkout/account routing while preserving query parameters. Browser POST method semantics are covered; live gateway callback behavior remains a separate sales gate.
- [x] Apply serialization-aware WordPress URL migration after private backups; retain pre-migration options and original HTTPS configuration for rollback. See recovery commands below.
- [ ] Obtain publisher-approved per-title destinations, prices, availability and rights; update Sanity links after the shop destination is tested.

**Routing implementation:** Create `netlify/edge-functions/commerce-redirects.js` and `netlify/tests/commerce-redirects.test.mjs`; register it in `netlify.toml` before the preview gate. The handler only redirects the exact main/www production hosts to the fixed HTTPS shop host. It preserves query parameters and uses HTTP 307 with no-store so browser POSTs keep their method and rollback is possible. Leave the main homepage, editorial pages and Netlify Forms POSTs untouched. Alternate preview hosts must still reach the password gate. Tests must cover root commerce query parameters, cart/checkout aliases, encoded product/media paths, POST bodies, fixed destination origin, and context.next for previews/editorial/forms. Update `tools/catalog-audit.mjs` to read the actual shop backend.

Ruling: use an edge response for HTTP 307 because Netlify's configuration-file redirect parser does not support that status. This is a browser compatibility redirect, not a payment-webhook proxy; gateway callbacks must be registered/tested at the new shop address before live sales.

### Task 4: Prepare the website release

- [x] Run `npm test` (31 passing including commerce routing) and `npm run validate` (26 pages, zero type-check errors or warnings, one existing hint).
- [x] Run internal link/resource checks and Studio typecheck; all 1,290 references resolve and Studio typecheck passes.
- [x] Commit only the reviewed launch changes on the existing feature branch and open a draft PR against `main`: https://github.com/exotiq-ai/zomedia/pull/5.
- [ ] Resolve remaining content approvals and prove the CMS publish/rebuild flow before promoting the release.

### Task 5: Coordinated cutover

- [ ] Confirm backups, tested shop TLS, gateway requirements, release artifact, content acceptance and rollback ownership.
- [x] Migrate the existing WordPress URLs to the shop hostname without forking active order data.
- [ ] Verify shop product pages, cart, account access, protected downloads, test-mode payments and receipt configuration.
- [ ] Attach the approved main/www domains to Netlify; change only the verified web DNS records.
- [ ] Verify public access/indexability on the main domain and continuing protection of alternate Netlify preview hosts.
- [ ] Verify forms, shop links, legacy commerce URLs, mail DNS, TLS and rollback behavior; record exact changes and deployment IDs.

## Execution Record

- November 19: HostGator required a fresh login when opening ZoMedia's management page. The login then required support-PIN creation at `/my-account/account-center/secure-your-account`. Owner handoff requested; no PIN was entered by the agent.
- Owner completed PIN setup. Created the shop virtual host on the existing ZoMedia document root and its A record; AutoSSL issued a valid certificate. Main-domain A/MX/TXT/NS records are unchanged.
- Private backup: `/home1/ubfsf/zo-migration-backups/20261119T161429Z` contains SQL, full WordPress archive, checksums, baseline counts and pre-migration settings. Live directory metadata changed during archive creation; archive/gzip integrity, critical-file presence and checksum checks passed. A separate restore rehearsal is still pending.
- Applied 214 serialization-safe URL replacements, excluding GUIDs. A repeat dry run reports zero remaining replacements. Home/site URLs now point to the shop. Six users, zero orders and zero download permissions match the pre-migration baseline.
- Added a shop-host-only Apache HTTP 307 HTTPS rule; verified exact path/query preservation, valid HTTPS product response and unchanged main-host behavior. Original `.htaccess` is backed up privately.
- WooPayments displays Test account; PayPal displays Action needed. Owner has no organization payment details available. No financial activation/settings changes or transactions were performed.
- Prepared an ignored CSV of all 14 current product URLs and their proposed shop-host destinations at `output/launch/2026-11-19/commerce-url-map.csv`. Every destination is explicitly pending shop verification and publisher approval; no Sanity records were changed.
- Independent read-only code review found no launch-blocking defect in preview protection, CMS validation or commerce approval handling. Draft PR #5 contains the reviewed release and migration preparation; no merge or Netlify unlock has occurred. Netlify queued deploy preview #5 automatically after PR creation.

## Recovery Commands

Run only during a coordinated rollback window after taking a fresh private database backup. Reversing URLs preserves newer orders; restoring the entire old SQL backup would overwrite newer data and must not be done casually. Keep the shop DNS/TLS available until rollback is verified.

```sh
wp --path=/home1/ubfsf/zomediaproductions.com --skip-plugins --skip-themes search-replace https://shop.zomediaproductions.com https://zomediaproductions.com --all-tables-with-prefix --skip-columns=guid --dry-run --report-changed-only
# Review the dry run, then repeat the same command without --dry-run.
wp --path=/home1/ubfsf/zomediaproductions.com --skip-plugins --skip-themes option get home
wp --path=/home1/ubfsf/zomediaproductions.com --skip-plugins --skip-themes option get siteurl
```

The pre-HTTPS `.htaccess` is in the private backup directory. Its restoration is optional for a main-host rollback because the new rule applies only to the shop hostname; inspect any subsequent edits before replacing it. Revert main-domain web DNS to the captured origin only if it has subsequently moved, preserving MX/TXT records. Reverify products, account and checkout after rollback.
