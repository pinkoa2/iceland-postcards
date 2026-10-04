# Trailmark

Scroll-down travelogues. Each trip is a bundle of postcards sent home, one per day: the photo on the front, and the route, story and postmark on the back, followed by the rest of the day's photos as loose prints.

One repo holds the engine; each trip is just a folder of content.

```
trips/
  iceland-2026/
    trip.js        the content: title, days, stops, captions
    media/day-N/   photos and videos (already compressed)
    routes.json    cached road routes (generated, commit it)
```

## Run a trip

```bash
npm install
npm run dev                      # the only trip, or…
TRIP=iceland-2026 npm run dev    # …pick one when there are several
TRIP=iceland-2026 npm run build  # → dist/iceland-2026/
```

`npm run dev` and `npm run build` first run `scripts/prepare-trip.js`, which:

- resizes every photo into responsive WebP sizes (480/960/1600) with blurred placeholders
- fetches each day's real road route once from the public OSRM server and caches it in `trips/<id>/routes.json`, so builds never hit the network again
- draws the overview map and each day's stamp map from Natural Earth coastlines
- samples each day's stamp colour from its photos (override with `stamp: { hue }` in `trip.js`)
- writes the link-preview image (`og.jpg`) and fills the page title and description

## Add a trip

```bash
npm run new-trip -- taiwan-2027
```

Then drop photos into `trips/taiwan-2027/media/day-N/`, fill in `trip.js`, and run `TRIP=taiwan-2027 npm run dev`.

- **Photos:** compress before adding: `magick in.jpg -auto-orient -resize '2000x2000>' -strip -quality 85 out.jpg`. `-strip` also removes GPS data.
- **Videos:** need a poster frame: `ffmpeg -ss 1 -i clip.mp4 -frames:v 1 clip-poster.jpg`.
- **Stops:** `{ name, lat, lng }` in driving order. In Google Maps, right-click a place to copy its coordinates. Leave `stops` out on days without a drive.
- **Units:** `units: 'mi'` or `'km'` in `trip.js` sets how distances read.
- **Main photo:** mark one photo per day with `cover: true` to put it on the day's picture stamp. The trip's `cover` is the top postcard and the link preview.

## Deploying

Each trip builds to a standalone static site in `dist/<id>/`, with a `CNAME` written from the trip's `subdomain`. Iceland deploys from this repo to GitHub Pages at `iceland.pinkoa2.lol` via `.github/workflows/deploy.yml` (builds `TRIP=iceland-2026`) on every push to `main`.

For a second trip on its own subdomain: GitHub Pages allows one custom domain per repository, so serving several subdomains from this single repo needs one of:

1. **Cloudflare Pages / Netlify:** one project per trip, all pointing at this repo, each with build command `TRIP=<id> npm run build`, output `dist/<id>`, and its own custom domain. Free, simplest.
2. **GitHub Pages via per-trip repos:** CI builds each trip and pushes `dist/<id>` to a small `trailmark-<id>` repo whose Pages site carries the subdomain.
