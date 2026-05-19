# QA Punch List — Phase 8 Findings

Compiled from 4 parallel QA agents (structural, accessibility, typography/color, build/responsive).

---

## CRITICAL (silently breaking the visual scale)

### C1. Undefined `--text-*` tokens used across pages
15 references to tokens that don't exist (`--text-sm`, `--text-xs`, `--text-base`, `--text-2xl`, `--text-3xl`). Browsers silently swallow these and inherit `<body>` size.

Affected:
- `about.astro:170, 207, 251, 259` — sm, xs
- `the-wire.astro:97` — sm
- `contact.astro:100, 104` — sm
- `books.astro:113, 120` — sm
- `special-projects.astro:93, 100, 109` — 2xl, base, sm
- `support.astro:102, 118` — 3xl (donation tier dollar amounts are silently broken)
- `film-projects/index.astro:52` — sm
- `staff-and-volunteers.astro:79` — 2xl (via inline style)

**Fix:** Add token aliases in `variables.css`:
```css
--text-xs: var(--text-micro);   /* 13px */
--text-sm: var(--text-tiny);    /* 14px */
--text-base: var(--text-body);  /* 17px */
--text-2xl: var(--text-h3);     /* clamp(22, 36, 30) */
--text-3xl: var(--text-h2);     /* clamp(30, 56, 44) */
```

### C2. Undefined `--duration-base` token
- `about.astro:376` — transition: ... var(--duration-base)
- `special-projects.astro:85` — same

**Fix:** Add alias `--duration-base: var(--duration-fast);` in variables.css

### C3. Hardcoded hex color (token exists)
- `about.astro:439` — `color: #0A0A0B;` should be `var(--color-void)`

### C4. TypeScript errors blocking `astro check` clean pass
- `books.astro:153,155` — `pill.dataset.filter`, `card.dataset.category` — Element doesn't have dataset
- `scripts/nav.ts:28` — `toggle.focus()` — Element doesn't have focus

**Fix:** Cast `as HTMLElement` or type-narrow via `querySelectorAll<HTMLElement>`

### C5. Heading hierarchy violation — h1 → h3 skips on team pages
- `staff-and-volunteers.astro` — h1, then h3 directly (member cards) with no h2
- `board-of-directors.astro` — same
- `advisory-board.astro` — same

**Fix:** Add `<h2>` "Members" / "The Team" section heading before the member grid.

### C6. Dead anchors site-wide
- `support.astro:28, 35, 42` — `href="#donate"` × 3, but no `#donate` exists anywhere
- `special-projects.astro:13, 19, 25, 31` — `href="#"` × 4 on project cards (all 4 projects)
- `Footer.astro:14-19, 55` — `href="#"` × 4 on social links

**Fix for support:** Add `id="donate"` to the donation tiers section heading, OR convert CTAs to point to a real donation URL (gift planning URL TBD by user)

**Fix for special-projects:** Convert to non-link `<article>` until projects launch, OR use a "Coming Soon" disabled-state pattern

**Fix for footer social:** Either real URLs (instagram, twitter, etc.) or pull placeholder URLs out into a config and document them as TBD

### C7. `.card--feature` mobile padding not scaling
At 768px the global `.card { padding: var(--space-lg) }` is overridden by `.card--feature { --card-padding: var(--space-2xl) }`, leaving feature cards bulky on mobile.

**Fix:** Add mobile media query to reduce `.card--feature` padding to `--space-lg` at 768px

---

## MEDIUM (drift from system)

### M1. `--color-ash` used as text color (should be surface only)
Per the contract, ash/slate/graphite are surfaces, only bone/chalk/fog for text. Ash crept into ~9 text contexts.

Affected:
- `staff-and-volunteers.astro:105`, `board-of-directors.astro:74`, `advisory-board.astro:74` — team meta
- `special-projects.astro:110` — footnote
- `Footer.astro:103, 189` — brand tagline + small text
- `components.css:182` (.card__meta), `:224` (.divider__label)

**Fix:** Replace `var(--color-ash)` with `var(--color-fog)` in text contexts. Keep ash for placeholders.

### M2. `.founder-quote__eyebrow` bespoke
About page founder quote has a bespoke eyebrow that's effectively `.eyebrow eyebrow--signal`.

**Fix:** Replace with `<span class="eyebrow eyebrow--signal">` and delete the bespoke CSS.

### M3. Books filter pills missing `aria-pressed`
Filter buttons toggle a visual `.active` class but never announce pressed state to AT.

**Fix:** Add `aria-pressed` attribute and update the JS in books.astro to toggle it.

### M4. Form `:focus-visible` outline stripped
- `components.css:278-282` — `.form-control:focus { outline: none; ... }`
- `Footer.astro:148` — same pattern

The replacement (border-color change + 1px box-shadow) is weaker than the global 2px outline.

**Fix:** Either restore outline OR replace with `box-shadow: 0 0 0 2px var(--color-signal)` for stronger ring.

### M5. Empty `* 2/` directories in src/
Finder/iCloud sync artifacts:
- `src/components/content 2/`, `footer 2/`, `forms 2/`, `nav 2/`, `ui 2/`
- `src/pages/film-projects 2/`

**Fix:** Delete (they're empty)

### M6. `--color-fog` text on light gradient regions
`special-projects.astro` project cards use `--color-fog` tagline text. On the lighter side of the wire-dim gradient, contrast drops below 4.5:1.

**Fix:** Switch tagline to `--color-bone` OR add darker overlay to the cards.

### M7. `film-projects/*.astro` pages NOT migrated
Outside Phase 6 scope. These 4 pages still use `.label`, `.hero--full`/`.hero--minimal`, redundant inline `style="color: var(--color-wire)"`.

**Fix:** Run Phase 6 migration pattern on these pages too.

---

## MINOR (polish)

### P1. Form labels — newsletter inputs use aria-label only
Index, the-wire, footer newsletter forms. Acceptable but visible labels are preferred.

**Defer:** Design decision — could be a polish pass later.

### P2. `breadcrumbs` prop unused
- `SubpageLayout.astro:10` — `breadcrumbs` declared but never rendered

**Fix:** Remove unused prop, or wire up a breadcrumb bar component.

### P3. `is:inline` missing on JSON-LD script
- `BaseLayout.astro:49` — Astro warns about implicit inline scripts with attributes.

**Fix:** Add `is:inline` attribute.

### P4. `.wire-headline` uses non-token clamp
- `the-wire.astro:81` — custom `clamp(3rem, 8vw, 6rem)` vs `--text-display` `clamp(3.5rem, 7vw, 6rem)`

**Fix:** Either add `--text-mega` token or accept as deliberate one-off.

### P5. rgba(232, 226, 217, ...) colors in about.astro
10 occurrences of bone-with-alpha for borders. Could be tokenized but they're slightly different from `--color-border` which is white-alpha.

**Defer:** Aesthetic refactor, not breakage.

### P6. Non-canonical breakpoints (500/600/900px)
Used in about.astro and the-wire.astro. Canonical ladder is 480/768/1024.

**Defer:** Document or migrate later.

---

## Execution plan

Fix all CRITICAL + MEDIUM in one commit. Defer the explicitly-deferred MINOR items.

Order:
1. Add missing tokens (C1, C2) — unblocks silent failures
2. Fix typescript errors (C4)
3. Heading hierarchy (C5)
4. Dead anchors (C6) — support, special-projects, footer
5. Hardcoded hex (C3)
6. Card mobile padding (C7)
7. Ash → fog in text (M1)
8. Bespoke eyebrow → component (M2)
9. Filter pills aria-pressed (M3)
10. Focus outlines (M4)
11. Delete empty dirs (M5)
12. Project card contrast (M6)
13. film-projects migration (M7)
