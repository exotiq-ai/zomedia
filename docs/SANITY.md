# Sanity CMS — editing the site

> November 19, 2026: Studio/schema deployment, administrator sign-in, credentialed CORS, publish/delete webhook delivery and failed-build recovery are verified. The release is merged on main and published at the main domain; the build hook now targets main. Halima's editor acceptance remains unverified. The older setup notes below are historical. Do not re-import production with `--replace` to update the schema: that can overwrite editor changes.

## Publishing verification — November 19, 2026

- The existing Netlify build hook “Sanity + Wire refresh” still targeted `main`. Updated it to `feat/launch-readiness` before testing so CMS rebuilds use the protected release source. Return it to `main` only after the reviewed release is merged and verified there. The secret hook URL is not recorded here.
- A controlled direct hook invocation produced branch deploy `6aff2818b6ffa314924ca5e0` from commit `c95598acacf787258d0456ebb3deb13fc3adedee`; the deploy is ready. This establishes the Netlify half of the pipeline, not a Sanity-triggered publication.
- Live verification of the hook-built preview passed login/logout, anonymous deep-link/assets/feed protection, tampered-cookie rejection, noindex and cache isolation. The production deploy ID and lock were read back unchanged after the test.
- Owner completed email-based CLI sign-in. Studio typecheck passed; the updated Studio and its schema deployed successfully to `https://zomedia.sanity.studio/`. Added that exact credentialed CORS origin while retaining localhost. Chrome loaded the deployed editor and the new impact-approval control; no approval flags were changed. The existing Studio auto-update setting is retained (local Sanity 6.18.0, hosted runtime 6.24.0).
- Verified the existing document webhook: production dataset, create/update/delete, drafts excluded, payload limited to document ID/type. Temporarily allowed one exact `launchVerification` test ID alongside the original editorial-type filter. Created a draft and published it through the Sanity Actions API; webhook attempt `atm-3MKnZyYDJg8qcFiDyK4EtJKXqo8` returned HTTP 200 and deploy `6aff2d5941b840692ecf301b` succeeded. Deleting the record returned HTTP 200 on attempt `atm-3MKndYobSDtAM39cgdcpfF5VGZa` and deploy `6aff2d767f003eacee1069be` succeeded.
- Cleanup verified: test draft/published record absent, original webhook rule restored, every original document ID/revision unchanged, published Netlify deploy still locked and unchanged. Evidence is in ignored `output/launch/2026-11-19/sanity-publish-verification.json`. This proves API publish/delete → webhook → rebuild; it does not establish an invited editor's first login. Project membership currently includes one human account and one robot; Halima's editor acceptance remains unverified.
- Failure/recovery check: published a separate clearly labeled synthetic `book` record with deliberately incomplete required data. Branch deploy `6aff2e6d4d1e83919d7553ae` failed during the build (exit code 2); the published deploy stayed locked and unchanged. Removing the test record triggered successful recovery deploy `6aff2e8625564a8f7048aeb4` on the same commit `abc1666324309edaeb6936e48d8d0dea467d2ab6`. Original document IDs/revisions match the baseline after cleanup. No real title was edited. Evidence: ignored `output/launch/2026-11-19/sanity-failed-build-recovery.json`.
- After PR #5 merged, the hook was retargeted to `main` and main deploy `6aff30b29cd168207fbb20bf` was published/unlocked for the owner's explicit main-domain launch request. The locked-deploy checks above describe the earlier controlled tests. Do not test by editing a real book or importing production with `--replace`. Use a staging dataset or a clearly labeled temporary noneditorial record, exclude it from site collections, and verify cleanup and the resulting rebuild.

## Launch approval controls
- Books have separate Print purchase destination / eBook purchase destination fields. The owner's verified shop product links enable direct navigation independently of catalog approval. Catalog approval still controls display prices/structured offers, and ebook actions require separate rights clearance. Existing approval flags remain unchanged.
- Site Settings has a Homepage impact claims approved toggle. Until enabled, the homepage impact counters are hidden; do not enable without organizational approval of all figures.
- Deploy the Studio schema after authorization (`cd studio && npm run deploy`). Field additions require no destructive document import. The frontend remains backward compatible with existing records.
- Published-only reads are enforced. Invalid/duplicate slugs, empty collections and missing book-cover alt text now fail the build. Settings API errors also fail the build. The last successful Netlify deploy must remain published on failure.
- Verify the build-hook branch contains the gate before enabling any webhook or scheduled refresh. Never log or commit the hook URL.

## Current status (2026-10-07)
| Item | State |
| --- | --- |
| Sanity project | **ZoMedia Productions**, project ID `shuf0j25`, dataset `production` (public read; drafts are never exposed) |
| Content | All 36 documents + images imported (7 books, 24 people, 4 special projects, site settings). Ivan Kilgore has **no photo** by design (see house rule in `src/assets/images/zo-media/NOTES.md`). |
| Studio | Deployed: **https://zomedia.sanity.studio/** |
| Editor invite | `halima@ubfsf.org` invited as **Editor** (she must accept the email invitation) |
| Netlify site `zomedia` | `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET` set; **Netlify Forms enabled** |
| Local `.env` / `studio/.env.local` | project ID only (not secret, gitignored) |
| **Still open** | Netlify **Build Hook URL** → Sanity webhook (so Publish rebuilds the site). The site code is also not on `main` yet, so production doesn't read Sanity until the branch is merged. |


The site stays a fast static site. Editors work in **Sanity Studio**; when they click **Publish**, Sanity calls a Netlify *build hook* and the site rebuilds in about a minute. With no Sanity settings present the site simply uses the Markdown files in `src/content/` — so local development and previews never depend on the CMS.

## What editors can change
| Studio section | Controls |
| --- | --- |
| **Books** | title, address (slug), author, category, short + long description, cover (with alt text), prices, "where to buy" link, forthcoming flag, display order. Each book gets its own page at `/books/<slug>/`. |
| **People** (Board / Advisory / Staff / Volunteers) | name, role, bio, headshot, order |
| **Special Projects** | title, tagline, description, status (live / coming soon), link, image |
| **Site Settings** | the four homepage numbers, social media links |

Layout, navigation, page structure and legal pages are intentionally *not* editable (developer changes), so an editor can't break the design.

## One-time setup (needs you)
1. **Project details** — in https://www.sanity.io/manage open the existing project and note the **Project ID** and **dataset**.
   - ⚠️ If that project already holds other content, create a **new dataset** (e.g. `zomedia`) so nothing is overwritten.
2. **Studio env** — `cp studio/.env.example studio/.env.local` and fill `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`.
3. **Import the existing content** (36 documents + images):
   ```bash
   npm run cms:export                             # builds studio/migration/zomedia.ndjson from src/content
   cd studio && npx sanity login                  # sign in with the Sanity account that owns the project
   npx sanity dataset import migration/zomedia.ndjson --dataset <dataset> --replace
   ```
   Re-running with `--replace` updates the same documents (IDs are deterministic).
4. **Deploy the Studio** — `cd studio && npm run deploy` → editors use `https://<studioHost>.sanity.studio` (default `zomedia`). In *manage → API → CORS origins* add that URL (and `http://localhost:3333`) with credentials allowed.
5. **Invite Ms. Kilgore** — *manage → Members → Invite* with role **Editor** (can edit/publish content, cannot change the schema or billing).
6. **Connect the site** — in Netlify set `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` (and `SANITY_API_READ_TOKEN` only if the dataset is *private*).
7. **Auto-publish** — Netlify → *Build & deploy → Build hooks → Add build hook* (copy URL). Sanity → *manage → API → Webhooks → Create*: URL = the hook, trigger on **create / update / delete**, dataset = yours, HTTP POST. Now Publish → rebuild.
8. Publish a test change and watch the Netlify deploy.

## How it's wired (for developers)
- `src/content.config.ts` swaps each collection's loader: `PUBLIC_SANITY_PROJECT_ID` set → `src/lib/sanity.ts` GROQ loaders (published documents only, never drafts); unset → Markdown.
- A failed Sanity fetch **fails the build**, so Netlify keeps serving the last good deploy instead of publishing an empty site.
- Sanity images are served from Sanity's CDN with automatic format and width.
- Books created in the CMS get a page, sitemap entry, structured data and `llms.txt` listing automatically. Their social-share card falls back to the cover image (branded cards for new titles: re-run `npm run brand-assets` after pulling content, or ask).
- Tested end-to-end against a mock Sanity API (collections, book page, settings → home stats). Not yet run against your real project.

## Later ideas
Wire issues / news posts (the Phuckin' Wire archive), announcement banner, per-page editable copy, visual draft preview (needs server rendering).
