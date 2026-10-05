# Iceland Postcards

Our 2026 Iceland roadtrip as a scroll-down travelogue, told as a bundle of postcards sent home: a pile of every photo to flick through on the cover, then one spread per day with a map of the day's drive and a written back (postmark, picture stamp, story, stops), followed by the day's photos as polaroids. Any photo or map opens in a full-screen, camera-roll style viewer.

Live at [iceland.pinkoa2.lol](https://iceland.pinkoa2.lol).

```
content/
  trip.js        the content: title, heading, days, stops, captions
  media/day-N/   photos and videos (already compressed)
  routes.json    cached road routes (generated, commit it)
src/             the page (Svelte 5)
scripts/         prepare-trip.js, the build-time media and map step
```

## Run it

```bash
npm install
npm run dev -- --host   # dev server, with a LAN URL for phones
npm run build           # → dist/
```

`npm run dev` and `npm run build` first run `scripts/prepare-trip.js`, which writes to `.generated/` (gitignored):

- resizes every photo into responsive WebP sizes (480/960/1600) with blurred placeholders
- fetches each day's real road route once from the public OSRM server and caches it in `content/routes.json`, so builds never hit the network again
- draws the trip map and each day's map from Natural Earth coastlines
- builds a Google Maps link for each day's route and for every single stop
- samples each day's stamp colour from its photos (override with `stamp: { hue }` in `trip.js`)
- writes the link-preview image (`og.jpg`), the `CNAME`, and fills the page title and description

## Editing the content

Everything on the page comes from `content/trip.js`.

- **Photos:** compress before adding: `magick in.jpg -auto-orient -resize '2000x2000>' -strip -quality 85 out.jpg`. `-strip` also removes GPS data. Drop them into `content/media/day-N/`.
- **Videos:** need a poster frame: `ffmpeg -ss 1 -i clip.mp4 -frames:v 1 clip-poster.jpg`.
- **Stops:** `{ name, lat, lng }` in driving order. In Google Maps, right-click a place to copy its coordinates. On a day without a drive, give a single `place: { name, lat, lng }` instead.
- **Heading:** `heading` is the page title; its first word is lettered large and the rest sits with the `year` underneath.
- **Main photo:** mark one photo per day with `cover: true` to put it on the day's picture stamp. The trip's `cover` is the top of the cover pile and the link preview.

## Deploying

`.github/workflows/deploy.yml` builds the site and publishes `dist/` to GitHub Pages at `iceland.pinkoa2.lol` on every push to `main`. The `CNAME` is written from `subdomain` in `trip.js`.
