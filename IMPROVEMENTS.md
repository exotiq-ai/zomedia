# Zo Media Productions — Improvement Roadmap

**Current Rating: 7.5/10**
**Target: 9+**

---

## Priority 1: Content (Placeholder Cleanup)

- [ ] Replace placeholder staff bios with real team member names, roles, and photos
- [ ] Replace placeholder board member entries with actual board of directors
- [ ] Replace placeholder advisory board entries with real advisors
- [ ] Verify all book descriptions match actual published blurbs
- [ ] Add real testimonials or press quotes if available
- [ ] Review "The Phuckin' Wire" page content — ensure newsletter description and back issues are accurate
- [ ] Verify donation tier amounts and descriptions match actual giving levels
- [ ] Update contact form action — confirm Netlify form handling is wired up on deploy
- [ ] Review Special Projects page — confirm project names, descriptions, and links

## Priority 2: Branding

- [ ] New logo — current logo is low-res and hard to read even at 64px; needs a clean vector version
- [ ] Favicon — currently using a copied file; should match new logo
- [ ] OG image for social sharing — currently using storefront.jpg; create a branded card
- [ ] Consistent social media links in footer — verify URLs are correct

## Priority 3: Visual Polish

- [ ] Staff/Board/Advisory pages — add headshot photos or illustrated avatars (currently text-only cards)
- [ ] The Wire page — add a background hero image (currently hero--minimal with no visual)
- [ ] Books page — verify all book covers display correctly in the grid
- [ ] Film Projects subpages (Screenplays, Theatrical Works, Documentaries) — add content and imagery
- [ ] Gallery page equivalent — the old site had one; consider adding a visual gallery of art/exhibitions
- [ ] Add a "100 Stories" or "Hundred Stories" page if that content still exists
- [ ] Consider adding author bios/profiles for featured writers

## Priority 4: Mobile & Responsive

- [ ] Visual QA at 480px (phone) — test all pages
- [ ] Visual QA at 768px (tablet) — test all pages
- [ ] Test hamburger menu functionality on mobile
- [ ] Verify book cover grid stacks properly on small screens (4-col → 2-col → 1-col)
- [ ] Check hero background images crop well on mobile viewports
- [ ] Test contact form usability on mobile

## Priority 5: Performance & SEO

- [ ] Optimize hero-ivan.jpg (922x1630, likely large file) — compress or serve responsive sizes
- [ ] Optimize book cover images — some are oversized PNGs that could be compressed JPEGs
- [ ] Add structured data for books (Schema.org Book type) for search visibility
- [ ] Add structured data for Organization with full details
- [ ] Verify sitemap-index.xml includes all 15 pages
- [ ] Test Lighthouse scores (target 90+ on all metrics)
- [ ] Add canonical URLs to prevent duplicate content issues
- [ ] Confirm robots.txt allows proper crawling

## Priority 6: Functionality

- [ ] Wire up newsletter subscription form (The Wire) to actual email service (Mailchimp, ConvertKit, etc.)
- [ ] Wire up contact form — test Netlify form submissions
- [ ] Wire up donation buttons to actual payment processor (Stripe, PayPal, etc.)
- [ ] Add Google Analytics or privacy-respecting analytics (Plausible, Fathom)
- [ ] Consider adding a blog/news section for updates
- [ ] Book purchase links — each book card should link to where readers can actually buy

## Priority 7: Animations & Interaction

- [ ] Fine-tune scroll reveal timing — test staggered delays for grid items
- [ ] Add subtle hover animations to team/staff cards
- [ ] Consider a book carousel on homepage instead of static grid (optional)
- [ ] Add page transition animations between routes (optional, Astro View Transitions)
- [ ] Counter animation on stats section — verify it triggers on scroll into view

## Priority 8: Accessibility

- [ ] Run full WCAG 2.1 AA audit with axe or Lighthouse
- [ ] Verify all images have meaningful alt text (not just "book cover")
- [ ] Test keyboard navigation through all interactive elements
- [ ] Verify focus styles are visible on dark backgrounds
- [ ] Test with screen reader (VoiceOver on Mac)
- [ ] Ensure color contrast passes on all text/background combinations

---

## What Gets Us to 9+

The gap between 7.5 and 9 is mostly **real content replacing placeholders** and **the logo**. The design system, typography, color palette, and editorial tone are all working. Once real team photos, verified book data, and a proper logo are in place, plus a mobile QA pass, this site will be production-ready and distinctive.
