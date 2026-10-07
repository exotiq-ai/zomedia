# Forms backend

Two forms exist on the site, both handled by **Netlify Forms** (works on any Netlify deploy, no server to run):

| Form name | Where | Fields |
| --- | --- | --- |
| `contact` | `/contact/` | name, email, organization, inquiry-type, subject, message |
| `newsletter` | footer (every page), home page, `/the-wire/` | email, source (`footer` / `home` / `wire`) |

## How a submission flows

1. Visitor submits. With JavaScript, `src/scripts/forms.ts` posts it in the background and shows an inline confirmation (`aria-live`). Without JavaScript the browser posts normally and lands on `/thanks/`.
2. Netlify filters spam (honeypot field `bot-field` + Akismet) and stores the submission (**Netlify dashboard → Forms**).
3. Netlify runs `netlify/functions/submission-created.mjs` for every accepted submission. It does two optional things:
   - **contact** → emails the right inbox via [Resend](https://resend.com) (routing by inquiry type) and, optionally, sends the sender an auto-reply.
   - **newsletter** → adds the address to your mailing-list provider (Buttondown, Beehiiv or Mailchimp).

Every integration is optional. With **no** environment variables set, the function logs and does nothing, and you rely on Netlify's built-in notifications (step A below) — the site never breaks because a key is missing.

## Setup (≈15 minutes once you have the accounts)

### A. Minimum: get email for every submission (no code, no DNS)
Netlify → *Site configuration → Forms → Form notifications → Add notification → Email notification*. Add one for `contact` (to the inbox that should answer) and one for `newsletter` if you want to see signups. Then submit a test on the **deployed** site and confirm it arrives.

### B. Nicer: Resend for routed contact email + auto-reply
1. Create a Resend account, **verify `zomediaproductions.com`** (adds SPF/DKIM DNS records — needs DNS access) and create an API key.
2. In Netlify → *Environment variables* set:
   - `RESEND_API_KEY`
   - `CONTACT_FROM` — e.g. `Zo Media <noreply@zomediaproductions.com>` (must be on the verified domain)
   - `CONTACT_TO` — default inbox, e.g. `info@zomediaproductions.com`
   - `CONTACT_ROUTES` (optional JSON) — e.g. `{"press":"press@zomediaproductions.com","film":"films@zomediaproductions.com"}`. Inquiry types: `general`, `film`, `book`, `donation`, `press`, `volunteer`, `other`.
   - `CONTACT_AUTOREPLY=true` (optional)
3. Redeploy. Replies to the email go straight to the visitor (`reply_to` is set).

### C. Mailing list
> **The Phuckin' Wire is on Substack**, which owns the list — signups are captured here and handed to Substack to confirm (see `docs/WIRE-SUBSTACK.md`). The provider options below are only for a *separate* list (e.g. general Zo Media news); leave them unset to use Substack alone.

Pick one provider, then set `NEWSLETTER_PROVIDER` and `NEWSLETTER_API_KEY` plus:

| Provider | `NEWSLETTER_PROVIDER` | Extra variables |
| --- | --- | --- |
| Buttondown | `buttondown` | — |
| Beehiiv | `beehiiv` | `BEEHIIV_PUBLICATION_ID` |
| Mailchimp | `mailchimp` | `MAILCHIMP_LIST_ID` (server prefix is read from the key; double opt-in by default, set `NEWSLETTER_DOUBLE_OPT_IN=false` to disable) |

> The provider calls are covered by unit tests with mocked requests, but have **not** been exercised against live accounts — do a real test signup right after you add the key and check the provider's dashboard.

## Local testing
`npm run dev` simulates a successful submit (nothing is sent). `npm test` runs the unit tests for the function's helpers. To exercise the real function locally use `npx netlify dev`.

## Spam protection
Honeypot on every form + Netlify's Akismet filtering. If spam gets through, add **Cloudflare Turnstile** (free): the widget goes in `SubscribeForm.astro` / `contact.astro` and the token is verified in `submission-created.mjs` — ask and it's a ~1 hour change.
