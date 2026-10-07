/**
 * Give Lively donation widget — configuration.
 *
 * Nothing is hard-coded: copy the values from the embed code Give Lively shows in
 * the widget's dashboard into Netlify environment variables (or a local `.env`).
 * See .env.example and docs/GIVE-LIVELY.md. With these unset the site keeps its
 * "Talk With Us" contact flow and no third-party script is loaded.
 *
 *   PUBLIC_GIVELIVELY_SCRIPT_SRC  the `gl.src='…'` URL from the embed <script>
 *   PUBLIC_GIVELIVELY_WIDGET_SRC  (branded widget only) the `data-widget-src` URL on the <div>
 *   PUBLIC_GIVELIVELY_WIDGET_TYPE 'simple' (default) | 'branded'
 */
const env = import.meta.env as Record<string, string | undefined>;

const type = env.PUBLIC_GIVELIVELY_WIDGET_TYPE === 'branded' ? 'branded' : 'simple';
const scriptSrc = env.PUBLIC_GIVELIVELY_SCRIPT_SRC?.trim() || undefined;
const widgetSrc = env.PUBLIC_GIVELIVELY_WIDGET_SRC?.trim() || undefined;

export const GIVELIVELY = {
  type,
  scriptSrc,
  widgetSrc,
  /** True only when the credentials needed to render the chosen widget type are present. */
  enabled: type === 'branded' ? Boolean(widgetSrc) : Boolean(scriptSrc),
} as const;
