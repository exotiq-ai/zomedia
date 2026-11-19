# Live review verification and public coming-soon hold

Owner request: test all seven live book destinations, forms and page controls, establish readiness for internal review, then restore the existing coming-soon landing page. Payment activation and editorial approval remain separate; do not announce or send messages to the team on the owner's behalf.

1. Click every home book card in a browser and verify its matching WooCommerce product. Crawl live pages/resources and test contact validation/success, newsletter handoff, book filters, navigation menus and media controls. Record concrete failures and limitations.
2. Add `PUBLIC_LAUNCH_HOLD=true` support to the existing preview-host predicate. Reuse the existing landing/password gate and host-bound sessions. Keep commerce compatibility redirects and the WooCommerce shop working. Add regression tests before implementation.
3. The temporary cached-origin bridge must forward only the dedicated signed preview cookie and same-origin Origin header, and return its matching Set-Cookie and noindex response headers. Do not forward WordPress authentication. Test guards and PHP syntax before replacing the bridge.
4. Verify tests/build in a clean checkout, review, deploy main and activate the public hold. Check anonymous homepage/deep links show coming soon, reviewer login opens the full site, forms still capture while authenticated, and logout restores the hold. Save a browser screenshot of the final public landing page.
5. Report readiness for internal review accurately, including sales/editorial limitations and the tested scope. Leave the public page in coming-soon mode and provide the review entry point without exposing the password in committed files.
