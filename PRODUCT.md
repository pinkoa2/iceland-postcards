# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Svelte (user preference: "I love svelte"). Plain Svelte + Vite unless routing needs justify SvelteKit with a static adapter. Fully static output, no backend, no API keys.

## Users

Two audiences, weighted equally:

- **Friends and family**, opening a shared link on their phone (group chat, social). They skim the highlights of the trip in a few minutes.
- **The travellers themselves** (Alex and Ting), using the site as a keepsake to relive the trip later, so completeness and detail matter too.

Phone and desktop are weighted equally: each gets a deliberately designed layout, not one stretched from the other. The link will most often be shared from and opened on a phone (chats, social), so the link preview (title, image, description) is part of the product.

## Product Purpose

Trailmark turns one trip into a scroll-down travelogue: a single page that tells the trip day by day as a journey, with routes, short write-ups, photos and videos. Success means a friend scrolls to the end and feels the trip, and the travellers want to come back to it.

Trailmark is a reusable engine, not a one-off. Iceland 2026 is the first trip; future trips (e.g. Taiwan) get added as content, not as new code.

## Positioning

A personal, journey-shaped record of one specific trip: the route across the map, in the order it happened, told through the travellers' own photos. It is not a photo dump, a social feed or a generic blog template.

## Operating Context

- **One repo, many trips.** The engine lives once; each trip is a content folder (one data file plus its media), e.g. `trips/iceland-2026/`. A design fix reaches every trip.
- **Each trip deploys to its own subdomain** of `pinkoa2.lol` (domain at Porkbun): `iceland.pinkoa2.lol` is live today from the old `trailmark` repo, and future trips follow the same pattern (`taiwan.pinkoa2.lol`). Builds take a trip identifier and produce one standalone static site. The exact host (GitHub Pages per-trip repos vs. Cloudflare/Netlify projects) is not decided yet.
- **Content workflow (from the prior project):** photos are dropped into a per-day folder and named in lowercase-hyphenated form after their confirmed caption. Captions are assigned one photo at a time with the user ("keep / skip / replace"). Media is compressed before commit (auto-orient, max 2000px, EXIF/GPS stripped, quality 85). Videos are kept as-is, with ffmpeg poster frames.

## Capabilities and Constraints

- Per-day sections: day number + short title, a short description, a route map, and a gallery of photos and videos with optional captions.
- Days may have no map (rest days, travel home) and may have no photos.
- **Maps:** custom-drawn route maps in the site's own style, built from stop coordinates (the Iceland stop lat/lngs are recoverable from the old Google Maps embed URLs), plus an "Open in Google Maps" link per day. No paid map APIs or keys.
- Videos play on demand and only fetch when opened; posters show in the page.
- Full-screen viewing of photos and videos with swipe and keyboard navigation.
- Must perform well on phones: responsive image sizes, no loading the whole trip's full-resolution media up front.
- Captions and alt text must stay accurate to the confirmed content. Don't invent place names or claims.

## Evidence on Hand

Iceland 2026 content, sourced from `../trailmark` (`src/App.svelte`, `public/photos/`):

- 7 days, with titles and descriptions already written: 1 Arrival & Blue Lagoon, 2 The Golden Circle, 3 South Coast Waterfalls, 4 Glacier Ice Caves, 5 Reynisfjara & Vík, 6 Last Day in Reykjavík (no map), 7 Heading Home (no map, no photos).
- 38 compressed photos and 4 videos with posters (3 on day 2, 1 on day 3), with confirmed captions and filenames.
- Route stops for days 1 to 5, inside the Google Maps embed URLs.
- `banner.jpg`, the Icelandic flag. It was used as the old hero; it doesn't have to be the hero.
- No trip dates are recorded beyond "2026". Don't invent exact dates.

## Product Principles

1. **The trip is the interface.** Photos, places and the route lead; UI chrome recedes.
2. **A journey, not a list.** Show progression through space and time, so the reader always knows where on the trip they are.
3. **Skimmable and complete.** A friend can get the highlights in minutes; the travellers can find every photo.
4. **Content, not code.** Adding a trip means adding a folder. Nothing Iceland-specific is hardcoded in the engine.
5. **Fast on a phone over cellular.**
