# Zo Media Productions

Static website for Zo Media Productions, LLC — a media cooperative
publishing literature, film, and art by incarcerated creators.
A subsidiary of UBFSF (501(c)(3)).

## Stack

Pure static HTML5 + CSS + vanilla JS. No frameworks. No build step.

## Local Dev

Open any `.html` file in a browser, or run a local server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Push to `main`. Netlify auto-deploys (config in `netlify.toml`).
Forms post to Netlify's built-in form handler.

## Structure

- `*.html` — 10 pages, one per route
- `css/` — `reset`, `variables`, `global`, `components`, `pages`
- `js/` — one file per concern (nav, carousel, gallery, counter, forms)
- `assets/` — icons (SVG), images (books, team, gallery, blog, heroes)

## Pages

1. Home (`index.html`)
2. Our Story (`our-story.html`)
3. The Hundred Stories Project (`hundred-stories.html`)
4. Bookstore (`bookstore.html`)
5. The Phuckin' Wire (`the-wire.html`)
6. Art Gallery (`gallery.html`)
7. Get Involved (`get-involved.html`)
8. Support Us (`support.html`)
9. Blog & News (`blog.html`)
10. Contact (`contact.html`)
