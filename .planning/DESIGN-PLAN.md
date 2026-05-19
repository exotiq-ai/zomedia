# Zo Media Productions — Design System Hardening Plan

> **Goal:** Take the site from **6/10 → 9/10** by eliminating system fragmentation, locking a typographic contract, and unifying patterns that have drifted across pages.

**Audit date:** Branch `main`, commit `3e8d89c`
**Stack:** Astro 6.3 / Satoshi + Instrument Serif + Space Mono / dark editorial press aesthetic
**Pages:** 10 (`index`, `about`, `books`, `the-wire`, `support`, `special-projects`, `contact`, `staff-and-volunteers`, `board-of-directors`, `advisory-board`, `404`)

---

## Diagnosis (one-page)

### What's working (don't break these)
- **Distinctive font pairing** — Instrument Serif + Satoshi + Space Mono is uncommon and editorial. Keep.
- **Opinionated palette** — signal-red / wire-gold / phosphor-green + 6-step grey ramp. Keep.
- **Fluid type scale** — 7-tier `clamp()` based. Keep.
- **Spacing scale** — 9-tier 8pt rhythm (xs through 5xl). Keep.
- **Editorial aesthetic POV** — dark editorial press is clear and intentional. Keep.

### What's broken (root causes)
1. Duplicate stylesheets shipping (`components 2.css`, `variables 2.css`, `BaseLayout 2.astro`) cause unpredictable cascade conflicts.
2. **Three competing eyebrow patterns** (`.label`, `.hero__eyebrow`, `.founder-quote__eyebrow`) for the same UI role.
3. **Three off-white shades** (`bone`, `chalk`, `fog`) used interchangeably for body text without rules.
4. **193 inline `style=""` attributes** across 10 pages — spacing rhythm reinvented per page.
5. **Five hero variants** (`hero--split`, `hero--full`, `hero--minimal`, `.about-hero`, `.support-hero`, `.sp-hero`) — no canonical "this is a hero" pattern.
6. **No `.card--quiet` variant** — cards always carry signal-red top accent, forcing content blocks into hard "card vs prose" choice.
7. **No `.section-header` component** — every page ad-hoc-builds eyebrow + h2 with custom spacing.
8. **`--text-micro` (~12px) + uppercase + tracking-mega** is borderline-unreadable on mobile.
9. **No documented color semantics** — signal vs wire vs phosphor have no enforced meaning.

---

## The Eight Phases

Each phase is **independently shippable** as a single commit. Phases 1–2 are highest ROI per minute; 6 is the longest stretch; 8 is the final QA gate.

---

### Phase 1 — Stop the bleeding

**Goal:** Remove duplicate files causing silent cascade conflicts.

**Why it matters:** The `X 2.css` and `X 2.astro` files from the directory rename collision are being imported alongside the canonical versions. Some definitions diverge between them — meaning the rendered styles depend on import order, which is fragile and untrackable.

**Files touched:**
- DELETE: `src/styles/components 2.css`, `src/styles/variables 2.css`, all `src/styles/* 2.css`
- DELETE: `src/layouts/BaseLayout 2.astro`, `src/layouts/SubpageLayout 2.astro`
- DELETE: every `src/pages/* 2.astro`
- DELETE: every `public/assets/images/*/X 2.ext` (legacy duplicates)
- AUDIT: `src/layouts/BaseLayout.astro` to confirm only canonical CSS imports

**Tasks:**
1. `git rm` all `* 2.*` files in `src/`, `public/`, and `_legacy/` if present
2. Verify `BaseLayout.astro` imports only canonical stylesheets
3. Run `npm run build` (or dev) — confirm no broken imports
4. Visual diff: spot-check 3 pages before/after — should be visually identical or reveal previously-conflicting rules now resolved
5. Commit: `chore: remove duplicate stylesheets and layout files from directory rename collision`

**Acceptance criteria:**
- [ ] No file matching pattern `* 2.*` in `src/` or `public/`
- [ ] `npm run build` succeeds
- [ ] No 404s in dev server console
- [ ] Visual smoke test on 3 representative pages (home, about, books) — no regressions

**Estimated effort:** 45 min
**Dependencies:** None — start here.

---

### Phase 2 — Lock the typographic contract

**Goal:** One eyebrow style, three text colors with rules, accessibility-safe minimums.

**Why it matters:** The same conceptual UI element (section eyebrow, body paragraph) looks different across the site. Locking the contract enforces design DNA propagation from tokens to every page.

**Files touched:**
- EDIT: `src/styles/variables.css` — document color semantics in comments
- EDIT: `src/styles/global.css` — add mobile-safe text minimums
- EDIT: `src/styles/components.css` — replace `.label` and `.hero__eyebrow` with unified `.eyebrow`
- EDIT: `src/styles/components.css` — add `.eyebrow--signal` modifier for red variant
- DEPRECATE (but alias for now): `.label`, `.hero__eyebrow`

**Tasks:**
1. Define `.eyebrow` component:
   - Font: Space Mono
   - Size: `0.8125rem` (13px) — mobile-safe minimum
   - Color: `var(--color-wire)` (default)
   - Letter-spacing: `var(--tracking-mega)`
   - Text-transform: uppercase
   - Font-weight: 600
   - Display: inline-block
   - Margin-bottom: `var(--space-md)`
2. Add modifier `.eyebrow--signal` → red variant
3. Alias `.label` and `.hero__eyebrow` to inherit from `.eyebrow` (back-compat during transition)
4. Define text color contract in `variables.css` comments:
   - `--color-bone` — primary text (headings, strong, key UI labels)
   - `--color-chalk` — body text (paragraphs, default `<body>`)
   - `--color-fog` — dim text (captions, meta, dimmed labels)
   - **Rule:** No other off-white shades.
5. Update `global.css`:
   - Body defaults to `--color-chalk`
   - Add `body { font-size: max(1rem, var(--text-body)); }` to enforce 16px floor
   - Add form input rule: `input, select, textarea { font-size: max(1rem, var(--text-body)); }` to prevent iOS zoom
   - Add minimum text rule: `.text-xs { font-size: max(0.8125rem, var(--text-tiny)); }`
6. Replace `.cochair__desc` (currently 0.7rem) with `0.8125rem` minimum
7. Commit: `feat(design): lock typographic contract — unified .eyebrow, text color rules, mobile-safe minimums`

**Acceptance criteria:**
- [ ] `.eyebrow` component exists and works on at least one page
- [ ] No text on any page renders below 13px (audit via DevTools rulers on 3 pages)
- [ ] Body text color is consistent — `--color-chalk` everywhere except `.text-fog` opt-in
- [ ] iOS Safari form-zoom does not occur on focus (manual check or simulator)
- [ ] `.label` and `.hero__eyebrow` still work via aliases (no regression on existing pages)

**Estimated effort:** 90 min
**Dependencies:** Phase 1 complete.

---

### Phase 3 — Section header component

**Goal:** One pattern for `eyebrow + h2 + optional lede` across all 10 pages.

**Why it matters:** Currently every page hand-builds this with inline styles. A component locks the rhythm and removes ~40% of inline-style debt in one pass.

**Files touched:**
- EDIT: `src/styles/components.css` — add `.section-header`
- CREATE: `src/components/ui/SectionHeader.astro` (optional Astro component for ergonomics)
- EDIT: All 10 page files — replace inline header patterns

**Tasks:**
1. Define `.section-header` block:
   ```
   .section-header { max-width: 64ch; margin-bottom: var(--space-3xl); }
   .section-header__lede { margin-top: var(--space-lg); font-size: var(--text-body-lg); color: var(--color-fog); max-width: 56ch; }
   ```
2. Add modifiers:
   - `.section-header--center` (centered, no max-width)
   - `.section-header--narrow` (constrained to `--container-narrow`)
3. (Optional) Create `<SectionHeader>` Astro component with slots for `eyebrow`, `title`, `lede`
4. Replace these patterns across all pages:
   ```
   <span class="label">...</span>
   <h2 ...>...</h2>
   ```
   With:
   ```
   <header class="section-header">
     <span class="eyebrow">...</span>
     <h2>...</h2>
     <p class="section-header__lede">...</p> <!-- optional -->
   </header>
   ```
5. Pages to touch: `index`, `about`, `books`, `the-wire`, `support`, `special-projects`, `contact`, `staff-and-volunteers`, `board-of-directors`, `advisory-board`
6. Commit: `refactor(design): replace ad-hoc section headers with .section-header component`

**Acceptance criteria:**
- [ ] All 10 pages use `.section-header` or `<SectionHeader />` for section starts
- [ ] No inline `style="margin-top: ..."` on h2 elements
- [ ] Section header alignment is consistent (left-aligned default, centered via modifier)
- [ ] Inline-style count per page drops by ~30–40%

**Estimated effort:** 60 min
**Dependencies:** Phase 2 (`.eyebrow` must exist).

---

### Phase 4 — Hero contract

**Goal:** Two canonical hero variants. Replace the five existing patterns.

**Why it matters:** The user's eye learns "this is a hero" by repetition. Five different hero treatments across 10 pages prevents that recognition.

**Files touched:**
- EDIT: `src/styles/components.css` — consolidate hero variants
- EDIT: `src/pages/about.astro` — replace `.about-hero`
- EDIT: `src/pages/support.astro` — replace `.support-hero`
- EDIT: `src/pages/special-projects.astro` — replace `.sp-hero`
- EDIT: `src/pages/the-wire.astro` — verify `hero--full` usage
- EDIT: `src/pages/books.astro` — verify `hero--minimal` → migrate to new contract

**Tasks:**
1. Define two canonical heroes:
   - **`.hero--editorial`** (replaces hero--full, hero--minimal, .about-hero, .support-hero, .sp-hero):
     - Text-driven, optional background image via CSS variable `--hero-image`
     - Optional overlay strength via `--hero-overlay` (0 to 1)
     - Optional position via `--hero-image-position` (default `center`)
     - Optional gradient direction (`--hero-overlay-direction`, default `to bottom`)
     - Modifier `.hero--editorial-left` for left-side darkening (used by support page desk image)
   - **`.hero--split`** (home page only):
     - Existing 7fr 5fr grid with image on right
2. Migrate each page hero:
   - `about.astro`: `<section class="hero hero--editorial" style="--hero-image: url(...)">`
   - `support.astro`: same, with `.hero--editorial-left` modifier
   - `special-projects.astro`: same, with heavy overlay
   - `the-wire.astro`: same, without image (text-only)
   - `books.astro`: same, without image (replace `hero--minimal`)
3. Delete `.hero--full`, `.hero--minimal`, `.about-hero`, `.support-hero`, `.sp-hero` style blocks
4. Commit: `refactor(design): unify five hero patterns into .hero--editorial + .hero--split contract`

**Acceptance criteria:**
- [ ] Only `.hero--editorial` and `.hero--split` exist as hero classes
- [ ] All 10 pages use one of the two
- [ ] Background images configured via CSS variable, not bespoke selectors
- [ ] All heroes hit `min-height: 60vh` desktop / `40vh` mobile
- [ ] Visual smoke test: about, support, special-projects, the-wire heroes still look correct

**Estimated effort:** 2 hr
**Dependencies:** Phase 2 (eyebrow contract used in heroes).

---

### Phase 5 — Card variants

**Goal:** Three intentional card variants with documented use cases.

**Why it matters:** Currently `.card` always carries a signal-red top accent — so every grid cell screams "feature." Need a quiet variant for content blocks and a feature variant for cards-as-call-to-action.

**Files touched:**
- EDIT: `src/styles/components.css` — add card variants
- EDIT: pages that use cards inappropriately

**Tasks:**
1. Define variants:
   - **`.card`** (default) — signal-red top border, soot bg, hover lift. For: feature cards, primary calls to action.
   - **`.card--quiet`** — no accent, no border-top, optional 1px hairline border. For: content blocks, info cards, supporting data.
   - **`.card--feature`** — larger padding, full-bleed image option. For: book covers, project tiles, blog featured posts.
2. Standardize padding: `--card-padding: var(--space-xl)` (token in variables.css)
3. Document the rule in a CSS comment block above the card definitions
4. Audit existing uses:
   - About page tiers (Sustainer / Champion / Patron) → keep `.card` (these ARE features)
   - Support "Other Ways to Help" → consider `.card--quiet`
   - Books grid cards → `.card--feature`
   - Cooperative model pillars (the ones I built) → already quiet pattern, no change needed
5. Commit: `feat(design): add .card--quiet and .card--feature variants`

**Acceptance criteria:**
- [ ] Three card variants exist with clear documented use cases
- [ ] At least 2 pages updated to use the new variants where appropriate
- [ ] `--card-padding` token in variables.css

**Estimated effort:** 45 min
**Dependencies:** Phase 2.

---

### Phase 6 — Inline style purge

**Goal:** Reduce 193 inline `style=""` attributes to <20 site-wide.

**Why it matters:** Inline styles fragment the spacing rhythm and prevent token updates from propagating. They're the single biggest source of design drift.

**Files touched:** All 10 page files, processed one at a time.

**Tasks (per page):**
1. Open page, count `style="..."` instances
2. For each inline style:
   - If it's a one-off positioning hack → leave as inline, but use a CSS variable
   - If it's a repeated pattern (e.g., `margin-top: var(--space-md)`) → extract to utility class or page-scoped `<style>` block
3. Banned inline patterns after this phase:
   - `style="margin-top: var(--space-*)"` — use spacing utilities or component margins
   - `style="text-align: center"` — use `.text-center` class
   - `style="padding: var(--space-*)"` — use card variants or component padding
   - `style="color: var(--color-*)"` — use `.text-*` utility classes
4. Add utility classes only as needed (avoid utility-class soup):
   - `.mt-md`, `.mt-lg`, `.mt-xl`, `.mt-2xl` (margin-top scale)
   - `.text-bone`, `.text-chalk`, `.text-fog`, `.text-signal`, `.text-wire` (already partially exist)
5. Order of pages to process (worst offenders first):
   - support (27 inline styles)
   - about (24)
   - the-wire (22)
   - index (13)
   - contact (12)
   - staff-and-volunteers (11)
   - board-of-directors (6)
   - advisory-board (6)
   - special-projects (5)
   - 404 (3)
6. One commit per page or grouped in logical batches: `refactor(<page>): purge inline styles, extract to component classes`

**Acceptance criteria:**
- [ ] Site-wide inline `style=""` count below 20
- [ ] Spacing tokens propagate (test: change `--space-md` value → all margins update)
- [ ] No visual regressions per page (spot check at 3 viewport widths)

**Estimated effort:** 4–6 hr (spread across multiple sessions)
**Dependencies:** Phase 3 (section-header component reduces a chunk automatically).

---

### Phase 7 — Color semantics contract

**Goal:** Document and enforce what each accent color means.

**Why it matters:** Right now signal-red and wire-gold both act as "decoration." Designers (and Claude) need rules to know which to reach for.

**Files touched:**
- EDIT: `src/styles/variables.css` — add semantic comments
- CREATE: `.planning/COLOR-CONTRACT.md` — full color usage doc
- AUDIT: existing pages for color misuse

**Tasks:**
1. Add to `variables.css`:
   ```css
   /* ——— Color semantics ———
    *
    * --color-signal (red)     → Primary action. Urgent state. "This matters."
    *                            CTAs, alerts, active states, primary stat numbers,
    *                            card top accents (feature cards only).
    *
    * --color-wire (gold)      → Editorial accent. Section markers. "This is meta."
    *                            Eyebrows, secondary highlights, hero overlays,
    *                            non-action emphasis.
    *
    * --color-phosphor (green) → Success / positive growth. "This is good news."
    *                            Currently unused — reserve for stats, success
    *                            states, positive deltas.
    */
   ```
2. Write `COLOR-CONTRACT.md` with examples + don'ts
3. Audit existing uses:
   - About page "50% of profits" stat — currently signal-red — semantically should be wire-gold (it's an editorial highlight, not an action). Decision: keep red OR move to wire. Document the decision.
   - Stat numbers on home page — signal-red. Currently fine if presenting "impact" data. Consider phosphor for positive metrics if context warrants.
   - Card top accents — keep signal-red on `.card` (feature). Already covered by Phase 5.
4. Commit: `docs(design): document color semantics contract and reclassify misuses`

**Acceptance criteria:**
- [ ] Comments in `variables.css` explain semantic intent for each accent color
- [ ] `COLOR-CONTRACT.md` exists with examples
- [ ] Any existing color misuses reclassified or explicitly flagged as exceptions

**Estimated effort:** 30 min (mostly docs)
**Dependencies:** Phases 4 + 5 (heroes and cards are major color consumers).

---

### Phase 8 — Accessibility + responsive QA

**Goal:** WCAG AA pass on every page, every text token, every breakpoint.

**Why it matters:** Final quality gate. Catches any regressions from prior phases.

**Files touched:** All pages — verification, not redesign.

**Tasks:**
1. **Contrast audit** — run `axe-core` or `pa11y` against every page:
   - All `--color-fog` on `--color-void` combinations
   - All `--color-chalk` on `--color-void` combinations
   - All text-on-image-with-overlay heroes
   - Target: WCAG AA (4.5:1 normal text, 3:1 large text)
2. **Mobile viewport test** — 375 / 480 / 768 / 1024 / 1280 px on each page:
   - Heroes don't break
   - Section headers wrap cleanly
   - Cards stack properly
   - Forms remain usable
   - No horizontal scroll
3. **Form a11y**:
   - All inputs have associated labels
   - Focus states visible on all interactive elements
   - Form-control 16px font-size (iOS zoom prevention)
   - Tab order is logical
4. **Text minimums** — verify zero text below 13px renders anywhere
5. **Image alt text** — verify all `<img>` tags have meaningful alt attributes
6. **Reduced-motion** — verify `prefers-reduced-motion` is respected for scroll-reveal animations
7. **Lighthouse run** on home + about + books — target 90+ on Performance / Accessibility / Best Practices / SEO
8. Commit: `chore(a11y): WCAG AA pass — contrast, mobile sizing, form labels, reduced-motion`

**Acceptance criteria:**
- [ ] Zero WCAG AA contrast violations site-wide
- [ ] All pages render correctly at 5 viewport widths
- [ ] All forms accessible (labels, focus, keyboard nav)
- [ ] Lighthouse Accessibility score ≥ 95 on home, about, books
- [ ] No text below 13px anywhere
- [ ] All images have alt text
- [ ] `prefers-reduced-motion` honored

**Estimated effort:** 2 hr
**Dependencies:** All prior phases complete.

---

## Recommended execution order

| Order | Phase | Duration | Why now |
|---|---|---|---|
| 1 | Phase 1: Stop bleeding | 45 min | Removes silent breakage. Highest-priority foundation. |
| 2 | Phase 2: Typographic contract | 90 min | Single most visible change. Sets foundation for everything else. |
| 3 | Phase 3: Section header | 60 min | Kills 40% of inline-style debt in one pass. |
| 4 | Phase 4: Hero contract | 2 hr | Visible on every page top. Unifies cross-page recognition. |
| 5 | Phase 5: Card variants | 45 min | Resolves the "card vs prose" tension. |
| 6 | Phase 7: Color semantics | 30 min | Docs, easy. Lock before tackling Phase 6 details. |
| 7 | Phase 6: Inline-style purge | 4–6 hr | Longest grind. Split across sessions. |
| 8 | Phase 8: A11y + responsive QA | 2 hr | Final gate. |

**Total effort:** ~12–15 hours, ideally across 4–5 working sessions.

---

## Definition of done — what 9/10 looks like

When this plan is complete, the site will:

- [ ] Have **zero duplicate stylesheets or layouts**
- [ ] Use **one** eyebrow pattern, **two** hero variants, **three** card variants
- [ ] Render **no text below 13px** on any device
- [ ] Have a **documented semantic contract** for every accent color
- [ ] Carry **fewer than 20 inline `style=""` attributes** site-wide (vs. 193 today)
- [ ] Score **≥95 on Lighthouse Accessibility** for top 3 pages
- [ ] Display **consistently** across home → subpages → forms
- [ ] Pass **WCAG AA contrast** at every text-on-background combination
- [ ] Boot **with no console errors or 404s**

What 10/10 would require (out of scope here, but worth noting):
- Custom motion design system (orchestrated page-load reveals, hover micro-interactions)
- Custom illustrations / iconography (replace stock photography where possible)
- Performance budget enforcement (image optimization, lazy-load thresholds)
- Internationalization scaffolding (if ever needed)
- Real user testing with the target audience (incarcerated readers / advocates)

---

## Risks + open questions

1. **The duplicate-files cleanup (Phase 1) might surface previously-masked bugs** when the conflicting rule no longer wins. Plan for a quick visual-diff pass after that commit.
2. **`.label` → `.eyebrow` migration** can be done via alias (backward-compatible) or hard cutover. Recommend alias for safety, then hard-deprecate in a later sweep.
3. **Hero migration (Phase 4)** is the most disruptive. Each hero has a slightly different image and overlay. Allow time for visual tuning per page after the consolidation.
4. **Color reclassification (Phase 7)** — the 50% stat being red vs gold is a real design choice, not a technical one. Decision needed from Gregory before that commit lands.
