# Zo Media — AI Video Generation Prompts

> Ready-to-paste prompts for **Kling.ai** video, **Runway Gen-3**, **Sora**, or **Luma Dream Machine**. Companion to [`ai-image-prompts.md`](./ai-image-prompts.md) and [`creative-direction.md`](./creative-direction.md). Same bright line applies: **no AI-generated faces of people meant to read as Zo Media collaborators.** Hands, objects, environments, atmosphere — that's the lane.

---

## Why video here is different from images

Image generation is forgiving and cheap. Video generation is **not** — Kling, Sora, and Runway charge by the second and can take 60–180s per render. Wrong prompts burn budget. Read this section before generating anything.

**Performance budget for the site**:
- Hero video: max **2 MB** compressed (AV1 or H.265 in MP4, ~8s loop, 1280×720)
- Section cinemagraph: max **800 KB** (5–6s loop, 960×540 acceptable)
- Background atmospheric: max **400 KB** (3–4s loop, can be 720×405)

If a Kling render exports at 30 MB you're not shipping it — you compress hard with `ffmpeg`, downscale, drop frame rate to 24fps, accept some quality loss. Plan for that before generating.

**Loop discipline**: the first frame and last frame should be functionally identical, or the loop will visibly snap. Tell the model this explicitly in the prompt. Generate at 5s, trim the snap-point in post if needed.

**Motion budget**: keep it small. Big camera moves and big subject moves both reveal AI artifacts quickly. The strongest AI video for editorial use is *barely moving* — light shifting, a hand finishing a stroke, smoke curling. Cinemagraph mindset, not action movie.

---

## Pilot pass first

Before generating the full batch:

1. Generate **one** test render per slot at the lowest tier (Kling Standard, Runway Gen-3 Turbo).
2. Review all the test renders side by side. Throw out any slot where the model can't get within striking distance.
3. Re-prompt the survivors and only then generate at full quality.
4. Save the prompt + seed + tool + render date next to each final clip — provenance.

Cost discipline: don't run 8 slots × 4 generations × full-quality on first pass. You'll spend $50+ for half-usable footage.

---

## Slot V1 — Home hero loop (replaces or layers behind the headline)

**Job**: convey "this is a media cooperative" in the first 2 seconds. Should loop without visible cut.

### Kling.ai

```
Cinematic 8-second looping video. Close-up of a Black man's hands (mid-forties, weathered) writing slowly on yellow lined legal paper. The pen moves left-to-right across one line of cursive over the duration of the clip. Soft window light from upper-left, dust motes faintly visible in the beam. Shallow depth of field, 50mm prime, f/2.0, hands sharp, background in deep soot-gray blur. Black and white, high contrast, fine Kodak Tri-X 400 film grain. The first and last frame should be near-identical so the loop is seamless — the pen returns to roughly the starting position of the next line. No face, no body, no logos, no legible text on the page. Aspect ratio 21:9.
```

**Negatives**: `face, body, person above wrists, jewelry, watch, ring, legible text, logos, color, plastic skin, AI artifacts, mangled fingers, jump cut, hard cut`

**Runway Gen-3 alt phrasing**:
```
A slow cinematic close-up: hands writing on yellow legal paper, in black and white. The hand moves left to right writing one line of illegible cursive over 8 seconds. Soft directional light from upper left. Documentary photography aesthetic. The clip should loop seamlessly — start frame matches end frame. No face visible.
```

**Compression target**: AV1 MP4, 1280×548 (21:9), 24fps, ~2 MB.

---

## Slot V2 — Mission → Stats section break cinemagraph

**Job**: brief mid-scroll moment. Mostly still, one small motion.

### Kling.ai

```
6-second looping cinemagraph. A single sheet of typed manuscript paper on a dark wooden desk, side-lit by a warm desk lamp. The corner of the page lifts and falls gently in a faint draft, the rest of the frame perfectly still. Black and white, high contrast, slight grain. Top-down framing, 35mm equivalent. Loop must be seamless — page returns to flat starting position by end. No hands, no people, no legible text. Aspect 21:9.
```

**Compression target**: AV1, 960×411, 24fps, ~600 KB.

---

## Slot V3 — Wire promo background (subtle atmospheric)

**Job**: lives behind The Wire newsletter form on the home page. Must not compete with the form copy or signup CTA.

### Kling.ai

```
5-second looping cinemagraph. Macro view of black ink slowly bleeding into wet absorbent paper from a single dropped point. The ink spreads radially in irregular organic shapes. Pure black ink, bone-white paper, no other color. The clip loops by reversing — ink retreats back to the source point in the second half, or fade to start frame. Shot extremely tight, abstract enough to read as texture not subject. No hands, no objects, no people. Aspect 21:9 cropped tight.
```

**Compression target**: AV1, 960×411, 24fps, ~400 KB. Position this with `position: absolute; inset: 0; object-fit: cover; opacity: 0.35` behind the form.

---

## Slot V4 — Documentaries page atmospheric (above Cell Power video)

**Job**: 4-second establish before the user clicks Cell Power. Sets mood, doesn't compete with the real video below it.

### Kling.ai

```
4-second looping cinemagraph. A professional cinema camera (Arri Alexa-style, no visible logo) mounted on a tripod, viewed from a 3/4 angle. The camera's small rear monitor flickers faintly with what appears to be unwatchable color noise — no recognizable content. Background is a dim editing-bay environment, deeply out of focus. Shot on 50mm at f/1.8. Black and white except for the monitor glow which retains a faint amber tint. High contrast, deep blacks. The loop should be seamless. No operator, no hands, no face. Aspect 21:9.
```

**Compression target**: AV1, 1280×548, 24fps, ~700 KB.

---

## Slot V5 — Theatrical Works page atmospheric

**Job**: lives above or behind the THEATRE marquee photo, gives the page kinetic depth.

### Kling.ai

```
5-second looping cinemagraph. Close-up of a single theatrical ghost-light (bare bulb on a tall metal stand) center frame on an empty stage. The bulb's tungsten filament flickers faintly, an old fixture struggling slightly. Background is deep black — the empty house. Camera is locked off, no movement. Shot wide on 24mm but cropped tight on the bulb. Black and white, very high contrast — the bulb is the brightest point in the frame by a wide margin. Loop seamless. No people, no audience. Aspect 16:9.
```

**Compression target**: AV1, 1280×720, 24fps, ~600 KB.

---

## Slot V6 — Books / Wire / About environmental ambient (interchangeable)

**Job**: a 4-second loop that can drop into any page-break slot when a section needs warmth.

### Kling.ai

```
4-second looping cinemagraph. A brass desk lamp throws warm pooled light onto a stack of hardcover books and a half-filled glass of water beside it. The lamp filament shifts subtly — barely perceptible flicker, no overt movement. Background falls into deep shadow. Shot on 35mm at f/2.8, slight handheld feel. Warm color palette — amber lamp, sepia mid-tones, charcoal shadows, desaturated 15%. The loop is near-perfectly still: the only motion is the filament breath. Aspect 16:9.
```

**Compression target**: AV1, 1280×720, 24fps, ~500 KB.

---

## Slot V7 — Closing CTA atmospheric

**Job**: lives behind or beside the "Donate Now / Get In Touch" buttons on the home page. Quiet motion that draws the eye downward.

### Kling.ai

```
6-second looping cinemagraph. A single white candle on a dark wooden surface, lit, flame moving naturally in a still room. Frame is tight — candle occupies the lower third, flame in the center, the rest is darkness with only a faint glow on the table surface. The flame's motion is the only motion. Loop: at 6s the flame returns to roughly the start position so the loop reads continuous. Black and white with the flame core retaining a warm yellow tint. Aspect 21:9. No hands, no people, no objects beyond the candle and surface.
```

**Compression target**: AV1, 960×411, 24fps, ~500 KB.

---

## Slot V8 — Marquee / type ticker (NOT AI video — CSS, listed for completeness)

This one is **not** AI-generated. Do it in code: a horizontal-scrolling `<div>` with pull quotes from Wire issues, CSS `animation: marquee 40s linear infinite`. Zero video weight, very on-brand for an editorial press.

Example markup:
```html
<div class="ticker" aria-label="Latest from The Wire">
  <div class="ticker__track">
    <span class="ticker__item">"They told me I'd never write again. I wrote this from solitary." — Issue 14</span>
    <span class="ticker__item">"The mailroom is the only door left." — Issue 12</span>
    <!-- duplicate set for seamless loop -->
  </div>
</div>
```

This is the cheapest motion on the site and arguably the most editorial. Use liberally.

---

## Compression playbook (run on every export)

```bash
# AV1 for modern browsers, smaller files
ffmpeg -i source.mp4 -c:v libsvtav1 -crf 32 -preset 6 -pix_fmt yuv420p10le -an out.mp4

# H.265 fallback for Safari pre-17
ffmpeg -i source.mp4 -c:v libx265 -crf 28 -preset slow -pix_fmt yuv420p -an out-h265.mp4

# WebM/VP9 as universal fallback
ffmpeg -i source.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -pix_fmt yuv420p -an out.webm
```

Always strip audio (`-an`) — none of these clips have meaningful sound and audio adds weight.

Test the final file in browser DevTools → Network panel. If it transfers >2 MB on a hero or >800 KB on a cinemagraph, compress harder or downscale resolution.

---

## HTML pattern for shipping a loop

```html
<video
  class="hero-loop"
  autoplay
  muted
  loop
  playsinline
  preload="metadata"
  poster="/assets/images/hero-loop-poster.webp"
  aria-hidden="true">
  <source src="/assets/video/hero-loop.av1.mp4" type="video/mp4; codecs=av01.0.05M.08">
  <source src="/assets/video/hero-loop.h265.mp4" type="video/mp4; codecs=hvc1">
  <source src="/assets/video/hero-loop.webm" type="video/webm">
</video>
```

Notes:
- `preload="metadata"` not `auto` — defer the actual bytes until needed
- `poster` is required — what shows before the video plays
- `playsinline` is required for iOS Safari to autoplay inline (not full-screen)
- `aria-hidden="true"` if the video is decorative; otherwise add `<track>` for captions
- AV1 first source — modern browsers will pick it, fallbacks for older

---

## When to NOT use AI video

| Use case | Use this instead |
| --- | --- |
| Cell Power documentary clip on the Films page | The real video (already done — YouTube embed) |
| Author readings, book launches | Real footage, even iPhone-shot, edited |
| Behind-the-scenes from actual productions | Real footage |
| A human face talking | NEVER AI. Always real. Always with release. |
| Footage of "a prison" | Stock library (Pond5, Artgrid, Filmsupply have real prison-environment B-roll with releases) — AI prison videos default to the same stereotype model the image prompts warn about |

---

## Cost-conscious generation order

If you have a budget cap, generate in this priority order — biggest impact first:

1. **V1 — Hero loop** (highest-visibility, every visitor sees it)
2. **V8 — Marquee ticker** (free, CSS-only, do this regardless)
3. **V3 — Wire promo background** (high traffic, low compute)
4. **V2 — Mission/Stats break** (homepage rhythm)
5. **V4 — Documentaries atmospheric**
6. **V5 — Theatrical atmospheric**
7. **V6 — Generic ambient** (drop-in for any page)
8. **V7 — Closing CTA atmospheric**

Stop at whatever budget runs out. The site is fine without V5–V7 if needed.
