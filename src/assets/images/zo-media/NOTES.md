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
| `folsom-tower.jpeg` (this folder) | About page hero (already in use); home WHAT WE MAKE → Special Projects tile | Real photograph of Folsom State Prison; editorially appropriate, no portrait implication. Treat with B&W contrast +5–10. |
| `public/assets/images/zo-media/zo-tower.001.jpeg` | Brand mark, hero backgrounds (Contact uses it) | Stylized Zo Media tower icon — brand asset, not a photograph |
| Book covers (`King_frontcover-scaled.jpg`, `domestic-genocide-book-cover-adobe.png`, `mayhem_murder_and_magnificence.jpg`, `socialjusticeautobiographies_cover-scaled.jpg`) | Books page; home WHAT WE MAKE → Literature tile uses `domestic-genocide-book-cover-adobe.png` | Real product imagery, no concerns |
| `zologo.png` | Nav, footer | Logo |
| `film-yard-crew.jpg` | Home WHAT WE MAKE → Film tile | Owner-provided production still: a film crew (cinema camera + boom mic) shooting a group of incarcerated men along a razor-wire prison-yard fence. Real documentary work in-frame — the strongest pick for the Film tile. Duotoned at render. |
| `stage-theatre-neon.jpg` | Home WHAT WE MAKE → Stage tile | Owner-provided: a vertical neon "THEATRE" marquee glowing white on a dark art-deco facade at night. Already near-B&W; duotone is gentle. |
| `literature-reading.jpg` | Home WHAT WE MAKE → Literature tile | **AI-generated, figure shot from behind — no identifiable face, within the allowed AI scope** (see rule of thumb below). B&W of a man reading a book in a spartan cell by hard window light. Already monochrome; duotone is gentle. |
| `support-writing-slats.jpg` | Home WHAT WE MAKE → Support tile | **AI-generated, hands/objects only — no face, within the allowed AI scope** (see rule of thumb below). B&W of weathered hands writing a cursive letter with hard venetian-blind light slats across the page. Already monochrome with deep blacks; duotone is gentle. Ties Support to Zo's letters-from-inside identity. |
| `phuckin-wire-mark.jpg` | Home WHAT WE MAKE → Wire tile (sticker mode, not duotoned); also referenced from `/the-wire/` masthead pattern | The Phuckin' Wire mark on its native cream paper — black ink, barbed-wire ring, wide-eyed face. Rendered without the duotone filter to preserve brand fidelity. |

## Alternate / unused

| File | Why kept | Could swap into |
| --- | --- | --- |
| `public/assets/images/pexels-keenan-constance-545154-5692026.jpg` | Daytime "THEATER" neon on brick. Photographer: Keenan Constance (Pexels). Was the Stage alternate; we chose the Capitol Theatre night shot instead. | Stage tile, if the Capitol shot needs to retire. |
| `public/assets/images/support-on-set.jpg` | Silhouetted film crew member with warm red backlight. Photographer: Wolrider (Pexels). Was the Support tile before the AI letter image landed; demoted because two cinematographer-adjacent photos (Film + Support) in a 6-tile grid created visual doubling. | Support tile, if the letter image needs to retire. Or any future "behind-the-scenes" surface. |

## Rule of thumb (also in [`docs/creative-direction.md`](../../../docs/creative-direction.md))

> Never use AI-generated faces of "incarcerated people" — and especially never of a *named* real one. Hands, objects, environments, atmosphere only. If you don't have a real photograph of a real person and you need one, leave the slot text-led until one exists.
>
> **Exception currently in force**: the home hero and documentaries director-bio use `hero-ivan.jpg` as a temporary placeholder pending the real Ivan video. Do not extend this exception to other surfaces. Replace at first opportunity.

## When to revisit

- Ivan video lands → swap home hero placeholder for the muted-autoplay video, remove or swap the documentaries bio portrait
- Real Ivan portrait shoot → restore the documentaries director-bio image with the real shot
- New stock/commissioned photography → expand the safe-to-use table above
