# Zo Media Productions — Motion, Imagery & Discovery Plan

> **Goal:** Take the site from **8/10 → 10/10** by adding one unforgettable signature moment, orchestrated motion design, a refined imagery system, and a discovery layer that ranks strong in both classic SEO and LLM-driven search.

**Plan date:** Following the design-system hardening (commit `8549909`)
**Stack:** Astro 6.3 / Satoshi + Instrument Serif + Space Mono / dark editorial press

---

## Three tracks, twelve phases

| Track | Phase | Description | ETA |
|---|---|---|---|
| **SIGNATURE** | 1 | The "Inside" home hero — the one moment people remember | 3-4 hr |
| **MOTION** | 2 | Orchestrated page-load reveals (every page top) | 2 hr |
| **MOTION** | 3 | Scroll-triggered animations (replace generic fades) | 3 hr |
| **MOTION** | 4 | Cooperative model split-bar interactive (about page) | 2 hr |
| **MOTION** | 5 | Stat counters + number animations | 1 hr |
| **MOTION** | 6 | Micro-interactions (hover, focus, magnetic CTAs) | 2 hr |
| **MOTION** | 7 | View Transitions API (Astro built-in) — page-to-page | 1.5 hr |
| **MOTION** | 8 | Reduced-motion audit + fallbacks | 1 hr |
| **IMAGERY** | 9 | CSS textures + grain + halftone system | 2 hr |
| **IMAGERY** | 10 | Custom SVG illustrations for special projects | 3 hr |
| **IMAGERY** | 11 | User-supplied photography list (flagged below) | — |
| **SEO/LLM** | 12 | Full discovery layer — robots, sitemap, schema, llms.txt, performance | 4 hr |

**Total Claude-time:** ~25 hours
**User-time for assets:** see Phase 11 — 6 photos + 2 decisions

---

# THE SIGNATURE MOMENT

## Phase 1 — "Inside" hero reveal

**Page:** `index.astro` (home — only place this can live for maximum impact)

**The moment:**
The home hero currently reads:
> *The stories that*
> *matter most are*
> *told from inside.*

Visitors land. After **80ms** of suspense (long enough to feel deliberate), a choreographed sequence plays:

1. **0ms**: page background fades in from `--color-void` solid
2. **80ms**: eyebrow `"A UBFSF 501(c)(3) Cooperative"` fades up + 8px translate
3. **280ms**: headline line 1 `"The stories that"` types in (character-by-character, ~30ms per char) — using `clip-path` mask, not actual typing
4. **560ms**: line 2 `"matter most are"` types in
5. **820ms**: line 3 begins typing `"told from "`
6. **1100ms**: the final word `"inside"` reveals — but with a special treatment: it slides in from BEHIND a vertical mask edge as if emerging through a slit. The mask is a slim vertical bar of `--color-signal` that "opens" left-to-right.
7. **1380ms**: a subtle 2px underline draws beneath `"inside"` in `--color-signal`, left-to-right, over 400ms
8. **1500ms**: subhead fades in
9. **1700ms**: CTAs slide up 12px + fade in (staggered 80ms between buttons)
10. **1900ms**: the right-column image (`hero-ivan.jpg`) reveals via a top-down wipe (clip-path inset)

**Why this works:**
- The "inside" treatment is *literal* — text emerges from behind a barrier, mirroring the org's mission of stories emerging from incarceration. Visceral, not decorative.
- The choreographed 0–2000ms timing creates anticipation without being slow
- The signal-red underline becomes the visual hook — people screenshot moments like this
- Skippable: any scroll, click, or `prefers-reduced-motion` instantly resolves to final state

**Implementation:**
- Pure CSS animations + Web Animations API where needed
- No JS libraries (Motion One adds 7kb — not worth it here)
- Custom property `--reveal-progress` for the animation phase
- `prefers-reduced-motion: reduce` → instant resolve to final state, no animation
- Test: First Contentful Paint must remain ≤1.2s (Lighthouse)

**Files touched:**
- `src/pages/index.astro` — restructure hero markup to support per-line mask animation
- `src/styles/effects.css` — new keyframes + signature-hero class
- `src/scripts/signature-hero.ts` — orchestration

**Acceptance criteria:**
- [ ] Sequence plays as described on first visit
- [ ] Resolves instantly under `prefers-reduced-motion: reduce`
- [ ] Reload triggers it again (no sessionStorage gating — every visit gets the moment)
- [ ] No layout shift during animation
- [ ] FCP ≤ 1.2s, LCP ≤ 2.5s
- [ ] Works at 375px / 768px / 1280px

---

# MOTION

## Phase 2 — Orchestrated page-load reveal (subpages)

Every subpage gets a softer version of the signature treatment — a four-beat reveal on page load:

| Element | Delay | Effect |
|---|---|---|
| `.hero__eyebrow` | 0ms | Fade + 8px up |
| `.hero__headline` | 150ms | Fade + 12px up |
| `.hero__subhead` | 350ms | Fade + 8px up |
| `.hero__ctas > *` | 500ms (stagger 80ms) | Fade + 8px up |

Implementation: CSS custom property `--enter-delay` on hero children. One keyframe, animation-delay set inline.

**Files touched:**
- `src/styles/components.css` — `.hero__enter` modifier with stagger logic
- `src/components/ui/Hero.astro` — apply the modifier class

---

## Phase 3 — Scroll-triggered reveals (replace generic fade)

**Current state:** `.reveal` class toggles opacity via IntersectionObserver. Linear, flat, all sections look identical.

**Target:** Three reveal variants chosen per section context:

1. **`.reveal--lift`** — fade + 24px translate-up (default)
2. **`.reveal--unmask`** — clip-path wipe from top (use on photos, hero bands)
3. **`.reveal--stagger`** — children animate in sequence (use on card grids, stat rows)

All driven by a single IntersectionObserver script in `effects.css` + `reveal.ts`. Threshold 15% visible. One-shot (no re-trigger on scroll-up).

**Files touched:**
- `src/styles/effects.css` — three variants + stagger child rules
- `src/scripts/reveal.ts` — extend existing observer

**Acceptance criteria:**
- [ ] Every section reveals on first scroll-in, never on scroll-out
- [ ] Honors `prefers-reduced-motion`
- [ ] No jank — RAF-driven, will-change set/unset properly

---

## Phase 4 — Cooperative model interactive (about page)

The pillars I built on `/about` are static. Make them the secondary signature moment.

**On scroll into view:**
1. **Pillar 01 (People)**:
   - Left + right node cards slide in from outside the viewport
   - Center "Co-Chair" pivot drops down + the wire-gold rules above/below it draw outward from center
   - 200ms stagger between the three elements
2. **Pillar 02 (Capital)** — the killer:
   - The 50/50 split bar starts empty (gray on both sides)
   - The UBFSF half (left) fills from 0% → 50% width with `--color-wire` background sweeping in
   - The "50%" number counts up from 0 → 50 in sync (using existing counter.ts)
   - Then the Creators half (right) fills the same way
   - Total sequence: ~1400ms
   - Legend below fades in after both bars complete

This is the kind of data-driven moment that lives in modern editorial sites (NYT Mag, Pudding, FT Visual).

**Files touched:**
- `src/pages/about.astro` — add scroll trigger classes
- `src/styles/effects.css` — new `.coop__animate` rules
- New: `src/scripts/coop-reveal.ts` — orchestration

---

## Phase 5 — Stat counters with character

Current `data-counter` is mechanical. Improve with:
- Eased deceleration (cubic-bezier on the counter math, not just linear)
- Tiny "overshoot" at the end (count to N+2, then settle to N) — borrowed from Apple's product counters
- Optional `data-counter-prefix` and `data-counter-suffix-style` for typographic flair

Affects: `/` (home page Impact stats), `/about` split-bar percentages.

**Files touched:**
- `src/scripts/counter.ts` — rewrite with easing + overshoot

---

## Phase 6 — Micro-interactions

**Card hovers** (`.card`, `.card--feature`, `.book-feature`):
- Current: `translateY(-2px)` + border color shift
- New: subtle parallax — the inner content shifts a few pixels OPPOSITE the card's lift, creating depth
- For book covers: a soft `box-shadow` extends below + slight `scale(1.02)` on the image (cover stays in container via overflow-hidden)

**Primary CTA magnetism** (the BIG home page buttons only):
- Cursor proximity (within ~80px) → button center subtly shifts toward cursor (max 4px offset)
- On hover, the button has a barely-perceptible warm-up animation: the inner background pulses 1-2% brighter
- Mobile: skipped (no cursor)

**Filter pill toggle** (books page):
- Active pill animates a 2px underline from left to right when selected
- Hover state: subtle background tint, no transform

**Eyebrow micro-reveal:**
- When an eyebrow with the `.eyebrow--animate` modifier enters viewport, the tracking expands from 0.15em → 0.25em over 600ms. Subtle, deliberate.

**Files touched:**
- `src/styles/effects.css` — all micro-interaction rules
- `src/scripts/magnetic-cta.ts` — new (only used on home page primary CTAs)

---

## Phase 7 — View Transitions API

Astro has built-in support for the View Transitions API (`<ViewTransitions />` from `astro:transitions`). Adding it gives every navigation a smooth crossfade by default, with the option to declare specific elements (logo, hero image) as persistent across pages.

**Setup:**
- `<ViewTransitions />` in `BaseLayout.astro` head
- `transition:name="nav-logo"` on the logo (persists across pages — the same logo element fades in place rather than re-rendering)
- `transition:name="hero-image"` on hero photos (smooth photo-to-photo)
- Custom transitions for the home → subpage flow (slide rather than fade)

**Acceptance criteria:**
- [ ] No full-page flash between navigations
- [ ] Logo persists across all pages
- [ ] Browser back/forward respects the transition
- [ ] Falls back to instant nav on unsupported browsers (Firefox until they ship it)

---

## Phase 8 — Reduced-motion audit

For every animation added in Phases 1–7, verify the `prefers-reduced-motion: reduce` query produces a graceful fallback. Currently `reset.css` neutralizes transitions globally, but our scripted animations need explicit checks.

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
  // skip orchestrated sequences, set final state immediately
}
```

**Files touched:**
- All `src/scripts/*.ts` — add reduced-motion check at the top
- `src/styles/effects.css` — wrap keyframes in `@media (prefers-reduced-motion: no-preference)` where appropriate

---

# IMAGERY

## Phase 9 — CSS texture system

Programmatic textures that give every page a tactile "press" feel without raster assets:

**1. Halftone overlay** (CSS-only)
- A repeating radial-gradient pattern at 2px scale
- Applied as a `::before` overlay to dark sections at 4-6% opacity
- Already partially used (`.halftone` exists) — extend to a system

**2. Paper grain**
- Inline SVG noise filter (`<feTurbulence>` + `<feColorMatrix>`)
- Applied as a body-level fixed overlay at 3% opacity, multiply blend
- Costs ~1kb, never re-renders (pure SVG)

**3. Newsprint-edge texture**
- Subtle uneven edge on `.section--alt` boundaries — like the cut edge of newspaper
- Implemented via `mask-image` with an SVG distortion pattern

**4. Ink-bleed shadows**
- Replace generic `box-shadow` on hover with a slight chromatic split — primary shadow + a tiny offset signal-red shadow at 40% opacity, creating a "registration print" feel

**Files touched:**
- `src/styles/effects.css` — texture system
- `public/assets/textures/grain.svg` — generated noise filter (10ms work, ship inline)

---

## Phase 10 — Custom SVG illustrations for special projects

Currently the 4 special-project cards use color gradients as placeholders. Replace with custom SVG illustrations — one per project — that fit the editorial press aesthetic.

**Approach:** I generate these as Claude-authored SVG (line art, geometric, editorial). No raster, no AI-generated images (yet).

| Project | Illustration concept |
|---|---|
| **Global Impact of Mass Incarceration** | Stylized world map with prison-bar overlay; bars get denser over the US |
| **Voices On Death Row** | A simple chair silhouette in line-art, with a single drawn lightbulb above — sparse, somber |
| **Tales From the Zo** | An open book whose pages curl into landscape forms — pages-as-mountains motif |
| **Writing Beyond the Prison** | A pen tip dragging an ink line that breaks through a brick wall edge |

Each rendered at ~120-160px, placed inside the existing card with subtle hover animation (line draws itself).

**Files touched:**
- `public/assets/illustrations/*.svg` — 4 new SVG files
- `src/pages/special-projects.astro` — wire them in

---

## Phase 11 — User-supplied imagery (flagged for Gregory)

Things only you can provide. Ordered by impact:

### Must-have (blocks the experience)

1. **Founder portrait — Ivan Kilgore**
   - **Where it goes:** About page founder quote section, right of the quote, or behind it as a duotone
   - **Spec:** High-contrast portrait, ideally B&W or treatable to duotone. Looking off-camera. ~2000x2500px minimum.
   - **Backup if unavailable:** Use the existing `hero-ivan.jpg` if it shows Ivan, or note that this remains a TBD with placeholder geometry.

2. **2-3 strong supporting photos**
   - Subjects: writing hands at a desk, a stack of finished books, a creator reading, a folsom-tower-style architectural shot (different from current). Anything that humanizes the work.
   - Spec: 16:9 horizontal, ~2400px wide, dark/moody if possible (matches the editorial press aesthetic)
   - **Use:** Get Involved page hero, Bookstore hero, Contact page hero

### Should-have (improves but not blocking)

3. **Books page — real book cover photography**
   - Currently using existing WP imports. If higher-resolution covers are available for the 7 real books, use those.
   - Spec: Same dimensions as current covers, ideally with consistent treatment (all on dark surface, similar lighting)

4. **Open Graph share image**
   - **Where it goes:** Every page's social share preview (Facebook, Twitter, Slack, iMessage)
   - **Spec:** 1200x630px. Should include logo + tagline + one strong image
   - **Backup:** I can generate a clean type-based one in Figma/Canva/SVG if no photo is available — say the word.

### Nice-to-have

5. **Hero motion video (optional)**
   - **Where it goes:** Home page hero — replaces or layers behind the static `hero-ivan.jpg`
   - **Spec:** 10-15 second loop, muted, autoplay. Hands writing, paper turning, ink spilling, urban-architectural slow pans. Hero background MUST not visually dominate the headline — heavy color grade toward dark / desaturated.
   - **Optional:** Skip if no video — the static image works.

6. **Decision: AI-generated imagery acceptable?**
   - If yes: I can write Midjourney/DALL-E prompts that match the editorial press aesthetic for the Special Projects pages, Get Involved, etc. — useful when we have content gaps and real photography isn't feasible.
   - If no: I stay strictly with photography you provide + Claude-generated SVG illustrations.

### What I'll generate for you (no input needed)

- 4 SVG illustrations (Phase 10)
- CSS textures (Phase 9)
- Improved favicon — `favicon.svg` with the Zo logo at small scale
- Color/duotone CSS treatment specs for any photo you provide
- Sharpened OG image if needed (text-only, brand-consistent)

---

# SEO + LLM DISCOVERY

## Phase 12 — Full discovery layer

The site currently has *basic* SEO: a sitemap.xml, robots.txt, Organization schema. Real organic + LLM discovery requires more.

### 12.1 robots.txt — explicit AI permissions

Current:
```
User-agent: *
Allow: /
Sitemap: https://zomediaproductions.com/sitemap.xml
```

Replace with a richer policy that explicitly allows the major AI crawlers (assumption: you WANT the LLMs to index this — it's editorial content with a justice mission, prime LLM training material):

```
# Search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# AI / LLM crawlers — explicitly welcomed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Catch-all
User-agent: *
Allow: /

Sitemap: https://zomediaproductions.com/sitemap.xml
```

**Decision needed:** Should we ALLOW or BLOCK GPTBot/ClaudeBot/etc.? My recommendation: ALLOW. The mission is amplification. LLM citations are amplification at scale.

### 12.2 llms.txt — the emerging standard

A new convention being adopted by AI agents: a markdown summary of the site at `/llms.txt` that LLMs can ingest cheaply. Anthropic, Mistral, and Mintlify already use it.

Format (200-400 lines max):
```markdown
# Zo Media Productions

> A media cooperative publishing literature, film, and art by incarcerated creators. A subsidiary of the United Black Family Scholarship Foundation (UBFSF), a 501(c)(3) nonprofit.

## About

Zo Media Productions operates on a cooperative model where every leadership
position is co-held by an inside member (currently or formerly incarcerated)
and an outside member (student or community advocate). Founded by Ivan
Kilgore, who coined the name "Zo" as shorthand for "Twilight Zone" — a
reference to the disorientation of incarceration.

## Mission

Amplify incarcerated voices through publishing, film, and art. Drive
systemic justice reform by creating economic opportunity for creators
and platforming their work in mainstream culture.

## Revenue Model

50% of all profits go directly to the UBFSF Community Grant Fund —
supporting education, reentry programs, and family assistance for
incarcerated individuals. The other 50% is shared among creators and
reinvested into new projects.

## Key Pages

- [/about/](https://zomediaproductions.com/about/) — Mission, cooperative model, founder
- [/books/](https://zomediaproductions.com/books/) — Published literature
- [/the-wire/](https://zomediaproductions.com/the-wire/) — Newsletter / advocacy journalism
- [/special-projects/](https://zomediaproductions.com/special-projects/) — Independent initiatives
- [/support/](https://zomediaproductions.com/support/) — Donation tiers
- [/contact/](https://zomediaproductions.com/contact/) — Press / partnership

## Contact

P.O. Box 862, Bristow, OK 74010
Phone: 1-918-924-5872
```

### 12.3 Schema.org expansion

The current `BaseLayout.astro` has basic Organization schema. Expand:

**On BaseLayout (all pages):**
- Change `@type: Organization` → `@type: NonprofitOrganization` (more specific)
- Add `nonprofitStatus: Nonprofit501c3` 
- Add `parentOrganization` (already there, refine)
- Add `founder` block referencing Ivan Kilgore
- Add `sameAs` array with social URLs (when available)

**Per-page schema (page-specific JSON-LD):**
- **`/books/[slug]`** — `@type: Book` for each title (when individual book pages exist)
- **`/the-wire/`** — `@type: Periodical` for the publication itself
- **`/about/`** — `@type: AboutPage` + `Person` for Ivan
- **`/support/`** — `@type: DonateAction` with potentialAction
- **`/contact/`** — `@type: ContactPage`
- **All subpages** — `@type: BreadcrumbList` for breadcrumb navigation

### 12.4 Meta description audit + uniqueness

Every page needs a unique `<meta name="description">` of 140-160 characters. Currently many fall back to the default. Audit and write for:

- `/` — "Zo Media Productions amplifies incarcerated voices through literature, film, and art. A UBFSF 501(c)(3) cooperative where creators own the work."
- `/about/` — "Founded by Ivan Kilgore. A cooperative publishing house where every leadership role is shared between an inside and outside member."
- `/books/` — "Memoir, essays, poetry, and anthologies by incarcerated authors. Published by Zo Media Productions."
- `/the-wire/` — "The Phuckin' Wire — advocacy journalism written by and for incarcerated people. Unfiltered. Uncensored."
- `/special-projects/` — "Independent initiatives exploring incarceration, art, and justice. Each project a standalone investigation."
- `/get-involved/` — "Volunteer, partner, or sponsor. Three pathways to support a cooperative reshaping who tells America's prison stories."
- `/support/` — "Every donation funds creator pay and the UBFSF Community Grant Fund. 50% to creators, 50% to community."
- `/contact/` — "Press, partnerships, sponsorships, general inquiries. Reach Zo Media Productions."
- `/staff-and-volunteers/`, `/board-of-directors/`, `/advisory-board/` — distinct descriptions for each

### 12.5 Open Graph + Twitter cards

Every page needs:
- `og:title` (matches `<title>` or improves it)
- `og:description` (matches meta description)
- `og:image` (1200x630, page-specific where possible, OR the global fallback)
- `og:url` (canonical)
- `og:type` (`website` default, `article` for /the-wire content)
- `twitter:card: summary_large_image`
- `twitter:site: @zomediaproductions` (when account exists)

### 12.6 Sitemap regeneration

The current `public/sitemap.xml` is stale (from the original static-HTML version). Regenerate to include:
- All 14 routes
- `lastmod` dates from git
- Priority weighting (`/` = 1.0, top-level pages = 0.8, sub-pages = 0.6)

**Tooling:** Install `@astrojs/sitemap` integration — automatic, zero-maintenance.

### 12.7 Performance budget

Pages must hit:
- **Lighthouse Performance:** ≥95
- **Lighthouse SEO:** 100
- **Lighthouse Accessibility:** ≥95
- **Lighthouse Best Practices:** ≥95
- **LCP:** ≤ 2.5s
- **FID:** ≤ 100ms
- **CLS:** ≤ 0.1

Tasks:
- Add `<link rel="preload">` for the hero image on home page (raw img file)
- Convert hero photos to AVIF + WebP with `<picture>` fallback
- Lazy-load every below-the-fold image (already done in most places)
- Preload Satoshi-Regular.woff2 (already done) — also preload Instrument Serif from Google Fonts
- Self-host Google Fonts (eliminate the 2 cross-origin requests) — `astro:assets` can ship them locally

### 12.8 Internal linking + content depth

LLMs reward sites with strong internal linking and content depth. Audit:
- Every page should link to 3-5 other internal pages contextually
- Every concept on home should expand into a dedicated page
- Glossary of terms (UBFSF, "the Zo", Phuckin' Wire) — could live on /about/ or a separate /glossary/

### 12.9 Submission + verification

After deploy:
- Submit sitemap to Google Search Console
- Submit sitemap to Bing Webmaster Tools
- Verify domain ownership in both
- Submit URL to https://www.indexnow.org/ (instant indexing protocol used by Bing + Yandex)
- Set up Search Console alerts for crawl errors

**Files touched:**
- `public/robots.txt` — replace
- `public/llms.txt` — new
- `public/sitemap.xml` — regenerated via integration
- `src/layouts/BaseLayout.astro` — expanded schema + OG meta
- `src/layouts/SubpageLayout.astro` — per-page schema slots
- Every page file — set unique `description` prop
- `astro.config.mjs` — add `@astrojs/sitemap`
- `package.json` — add sitemap dep

---

# Definition of done — 10/10

After all 12 phases, the site will:

- [ ] Display **one signature moment** on first load that visitors remember
- [ ] Animate **every section** as it enters the viewport (no generic fades)
- [ ] Honor `prefers-reduced-motion` site-wide
- [ ] Render the cooperative model as a **scroll-driven data interactive**
- [ ] Use **View Transitions** for smooth page-to-page navigation
- [ ] Carry **CSS textures** (halftone, grain) that give a tactile press feel
- [ ] Display **custom SVG illustrations** on the Special Projects page
- [ ] Use **provided photography** for hero placements
- [ ] Score **≥95 Lighthouse** across all four categories on top 3 pages
- [ ] Be discoverable by **Google, Bing, GPTBot, ClaudeBot, PerplexityBot, etc.** via robots.txt + llms.txt + comprehensive schema
- [ ] Have a **unique meta description** per page
- [ ] Generate a **valid sitemap** automatically
- [ ] Pass **structured data testing tool** validation
- [ ] Show **rich preview cards** on social shares (Twitter, Slack, iMessage)

---

# Recommended execution order

| Day | Work | Effort |
|---|---|---|
| 1 (AM) | Phase 12 SEO foundation (robots, llms.txt, schema, sitemap) | 4 hr |
| 1 (PM) | Phase 1 signature moment + Phase 2 page-load reveals | 5 hr |
| 2 (AM) | Phase 3-6 scroll motion + interactions | 6 hr |
| 2 (PM) | Phase 7 View Transitions + Phase 8 reduced-motion audit | 3 hr |
| 3 (AM) | Phase 9 textures + Phase 10 SVG illustrations | 5 hr |
| 3 (PM) | Phase 12 performance pass + Lighthouse fixes | 2 hr |
| — | Phase 11 imagery — happens whenever you supply files | (your turn) |

**Total Claude-time:** ~25 hours across 3 working days.

---

# Open questions / decisions needed before we start

| # | Question | My recommendation |
|---|---|---|
| Q1 | Allow LLM crawlers (GPTBot, ClaudeBot, etc.) in robots.txt? | **Yes — allow.** Mission is amplification. |
| Q2 | AI-generated imagery acceptable for placeholder/atmosphere photos? | **No — strictly photography you supply + my SVG illustrations.** Keeps the editorial integrity. |
| Q3 | Hero motion video (Phase 11 #5) — pursue or skip? | **Skip for now.** The static image works. Revisit after launch with real footage. |
| Q4 | Founder portrait of Ivan available? | **TBD — confirm.** |
| Q5 | OG share image — provide your own, or have me generate type-based? | **My recommendation: I generate a type-based one** (clean, brand-consistent, instant). Replace with photo later. |
| Q6 | Self-host Google Fonts (Instrument Serif, Space Mono) to eliminate cross-origin requests? | **Yes — small perf win, simple to do.** |
| Q7 | When to deploy to Netlify? | **After Phase 12 SEO foundation lands.** That way the indexed URLs match the live URLs from day one. |
| Q8 | Social URLs available yet (IG, X, FB, YT)? | **TBD — currently placeholders.** |

---

Once you greenlight, I'll execute Phase 12 first (the SEO foundation) since it sets up everything else for success on launch. Then Phase 1 (signature moment). Then everything else.
