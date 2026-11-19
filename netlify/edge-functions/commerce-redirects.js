const PRIMARY_HOSTS = new Set(['zomediaproductions.com', 'www.zomediaproductions.com']);
const WORDPRESS_QUERY_KEYS = ['download_file', 'wc-api', 'wc-ajax', 'add-to-cart', 'p', 'page_id', 'rest_route'];

// Compatibility for old links after the editorial domain moves to Netlify.
// Payment providers must still register and verify their new shop callback URLs.
export default function commerceRedirects(request, context) {
  const url = new URL(request.url);
  if (!PRIMARY_HOSTS.has(url.hostname)) return context.next();

  let pathname = url.pathname;
  if (/^\/cart(?:\/|$)/.test(pathname)) {
    pathname = pathname.replace(/^\/cart(?=\/|$)/, '/cart-2');
  } else if (/^\/checkout(?:\/|$)/.test(pathname)) {
    pathname = pathname.replace(/^\/checkout(?=\/|$)/, '/checkout-2');
  } else if (/^\/shop\/?$/.test(pathname)) {
    pathname = '/store/';
  } else if (!/^\/(?:product|product-category|product-tag|store|cart-2|checkout-2|my-account|wp-content|wp-includes|wp-admin|wp-json)(?:\/|$)/.test(pathname)
    && pathname !== '/wp-login.php'
    && !(pathname === '/' && WORDPRESS_QUERY_KEYS.some((key) => url.searchParams.has(key)))) {
    return context.next();
  }

  if (/^\/(?:cart-2|checkout-2|my-account|store)$/.test(pathname)) pathname += '/';
  const destination = new URL('https://shop.zomediaproductions.com');
  destination.pathname = pathname;
  destination.search = url.search;
  return new Response(null, {
    status: 307,
    headers: {
      Location: destination.href,
      'Cache-Control': 'private, no-store, max-age=0',
      'Referrer-Policy': 'no-referrer',
    },
  });
}
