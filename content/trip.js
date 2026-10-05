// Iceland 2026: all of the trip's content. The page's code reads it from here.
//
// Photos live in ./media/ and are referenced relative to it. Mark one photo per
// day `cover: true` to put it on the postcard front (defaults to the first).
// Videos need a `poster` image. `stops` draw the route map and the Google Maps
// link; on days without a drive, give a single `place` instead. Stamp colours
// are sampled from each day's photos; `stamp: { hue }` overrides (OKLCH hue).

export default {
  title: 'Iceland',
  // The page heading (falls back to the title).
  heading: 'Iceland Roadtrip',
  year: 2026,
  travellers: ['Alex', 'Ting'],
  subdomain: 'iceland.pinkoa2.lol',
  // Distances on the page: 'mi' or 'km'.
  units: 'mi',
  // Region drawn behind the route maps (a Natural Earth country name).
  country: 'Iceland',
  // The front of the trip's top postcard and the link-preview image.
  cover: 'flag.jpg',
  coverAlt: 'The Icelandic flag against a clear blue sky',
  summary:
    'A week on the south of the island: the Golden Circle, the waterfalls of the south coast, a blue ice cave in the glacier, and black sand beaches.',

  days: [
    {
      title: 'Arrival & Blue Lagoon',
      description:
        'We arrived at Keflavík Airport, picked up the rental car, and made our way to the Blue Lagoon. After dropping off our stuff at the hostel we were staying at, we explored the town of Reykjavík.',
      stops: [
        { name: 'Keflavík Airport', lat: 63.9814869, lng: -22.6281862 },
        { name: 'Rental car', lat: 63.9970952, lng: -22.5864379 },
        { name: 'Blue Lagoon', lat: 63.8807176, lng: -22.4472964 },
        { name: 'CityHub Reykjavik', lat: 64.1460424, lng: -21.9276384 },
      ],
      media: [
        { src: 'day-1/rental-car.jpg', alt: 'Rental car', caption: 'Mazda CX-30' },
        { src: 'day-1/blue-lagoon-arrival.jpg', alt: 'Milky blue water between black lava rocks at the Blue Lagoon', caption: 'Blue Lagoon', cover: true },
        { src: 'day-1/blue-lagoon.jpg', alt: 'Selfie in the Blue Lagoon' },
        { src: 'day-1/cityhub-reykjavik.jpg', alt: 'Sleeping pods at CityHub', caption: 'CityHub Reykjavik' },
        { src: 'day-1/reykjavik-town.jpg', alt: 'A street in Reykjavík' },
        { src: 'day-1/hallgrimskirkja.jpg', alt: 'Hallgrímskirkja church at golden hour', caption: 'Hallgrímskirkja' },
      ],
    },
    {
      title: 'The Golden Circle',
      description:
        'We drove the Golden Circle, stopping at Öxarárfoss, Brúarfoss, Strokkur Geyser, Gullfoss, Faxafoss, and Kerið Crater, and ended our day at an Aurora Borealis glass igloo.',
      stops: [
        { name: 'CityHub Reykjavik', lat: 64.1460424, lng: -21.9276384 },
        { name: 'Öxarárfoss', lat: 64.2658062, lng: -21.117885 },
        { name: 'Brúarfoss', lat: 64.2643026, lng: -20.5157467 },
        { name: 'Strokkur Geyser', lat: 64.3127094, lng: -20.3007211 },
        { name: 'Gullfoss', lat: 64.3270716, lng: -20.1199478 },
        { name: 'Faxafoss', lat: 64.225735, lng: -20.3381288 },
        { name: 'Kerið Crater', lat: 64.0412785, lng: -20.8851466 },
        { name: 'Bónus, Selfoss', lat: 63.9381675, lng: -20.9737758 },
        { name: 'Aurora Igloo South', lat: 63.8351064, lng: -20.4215863 },
      ],
      media: [
        { src: 'day-2/oxararfoss.jpg', alt: 'Öxarárfoss', caption: 'Öxarárfoss' },
        { src: 'day-2/waterfall.jpg', alt: 'Waterfall with a rainbow', cover: true },
        { src: 'day-2/waterfall-video.mp4', alt: 'Waterfall', poster: 'day-2/waterfall-video-poster.jpg' },
        { src: 'day-2/bruarfoss.jpg', alt: 'Turquoise water at Brúarfoss', caption: 'Brúarfoss' },
        { src: 'day-2/strokkur-geyser.jpg', alt: 'Geysir field', caption: 'Strokkur Geyser' },
        { src: 'day-2/strokkur-eruption.mp4', alt: 'Strokkur eruption', poster: 'day-2/strokkur-eruption-poster.jpg' },
        { src: 'day-2/boiling.mp4', alt: 'Boiling mud pot', poster: 'day-2/boiling-poster.jpg' },
        { src: 'day-2/gullfoss.jpg', alt: 'Gullfoss', caption: 'Gullfoss' },
        { src: 'day-2/faxafoss.jpg', alt: 'Faxafoss', caption: 'Faxafoss' },
        { src: 'day-2/kerid-crater.jpg', alt: 'Kerið Crater', caption: 'Kerið Crater' },
        { src: 'day-2/aurora-igloo.jpg', alt: 'Aurora Igloo South', caption: 'Aurora Igloo South' },
      ],
    },
    {
      title: 'South Coast Waterfalls',
      description:
        'We visited Seljalandsfoss, Gljúfrabúi, and Skógafoss waterfalls, hiked out to the Sólheimasandur Plane Wreck, grabbed pizza in Vík, and ended the day at Skyrhúsið Guesthouse.',
      stops: [
        { name: 'Aurora Igloo South', lat: 63.8351064, lng: -20.4215863 },
        { name: 'Seljalandsfoss', lat: 63.6156232, lng: -19.9885688 },
        { name: 'Gljúfrabúi', lat: 63.6208631, lng: -19.9864486 },
        { name: 'Skógafoss', lat: 63.5320523, lng: -19.5113705 },
        { name: 'Sólheimasandur Plane Wreck', lat: 63.459104, lng: -19.364789 },
        { name: 'Black Crust Pizzeria, Vík', lat: 63.4176685, lng: -19.0027475 },
        { name: 'Skyrhúsið Guesthouse', lat: 64.1294078, lng: -16.0160555 },
      ],
      media: [
        { src: 'day-3/seljalandsfoss.jpg', alt: 'Seljalandsfoss', caption: 'Seljalandsfoss' },
        { src: 'day-3/seljalandsfoss-behind.jpg', alt: 'Behind Seljalandsfoss' },
        { src: 'day-3/gljufrabui.jpg', alt: 'Gljúfrabúi', caption: 'Gljúfrabúi' },
        { src: 'day-3/gljufrabui-bridge.mp4', alt: 'Gljúfrabúi', poster: 'day-3/gljufrabui-bridge-poster.jpg' },
        { src: 'day-3/skogafoss-ting.jpg', alt: 'Skógafoss with a rainbow', caption: 'Skógafoss' },
        { src: 'day-3/skogafoss-alex.jpg', alt: 'Skógafoss with a rainbow', caption: 'Skógafoss' },
        { src: 'day-3/solheimasandur-plane-wreck.jpg', alt: 'Sólheimasandur Plane Wreck', caption: 'Sólheimasandur Plane Wreck', cover: true },
        { src: 'day-3/skyrhusid-guesthouse.jpg', alt: 'Skyrhúsið Guesthouse', caption: 'Skyrhúsið Guesthouse' },
      ],
    },
    {
      title: 'Glacier Ice Caves',
      description:
        'A 6-hour hike on the glacier to explore blue ice caves. We made our way back to Vík, stopping at Diamond Beach along the way.',
      stops: [
        { name: 'Skyrhúsið Guesthouse', lat: 64.1294078, lng: -16.0160555 },
        { name: 'Diamond Beach', lat: 64.044334, lng: -16.1776622 },
        { name: 'Smiðjan Brugghús, Vík', lat: 63.4172849, lng: -19.0109195 },
      ],
      media: [
        { src: 'day-4/dark-cave.jpg', alt: 'Silhouettes inside the ice cave', cover: true },
        { src: 'day-4/both-ice-cave.jpg', alt: 'Ice cave' },
        { src: 'day-4/ting-ice-cave.jpg', alt: 'Ice cave' },
        { src: 'day-4/alex-blue-cave.jpg', alt: 'Blue ice cave' },
        { src: 'day-4/glacier-crack.jpg', alt: 'Breiðamerkurjökull Glacier', caption: 'Breiðamerkurjökull Glacier' },
        { src: 'day-4/glacier-ting.jpg', alt: 'Glacier' },
        { src: 'day-4/diamond-beach.jpg', alt: 'Diamond Beach', caption: 'Diamond Beach' },
      ],
    },
    {
      title: 'Reynisfjara & Vík',
      description:
        'We visited the town of Vík, grabbing crepes, coffee, and doing some local shopping. Then we made our way back to Reykjavík.',
      stops: [
        { name: 'The Barn', lat: 63.4359359, lng: -19.0622501 },
        { name: 'Reynisfjara Beach', lat: 63.4057404, lng: -19.0716193 },
        { name: 'Skool Beans', lat: 63.4203031, lng: -18.9813256 },
        { name: 'Vík í Mýrdal Church', lat: 63.4205017, lng: -19.0028796 },
        { name: 'Guesthouse Galtafell', lat: 64.1413119, lng: -21.9369935 },
      ],
      media: [
        { src: 'day-5/reynisfjara-beach.jpg', alt: 'Reynisfjara Beach', caption: 'Reynisfjara Beach', cover: true },
        { src: 'day-5/reynisfjara-beach-mountain.jpg', alt: 'Reynisfjara Beach and the sea stacks' },
        { src: 'day-5/reynisfjara-black-sand.jpg', alt: 'Basalt columns at Reynisfjara' },
        { src: 'day-5/vik-church.jpg', alt: 'Vík í Mýrdal Church', caption: 'Vík í Mýrdal Church' },
        { src: 'day-5/skool-beans.jpg', alt: 'Skool Beans, a café in an old school bus', caption: 'Skool Beans' },
        { src: 'day-5/skool-beans-inside.jpg', alt: 'Inside Skool Beans' },
        { src: 'day-5/yarn.jpg', alt: 'Shelves of yarn' },
      ],
    },
    {
      title: 'Last Day in Reykjavík',
      description:
        'A relaxed, slow day — shopping, lots of bakeries, and enjoying our last day in Iceland.',
      // A day without a drive: one place, shown on the map and linked to Google Maps.
      place: { name: 'Reykjavík', lat: 64.1466, lng: -21.9426 },
      media: [
        { src: 'day-6/street-cat.jpg', alt: 'Street cat' },
        { src: 'day-6/rainbow-street.jpg', alt: 'Rainbow street', cover: true },
        { src: 'day-6/restaurant.jpg', alt: 'Restaurant' },
      ],
    },
    {
      title: 'Heading Home',
      description:
        'Headed back to Keflavík Airport for our flight home, wrapping up an unforgettable trip.',
      stops: [
        { name: 'Reykjavík', lat: 64.1466, lng: -21.9426 },
        { name: 'Keflavík Airport', lat: 63.9814869, lng: -22.6281862 },
      ],
    },
  ],
}
