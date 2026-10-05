---
version: 1
slug: "src-app-svelte"
primary_target: "src/App.svelte"
related_targets: []
---

# Trip page (the travelogue)

Scope: the single scrolling page of the Iceland trip (`src/App.svelte` and its components). Mode: Experience. The trip's photos lead from the first viewport (a pile of every photo on the cover).

Audience and job: friends and family opening a shared link (mostly on phones) to feel the trip in a few minutes; the travellers reliving it. Phone and desktop are equally designed.

Constraints: nothing important hides behind a flip; every photo is reachable by scrolling or swiping a pile; trip content comes only from `content/trip.js`.

## Direction contract

THESIS: Each day of the trip arrives as a postcard spread sent home: a map card of the day's drive and a written back (postmark, a large picture stamp of the day's main photo, message, itinerary), followed by the day's photos as polaroids. It refuses the category default: a full-bleed hero, a sticky map, then alternating photo and text blocks.

OWN-WORLD: The ground is a pale, cool paper table the cards are laid out on (user revision: the all-blue ground was too much). Airmail blue survives in the title, the chevrons and the postmark ink. Crisp white card stock with real thickness and a soft offset shadow. Red, white and blue airmail chevrons edge every card back. Each day has one stamp colour sampled from its cover photo, by law, and that colour marks the day everywhere (stamp, postmark ink, map leg, nav marker). Every day has its own map card: the day's road route in its stamp colour, numbered stops matching the list, the coastline, and the rest of the trip faint for context (user revision: "I really like seeing the maps of the daily drives"). Perforated picture stamps carry a crop of the day's photo. Circular rubber-stamp postmarks carry measured facts. Archivo (width axis) is the only family: wide and heavy for the trip name and day titles, condensed caps for postmarks. No handwriting fonts, no tape, no cream paper.

STORY: The visitor sees the trip as a pile of photos and the island route at once. Scrolling deals one day at a time, each card gets postmarked, and the day's polaroids follow (a swipeable pile on phones, scattered on desktop). Any photo or map opens on a plain dark ground like a camera roll. They finish knowing where the travellers went, in what order, and what it looked like. The travellers can find every photo.

FIRST VIEWPORT: Phone: the trip name ("Iceland", wide and heavy, in airmail blue, by user request calmer than all-caps) with "ROADTRIP · 2026" stamped in red beside an airmail strip, the summary, then a pile of printed photos (every photo of the trip, the flag on top, by user request) to swipe through, then the trip map card. Desktop: the name across the top, the photo pile on the left, the summary and the map card (coastline, route in day colours, tappable day markers and index) on the right. No buttons; the map markers and index are the table of contents.

FORM: Postcards Home (picture postcards and airmail sent home), number 4 on the ordered list; seed key 911674c6. Signature interaction: a card dealt from the stack, settling to its rest angle as its day enters view, then the postmark stamped on with an ink thunk. A sticky postmark shows the current day and opens the day index. Code-led.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
