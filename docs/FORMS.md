# Forms backend

## Private contact documents — November 24, 2026

The optional contact document field accepts one PDF, DOCX, PPTX, TXT or FDX file up to 4 MB. The browser uploads it to the write-only `contact-upload` function, which validates origin, format, size and honeypot; Netlify rate-limits it to five requests per IP per minute. Files are stored in Netlify Blobs, not in public Sanity assets or Netlify Forms attachments. There is deliberately no public file download/list route. Only the filename and reference are included in the ordinary form notification to `gregory@ubfsf.org`.

Team retrieval: sign in to Netlify, open the ZoMedia project → Blobs → `contact-documents` (or `contact-documents-preview` for preview-context tests), locate the exact key from the notification, and download the object. Access depends on the team's Netlify permissions; the website preview password does not grant file access. Do not forward downloaded submissions beyond the intended reviewers. The file control stays disabled without JavaScript so native contact submissions cannot accidentally upload files to Netlify Forms. Without JavaScript, send the inquiry and arrange a private upload with the team.

If the message submission fails after a file upload, retrying the same document reuses its reference. An abandoned upload can remain in the private store; periodically review and remove unneeded files through Netlify. No automatic retention deadline is claimed. This is document storage, not malware scanning or an editorial-rights agreement.

## Live verification — November 19, 2026

- Follow-up tests on the protected PR preview: contact submission `6aff27f88e62de83f52e7fe2` and newsletter submission `6aff27f8fbf0cf98e2a357e5` both returned HTTP 200 and were read back from Netlify. Contact subject: `ZoMedia form verification 2026-11-19T16:46:47.963Z`. The newsletter retains `source=wire`; no Substack subscription was completed.
- Native HTML form endpoint `/thanks/?form=contact` returned HTTP 200 with thank-you HTML and stored submission `6aff2847ffc4e33bb8e001ee`. A later Chrome test verified empty required-field rejection, inline contact success and form reset (submission `6aff2ddcb2584357b644b5dc`), and footer newsletter success with the email-prefilled Substack confirmation link (submission `6aff2de22c15bc7f20a376bd`). The confirmation link was not followed; no Substack subscription was completed. Screenshots are in ignored `output/launch/2026-11-19/`.
- The built-in email notification remains configured for `gregory@ubfsf.org`. The owner confirmed receiving the fresh “ZoMedia form verification” notification on November 19. Live capture and inbox delivery are verified without a personal Resend account. Evidence is in ignored `output/launch/2026-11-19/forms-followup.json`.
- Authenticated to the existing protected Netlify preview and submitted clearly labeled launch tests through its real form POST endpoint. Both requests returned HTTP 200.
- Verified the contact submission directly in its Netlify form: `6aff0ba465cd8e8fcdd0a922`.
- Verified the newsletter submission directly in its Netlify form: `6aff0ba4427a0e534885e1bd`.
- Used the published organizational contact address as test data. No Substack confirmation was submitted and no subscription was completed.
- At the initial check, Netlify's configured environment contained the Sanity project/dataset and preview credentials; no Resend or newsletter-provider credentials were configured. The initial outgoing-hook list contained deployment hooks only; the notification added below now supplies email delivery.
- Initial result: live form capture was verified before recipient setup. The follow-up above now verifies recipient configuration and owner-confirmed inbox delivery.
- Follow-up: the owner selected `gregory@ubfsf.org`. Created and read back an enabled Netlify email notification for all form submissions (hook `6aff0eba6ccb0c6117c61953`). Submitted a contact test with subject `ZoMedia notification delivery test — 2026-11-19T14:59:08.784Z` and verified stored submission `6aff0ebd173196c3836d269e`. The later test above supplied owner-confirmed inbox receipt.
- Recommended launch setup: Netlify Forms storage plus Netlify's built-in email notifications. This does not require the owner's personal Resend account. A Sanity submissions inbox would require a separate integration and private storage; email notifications would still need a delivery service. Never store private inquiries in the existing public content dataset.

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
