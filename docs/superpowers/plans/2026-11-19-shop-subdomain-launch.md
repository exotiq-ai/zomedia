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
- [ ] Owner completes HostGator's mandatory support-PIN creation; browser security rules require owner entry.
- [ ] Inspect ZoMedia's document root, WordPress administration, database, enabled gateways and existing backups.
- [ ] Create private file/database backups, record checksums and location, and verify a recovery path.

### Task 2: Establish the shop hostname

- [ ] Configure `shop.zomediaproductions.com` on HostGator with the verified existing ZoMedia document root.
- [ ] Add the shop DNS record at the authoritative DNS service; do not alter main-domain or mail records yet.
- [ ] Obtain and verify a valid TLS certificate for the shop hostname.
- [ ] Verify the hostname reaches the intended installation and document any home-URL redirects.

### Task 3: Prepare commerce migration and release routing

**Files:** `public/_redirects` and, only if required by verified gateway behavior, a dedicated Netlify edge handler and focused regression tests. Do not activate rules before the destination is ready.

- [x] Refresh public WooCommerce/Sanity evidence using `node tools/catalog-audit.mjs` (14 products, seven books).
- [ ] Record exact checkout, account, payment callback and historical download routes from the existing installation.
- [ ] Draft and test product/category/cart/checkout/account routing while preserving query parameters. Verify POST callback behavior separately.
- [ ] Prepare a serialization-aware WordPress URL migration and exact rollback commands using the verified installation path/database.
- [ ] Obtain publisher-approved per-title destinations, prices, availability and rights; update Sanity links after the shop destination is tested.

### Task 4: Prepare the website release

- [x] Run `npm test` (23 passing) and `npm run validate` (26 pages, zero type-check errors or warnings, one existing hint).
- [x] Run internal link/resource checks and Studio typecheck; all 1,290 references resolve and Studio typecheck passes.
- [x] Commit only the reviewed launch changes on the existing feature branch and open a draft PR against `main`: https://github.com/exotiq-ai/zomedia/pull/5.
- [ ] Resolve remaining content approvals and prove the CMS publish/rebuild flow before promoting the release.

### Task 5: Coordinated cutover

- [ ] Confirm backups, tested shop TLS, gateway requirements, release artifact, content acceptance and rollback ownership.
- [ ] Migrate the existing WordPress URLs to the shop hostname without forking active order data.
- [ ] Verify shop product pages, cart, account access, protected downloads, test-mode payments and receipt configuration.
- [ ] Attach the approved main/www domains to Netlify; change only the verified web DNS records.
- [ ] Verify public access/indexability on the main domain and continuing protection of alternate Netlify preview hosts.
- [ ] Verify forms, shop links, legacy commerce URLs, mail DNS, TLS and rollback behavior; record exact changes and deployment IDs.

## Execution Record

- November 19: HostGator required a fresh login when opening ZoMedia's management page. The login then required support-PIN creation at `/my-account/account-center/secure-your-account`. Owner handoff requested; no PIN was entered by the agent.
- No HostGator configuration, WordPress URL or DNS record has been changed at this checkpoint.
- Prepared an ignored CSV of all 14 current product URLs and their proposed shop-host destinations at `output/launch/2026-11-19/commerce-url-map.csv`. Every destination is explicitly pending shop verification and publisher approval; no Sanity records were changed.
- Independent read-only code review found no launch-blocking defect in preview protection, CMS validation or commerce approval handling. Draft PR #5 contains the reviewed release and migration preparation; no merge or Netlify unlock has occurred. Netlify queued deploy preview #5 automatically after PR creation.
