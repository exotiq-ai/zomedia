export const COOKIE_NAME = '__Host-zo-preview';
export const SESSION_SECONDS = 8 * 60 * 60;
export const previewHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Netlify-CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

export function envValue(key) {
  return globalThis.Netlify?.env?.get(key) ?? (typeof process !== 'undefined' ? process.env[key] : undefined);
}

// Every alternate host is gated; only the intended public domain is exempt.
export function isPreviewHost(hostname, launchHold = envValue('PUBLIC_LAUNCH_HOLD')) {
  return launchHold === 'true' || !['zomediaproductions.com', 'www.zomediaproductions.com'].includes(hostname.toLowerCase());
}

export function safeReturnTo(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/';
  try {
    const decoded = decodeURIComponent(value);
    if (/[\\\s\x00-\x1f]/.test(decoded) || decoded.startsWith('//') || decoded.includes('%')) return '/';
    const url = new URL(value, 'https://preview.invalid');
    if (url.origin !== 'https://preview.invalid' || /^\/(?:\.netlify|coming-soon|preview)(?:\/|$)/.test(url.pathname)) return '/';
    return url.pathname + url.search;
  } catch { return '/'; }
}

const encoder = new TextEncoder();
const base64 = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function signature(value, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}
export async function equalSecret(a, b) {
  const hashes = await Promise.all([a, b].map((s) => crypto.subtle.digest('SHA-256', encoder.encode(s))));
  const left = new Uint8Array(hashes[0]);
  const right = new Uint8Array(hashes[1]);
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}
export async function createSession(secret, hostname, now = Math.floor(Date.now() / 1000)) {
  const expires = now + SESSION_SECONDS;
  return `${expires}.${await signature(`${hostname}:${expires}`, secret)}`;
}
export async function verifySession(token, secret, hostname, now = Math.floor(Date.now() / 1000)) {
  if (!secret || !token || !/^\d+\.[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const [expires, mac] = token.split('.');
  if (Number(expires) <= now || Number(expires) > now + SESSION_SECONDS) return false;
  return equalSecret(mac, await signature(`${hostname}:${expires}`, secret));
}
export function sessionCookie(token, maxAge = SESSION_SECONDS) {
  return `${COOKIE_NAME}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}
