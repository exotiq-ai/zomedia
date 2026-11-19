# Launch Readiness — October 19, 2026

## Current Execution Checkpoint — November 19, 2026

The owner approved retaining WordPress/WooCommerce on HostGator at `shop.zomediaproductions.com` and preparing the main domain for Astro/Netlify. See `docs/BOOK-COMMERCE.md` and `docs/superpowers/plans/2026-11-19-shop-subdomain-launch.md` for the approved architecture and execution sequence. HostGator retirement is no longer part of the launch plan.

- Fresh verification including shop routing and preview logout: `npm test` passed 32 tests; `npm run validate` built 26 pages with zero type-check errors/warnings and one existing hint. All 1,290 internal references resolve. Public catalog evidence refreshed from the shop: 14 WooCommerce products, seven Sanity books.
- Fresh resource checks: all 1,290 internal references resolve; Sanity Studio typecheck passes. A local CSV lists all 14 proposed shop product destinations, each awaiting verification and publisher approval.
- Shop migration completed: `https://shop.zomediaproductions.com` points to the existing WordPress installation with valid TLS. All 14 product IDs and commerce/user counts are unchanged. Main web DNS remains `50.87.149.90`; Google MX and other existing main-domain DNS records are unchanged. The old WordPress homepage now redirects to the shop pending editorial cutover.
- Netlify site `zomedia` remains locked at the protected preview deploy listed below, with no custom domain attached. GitHub `main` remains at `fa13d6078fce453df74b0a01383b5ed2cf73c235`; the reviewed launch-readiness branch is now pushed and available as draft PR https://github.com/exotiq-ai/zomedia/pull/5. No merge or unlock has occurred.
- Contact/newsletter capture, native HTML contact endpoint, browser validation/inline success/reset and newsletter handoff passed. The owner confirmed receiving the notification at `gregory@ubfsf.org`. No personal Resend account is required; Substack confirmation was not completed. See `docs/FORMS.md`.
- Sanity email sign-in, updated Studio/schema deployment and credentialed Studio CORS are verified. A temporary noneditorial draft was published through the Actions API, rebuilt successfully via the existing webhook, then deleted and rebuilt again. Original content revisions and webhook filter were preserved. Netlify's hook targets protected `feat/launch-readiness` until the release is merged; the published deploy stays locked. See `docs/SANITY.md`. Payments are deferred at the owner's request.
- The deliberate incomplete-record build failed without changing the published deploy; deletion recovered successfully on the same commit. A browser test also exposed and fixed an Astro-intercepted preview logout POST: native transport and explicit URL encoding now clear the session. Chrome verified clean logout and blocked subsequent contact access; the regression test and focused review pass.
- Owner completed HostGator login/PIN setup. Private database/files backups, integrity checks, serialization-aware URL migration and shop-scoped HTTPS enforcement are complete. See `docs/BOOK-COMMERCE.md` for evidence and remaining merchant requirements.
- WooPayments shows “Test account”; PayPal shows “Action needed.” Prior live payment operation could not be established. Organization-owned activation, callbacks, payment/receipt/refund/download verification remain pending; no financial settings were changed.

## Implemented
- Preview-only server-side password gate, host-bound signed eight-hour session, logout, same-origin login, platform rate limiting (five attempts/minute/IP/domain), non-cacheable responses and noindex. The actual password and signing key are Netlify environment variables, not public bundles.
- All alternate Netlify hosts are protected; `zomediaproductions.com` and `www.zomediaproductions.com` are exempt. WordPress now uses the shop hostname; the main domain has not moved to Netlify.
- Standalone coming-soon page uses the existing typewriter poster, white logo and editorial typography. It deliberately has no analytics, signup backend dependency, or private media requirements.
- 74 untracked duplicate files preserved under `_legacy/launch-readiness-2026-10-19/duplicates/`, with SHA-256/comparison manifest. 65 were byte-identical; the nine differing copies were also preserved, including older newsletter behavior. No tracked content was discarded. Source/output route guards reject accidental numbered duplicates.
- Separate print/eBook purchase fields, catalog approval and eBook-rights approval. Unreviewed prices/buttons/offers are withheld. Legacy purchase URLs remain available as reviewed print destinations.
- CMS build rejects empty collections, invalid/duplicate slugs, unpublished records and book covers missing alternative text. Impact numbers require explicit approval; failed CMS requests stop publishing rather than silently replacing claims.

## Catalog Reconciliation — Blocking
Public WordPress values are evidence, not final publisher approval. Run `node tools/catalog-audit.mjs` to refresh `output/launch/catalog-evidence.json`. No Sanity documents or WooCommerce products were automatically rewritten.

| Title | WordPress print / eBook | Sanity print / eBook | Issue |
|---|---|---|---|
| Domestic Genocide | $14.95 / $4.99 | $14.95 / $4.99 | Verify edition, author, rights and destination |
| King: The Early Years | $14.95 / $4.99 | $12.95 / $3.99 | Price mismatch; verify author and description |
| Mayhem, Murder & Magnificence | $14.99 / $4.99 | $16.95 / $5.99 | Prices and genre/description differ |
| My Comrades' Thoughts | $14.99 / $4.99 | $13.95 / $4.99 | Full title, attribution and price differ |
| Kill the Bastard | $9.95 / $4.99 | $14.95 / $4.99 | WordPress synopsis describes science fiction; Sanity says forthcoming memoir. Major content error requiring publisher review |
| Social Justice Autobiographies | $12.99 / $4.99 | $15.95 / $5.99 | Prices and attribution need review |
| No Rhyme or Reason | $12.99 / $4.99 | $11.95 / $3.99 | Already purchasable on WordPress; Sanity marks forthcoming |

For every title, obtain the approved ISBN/edition, author/editor, genre, description, print binding, final prices, availability, retail destinations and direct digital rights. Confirm KDP Select/exclusivity before enabling direct eBooks. Approve in Studio only after that review. Never treat the number of print/eBook SKUs as number of unique published books.

## Live Services — Verified vs Pending
- Netlify site `zomedia` has contact/newsletter forms and a build hook named “Sanity + Wire refresh”. Before this change, only the Sanity project/dataset variables were configured; no Resend, donation, analytics or scheduled-rebuild variable was present.
- Sanity public reads work: seven books, 24 people, four projects and one settings record. Local builds read this dataset successfully.
- Sanity administrator access, deployed schema, credentialed Studio CORS and publish/delete webhook delivery are verified. Halima's editor invitation acceptance remains unverified; the successful administrator test does not prove her login or role.
- Never publish a test edit/delete to a real book to test automation. Use a temporary noncritical record in a staging dataset, or an explicitly approved reversible test; capture publish timestamp, webhook response and Netlify deploy ID, then restore/delete it and verify the next rebuild.
- Keep the scheduled rebuild disabled until the build hook targets a branch containing the gate. An older main build would otherwise republish the ungated site.
- Confirm donation recipient, Give Lively embed values, real receipt and refund. No payments, purchases, donations or customer emails were generated in this implementation.
- Contact delivery has owner-confirmed inbox receipt. Substack confirmation remains separate; website capture and the tested handoff link are not proof of a completed Substack subscription.

## Preview Verification Evidence
- Current PR alias: https://deploy-preview-5--zomedia.netlify.app/ (protected; main-domain cutover pending).
- Live tests passed for wrong/correct password, secure cookie round-trip, logout, tampered cookie, unauthenticated deep links/assets/feeds, noindex and anonymous access after an authenticated cache-warming request.
- Native rate-limit configuration was accepted in Netlify's deploy function metadata. The dedicated `/preview/login` route returned HTTP 429 during a sustained live probe; the platform can allow a short burst before enforcement catches up.
- The raw `/.netlify/functions/preview-login` URL is not publicly allowlisted, avoiding a second unthrottled login entrance.
- 23 unit tests pass; Studio typecheck passes. A real local build pointed at a deliberately failing mock Sanity API exited with failure as expected; this does not substitute for a Netlify last-good-deploy recovery test.
- All seven books and 24 people loaded successfully from the live public Sanity dataset during the normal build. Administrative CMS writes were not attempted.
- Numbered generated artifacts reappeared under local `dist/` after validation. The final release is built/checked in a clean temporary directory; do not upload this checkout's `dist/` without rerunning the route and resource guards immediately beforehand. No cause is assumed for the extra copies.
- The clean release contains 26 HTML documents and all 1,291 checked internal links/resource references resolve. The 404 page now declares noindex and its canonical URL matches `/404.html`.
- Mobile Lighthouse lab checks: coming soon 98 performance / 100 accessibility / 100 best practices (SEO intentionally reduced by noindex); books 93 performance / 100 accessibility / 100 best practices / 100 SEO. These are local simulated-mobile measurements, not a production Core Web Vitals guarantee.
- Coming-soon page, including its expanded password form, passed layout, image and axe accessibility checks at 360, 390, 820, 1024, 1440 and 1920px with reduced motion enabled.
- All 26 built HTML pages passed the six-width responsive audit (156 page/viewport checks); all 26 passed phone/desktop axe scans (52 checks, no violations). After enlarging the last book back-link target, all seven book pages were rechecked at all six widths (42 checks, no undersized targets). Chromium was tested; these results do not replace real-device Safari/Android sign-off.
- The final artifact was checked for unapproved rendered prices and impact numbers; none appeared. No preview password/signing-key assignments were found in shipped assets.

## Netlify Preview Publication Hold
The protected build is published at https://zomedia.netlify.app/ and pinned using Netlify's deploy lock. WordPress runs at the shop hostname; main DNS still points to HostGator. Current pinned preview deploy: `6ad6cb43cb312f6ef8314d02`; pre-change published preview: `6ac6745c2e6b0b0008c5d22f`. The coming-soon page no longer links to the old site; Read The Wire and Preview Access remain available.

The lock intentionally prevents automatic main-branch builds from replacing this preview while the feature branch awaits review. After merging the gate changes, verify the new main artifact is protected, then unlock/re-publish that build. Do not simply unlock before the source branch contains the gate. The scheduled rebuild remains unconfigured until that step is complete.

Existing historical Netlify deploy URLs contain their original artifacts and are not retroactively modified by a new deploy. Review retention and retire old publicly accessible previews before treating the project as private. No historical deploys were deleted in this task.

## Release Checklist
- [ ] Organization approves catalog records, impact figures, biographies, permissions and legal copy.
- [ ] Authorized Sanity administrator deploys the new Studio schema and verifies editor permissions/CORS.
- [x] Publish → webhook → protected correct-branch deploy proven, including deletion and failed-build recovery. Retarget the hook to `main` only after the approved release is merged there.
- [ ] WooCommerce ebook delivery, failed payment, refund and receipt tested with approved test credentials.
- [ ] Print retailer destination verified per edition; proof order required before enabling direct POD.
- [ ] Donation and contact delivery tests completed.
- [ ] Preview gate tested on deployment aliases, deep links, expired/tampered sessions and cache isolation.
- [ ] Updated responsive, accessibility, performance and link results recorded; real-device Safari/Android check.
- [ ] Feature branch reviewed and merged before allowing unattended main-branch rebuilds.

## Main-Domain Cutover — Pending Release Gates
The owner authorized the hosting split and launch preparation. Keep the shop operating while the Astro preview is protected. Before main-domain DNS changes: finish content/CMS approvals and merchant tests, verify recovery in an isolated environment, approve the release artifact and assign rollback ownership. Shop TLS, backups, URL migration and legacy route implementation are complete; live payment callbacks/email/downloads remain unproven. Preserve mail DNS. Retain HostGator while WooCommerce operates there, including the rollback window.

Sanity is a public content dataset; the preview gate does not make its published content confidential. Do not upload private ebook masters or credentials to Sanity or `public/`.
