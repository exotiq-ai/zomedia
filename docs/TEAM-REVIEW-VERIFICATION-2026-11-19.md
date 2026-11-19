# ZoMedia team review verification — November 19, 2026

**Result: ready for internal team review.** The public domain now displays the previously built coming-soon page. Reviewers use **Preview access** with the existing password to open the full website. Logout returns to coming soon. The owner will announce the review; no team message was sent by this work.

## Live checks

| Area | Result |
| --- | --- |
| Seven homepage book journeys | Clicked every card in the browser; each reached its exact corresponding WooCommerce product. No purchase was made. |
| Book filters | Memoir 3, essays 1, poetry 1, anthology 2, fiction 0, all 7; pressed-state and visible results verified. |
| Contact | Empty required field blocked submission. Valid submission showed success, reset fields and appeared in Netlify. Repeated successfully while signed in after the hold was enabled. |
| Newsletter | Footer, Wire and homepage forms showed the Substack handoff and appeared in Netlify with their respective source values. Confirmation links prefill the test email. No Substack subscription was completed. |
| Navigation | Menu opening, navigation, closing on selection and Escape checked; contextual film contact link preselected Film Collaboration. Internal link/resource crawl had no broken responses. |
| Media and shelf | Documentary play control loaded and played Cell Power on YouTube. Homepage background video reached ready state 4 and played. Shelf next/previous arrows changed its scroll position. |
| Rendered pages | 25 full-site pages, including thank-you and 404 documents, had one h1, no horizontal overflow and no failed loaded images at effective CSS width 836. Public coming soon was separately browser-verified. Lazy images outside the viewport are not implied to have downloaded. |
| Responsive samples | Home, books and contact checked at effective CSS widths 354 and 1309 in addition to the intermediate sweep. No overflow or failed loaded images; phone menu Escape closes it. These are browser checks, not physical-device certification. |
| Public landing | Plain main URL leads to coming soon. Preview disclosure/login, return to full site, logout, and Read The Wire destination verified in the browser. |
| Gate and old cached origin | Anonymous home/deep links/feeds blocked, valid login allowed, tampered cookie rejected, www canonicalized, legacy commerce redirects preserved and logout cookie cleared on both Netlify and the temporary HostGator bridge. |

## Release verification

- 36 unit tests passed. Clean dependency install, typecheck and build passed; 26 pages generated. The first local build using a node_modules symlink hit an Astro compile-metadata path error; a clean install resolved it without changing product code.
- 25-page HTTP crawl checked 69 unique same-origin linked resources with no broken responses. This is distinct from the rendered browser sweep and does not claim that every external service was exhaustively tested.
- HostGator PHP syntax check and 17 guard checks passed. Focused independent review found a cached-www login issue; canonicalization plus regression tests resolved it, and follow-up review found no blocker.
- Coming-soon deployment: `6aff431a24073abdf5e51ef2`, source `802f8abd3248e25ba1a4d958a9db52aa7b5629ed`. `PUBLIC_LAUNCH_HOLD=true` enables the existing gate on the primary domain; setting it false and rebuilding is the eventual approved public-launch operation.
- The temporary bridge forwards only the dedicated signed preview cookie, exact same-origin Origin and matching Set-Cookie. WordPress authentication remains on the shop. Keep the prior private backup and transition-removal instructions.

## Review boundaries

This is an internal content/functional review, not approval for live sales. WooPayments activation, PayPal setup, real payment/refund/receipt/download verification and donation processing remain pending. Catalog copy, edition/price discrepancies, rights and organizational claims still need publisher review. No live financial action was performed. Fresh inbox receipt for these exact submissions was not independently read; Netlify capture passed and the owner confirmed notification receipt earlier today.

The prior responsive/accessibility audits remain historical evidence. This session did not repeat a complete accessibility scanner or every physical browser/device combination, and does not claim every possible interaction/state is defect-free.

## Evidence

Ignored `output/launch/2026-11-19/` contains `seven-book-browser-tests.json`, `live-site-crawl.json`, `rendered-page-review.json`, `review-responsive-checks.json`, `review-hold-verification.json`, `review-unit-tests.txt`, `review-build.txt`, contact/newsletter/video screenshots, and `coming-soon-public-final.jpg`. No preview password or service token is included in this report.
