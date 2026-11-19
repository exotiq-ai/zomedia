# Book Commerce — Low-Cost Launch

Decision: retain existing WooCommerce checkout as a bridge; Astro/Sanity manage editorial pages. Expected book revenue is below $500/month. Existing distribution is KDP/Ingram; no automated direct-POD integration has been proven.

## Approved Hosting Split — November 19, 2026

The owner approved keeping the existing WordPress/WooCommerce installation for book payments and moving the editorial website to the main domain:

- `https://zomediaproductions.com`: Astro on Netlify; `www` redirects to the canonical main domain.
- `https://shop.zomediaproductions.com`: existing WordPress/WooCommerce on HostGator, retaining products, orders, accounts and protected downloads.
- Reviewed purchase links on the new website will point to the corresponding WooCommerce products on the shop hostname. Do not point visitors at the new hostname until it works.
- HostGator remains required for the shop after the editorial launch. Its hosting cannot be retired under this architecture.

Read-only checks on November 19 found no DNS record for the shop hostname. Netlify site `zomedia` has no custom domain attached and its published preview remains locked. No DNS, WordPress URL, checkout or customer data was changed.

Execution order:

1. Obtain HostGator/DNS and WordPress administrator access; identify payment gateways and their domain-specific requirements.
2. Back up WordPress files/database and verify recovery. Capture the existing DNS zone, including mail records.
3. Configure the shop virtual host/subdomain, DNS and valid TLS. Move the existing WordPress site's URL and stored internal references using a serialization-aware migration; preserve order/download records.
4. Verify product pages, cart, checkout, account login, existing download links, receipts and gateway callbacks. Use gateway test mode for transactions; any real financial action requires the owner.
5. Reconcile and approve each title's sales destination, then update Sanity purchase URLs to the tested shop URLs.
6. Prepare and test legacy commerce redirects on Netlify, including product/cart/checkout/account paths, payment callbacks and query-string download URLs. Browser redirects alone do not establish that gateway POST callbacks work.
7. Attach the main domain to the approved Netlify release and switch only the required web DNS records after shop verification. Preserve mail records and a rollback route.

The prior WordPress-retirement runbooks are historical proposals; their HostGator cancellation steps do not apply while WooCommerce remains hosted there.

## Options Evaluated
| Option | Cost structure | Decision |
|---|---|---|
| Existing WooCommerce | Free core; existing hosting, maintenance, payment processing and fulfillment remain | Selected: preserve orders and secure eBook delivery without a new storefront subscription |
| Payhip | $0/month + 5% platform fee plus processing; unlimited products | Strong future digital alternative, not a verified automatic book-POD workflow |
| Big Cartel | Free tier has five products | Too small for seven titles and format variants |
| Stripe links | Processing fees; digital fulfillment would need separate implementation | Not a complete replacement for protected ebook delivery/order operations |
| Shopify / Lulu | Subscription/processing plus printing/shipping; confirm plan/app eligibility | Reconsider only after actual margins and operational savings justify migration |

Sources checked October 19, 2026: https://woocommerce.com/pricing/ · https://payhip.com/pricing · https://www.bigcartel.com/product/pricing · https://www.lulu.com/sell/sell-on-your-site · https://support.stripe.com/questions/fee-discount-for-nonprofit-organizations

## Editorial/Transaction Contract
- Sanity: approved author/title/description, cover/alt, category, optional `printPurchaseUrl`, `ebookPurchaseUrl`, `commerceReviewed`, `ebookRightsCleared` and display prices.
- `purchaseUrl` is a hidden legacy print fallback; existing documents remain readable without a bulk migration.
- WooCommerce: payable price, payment, tax/shipping, protected ebook downloads, customer/order history, receipts, refunds and fulfillment status. Do not move any of this to Sanity.
- Buy Print / Buy eBook render independently after review; no ebook button without rights clearance. Forthcoming records remain inquiry-only until actual preorder behavior is implemented/tested.
- Display prices must be reconciled against checkout. No automatic stock or preorder claims are inferred from a URL.
- Book purchases and charitable gifts remain separate. Do not promise deductibility for ordinary book purchases or assume donation-only processing discounts apply to retail sales.

## POD and Margin Worksheet
For each title collect: ISBN/edition, trim size, page count, binding, interior color, cover/interior print-ready files, retail price, print cost, shipping by destination, processing/platform fees, taxes, replacement/refund allowance and creator/cooperative allocation. Contribution = collected book revenue minus printing, merchant-paid shipping, fees and reserves; never count pass-through tax as income.

Verify whether existing KDP/Ingram retail links meet the immediate need. Their existence does not establish a WooCommerce dropship API. For fully automated direct POD, price a native Lulu/WooCommerce integration and require a proof order, failed-payment test, duplicate-webhook test, shipping notification, refund procedure and funding method for printing costs before activation. No custom fulfillment integration in this release.

## Migration Gates
Before moving a single order flow: export products/orders/download entitlements, document taxes/payment gateways and renewal costs, verify ebook rights and delivery security, test old customer downloads, retain a rollback copy and obtain accounting/legal approval of seller identity and receipt wording. Keep the current store URL until its replacement hostname is tested.
