# Iceland Postcards

Our 2026 Iceland roadtrip as a scroll-down travelogue, built with Svelte 5 + Vite as one static site, live at `iceland.pinkoa2.lol`. It is Iceland-only: future trips get their own projects and designs, so nothing here needs to be reusable.

## Read first

- `PRODUCT.md`: who it's for, what it must do, constraints, the content workflow.
- `DESIGN.md`: the design system ("Postcards Home"): tokens, components, rules. Keep it true to the code.
- `.impeccable/surfaces/src-app-svelte.md`: the page's design plan (direction contract).
- `README.md`: how to run, build, edit the content, deploy.

## Layout of the repo

- `content/trip.js` is the only place trip content lives (title, heading, year, units, days, stops, captions, main photos). Media sits in `content/media/day-N/`. `routes.json` caches road routes (commit it).
- `scripts/prepare-trip.js` runs before dev/build: resizes photos to WebP, fetches and caches OSRM routes, draws maps from Natural Earth, samples day colours, builds Google Maps links, writes `og.jpg` and `CNAME`. Its output goes to `.generated/` (gitignored).
- `src/` is the page. Keep words, places and photos in `content/`, not in components.
- Deploy: `.github/workflows/deploy.yml` builds the site and publishes `dist/` to GitHub Pages on every push to `main`, so pushing to `main` updates the live site.

## Working with the user

- Go step by step and check in on design decisions; the user guides the direction and likes to see options before big changes.
- The user mostly views on a phone (dev server: `npm run dev -- --host`, then the LAN URL). Check both phone and desktop widths.
- Photo captions: go one photo at a time, propose a caption, and let the user answer "keep", "skip" or give their own text. Don't batch.
- Main photos: when asked, offer a numbered list per day (open a numbered contact sheet) and let the user pick by number.
- Never invent places, dates or claims in content. No trip dates beyond the year are recorded.
- Compress media before adding (see README); `-strip` also removes GPS data.
- Keep `DESIGN.md`, `PRODUCT.md`, `README.md` and this file current when decisions change.
