# Trailmark

Scroll-down travelogues built with Svelte 5 + Vite, one static site per trip. Iceland 2026 is the first trip, live at `iceland.pinkoa2.lol`.

## Read first

- `PRODUCT.md`: who it's for, what it must do, constraints, the content workflow.
- `DESIGN.md`: the design system ("Postcards Home"): tokens, components, rules. Keep it true to the code.
- `.impeccable/surfaces/src-app-svelte.md`: the page's design plan (direction contract).
- `README.md`: how to run, build, add a trip, deploy.

## Layout of the repo

- `trips/<id>/trip.js` is the only place trip content lives (title, heading, year, units, days, stops, captions, main photos). Media sits in `trips/<id>/media/day-N/`. `routes.json` caches road routes (commit it).
- `scripts/prepare-trip.js` runs before dev/build: resizes photos to WebP, fetches and caches OSRM routes, draws maps from Natural Earth, samples day colours, builds Google Maps links, writes `og.jpg` and `CNAME`. Its output goes to `.trailmark/<id>/` (gitignored).
- `src/` is the engine. Nothing trip-specific may be hardcoded there.
- Deploy: `.github/workflows/deploy.yml` builds `TRIP=iceland-2026` and publishes to GitHub Pages on every push to `main`, so pushing to `main` updates the live site.

## Working with the user

- Go step by step and check in on design decisions; the user guides the direction and likes to see options before big changes.
- The user mostly views on a phone (dev server: `npm run dev -- --host`, then the LAN URL). Check both phone and desktop widths.
- Photo captions: go one photo at a time, propose a caption, and let the user answer "keep", "skip" or give their own text. Don't batch.
- Main photos: when asked, offer a numbered list per day (open a numbered contact sheet) and let the user pick by number.
- Never invent places, dates or claims in content. No trip dates beyond the year are recorded.
- Compress media before adding (see README); `-strip` also removes GPS data.
- Keep `DESIGN.md`, `PRODUCT.md`, `README.md` and this file current when decisions change.
