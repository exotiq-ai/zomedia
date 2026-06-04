# Zo Media Productions — Creative Direction

> Reference document for photography sourcing, AI image generation, and visual direction across **zomediaproductions.com**. Walk Halima, the boss, and anyone else briefing creative through this **before any image work begins**. When in doubt, default to "no."

---

## 1. Brand DNA (do not deviate)

The site is **Dark Editorial Press** — voice-first, type-led, editorially serious. Three load-bearing identity elements that constrain every image decision:

- **Typography**: Instrument Serif italic for display, Satoshi for body, Space Mono for eyebrows and meta. Big serif headlines do the talking.
- **Palette**: near-black background (`--color-void` `#0A0A0B`), signal red (`--color-signal` `#D64045`), wire gold (`--color-wire` `#C8A84E`), bone off-white text (`--color-bone` `#E8E2D9`).
- **Tone**: typesetter's proof page, letterpress stamp, ink-bleed shadow. Editorial press serving incarcerated authorial voice.

**Core principle**: photography *supports* the voice — it never replaces it. The incarcerated person on this site is **author**, not **subject**. Imagery must carry that posture or stay off the page.

---

## 2. The "No" List (post on the wall)

| # | Forbidden | Why |
| --- | --- | --- |
| 1 | **AI-generated faces of "incarcerated people"** | Deceptive. Reputational + 501(c)(3) liability. Reinforces the AI's stereotype model (heavily-tattooed shirtless men in razor-wire yards) — the exact image the org's writing pushes against. |
| 2 | **GTL / GettingOut / video-visit screenshots** | Surveillance aesthetic, ~480p phone captures, possible non-consenting third parties in frame. |
| 3 | **Stock photos with legible foreign branding** | Anything with another production's title, logo, or readable script (the French "WEREAL PRODUCTION" example). Announces "we are stock." |
| 4 | **Cartoon / clip-art / doodle illustrations** | Wrong brand by miles. Etsy energy on a press site. |
| 5 | **Stolen-valor portraits** | Real photos of real people (different demographic, different country, different context) misrepresented as Zo Media collaborators. The reading-by-brick-wall photo is the example. |
| 6 | **Splash gates / autoplay video walls before content** | Kills conversion. Voices on Death Row can afford it; a 501(c)(3) selling books cannot. |
| 7 | **Photos that fill space without doing work** | If removing it changes nothing for the reader, don't add it. |

---

## 3. Image Slot Inventory

The site has **8 places** photography earns its keep. Anywhere else is a no until proven otherwise.

### Slot 1 — Home: Mission → Stats section break
- **Job**: a mid-scroll pause, humanity injection between text-heavy sections
- **Subject**: hands writing on lined paper, manuscript pages, an open letter
- **Treatment**: B&W, full-bleed, shallow DOF
- **Aspect**: 21:9 letterbox
- **Avoid**: faces, identifiable handwriting, branded paper
- **Status**: needs sourcing

### Slot 2 — Home: closing image before final CTA
- **Job**: warm callback to the home hero — work happens here
- **Subject**: a writer's desk at night, lamp + books + papers, no person
- **Treatment**: warm color, desaturated 10–15%, dim ambient
- **Aspect**: 16:9
- **Status**: needs sourcing

### Slot 3 — About: hero
- **Job**: institutional identity — "this is who we are"
- **Subject**: a small stack of Zo Media's published books on a desk, OR an editor's worktable mid-edit
- **Treatment**: B&W, editorial, soft window light
- **Aspect**: 16:9 split-hero compatible
- **Status**: needs sourcing (uses real books, easy)

### Slot 4 — Film Projects index cards (3 cards: Screenplays, Theatrical, Documentaries)
- **Job**: each card needs a distinct visual identifying its medium
- **Subjects**:
  - Screenplays → typewriter / stack of script pages with binder clip
  - Theatrical → empty stage with worklight, OR marquee at night (we have this)
  - Documentaries → film camera + monitor in low light (we have this)
- **Treatment**: matched B&W, identical contrast — they read as a set
- **Aspect**: 3:2 each
- **Status**: 2 of 3 covered by Halima's batch; need 1 (screenplays)

### Slot 5 — Documentaries: hero band above Cell Power video
- **Job**: atmospheric establish before the video frame
- **Subject**: documentary gear silhouette at golden hour, OR a corridor with light
- **Treatment**: high-contrast B&W
- **Aspect**: 21:9
- **Status**: needs sourcing

### Slot 6 — Theatrical Works: hero (replaces proof page)
- **Subject**: the THEATRE marquee photo Halima sent
- **Treatment**: contrast +5, slight crop tighter on the letters
- **Aspect**: 16:9
- **Status**: ✅ have the asset

### Slot 7 — Screenplays: hero (replaces proof page)
- **Subject**: typewriter or script pages on a desk
- **Treatment**: warm-toned B&W, shallow DOF
- **Aspect**: 16:9
- **Status**: needs sourcing

### Slot 8 — The Wire: masthead
- **Job**: newsprint editorial weight
- **Subject**: hands holding/folding a printed newsletter, OR ink rolling on a printing plate
- **Treatment**: high-contrast B&W, slight grain
- **Aspect**: variable, full-bleed band
- **Status**: needs sourcing

---

## 4. Sourcing Rubric

### ✅ Stock-OK (Unsplash / Pexels first)
- Hands on paper, hands writing, hands typing
- Envelopes, mail, manuscripts, ink stains
- Typewriters, fountain pens, ballpoints
- Empty studios, edit bays, theatre marquees, stage worklights
- Architecture: prison walls (abstract), corridors, light through bars or windows
- Library shelves, book stacks, open books

Check license is CC0 or Unsplash-equivalent. Verify no legible foreign branding before downloading.

### ⚠️ Commission-required (paid photographer)
- Anything with a face that reads as a Zo Media collaborator
- Real author portraits (require signed release on file)
- Event documentation (book launches, readings, public events)
- Anything where the subject must be a specific real person Zo Media works with

### 🤖 AI-OK (Kling / NanoBanana / Midjourney) — with limits
- **Objects**: hands (no face visible), pen-on-paper, envelopes, typewriters, books
- **Atmosphere**: corridor light, ink stains, paper textures, abstract architecture
- **Empty environments**: stages, edit bays, prison-yard architecture *without people*
- **Textures and backgrounds**: paper fiber, ink wash, light leaks

**Never AI**: faces of "incarcerated people," portraits, crowds, anyone meant to read as a specific real person. This is the bright line.

See [`ai-image-prompts.md`](./ai-image-prompts.md) for the ready-to-paste prompt library.

---

## 5. Treatment Specs

| Spec | Default | Notes |
| --- | --- | --- |
| Color | Black & white | Warm sepia OK for closing-warmth slots; signal red is for type/UI only, never tinted into photos |
| Contrast | +5 to +10 | Editorial press — slight crush, not bleached |
| Depth of field | Shallow (f/1.8–2.8 equivalent) | Subject pops, environment falls away |
| Aspect | 16:9 / 21:9 / 3:2 | No square except film cards |
| Output | webp via `astro:assets` `<Image>` | Already wired in `BaseLayout.astro` |
| Min resolution | 2560px on long edge | We serve responsive `srcset` down to 320px |
| Overlay | `linear-gradient(rgba(10,10,11,0.55) → 0)` when text sits on photo | Existing pattern in `hero--editorial` |

---

## 6. Workflow

1. Identify which slot from §3 needs filling.
2. Check the sourcing rubric in §4 — stock first, AI for objects/atmosphere, commission for faces.
3. If AI, copy the matching prompt from `ai-image-prompts.md`, tweak the variables, generate, regenerate until the §2 "No" list is satisfied.
4. Treat the image to the §5 specs (B&W, contrast, crop).
5. Drop into `src/assets/images/zo-media/` and import via Astro `<Image>` — never as a raw `<img>` to `/public`, we lose responsive optimization.
6. PR review by one other human before merge — the brand is the contract.

---

## 7. Open Questions for the Direction Session

Walk into the session with answers to these:

- Does Halima have access to Zo Media's existing archive (book launches, readings, author photos with release)?
- Budget for one commissioned portrait shoot of an author with a release? Even 3 portraits would transform the About page.
- Do we want a single editorial photographer on retainer, or rotating contributors?
- Who signs off on the final imagery before it ships — the boss, Halima, the director, or the producer?
- Are there incarcerated members who *can* and *want to* contribute photography (some prison programs allow it)?
