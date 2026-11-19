# Main Domain and Direct Shop Links Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement the steps in order.

**Goal:** Publish the existing Netlify website at zomediaproductions.com and send book clicks directly to the matching WooCommerce product on shop.zomediaproductions.com.

**Architecture:** Keep the established Astro/Sanity/Netlify editorial site and existing HostGator WooCommerce store. The owner's latest instruction authorizes publishing the current website and connecting product destinations now; payment-account activation remains deferred. Verified shop links are navigation to existing product pages, independent of publisher approval of display prices or ebook rights. Existing approval flags remain unchanged.

**Tech Stack:** Astro, Sanity, Netlify edge functions/domains/TLS, HostGator DNS and WooCommerce.

1. [x] Add a focused strict shop-product URL helper and tests. Use existing printPurchaseUrl fields; do not infer rights, prices or catalog approval.
2. [x] Connect home shelf, books-grid cover/title/purchase link, detail-page fallback purchase action and related-book cards. Keep internal book-detail routes available. Suppress stale forthcoming badges when a verified live shop destination exists.
3. [x] Verify seven print product IDs/URLs, back up original Sanity documents in ignored output, and patch only printPurchaseUrl with revision guards. Preserve all other editorial data and approval flags.
4. [ ] Run tests, build/type checks, internal links and generated outbound-link checks. Review, commit and push the concrete release.
5. [ ] Merge the reviewed release; retarget the existing Sanity hook to main; build and verify main while Netlify remains locked. Attach main/www domains before DNS changes.
6. [ ] Snapshot current authoritative DNS. Set apex A to Netlify's documented standard-network destination and www CNAME to zomedia.netlify.app. Preserve shop A and all mail records. Publish/unlock the verified release and provision TLS.
7. [ ] Verify main/www serve the Astro site without preview auth; alternate Netlify hosts stay gated; every book destination reaches its matching shop product. Verify forms, HTTPS and unchanged mail/shop records. Save screenshots and final deploy/DNS evidence.

Rollback: restore the captured apex/www records and previous published Netlify deploy if the live cutover fails. Do not restore the old WordPress database or remove the shop hostname.
