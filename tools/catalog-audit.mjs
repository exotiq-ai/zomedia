import fs from 'node:fs';
import path from 'node:path';

// Read-only public evidence. This never imports or overwrites editorial records.
const site = 'https://zomediaproductions.com';
const project = process.env.PUBLIC_SANITY_PROJECT_ID || 'shuf0j25';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const query = '*[_type == "book" && !(_id in path("drafts.**"))]{title,"slug":slug.current,author,category,description,priceHardcover,priceEbook,isForthcoming,purchaseUrl,printPurchaseUrl,ebookPurchaseUrl,commerceReviewed,ebookRightsCleared}';
const request = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return { data: await response.json(), headers: response.headers };
};
const first = await request(`${site}/wp-json/wc/store/v1/products?per_page=100`);
const products = [...first.data];
for (let page = 2; page <= Number(first.headers.get('X-WP-TotalPages') || 1); page++) {
  products.push(...(await request(`${site}/wp-json/wc/store/v1/products?per_page=100&page=${page}`)).data);
}
const { data: sanity } = await request(`https://${project}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`);
const report = {
  checkedAt: new Date().toISOString(),
  notice: 'Public catalog evidence only; not publisher approval, rights clearance, payment verification or proof of fulfillment.',
  wordpress: products.map((p) => ({
    id: p.id, title: p.name, url: p.permalink,
    price: Number(p.prices.price) / (10 ** p.prices.currency_minor_unit), currency: p.prices.currency_code,
    inStock: p.is_in_stock, purchasable: p.is_purchasable,
    description: p.short_description,
  })),
  sanity: sanity.result,
};
const out = path.resolve('output/launch/catalog-evidence.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
console.log(`Read-only catalog audit: ${products.length} WooCommerce products; ${sanity.result.length} Sanity books.\n${out}`);
