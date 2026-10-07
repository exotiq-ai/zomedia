# Give Lively donation widget

The site is wired for the Give Lively embeddable widget. Until credentials are added, **nothing third-party loads** and the Support page keeps its "Talk With Us" contact flow.

## What you need from Give Lively
1. A Give Lively nonprofit account for the organization that receives the gifts (UBFSF, the 501(c)(3)).
2. In Give Lively: *Widgets → create a widget* (**Simple** is a good start; **Branded** supports imagery/story). Link it to the right campaign.
3. Copy the embed code Give Lively shows. You only need two values from it:
   - the script URL — the `gl.src='…'` address in the `<script>` snippet → `PUBLIC_GIVELIVELY_SCRIPT_SRC`
   - **Branded only:** the `data-widget-src='…'` address on the `<div>` → `PUBLIC_GIVELIVELY_WIDGET_SRC`, and set `PUBLIC_GIVELIVELY_WIDGET_TYPE=branded`.

(Their docs: https://www.givelively.org/resources/use-embeddable-widgets-to-collect-donations-on-your-website. Note their examples use a `-staging` host — use the production URLs from your own dashboard.)

## Turn it on
Netlify → *Environment variables* → set the values above → redeploy. The **Make a Gift** section appears at the top of `/support/` (`#give`) and a `DonateAction` is added to the page's structured data.

## Rules the widget imposes (already handled)
- One widget per page → it only appears on `/support/`.
- Must be served over HTTPS and **not** inside an iframe → rendered directly into the page.
- Recommended container height 272px → reserved, so the page doesn't jump when it loads.
- Re-initialised after every page transition (the site uses client-side navigation).

## To finish when credentials arrive
- [ ] Add the env vars, redeploy, make a **test donation** in Give Lively's test mode.
- [ ] Confirm the receipt email/branding and that gifts land in the right campaign.
- [ ] Approve the line under the widget on `/support/` ("Gifts support the UBFSF, a 501(c)(3) organization…") and the Privacy/Terms wording about donations.
- [ ] If a Content-Security-Policy is ever added, allow Give Lively's script/frame domains.
