# Zo Media — Stock Video Sourcing Index

> Free, commercial-use video sources mapped to the slots in [`ai-video-prompts.md`](./ai-video-prompts.md). Use this **before** spending AI-generation credits — stock often delivers higher quality (real cameras, real lenses, real motion) for $0. AI is for what stock can't deliver.

## The legitimate free sources

Use these in priority order. The top three are workhorses; the rest are for specific needs.

| Source | License | Attribution | Strengths |
| --- | --- | --- | --- |
| **[Pexels Videos](https://www.pexels.com/videos/)** | Pexels License (CC0-equivalent) | Not required | Largest free library, modern aesthetic, well-tagged |
| **[Pixabay](https://pixabay.com/videos/)** | Pixabay License | Not required | Strong on B&W, abstract, atmospheric clips |
| **[Mixkit](https://mixkit.co/free-stock-video/)** | Mixkit License | Not required for most | Curated, cinematic, fewer but better |
| [Coverr](https://coverr.co/) | Free, commercial OK | Not required | Hero-loop friendly clips |
| [Videvo](https://www.videvo.net/) | Mixed — filter to "Free" | Some clips require attribution — check each | Larger library with paid tiers mixed in |
| [Pond5 Public Domain](https://www.pond5.com/free) | Public domain | Not required | Historical/archival footage |
| [Internet Archive](https://archive.org/details/movies) | Mostly public domain | Not required | Historical, archival, found-footage aesthetic |
| [Library of Congress](https://www.loc.gov/film-and-videos/) | Public domain (US govt) | Not required | Documentary archive, civil-rights era footage |
| [NASA Image and Video Library](https://images.nasa.gov/) | Public domain | Not required | Atmospheric / abstract (not directly relevant but useful) |

**Rule**: confirm the per-clip license on the page before downloading. Sites like Videvo mix free and paid; double-check.

---

## Search-term index per slot

These are the exact queries I'd run, in order, on each site. Each search returns dozens of candidates; pick the one that fits the brand brief.

### Slot V1 — Home hero loop (hands writing)

**Best site**: Pexels

Search:
- `"hands writing"`
- `"writing letter"`
- `"close up writing pen paper"`
- `"hand writing notebook"`
- `"pen paper close up"`

What to filter for: B&W or easily B&W-treatable, no face visible, shallow DOF, no modern tech (laptops, phones), no obvious wedding ring or watch.

**Pixabay backup**: `"writing"` + filter `Type: Video` + `Color: Black and White`.

### Slot V2 — Mission/Stats break (paper / corner lifting / draft motion)

Search:
- `"paper draft"`
- `"paper flutter"`
- `"document close up"`
- `"manuscript pages"`
- `"page turning slow"`

What to filter for: top-down or 3/4 angle, no human subject, neutral surfaces (wood, fabric, concrete).

### Slot V3 — Wire promo background (ink / texture / abstract)

**Best site**: Pixabay (strong abstract library)

Search:
- `"ink water"`
- `"ink bleed"`
- `"black ink white paper"`
- `"ink macro"`
- `"abstract black white"`

What to filter for: minimal subject, lots of negative space, can loop, no recognizable forms.

### Slot V4 — Documentaries page atmospheric (camera/edit-bay)

Search:
- `"film camera"`
- `"cinema camera tripod"`
- `"editing studio"`
- `"film production"`
- `"camera lens close up"`

What to filter for: no operator visible, dim ambient lighting, mid-century or contemporary professional gear, no consumer DSLRs/iPhones.

### Slot V5 — Theatrical Works atmospheric (ghost light / empty stage)

Search:
- `"theater empty"`
- `"stage light"`
- `"empty stage"`
- `"theatre curtain"`
- `"marquee neon"`

What to filter for: no audience, no performers, dim/dramatic lighting, vintage if possible.

### Slot V6 — Generic ambient (desk / lamp / books / warm interior)

Search:
- `"desk lamp"`
- `"reading lamp warm"`
- `"books candlelight"`
- `"library desk"`
- `"writing desk night"`

What to filter for: no person, warm light source, vintage or timeless props.

### Slot V7 — Closing CTA (candle / flame / quiet light)

Search:
- `"candle flame close up"`
- `"single candle dark"`
- `"flame slow motion"`
- `"candle macro"`

What to filter for: tight on flame, deep black background, no other light competing.

---

## Specialty searches (use sparingly)

### For The Wire / editorial mood

- `"printing press"` — real letterpress machinery in motion (rare but gold when found)
- `"newsprint close up"` — abstract texture
- `"typewriter close up"` — alternative to AI-generated typewriter
- `"old newspaper"` — period detail

### For Films pages

- `"film reel"` — vintage projection
- `"projector light"` — atmospheric, classic cinema mood
- `"clapperboard"` — production identifier (use sparingly, risks looking generic)

### For carceral / institutional atmosphere (handle with care)

This is the lane where stock can deliver what AI cannot ethically — **real, releasable footage of architecture**. Do not use anything with identifiable persons.

- `"prison fence"` (filter B&W, abstract crops only)
- `"barbed wire silhouette"`
- `"chain link fence shadow"`
- `"empty corridor industrial"`
- `"institutional hallway"`
- `"concrete wall light"`
- `"barred window"`

Hard rule: skip any clip with a person in frame even if blurred. Skip any clip showing a recognizable facility name or signage.

---

## Treatment pipeline (every stock clip gets this)

Stock footage usually arrives over-graded for someone else's brand. Run every download through the same pass:

1. **Open in `ffmpeg`, DaVinci Resolve, or Premiere** — desaturate to B&W (unless slot calls for warm color).
2. **Match contrast** to the site's editorial tone — push blacks to crush slightly (~5%), pull highlights so bone-white isn't pure-white (#FFF would clash with `--color-bone` #E8E2D9).
3. **Strip audio** entirely — `ffmpeg -i input.mp4 -an -c:v copy stripped.mp4`.
4. **Trim to loop length** — typically 5–8s. Find a loop point where first and last frames are near-identical.
5. **Compress hard** for web — see ffmpeg recipes in [`ai-video-prompts.md`](./ai-video-prompts.md). Target sizes:
   - Hero: ≤ 2 MB
   - Cinemagraph: ≤ 800 KB
   - Background: ≤ 400 KB
6. **Generate poster frame** — `ffmpeg -i clip.mp4 -ss 0 -vframes 1 poster.webp` — used in the `<video poster="...">` attribute.
7. **Document the source** — drop the original Pexels/Pixabay URL in a comment near the `<video>` tag or in `creative-direction.md` provenance log. Even though attribution isn't required, traceability is.

---

## When stock won't deliver

Some shots are hard to source free, even from Pexels:

| Need | Free-stock probability | Fallback |
| --- | --- | --- |
| Hands writing in cursive on lined paper | High — many candidates | — |
| Cinema camera on a tripod, no operator | Medium | AI |
| Empty theatre stage with ghost light | Low — paid/AI usually wins | Commission or AI |
| Vintage typewriter in motion | High | — |
| Prison architecture, abstract, non-identifiable | Medium — search carefully | AI atmospheric, or stylized illustration |
| Ink bleeding on paper, macro | High | — |
| Black candle on black background, lit | Medium | AI |
| Pages of a book turning slowly | High | — |

If a slot is "Low" probability for stock, jump straight to AI generation — don't burn 30 minutes searching first.

---

## Browser bookmarks worth saving

If you do a lot of searching, save these direct URLs (pre-filtered to B&W or short clips):

- Pexels B&W videos: `https://www.pexels.com/search/videos/black%20and%20white/`
- Pixabay B&W filter: `https://pixabay.com/videos/search/?colors=blackwhite`
- Mixkit category: writing → `https://mixkit.co/free-stock-video/writing/` (substitute keyword)

---

## Don't-use list

Same spirit as the image "no" list:

| ❌ | Why |
| --- | --- |
| Clips with identifiable faces from stock | Even with model release on the platform, putting a stranger on a site about *real* Zo Media collaborators implies they're one. Same stolen-valor problem as Halima's reading-by-the-wall photo. |
| Clips with legible signage from other organizations | Brand bleed (the "WEREAL PRODUCTION" script issue). |
| Drone shots of "a prison" | Almost always identifiable to a specific facility, raising legal/PR questions. |
| Crime-scene / mug-shot aesthetics | Wrong tone for an authorial-voice org. |
| Anything tagged "inspirational," "uplifting" | These are stock-photo signals — they read commercial, not editorial. |
