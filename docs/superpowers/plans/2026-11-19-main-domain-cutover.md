# Main Domain and Direct Shop Links Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement the steps in order.

**Goal:** Publish the existing Netlify website at zomediaproductions.com and send book clicks directly to the matching WooCommerce product on shop.zomediaproductions.com.

**Architecture:** Keep the established Astro/Sanity/Netlify editorial site and existing HostGator WooCommerce store. The owner's latest instruction authorizes publishing the current website and connecting product destinations now; payment-account activation remains deferred. Verified shop links are navigation to existing product pages, independent of publisher approval of display prices or ebook rights. Existing approval flags remain unchanged.

**Tech Stack:** Astro, Sanity, Netlify edge functions/domains/TLS, HostGator DNS and WooCommerce.

1. [x] Add a focused strict shop-product URL helper and tests. Use existing printPurchaseUrl fields; do not infer rights, prices or catalog approval.
2. [x] Connect home shelf, books-grid cover/title/purchase link, detail-page fallback purchase action and related-book cards. Keep internal book-detail routes available. Suppress stale forthcoming badges when a verified live shop destination exists.
3. [x] Verify seven print product IDs/URLs, back up original Sanity documents in ignored output, and patch only printPurchaseUrl with revision guards. Preserve all other editorial data and approval flags.
4. [x] Run tests, build/type checks, internal links and generated outbound-link checks. Review, commit and push the concrete release. 34 tests, 26-page build, 1,234 internal references and all seven shop destinations pass.
5. [x] Merge the reviewed release; retarget the existing Sanity hook to main; build and verify main while Netlify remains locked. Attach main/www domains before DNS changes. PR #5 merged as `1b5f9e265c44cc464599b14471acdadf5f37543d`; verified and published production deploy `6aff30b29cd168207fbb20bf`.
6. [x] Provision and verify custom-domain TLS. Certificate issued for apex/www at 17:38 UTC, expires February 17, 2027; strict TLS checks pass. Apex A `75.2.60.5`, www CNAME `zomedia.netlify.app`, both TTL 300; shop A remains `50.87.149.90`. Existing MX/TXT/NS values are unchanged. cPanel required normalizing the existing apex SPF TXT TTL from 14400 to 7200 to match the other apex TXT record; its value was unchanged. FTP/cPanel/webmail CNAMEs now target the shop hostname so they continue resolving to HostGator after the apex move. Snapshots are in ignored `output/launch/2026-11-19/`.
7. [x] Verify main/www serve the Astro site without preview auth; alternate Netlify hosts stay gated; every book destination reaches its matching shop product. Main HTTPS home/books return 200 with all seven destinations, www canonical redirect and legacy commerce 307 preserve paths/queries, HTTP redirects to HTTPS, robots advertises the main sitemap. Primary-domain contact submission `6aff34c8442e2b671b6d5eac` captured successfully. Evidence: `primary-domain-verification.json`, `netlify-certificate.json` and `live-book-destination.jpg` in ignored launch output. Authoritative and Google/Cloudflare DNS resolve the new records; local browser/resolver still caches the prior HostGator IP. Allow up to the previous four-hour TTL for those clients; browser screenshot verifies the shop destination while the new main origin was verified directly with strict TLS.

Rollback: restore the captured apex/www records and previous published Netlify deploy if the live cutover fails. Do not restore the old WordPress database or remove the shop hostname.
