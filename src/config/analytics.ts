/**
 * Analytics + search-engine verification — all driven by environment variables, so nothing
 * loads (and no cookies are set) until you opt in. See docs/SEO.md.
 *
 *   PUBLIC_PLAUSIBLE_DOMAIN           cookie-free analytics (Plausible/Fathom-style); no consent banner needed
 *   PUBLIC_GA4_ID                     Google Analytics 4 measurement ID ("G-XXXXXXX"); required for Google Ad Grants
 *                                     conversion tracking. Sets cookies → update the Privacy Policy (it adapts automatically).
 *   PUBLIC_GOOGLE_SITE_VERIFICATION   content value for Search Console's meta-tag verification
 *   PUBLIC_BING_SITE_VERIFICATION     content value for Bing Webmaster's meta-tag verification
 */
const env = import.meta.env as Record<string, string | undefined>;
const clean = (v?: string) => v?.trim() || undefined;

export const ANALYTICS = {
  plausibleDomain: clean(env.PUBLIC_PLAUSIBLE_DOMAIN),
  ga4Id: clean(env.PUBLIC_GA4_ID),
  googleVerification: clean(env.PUBLIC_GOOGLE_SITE_VERIFICATION),
  bingVerification: clean(env.PUBLIC_BING_SITE_VERIFICATION),
} as const;

export const usesGoogleAnalytics = Boolean(ANALYTICS.ga4Id);
export const usesAnalytics = usesGoogleAnalytics || Boolean(ANALYTICS.plausibleDomain);
