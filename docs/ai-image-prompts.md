# Zo Media — AI Image Generation Prompts

> Ready-to-paste prompts for **Kling.ai** and **NanoBanana** (Google Gemini 2.5 Flash Image). Paired to the image slots in [`creative-direction.md`](./creative-direction.md). Hold the line on the "No" list: **never AI-generate faces of people meant to read as Zo Media authors or incarcerated collaborators.** Objects, hands, environments, atmosphere only.

## How to use this file

1. Find the slot you need (numbered to match `creative-direction.md` §3).
2. Copy the prompt block for your tool (Kling or NanoBanana — they prefer different phrasing).
3. Tweak the **variables in `<angle brackets>`** (skin tone, time of day, location, etc.).
4. Generate at least 4 candidates. Throw out any with: AI artifacts on hands/fingers, illegible glyphs trying to be text, melted geometry, fake-looking grain.
5. Run the chosen output through the §5 treatment specs in the brief (B&W, contrast +5–10, crop to spec aspect).
6. Drop into `src/assets/images/zo-media/` and import via Astro `<Image>`.

**Iteration rule**: if you regenerate 6+ times and can't get one without AI tells, the prompt isn't the problem — the subject probably needs a real photographer. Don't ship a near-miss.

---

## Master template

Use this skeleton for any new slot not covered below.

```
[SHOT TYPE: close-up / medium / wide / overhead] of [SUBJECT — objects or hands only, never identifiable face], 
[LIGHTING: soft window light from <direction> / single practical / golden hour / corridor light], 
[ENVIRONMENT: <surface, location, era>], 
[COMPOSITION: shallow depth of field, subject sharp, background falls to <color>], 
[CAMERA: shot on 50mm prime f/1.8 / 35mm anamorphic / Arri Alexa], 
[FILM REFERENCE: Kodak Tri-X 400 / Ilford HP5 / cinematic B&W], 
[MOOD: editorial documentary, restrained, contemplative], 
[ASPECT: 21:9 / 16:9 / 3:2], 
black and white, high contrast, no people visible above the wrists, no logos, no legible text, no AI artifacts.
```

---

## Slot 1 — Home: Mission → Stats break (hands writing)

**Subject**: hands writing a letter on lined paper. The single most important image on the site. Carries the entire "voice-first" thesis.

### Kling.ai

```
Cinematic close-up photograph of <a Black man's hands, mid-forties / a person's hands, age and race ambiguous> writing in cursive on a sheet of yellow lined legal paper. Right hand grips a blue ballpoint pen, knuckles tense, slight ink stain on the thumb. Soft afternoon window light enters from the upper left, raking across the page and casting gentle shadow on the writing surface. Shallow depth of field, f/2.0, 50mm prime lens, subject hands tack-sharp, background blurred to a warm soot-gray bokeh. Documentary editorial photography. Shot on Kodak Tri-X 400, fine film grain. Black and white, high contrast, deep blacks, bone-white highlights. No face visible, no logos, no legible handwritten words. Aspect ratio 21:9.
```

**Negative prompt**: `face, body, person, logo, brand, watermark, legible text, color, oversaturated, plastic skin, AI artifacts, extra fingers, mangled hands`

### NanoBanana

```
A tight, intimate black-and-white documentary photograph of a Black man's hands in his mid-forties writing a letter. The hands are weathered, knuckles slightly raised. A blue ballpoint pen rests between thumb and index finger. The paper is yellow legal-pad lined paper, cursive handwriting visible but illegible at this crop. Soft directional light enters from upper left, modeling the hands and casting a soft shadow. The background falls to a deep soot-gray, completely out of focus. Shot in the style of Magnum documentary photography, reminiscent of Bradford Young's lighting. Cinematic 21:9 letterbox aspect ratio. High contrast black and white, fine film grain. Do not show the face or body above the wrists. No identifiable text on the page.
```

**Variants**:
- Swap "writing in cursive" → "folding a finished letter into an envelope"
- Swap "ballpoint pen" → "fountain pen" for a quieter, slower variant
- Swap "yellow legal" → "white onionskin / blue prison-issue stationery"

---

## Slot 2 — Home: closing warm desk (before final CTA)

**Subject**: A writer's desk at night, no person — the workspace as character.

### Kling.ai

```
Cinematic wide-angle photograph of a writer's desk at night, no person in frame. A vintage brass desk lamp throws warm directional light onto an open notebook, a closed hardcover book, and a half-full glass of water. A stack of typed pages sits to the right, edges slightly worn. The background falls into dim shadow, suggesting a small room. Shot on 35mm at f/2.8, slight handheld feel. Warm color palette — amber lamp glow, deep sepia shadows — desaturated 15%. Editorial documentary mood, contemplative. Film aesthetic, slight grain, no neon, no laptops, no screens, no modern tech. Aspect 16:9.
```

**Negative prompt**: `person, hands, face, laptop, phone, screen, modern technology, neon, bright color, oversaturated, vector illustration, cartoon, watermark`

### NanoBanana

```
An atmospheric warm-toned photograph of an empty writer's desk at night. A single brass desk lamp casts warm directional light onto: an open spiral notebook with handwriting visible but illegible, a closed clothbound hardcover book, and a stack of typed manuscript pages. No people, no modern electronics visible. The light falls off into deep shadow on the right side. The mood is intimate, contemplative, post-midnight — the kind of desk where someone has been working alone for hours. Shot in the style of late-night editorial photography. 16:9 aspect ratio. Slightly desaturated warm color, deep amber lamp light, charcoal shadows.
```

---

## Slot 3 — About: book stack hero

**Subject**: A small architectural stack of Zo Media's published books on an editor's desk. Object portrait of the work itself.

### Kling.ai

```
Editorial product photograph of a small stack of four hardcover and paperback books arranged on a dark wooden desk, no person. The books have plain spines (no legible titles or branding). Soft north-facing window light from camera-left rakes across the spines, picking out the texture of the cloth and paper. A pair of reading glasses rests folded next to the stack. Shot on 50mm at f/2.8. Black and white, high contrast. Magnum editorial mood, restrained and dignified. Aspect 16:9. No legible text or logos on any book.
```

**Negative prompt**: `legible title, brand name, logo, person, hands, face, color, plastic, modern barcode, library sticker`

### NanoBanana

```
A black-and-white editorial photograph of four books stacked on a dark wooden desk. The books are a mix of hardcover and paperback, with plain unmarked spines — no titles, logos, or barcodes legible. A pair of folded tortoiseshell reading glasses sits beside the stack. Soft window light from the left, deep shadows on the right. Shot in the documentary editorial style of a publishing house portrait. 16:9 ratio. The books should look used and read, not new — slight wear on edges, evidence of being handled. Restrained, dignified mood.
```

---

## Slot 4 — Film Projects index cards (set of 3)

These three images must read as **a matched set** — same treatment, same contrast, same B&W tone.

### 4a. Screenplays card — typewriter + script pages

**Kling.ai**:
```
Cinematic overhead photograph of a vintage manual typewriter (mid-century, no visible brand), a sheet of paper loaded with the top half of a film script visible — formatted with scene headings in monospace, but text illegible. Beside it a stack of pages held by a brass brad clip. Soft top-down lamp light, slight vignette. Shot on 35mm. Black and white, high contrast. 3:2 aspect ratio. Editorial documentary mood. No hands, no person.
```

### 4b. Theatrical card — empty stage with worklight

**Kling.ai**:
```
Cinematic photograph of an empty theatre stage seen from the wings. A single ghost-light (bare bulb on a tall stand) burns center stage. Black masking curtains on either side, the proscenium arch barely visible in deep shadow. No people, no audience. Shot wide on 24mm at f/2.8. Black and white, high contrast, deep shadows. 3:2 aspect ratio. The mood is hushed, anticipatory — the moment before a rehearsal begins or after one ends.
```

### 4c. Documentaries card — film camera in low light

We already have a workstation shot from Halima's batch. Use that for parity; if regenerating:

**Kling.ai**:
```
Cinematic side-profile photograph of a professional cinema camera (Arri Alexa-style body, no visible brand markings) mounted on a fluid-head tripod. The camera's monitor is dimly lit, no operator behind it. Background is dark, with a soft practical light source out of frame. Shot on 50mm at f/2.0. Black and white, high contrast. 3:2 aspect ratio. Documentary workspace mood.
```

---

## Slot 5 — Documentaries: corridor / atmospheric establish

**Kling.ai**:
```
Cinematic photograph of an industrial corridor with raking light from a high window, no people. Concrete floor, painted cinder-block walls, a single fluorescent tube halfway down the hall. Long shadows, deep perspective. Shot on 35mm at f/4, deep depth of field. Black and white, very high contrast — bone-white highlights, crushed blacks. 21:9 letterbox aspect ratio. Mood: institutional, quiet, observational. The corridor is empty but recently walked.
```

**Negative**: `person, figure, silhouette of person, color, neon, signage, watermark, AI artifacts`

---

## Slot 7 — Screenplays: hero (writing scene)

**Kling.ai**:
```
Cinematic medium shot of a writing scene — a hand (no face, frame cuts at the wrist) resting on a stack of typed manuscript pages, holding a fountain pen at rest. A coffee cup sits to the right, half-drunk. Window light from upper left. Shot on 50mm at f/1.8, shallow depth of field, foreground hand and pages sharp, background falling to dim warm gray. Black and white with very subtle warm undertone, high contrast. 16:9 aspect ratio. Editorial documentary mood, restrained.
```

---

## Slot 8 — The Wire: masthead (hands with newsletter)

**Kling.ai**:
```
Cinematic close-up photograph of two hands holding open a folded broadsheet newspaper, fresh ink slightly smudging the fingertips. Only hands and forearms visible, no face, frame cuts at the elbows. The newsprint shows column rules and what reads as serif headlines, but text is illegible at this crop. Soft overhead light, slight shadow under the page. Shot on 35mm at f/2.8. Black and white, high contrast, slight newsprint grain. Full-bleed wide aspect 21:9. No legible text, no masthead, no logos.
```

---

## Atmospheric / texture prompts (background use)

These are for subtle texture overlays, section dividers, or hero background washes. Generate at high res and treat as fill.

### Light through bars

```
Abstract black-and-white photograph of geometric light and shadow patterns cast through vertical window bars onto a concrete floor. No person, no window itself visible — only the cast pattern. High contrast, deep black, bone-white highlights. Slight atmospheric haze. 21:9 aspect ratio.
```

### Paper fiber close-up

```
Extreme macro photograph of textured cotton paper, side-lit so the fiber catches highlights. Black and white, high contrast. No text, no marks. Use as a texture overlay. Square aspect ratio for tiling.
```

### Ink wash texture

```
Abstract photograph of black ink bleeding into wet paper, irregular organic shapes, deep blacks fading to bone-white. No text, no recognizable forms. High contrast. Suitable for use as a texture overlay or background fill.
```

### Envelope being addressed

```
Cinematic overhead close-up of a hand (no face, frame cuts at wrist) addressing a plain white envelope with a fountain pen. The envelope is positioned diagonally on a dark wood surface. Soft window light from upper left. Shallow depth of field. Black and white, high contrast. 16:9 aspect ratio. The address text being written is illegible.
```

---

## What to do when generations go wrong

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Hands have 4 or 6 fingers, fused thumbs | Hand-rendering failure (common) | Regenerate; or crop tighter so fewer fingers are visible |
| Text on the page tries to be real words and fails | Model can't write | Add "illegible handwritten text" and "no legible words" to prompt |
| Subject looks like a stock photo | Lighting too even, composition too clean | Add "documentary handheld feel," "raking side light," "slight imperfection in framing" |
| Image looks AI-glossy / over-rendered | Default model bias | Add "Kodak Tri-X 400 grain," "imperfect," "documentary not commercial" |
| Person appears even though you said no person | Prompt order issue | Move the exclusion to the front: "Photograph (NO PEOPLE) of..." |
| Looks like every other AI prison image (razor wire + tattoos) | Model defaulting to stereotype | Strip "prison" from prompt entirely; describe the environment without the loaded word |

---

## Notes for the direction session

- **Kling vs NanoBanana**: Kling is better for cinematic / shallow-DOF / "shot on film" looks. NanoBanana is better for object-stillness, product-photography precision, and when you want to edit/iterate on a base image. Try both for any high-stakes slot and pick the stronger output.
- **Resolution**: generate at the highest available (Kling: 1080p+; NanoBanana: 2K+). The Astro pipeline downsamples for responsive `srcset`; we never need to *up*-sample.
- **Licensing**: both tools currently allow commercial use of outputs, but **double-check the ToS on the day of use** before shipping. Save the prompt and seed alongside the final file in case provenance is asked.
- **Provenance**: drop a comment in `creative-direction.md` §3 next to the slot when an image lands — "AI · NanoBanana · 2026-06-04 · prompt v3" — so we can re-derive if needed.
