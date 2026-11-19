# Correct the cached HostGator origin

The main-domain DNS records now identify Netlify, but the owner's recursive resolver retains the previous HostGator A record. The old shared WordPress installation responds to main-domain requests with a real HTTP 301 to its new shop URL. Direct-origin checks did not establish normal-browser success; the earlier completion claim was incorrect.

The owner explicitly requested fixing the main domain and verifying the result in a browser. Keep the approved Netlify/WooCommerce split. While old DNS answers remain cached, route exact main/www requests on HostGator through a fixed-origin HTTPS bridge to the same Netlify site. The address bar stays on the main domain. Shop requests continue through WordPress. Do not modify the owner's network settings, disable TLS checks, open previews or copy WordPress credentials into Netlify.

Implementation: `tools/hostgator-transition.php`, installed as `zomedia-netlify-bridge.php` in the existing WordPress document root. Prefix `.htaccess` with an exact main/www host rule before WordPress routing. Fixed HTTPS origin with explicit Netlify IP, certificate validation, no followed redirects, no incoming credentials/cookies forwarded, bounded POST bodies, no-store responses and no WordPress fallback on upstream failure. Preserve the original `.htaccess` in the existing private backup folder before mutation. The bridge is temporary compatibility for cached DNS; normal fresh DNS continues directly to Netlify.

1. Reproduce normal main-domain 301 and compare old/new origins and resolver answers.
2. Verify bridge syntax and host/path/method guards on HostGator before activating its rewrite rule; save a fresh `.htaccess` backup.
3. Activate exact-host rule. Verify old-origin and normal DNS home/books/assets return Netlify HTML; verify shop product remains unchanged. Submit one controlled contact test through the cached-origin route.
4. Open the plain main-domain URL in the browser. Confirm the built site's heading and URL; click a book and verify the corresponding shop product; return to the main site and save screenshot proof.
5. Record evidence and commit the reviewed tools/runbook. Remove the bridge only after pre-cutover DNS caches are no longer relevant; restore the captured `.htaccess` prefix without overwriting subsequent edits.

Rollback: remove only the marked transition rewrite block to restore the previous `.htaccess`; the shop installation and DNS records remain unchanged. A failed bridge activation must be rolled back before reporting status. Do not claim completion without the ordinary browser check.

## Execution evidence

Completed November 19, 13:05–13:10 Eastern. PHP 8.3.37/cURL verified; syntax check and 12 guard checks passed. A direct bridge execution fetched the expected Netlify homepage with TLS verification enabled before activation. Original `.htaccess` is retained privately at `/home1/ubfsf/zo-migration-backups/20261119-main-route-fix/.htaccess-before`; private bridge/test source copies remain alongside it. The only rewrite addition is the marked exact main/www host block before the existing shop HTTPS and WordPress rules.

The corrected cached origin returns 200 for main home/books and three sampled CSS/JS assets, all seven product destinations match, and legacy product URLs return 307 to the shop. Shop product responses remain 200 from WordPress. Contact POST through the bridge was captured as `6aff3ac97336c8f3c934a1a4`; the first immediate API read preceded visibility, and a later read confirmed capture.

Chrome initially retained the old 301. Added `Clear-Site-Data: "cache"` on bridge homepage GETs, visited a fresh homepage query to receive that header, then navigated to the plain root URL. Chrome and the in-app browser both showed `https://zomediaproductions.com/` and “The stories that matter most are told from inside.” Chrome homepage book click reached `https://shop.zomediaproductions.com/product/domestic-genocide/`. Cookies and local storage were retained. Screenshots and structured evidence are in ignored `output/launch/2026-11-19/`.

Do not remove this bridge simply because the local resolver expires; other clients may retain old answers longer. After the transition, verify both authoritative records and ordinary browser behavior before removing only the marked block. Preserve unrelated `.htaccess` changes and the shop HTTPS rule.
