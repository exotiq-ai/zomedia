# Image asset audit notes

> Audit conducted during the photo/video next-level pass. Treat this file as the asset rulebook — read before adding/swapping images from `public/assets/images/zo-media/`.

## ⚠️ AI-generated assets currently in use as deliberate placeholders

Per project owner direction, these are kept in place **until the real Ivan video lands on a host** (Cloudflare Stream / YouTube unlisted / Vimeo). At that point, swap them out.

| File | Where used | Replace with |
| --- | --- | --- |
| `hero-ivan.jpg` (this folder) | Home hero `data-ivan-slot`; documentaries director-bio portrait | The hosted Ivan video, autoplay-muted-loop on home; real Ivan portrait on documentaries (or remove portrait) |
| `public/assets/images/zo-media/hero-tall.jpg` | Not in active use | n/a — don't reintroduce |

**The visual tells are AI-generated** (theatrical single-source lighting, implausibly clean walls, perfect single-point perspective, posed subject, identical-seed framing between the two). They are in use temporarily to fill the slot and indicate intended composition; they are not intended to ship long-term as portraits of a named real person.

**Why this is acknowledged in writing**: misrepresenting a real incarcerated person with a synthetic portrait is a brand and reputational risk if discovered. The temporary tradeoff is conscious. The Ivan video replaces them.

## ⚠️ Do not use (unusable, not a temporary placeholder)

| File | Why |
| --- | --- |
| `public/assets/images/zo-media/storefront.jpg` | Old WP layered cutout with stale third-party (Prison Arts Council) branding visible. Off-brand and tonally wrong. |

## ✅ Safe to use

| File | Best slot | Notes |
| --- | --- | --- |
| `folsom-tower.jpeg` (this folder) | About page hero (already in use); atmospheric breaks | Real photograph of Folsom State Prison; editorially appropriate, no portrait implication. Treat with B&W contrast +5–10. |
| `public/assets/images/zo-media/zo-tower.001.jpeg` | Brand mark, hero backgrounds (Contact uses it) | Stylized Zo Media tower icon — brand asset, not a photograph |
| Book covers (`King_frontcover-scaled.jpg`, `domestic-genocide-book-cover-adobe.png`, `mayhem_murder_and_magnificence.jpg`, `socialjusticeautobiographies_cover-scaled.jpg`) | Books page, featured-books grid | Real product imagery, no concerns |
| `zologo.png` | Nav, footer | Logo |

## Rule of thumb (also in [`docs/creative-direction.md`](../../../docs/creative-direction.md))

> Never use AI-generated faces of "incarcerated people" — and especially never of a *named* real one. Hands, objects, environments, atmosphere only. If you don't have a real photograph of a real person and you need one, leave the slot text-led until one exists.
>
> **Exception currently in force**: the home hero and documentaries director-bio use `hero-ivan.jpg` as a temporary placeholder pending the real Ivan video. Do not extend this exception to other surfaces. Replace at first opportunity.

## When to revisit

- Ivan video lands → swap home hero placeholder for the muted-autoplay video, remove or swap the documentaries bio portrait
- Real Ivan portrait shoot → restore the documentaries director-bio image with the real shot
- New stock/commissioned photography → expand the safe-to-use table above
