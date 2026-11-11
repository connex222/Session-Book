# CLAUDE.md - The Session Book

Instructions for AI assistants working in this repository.

## What this is

The Session Book is a static website of 50 football training sessions and drills for grassroots coaches, with 70 hand-drawn SVG diagrams, learning pathways and a session planner.

- Live: https://connex222.github.io/Session-Book/ (GitHub Pages, branch `main`, root folder)
- The paid product built from this material is **Cones & Bibs** (conesandbibs.com, hosted on Cloudflare). That is a separate project and is not deployed from this repository.

## Architecture

| Part | Location |
|---|---|
| Home, about, 404 | `index.html`, `about.html`, `404.html` |
| One page per drill | `drills/` |
| Learning pathways | `pathways.html`, `pathways/` |
| Session planner | `planner.html` |
| Shared CSS, JS, diagrams | `assets/` |
| Social-share images | `og/` |
| SEO files | `sitemap.xml`, `robots.txt` |

There is no build step. Old version notes and an obsolete v3 build script are in `docs/history/`; do not use them.

## Project rules

- **File names must stay lowercase.** GitHub Pages URLs are case-sensitive.
- Canonical links, Open Graph URLs and `sitemap.xml` use `https://connex222.github.io/Session-Book`. Update all three if a page is added, renamed or removed.
- Diagrams are original SVGs drawn for this site. Never add third-party or watermarked images.
- Use correct UK grassroots football terms and follow FA guidance for age groups.
- No external scripts, fonts or analytics.

## Working with Shaun (the owner)

- Shaun is not a programmer. Explain every step in plain English, in order, and assume no prior knowledge.
- Always return complete files, never partial snippets or "..." placeholders.
- Use UK English.
- Never delete files to tidy up; move old notes into `docs/` instead.
- Never force-push, rewrite history or rename the repository.
