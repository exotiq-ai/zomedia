# Review corrections and private contact attachments

The owner selected private uploads for unpublished manuscripts and scripts. Keep the approved contact layout and inquiry choices; add one optional document field in the existing form style. Preserve the public coming-soon hold, payment settings and shop destinations.

1. Apply the exact Wire and Film Overview copy edits. Align Cell Power with its verified UBF YouTube subject; preserve prison/freedom movement and racism language.
2. Update Sanity and Markdown board categories/roles. Move Glenn and DeShannon to advisory, make Timothy Young chairman, and remove Glenn's obsolete chairman claim. Do not invent Dr. Poole's identity, photograph or biography.
3. Mark Writing Beyond the Prison live with its HTTPS destination. Keep Voices on Death Row and Tales From the Zo names (owner confirmed transcription errors). Correct Cages title; await Gianna's approved description and documentary materials.
4. Add a POST-only private attachment function using Netlify Blobs, with same-origin validation, a honeypot, document format/size checks and platform rate limiting. Expose no download/list endpoint. Team members retrieve files through Netlify's authenticated Blobs dashboard. Keep test/preview storage separate.
5. Keep files out of Netlify Forms and Sanity. The enhanced form first uploads the file privately, then submits the existing textual form with its file reference. Disable the file control until JavaScript initializes so native form submission never creates a public file URL. Reuse the reference on retries; report success only after both steps succeed. No-JavaScript contact submissions remain supported.
6. Use the current contact page as the visual reference: same label, field, optional marker, spacing and live status pattern. No other page-11/page-16 copy changes.
7. Add meaningful rejection/storage tests first; run all tests, clean build, live upload/readback and signed-out denial checks. Inspect the form in a browser. Publish behind the hold, verify all changes, and report missing materials separately.

Sources: https://docs.netlify.com/build/data-and-storage/netlify-blobs/ ; https://docs.netlify.com/build/functions/api/ ; https://www.sanity.io/docs/content-lake/manage-assets
