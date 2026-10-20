# Book Commerce — Low-Cost Launch

Decision: retain existing WooCommerce checkout as a bridge; Astro/Sanity manage editorial pages. Expected book revenue is below $500/month. Existing distribution is KDP/Ingram; no automated direct-POD integration has been proven.

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
