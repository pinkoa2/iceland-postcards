---
version: 1
slug: "src-app-svelte"
primary_target: "src/App.svelte"
related_targets: []
---

# Trip page (the travelogue)

Scope: the single scrolling page every trip builds to (`src/App.svelte` and its components). Mode: Experience. The trip's photos lead from the first viewport.

Audience and job: friends and family opening a shared link (mostly on phones) to feel the trip in a few minutes; the travellers reliving it. Phone and desktop are equally designed.

Constraints: nothing important hides behind a tap or flip; every photo is reachable without opening anything; trip content comes only from `trips/<id>/trip.js`.

## Direction contract

THESIS: Each day of the trip arrives as a postcard spread sent home: its photo front, its map card and its printed back (postmark, stamp, message, itinerary), all laid out together. It refuses the category default: a full-bleed hero, a sticky map, then alternating photo and text blocks.

OWN-WORLD: The ground is a pale, cool paper table the cards are laid out on (user revision: the all-blue ground was too much). Airmail blue survives in the title, the chevrons and the postmark ink. Crisp white card stock with real thickness and a soft offset shadow. Red, white and blue airmail chevrons edge every card back. Each day has one stamp colour sampled from its cover photo, by law, and that colour marks the day everywhere (stamp, postmark ink, map leg, nav marker). Every day has its own map card: the day's road route in its stamp colour, numbered stops matching the list, the coastline, and the rest of the trip faint for context (user revision: "I really like seeing the maps of the daily drives"). Perforated picture stamps carry a crop of the day's photo. Circular rubber-stamp postmarks carry measured facts. Archivo (width axis) is the only family: expanded heavy for place-name lettering, condensed caps for postmarks. No handwriting fonts, no tape, no cream paper.

STORY: The visitor sees the trip as a bundle of postcards and the island route at once. Scrolling deals one day at a time, each card gets postmarked, and the day's prints spill out below. They finish knowing where the travellers went, in what order, and what it looked like. The travellers can find every photo.

FIRST VIEWPORT: Phone: the trip title in expanded blue lettering (moderate size, by user request), the byline and summary below, then the cover postcard (the Icelandic flag, by user request) tilted on a visible stack of the other days' card edges. The map card peeks under the stack's fold. Desktop: the title spans the top, the cover postcard is tilted on the left (about 55% width), and the map card (Iceland coastline, route in day colours, tappable day markers) is tilted on the right, overlapping. No buttons; the map markers are the index.

FORM: Postcards Home (picture postcards and airmail sent home), number 4 on the ordered list; seed key 911674c6. Signature interaction: a card dealt from the stack, settling to its rest angle as its day enters view, then the postmark stamped on with an ink thunk. A sticky postmark shows the current day and opens the day index. Code-led.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
