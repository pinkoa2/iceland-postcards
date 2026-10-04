---
name: Trailmark
description: Each trip told home as postcard spreads (photo front, day map, written back) laid out on a pale paper table.
colors:
  title: "#1b3a8c"
  airmail-red: "#d4332b"
  airmail-blue: "#2347b0"
  ground: "#e4e7e2"
  ground-shade: "#d6dad3"
  on-ground: "#1b2032"
  on-ground-soft: "#4c5368"
  on-ground-faint: "#6e7488"
  card: "#fcfcfa"
  card-shade: "#eceee9"
  ink: "#1b2032"
  ink-soft: "#50576e"
  rule: "#d5d9df"
  sea: "#e1eaf3"
  land: "#f6f5ef"
  land-edge: "#b7c1cf"
  context-route: "#c3c9d4"
  focus: "#e0a100"
typography:
  display:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 10vw, 4rem)"
    fontWeight: 620
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 104"
  headline:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)"
    fontWeight: 850
    lineHeight: 0.98
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  printed:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(0.8rem, 1.6vw, 1rem)"
    fontWeight: 800
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 112"
  lead:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  title:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  label:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 650
    letterSpacing: "0.18em"
    fontVariation: "'wdth' 75"
  caption:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 550
    lineHeight: 1.3
rounded:
  none: "0px"
  full: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  print-gap: "16px"
  print-row-gap: "22px"
  day-gap: "clamp(72px, 11vw, 150px)"
  index-row: "46px"
components:
  postcard-front:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.none}"
    padding: "9px"
  postcard-front-wide:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.none}"
    padding: "13px"
  postcard-back:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "20px 20px 22px"
  postcard-back-wide:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "26px 30px 28px"
  day-map-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 10px 0"
  print:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.none}"
    padding: "5px"
  index-row:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    height: "46px"
  index-row-hover:
    backgroundColor: "{colors.card-shade}"
  daynav-mark:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.full}"
    size: "64px"
  daynav-mark-wide:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.full}"
    size: "76px"
  lightbox-button:
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    size: "48px"
---

# Design System: Trailmark

## Overview

**Creative North Star: "Postcards Home"**

Every trip is a bundle of picture postcards and airmail sent home, laid out on a pale, cool paper table. The trip's name is lettered across the top in airmail blue. Each day arrives as a three-card spread: a photo front with an even white border and the place printed across it, a map card showing that day's drive, and a printed back carrying a rubber-stamp postmark, a perforated picture stamp, the message and the itinerary. All the cards lie together, overlapping, never hidden behind a flip. All of the day's photos (the front one included) follow as polaroids: on phones, one swipeable pile; on wider screens, tipped out onto the table: masonry columns, each photo at its natural shape, each polaroid at its own small angle, overlapping its neighbours. A winding road at the right edge fills day by day in each day's ink as you scroll, with a red map pin marking where you are.

The world is physical but crisp: near-white card stock with real thickness, light navy-tinted paper shadows on the table, red-white-blue airmail chevrons around every card back, and rubber-stamp ink with uneven pressure. One type family, Archivo, does all the lettering by moving along its width axis: expanded heavy caps for place names, condensed tracked caps for postal marks and measured facts. Colour comes from the trip itself. Each day gets one stamp colour sampled from its own photos, and that colour marks the day everywhere it appears, including its route on the map.

The engine runs many trips, so the system is defined by roles and rules, not by any one country. The table, the card stock, the title blue and the airmail chevrons stay fixed. Day colours, stamps, maps and place names are generated per trip.

**Key Characteristics:**
- Pale cool paper table with a faint fibre; every surface on it is a piece of card stock or a print.
- Airmail blue is lettering and ink, not a field: the title, the chevrons, the trip postmark.
- Each day is a spread of front, map card and back, overlapping at small rest angles.
- One generated stamp colour per day, used for every mark belonging to that day.
- Archivo only, with the width axis carrying the hierarchy (125% place names, 75% postal caps).
- Square-cornered paper, circular marks.
- Motion is the deal: cards settle to their rest angle and the postmark lands with an ink thunk.

## Colors

A fixed airmail palette (pale table, near-white card, blue lettering, red and blue chevrons) plus one generated ink per day. `color-scheme: light`.

### Primary
- **Airmail Title** (title): the trip-level blue lettering. The trip title and the text selection fill (with white text).

### Secondary
- **Airmail Red** (airmail-red) and **Airmail Blue** (airmail-blue): the chevron border on every card back and on the trip map card, always together, alternating with card-white. Airmail Blue also inks the trip postmark on the cover map card.

### Tertiary: the day colour (generated)
- **Day Ink** (`--day`, `oklch(0.5 C H)`): one per day, generated at build time from that day's photos. It fills the stamp's tint, inks the day's postmark, draws the day's route and pins on its map card and on the trip map, colours the number discs, the itinerary numerals and dots, the Google Maps link and the day nav mark. Chroma is the photo's sampled chroma times 1.6, held between 0.11 and 0.17. Lightness is fixed at 0.5, so white numerals on it and it as text on card both stay legible.
- **Day Wash** (`--day-wash`, `oklch(0.93 C×0.28 H)`): generated and exposed alongside the ink, but not used by any component yet. It is the reserved tint for that day if a surface needs one.

### Neutral
- **Paper Table** (ground): the field the whole page lies on, under a faint navy-tinted fractal-noise fibre (6% alpha) so it reads as a material, not a flat fill. Cool and slightly green-grey.
- **Table Shade** (ground-shade): the scrollbar track.
- **Table Ink** (on-ground): the summary and body text lying directly on the table. Same value as Print Ink.
- **Soft Table Ink** (on-ground-soft): bylines, print captions and quiet links on the table.
- **Faint Table Ink** (on-ground-faint): the scrollbar thumb and counters on the table.
- **Card Stock** (card): every postcard, map card, print and dropdown; also the casing under map routes and the fill of open pins. Near-white, never cream.
- **Card Shade** (card-shade): the hover fill on index rows and the paper edge under prints.
- **Print Ink** (ink): all text on card stock.
- **Faded Ink** (ink-soft): secondary facts on card (distances, map captions).
- **Hairline** (rule): 1px rules between itinerary stops and index rows, and the frame around a map.
- **Sea** (sea), **Land** (land) and **Coast** (land-edge): the map palette on both the trip map and day map cards.
- **Other Days** (context-route): the rest of the trip's routes on a day map card, drawn faint for context.
- **Signal Amber** (focus): the 3px focus outline. It is the only warm non-day colour, and it is used only for focus.

### Named Rules
**The One Stamp Colour Rule.** Each day has exactly one ink, and anything that belongs to that day (stamp, postmark, map route, pins and leader lines, number disc, itinerary numerals, route link, nav mark) uses it. No other colour marks a day, and a day's ink never appears on another day's marks; on a day's map, other days are Other Days grey.

**The Clear Of Airmail Rule.** Day hues are sampled from the photos and must sit outside the airmail blue range (hues 205–300 in OKLCH, which is 215–290 plus 10° of margin), so a day's marks never read as the trip-level blue of the title, chevrons and trip postmark. They are spread as far apart as the photos allow, aiming for at least 40°. If a day's photos give no usable hue, it is nudged up to 45° from its own photo hues, then falls back to a fixed list. A trip author can override a day's colour; the rules still apply around it.

**The Fixed Table Rule.** The table, card stock, title blue and chevrons are the same on every trip. A new trip's photo palette changes the day inks, never the table or the stationery.

## Typography

**Display Font:** Archivo Variable (with Archivo, system-ui)
**Body Font:** Archivo Variable
**Label Font:** Archivo Variable at 75% width

**Character:** One grotesque family set like postal print. Expanded black caps for anything that names a place, condensed tracked caps for anything a post office would stamp, and plain regular-width text for the message.

### Hierarchy
- **Display** (620, 104% width, sentence case, line-height 1, −0.03em, Airmail Title): the trip heading (`heading` in trip.js, e.g. "Iceland Roadtrip") at the top of the cover. Calm, not shouting: no capitals, no heavy weight (desktop from 960px: `clamp(3.6rem, 5.4vw, 5.6rem)`).
- **Headline** (850, 125% width, uppercase, balanced wrap): the day title on each card back.
- **Printed** (800, 112% width, uppercase, 0.08em tracking, white with a soft dark text-shadow): the place name printed across the bottom of a photo front, on one line with an ellipsis.
- **Lead** (400): the trip summary under the byline on the table, `text-wrap: pretty`, max 38rem.
- **Body** (400, line-height 1.6, max 60ch): the message on a card back.
- **Title** (600): day names in the trip index and the nav dropdown. Itinerary stops use 0.98rem at 560.
- **Label** (650–750, 75% width, uppercase, tracked 0.06–0.3em): bylines, distances, map captions (distance and stops), postmark rings, the stamp's trip line, the nav mark's DAY label, lightbox counters. Numerals are tabular.
- **Caption** (550): print captions on the table, in Soft Table Ink.
- **Number discs and pins** (800, 112% width on discs, 100% on map pins): day numbers in the index, nav list and trip map markers (white on Day Ink); stop numbers on day map pins (Day Ink on card, white on filled end pins).

### Named Rules
**The Width Axis Rule.** Hierarchy comes from width before size: 125% for place names and big figures, 112% for printed captions and number discs, 75% for postal caps and facts, 100% for prose. Don't add a second family; move along the axis.

**The Postal Caps Rule.** Uppercase is for lettering that would be printed or stamped (titles, place names, postmark text, labels of fact). The message and itinerary stay in sentence case.

## Layout

Single scrolling column of days on the table, gutters of `clamp(16px, 4vw, 56px)`. The cover is capped at 1520px wide, days at 1320px. Days are separated by `clamp(72px, 11vw, 150px)` of open table, and each day's spread has `clamp(40px, 5vw, 72px)` below it before its prints.

**Phone (below 960px):** day sections take 26px on the left and 46px on the right (a lane for the trip road), and each day's cards stack in order: the front (up to 640px), the map card laid over the front's bottom edge (6px, 4px narrower), then the back 26px below (10px narrower, up to 620px), then the polaroid pile. On the cover: title, then byline and summary, then the photo stack, then the trip map card tucked 28px under the stack.

**Wide (960px and up):** each day picks one of four spreads from its front photo.
- **left / right** (portrait front): the front spans two rows on one side (1.05fr against 1fr); the map card sits beside it, dropped by a per-day offset (3–14vh) and pulled 6% over the front; the back lies 22px below the map, inset 3%. The map and back go on the side the photo's subject isn't on; a centred subject takes the other side from the day before.
- **stacked** (landscape front, wider than 1.15:1): the front across the top at up to `min(900px, 78%)`; the map card and back in two columns below, the map pulled 10% up over the front's lower edge and the back dropped 6%.
- **solo** (no photo): the map card and back side by side, the back dropped 8vh and overlapping by 3%.

Where the map overlaps the front's left edge (right, stacked), the printed place name aligns right. On the cover, the stack takes the left column (1.1fr) and the byline and trip map card share the right, the map card overlapping the stack by 12%.

**Polaroids:** a swipeable pile under 700px; scattered masonry columns (three) from 700px. Nothing scrolls sideways.

**The Side By Side Rule.** Every card of a day's spread (front, map, back) is visible together. Nothing important sits behind a flip, a tap or a hover.

## Elevation & Depth

Depth is physical paper, not UI elevation. Every card shows its own edge (two 1px solid steps in pale grey) and then casts a light, layered navy-tinted shadow onto the table. Cards rest at small angles (±1–9°) so the overlaps read as a spread of real cards; within a spread the back sits above the map, the map above the front. Ink marks (postmarks) sit on the paper with `mix-blend-mode: multiply` at about 0.9 opacity, not above it.

### Shadow Vocabulary
- **Card stock** (`--shadow-card`): postcard fronts and backs, map cards, the cover stack, the nav dropdown, lightbox media, and prints on hover. The card's two-step edge plus three soft navy-tinted shadows (10–28% alpha) of increasing spread.
- **Print** (`--shadow-print`): prints at rest (under a 1px Card Shade edge) and the day nav mark. A 1px edge and a shorter, thinner drop.
- **Stamp**: two small navy drop-shadows on the perforated stamp, so the perforations cast.
- **Printed caption**: a soft dark text-shadow under white lettering on photos, for legibility only.

### Named Rules
**The Paper Not Panels Rule.** Shadows are always navy-tinted (rgb 22 32 64 on cards and prints), light, and always describe paper lying on the table. No neutral grey UI shadows, no glow.

**The Lift On Hover Rule.** Hovering paper lifts it 4px and, on prints, swaps the print shadow for the card shadow. The cover's top card also turns 1° toward straight.

## Shapes

Paper is rectangular with square corners (0). Circles are for marks: postmarks, number discs, map pins and markers, the day nav mark, the lightbox buttons, the play badge. The stamp is a 100 × 124 sheet with perforation holes every 8 units, a white margin and the day's picture panel. The airmail chevron is a 9px `border-image` of -45° stripes (red 9px, card 7px, blue 9px, card 7px). Map routes are round-capped and round-joined over a wider card-coloured casing. Rubber-stamp marks are drawn in SVG through a turbulence mask, so their edges break up like real ink.

**The Square Paper, Round Ink Rule.** Never round the corners of a card or print. Roundness belongs only to things that are stamped, pressed or pinned.

## Components

### Postcard Front
A picture postcard. Card stock with an even border (9px, 13px from 960px), photo cropped to cover (max 74svh, 78vh wide), the place name in Printed type at the bottom (right-aligned where the map overlaps its left edge). Opens the lightbox (`cursor: zoom-in`). Rests at a per-day angle.

### Day Map Card
The day's drive on its own card, present on every day with map data. Card stock, 10px border on three sides, the map framed by a 1px Hairline. Sea fills the frame; land in Land with a 1.2px Coast edge; the trip's other routes in Other Days grey (3px); this day's route in Day Ink (5.5px) over a 12px card-coloured casing. Numbered pins match the stop list on the back: open pins are card-filled with a 3px Day Ink ring and Day Ink numerals (r 14); the start and end pins are filled Day Ink with a card ring and white numerals (r 17). When pins are nudged apart, a 1.5px Day Ink leader runs from a small Day Ink anchor dot at the true location. A day without a route shows a single filled pin with a white centre. The whole map is a link to the day's route in Google Maps: on hover or focus the card lifts 4px and a Day Ink tag, "Open in Google Maps" with an outward arrow, appears top right. The caption row below (min 46px) holds the distance (in the trip's `units`, miles for Iceland) and stop count in condensed caps (Faded Ink) and "Open in Google Maps" with an outward arrow in Day Ink, underlined at 40% until hover.

### Postcard Back
The written side. Card stock with the airmail chevron border, Print Ink text. The franking row along the top holds the stamp (86px, 104px wide) and, to its left, the day postmark with wavy cancellation lines running over the stamp. Then the headline, the message and the itinerary (numbered stops between hairlines, numerals in Day Ink; a Day Ink dot for a single place).

### Postmark
A circular rubber stamp in SVG: the place around the top, measured facts around the bottom, a condensed label and an expanded big figure in the centre, optional wavy cancellation. Inked in the day colour on card backs, Airmail Blue for the whole trip on the cover map card. Only true measured facts go in the rings.

### Stamp
A perforated picture stamp: a crop of the day's front photo (the trip cover on photo-less days), multiplied with 28% Day Ink, inside a white perforated margin. A white value numeral top left and the trip title in condensed caps, in Day Ink, along the bottom margin.

### Instant Film (all polaroids)
Polaroids are their own paper, not card stock: `--polaroid` #f8f8f4 under a faint fibre noise and a slight top-to-bottom shading (`--polaroid-paper`), with a 1px hairline at the edge (6% navy). The photo sits slightly recessed: a 1px inner line and a soft inner shadow at the top, under a very faint diagonal gloss. The bottom strip carries the caption on the left (ellipsis when long) and a frame number on the right, like a film counter: `2 · 05` (day · photo) in postal caps at 0.7rem, in Day Ink, after a 5px dot. Polaroids without a caption still show the frame number, so the strip never reads as blank.

### Polaroid Pile (phones, under 700px)
All of the day's photos as one pile of identical polaroids (photo window about 1:1.06, filled by the photo; 8px border; 42px caption strip; card up to 340px wide), centred. The top polaroid sits at half its scatter angle with the card shadow; the next three peek out behind it, fanned to alternate sides (about +8.5°/+24px, −9.5°/−26px, +4°/+12px, plus each card's own jitter), at −4/12/22px vertically and 1.5% smaller per place. Swipe left (over 70px) flicks the top one off and brings up the next; swipe right brings the previous one back on top; vertical scrolling passes through. Below: the counter in postal caps (3 / 11) beside a faint hint, "Try swiping left and right" (0.8rem, Faint Table Ink). No arrow buttons; arrows appear only in the full-screen lightbox. The arrow keys flip the pile when the top polaroid has focus. A tap without a drag opens the lightbox with the full, uncropped photo. With reduced motion, cards change without flying.

### Polaroids (700px and up)
Card stock with a 7px border (10px wide) and the thick polaroid bottom strip (34px, 46px wide), the caption written in that strip in Soft Ink. They sit in three masonry columns (from 700px; phones get the pile). Each photo keeps its natural aspect and drops into the shortest column, so order reads left to right. Each polaroid has a stable scatter seeded from its file name: up to ±4.2° of rotation, up to ±7% sideways off its column, a random stacking order, and a slight overlap with the one above (−14px phone, −6px wide). Hover or focus straightens it, scales it 1.03 and brings it to the top. Videos show a 52px card-white play badge in the centre. Every polaroid opens the lightbox.

### Trip Road (progress)
A winding road fixed at the right edge (vertically centred, clear of the day postmark above it) (66vh, max 580px), shown once the cover has scrolled away. It is drawn in SVG as an irregular winding line (drifting frequency, a swing that grows and shrinks into near-straight stretches, and a slight wobble): 72px wide on desktop (30px in from the edge) and 28px on phones (8px in), with a #c6cbc3 road (10px desktop, 6px phone) and a dashed card-white centre line. The road is split by length into one equal stretch per day; each stretch fills with that day's ink as the reader moves through the day. A disc marks each day's start on the road: hollow before, filled with Day Ink once reached. Desktop discs are 25px and numbered, with a card-stock tooltip of the day title opening to the left on hover or focus; phone discs are 11px dots. A red map pin (Airmail Red teardrop with a card-white outline and centre, 29 × 39 desktop, 19 × 25 phone) stands upright with its point on the road at the exact progress point.

### Trip Map Card (cover)
Card stock with the airmail chevrons, the trip's land in Land and Coast on Sea, the route drawn in each day's ink over a 13px card-white underlay, and numbered day markers that grow on hover or focus (focus turns the marker's ring Signal Amber). The trip postmark sits over open sea. Under the map, a faint hint ("Tap a day to jump to it", 0.8rem) and an index of days: number disc, name, distance and a chevron, in 46px rows between hairlines. On hover or focus the row takes Card Shade, the name and chevron turn Day Ink, and the chevron nudges 3px right. The markers and the index are the trip's table of contents; there are no buttons.

### Day Nav
A fixed postmark-style disc in the top right (64px, 76px wide) that appears once the first day is reached. Card stock with two inset rings in the current day's ink, a condensed DAY label over the expanded day number, and the print shadow. The colour crossfades over 400ms as days change. It opens a card-stock dropdown listing the days (number discs, the current day in its ink).

### Lightbox
A native `<dialog>` over a 94% deep-navy backdrop with a 10px blur. Media gets a 6px card-white border and the card shadow. Counter in condensed tabular caps, caption beside it, in white. Round 48px buttons in translucent white (10%, 22% on hover). Arrows sit at mid-height, moving to the bottom edge under 640px. Swipe and arrow keys step through, Escape closes.

### Motion
One easing for everything: `cubic-bezier(0.16, 1, 0.3, 1)`. **The deal:** as a day enters view, the front settles from about 9° off and 70px low over 900ms, the map card follows 45ms later (from 6° off, 80px low) and the back 90ms later (from 8° off, 90px low). At 620ms the postmark strikes (520ms: in at 1.6× scale, overshoots to 0.94, lands at its rest angle). All of this is gated on `prefers-reduced-motion`; without motion, cards simply sit at rest and the postmark is already there.

## Do's and Don'ts

### Do:
- **Do** put every surface on the table as paper: card stock (card) with `--shadow-card`, or a print with `--shadow-print`.
- **Do** edge every card back, and the trip map card, with the red, white and blue airmail chevron (9px).
- **Do** give every day with map data its own map card: its route in `--day` over a card casing, other days in Other Days grey, pins numbered to match the stop list, end pins filled.
- **Do** take each day's colour from the build's generated `--day` ink and use it for every mark belonging to that day.
- **Do** keep day hues outside OKLCH 205–300 and spread them as far apart as the photos allow (aim for 40°).
- **Do** set place names in Archivo at 125% width, black weight, uppercase; set postal facts in Archivo at 75% width, tracked caps, tabular numerals.
- **Do** rest cards and prints at small varied angles and let the cards of a spread overlap.
- **Do** keep ink marks multiplied into the paper (`mix-blend-mode: multiply`, about 0.9 opacity) with broken rubber-stamp edges.
- **Do** keep every photo reachable as a front or a print, each opening the lightbox.

### Don't:
- **Don't** use handwriting or script fonts, tape, or cream or aged paper; the card stock is near-white (card).
- **Don't** flood the ground with airmail blue; the table is pale (ground) and blue stays in the title, chevrons and trip postmark.
- **Don't** add a second type family; move along Archivo's width axis instead.
- **Don't** round the corners of cards or prints.
- **Don't** hide any card of a day's spread behind a flip, hover or tap.
- **Don't** use a day's ink for another day, or a fixed brand accent where a day colour belongs.
- **Don't** let a trip's photos change the table, card stock, title blue or chevrons.
- **Don't** use grey or glowing shadows; shadows are light navy-tinted paper shadows.
- **Don't** use Signal Amber (focus) for anything except focus.
