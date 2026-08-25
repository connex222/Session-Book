# The Session Book

50 football training drills as a static site. No build step, no dependencies.

## Publishing on GitHub Pages

**The files in this folder must sit at the root of the repository (or of `docs/`).**
If the repo contains a `session-book/` folder with everything inside it, GitHub will
serve the repo root, find no `index.html`, and return 404. That is the usual cause.

1. Create a repository, e.g. `session-book`.
2. Upload **the contents of this folder** — `index.html`, `about.html`, `404.html`,
   `robots.txt`, `sitemap.xml`, `.nojekyll`, and the `assets/`, `drills/` and `og/`
   folders. Not the folder itself.
3. Repo **Settings → Pages**. Source: *Deploy from a branch*. Branch: `main`,
   folder: `/ (root)`. Save.
4. Wait a minute, then open `https://USERNAME.github.io/REPO/`.

## If you still get a 404

- `index.html` is not at the published root — check step 2.
- Pages source is set to `/docs` but the files are at the root, or the reverse.
- The branch you pushed to is not the branch Pages is deploying from.
- The first build has not finished. Check the Actions tab.
- URLs are case-sensitive on GitHub Pages. Every file here is lowercase; keep it that way.

## Before you publish

`SITE` and `BASE` in the generator are currently set to a placeholder. The canonical
tags, Open Graph URLs and `sitemap.xml` all point at `https://connex222.github.io/Session-Book`.
Replace that with your real Pages URL or search engines will be told the
canonical version of every page lives somewhere that does not exist.

## Structure

- `index.html` — the library, with search and filters
- `drills/*.html` — one page per session
- `about.html` — author page, the E-E-A-T anchor
- `404.html` — served by GitHub Pages for unknown paths
- `.nojekyll` — stops Jekyll processing the files
- `assets/` — shared CSS and JS, cached across all pages
- `og/` — social share images, one per session
