<script>
  import Icon from './Icon.svelte'

  // The day's drive on its own card: coastline, the rest of the trip faint,
  // this day's road route in its stamp colour, numbered stops that match the
  // list on the card back.
  let { day, unit = 'km', class: cls = '' } = $props()

  const map = day.map
  const fmt = new Intl.NumberFormat('en')
  const label = day.dist ? `${fmt.format(day.dist)} ${unit} · ${day.stops.length} stops` : day.place
</script>

<figure class="mapcard {cls}">
  <svelte:element
    this={day.gmaps ? 'a' : 'div'}
    class="mapview"
    href={day.gmaps}
    target={day.gmaps ? '_blank' : undefined}
    rel={day.gmaps ? 'noopener' : undefined}
    aria-label={day.gmaps ? `Open day ${day.n}'s route in Google Maps` : undefined}
  >
  <svg viewBox="0 0 {map.w} {map.h}" role="img" aria-label="Map of day {day.n}: {day.dist ? day.stops.join(', ') : day.place}">
    <rect width={map.w} height={map.h} class="sea" />
    {#if map.land}<path class="land" d={map.land} />{/if}
    {#each map.context as d}<path class="context" {d} />{/each}
    {#if map.route}
      <path class="casing" d={map.route} />
      <path class="route" d={map.route} />
    {/if}
    {#each map.pins as pin}
      {#if pin.x !== pin.ax || pin.y !== pin.ay}
        <line class="leader" x1={pin.ax} y1={pin.ay} x2={pin.x} y2={pin.y} />
        <circle class="anchor" cx={pin.ax} cy={pin.ay} r="4" />
      {/if}
      <g transform="translate({pin.x} {pin.y})">
        {#if map.route}
          <circle class="pin" class:end={pin.end} r={pin.end ? 17 : 14} />
          <text class="pin-n" y={pin.end ? 6.5 : 5.5} font-size={pin.end ? 18 : 15}>{pin.n}</text>
        {:else}
          <circle class="pin end" r="11" />
          <circle r="4" fill="#fff" />
        {/if}
      </g>
    {/each}
  </svg>
  {#if day.gmaps}
    <span class="open" aria-hidden="true">Open in Google Maps <Icon name="arrow-out" size={15} /></span>
  {/if}
  </svelte:element>
  <figcaption>
    <span class="label">{label}</span>
    {#if day.gmaps}
      <a href={day.gmaps} target="_blank" rel="noopener">Open in Google Maps <Icon name="arrow-out" size={16} /></a>
    {/if}
  </figcaption>
</figure>

<style>
  .mapcard {
    position: relative;
    padding: 10px 10px 0;
    background: var(--card);
    box-shadow: var(--shadow-card);
    color: var(--ink);
  }
  .mapcard {
    transition:
      translate 300ms var(--ease-out),
      box-shadow 300ms var(--ease-out);
  }
  .mapview {
    position: relative;
    display: block;
  }
  a.mapview {
    cursor: pointer;
  }
  svg {
    width: 100%;
    height: auto;
    border: 1px solid var(--rule);
  }
  /* A tag that appears over the map on hover: the map is the link. */
  .open {
    position: absolute;
    top: 10px;
    right: 10px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 10px;
    font-size: 0.8rem;
    font-weight: 650;
    color: #fff;
    background: var(--day);
    box-shadow: var(--shadow-print);
    opacity: 0;
    translate: 0 -4px;
    transition:
      opacity 250ms var(--ease-out),
      translate 250ms var(--ease-out);
  }
  .mapcard:has(a.mapview:hover),
  .mapcard:has(a.mapview:focus-visible) {
    translate: 0 -4px;
    box-shadow: var(--shadow-card), 0 18px 30px -18px rgb(22 32 64 / 0.3);
  }
  a.mapview:hover .open,
  a.mapview:focus-visible .open {
    opacity: 1;
    translate: none;
  }
  .sea {
    fill: var(--sea);
  }
  .land {
    fill: var(--land);
    stroke: var(--land-edge);
    stroke-width: 1.2;
    stroke-linejoin: round;
  }
  .context {
    fill: none;
    stroke: var(--context-route);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .casing,
  .route {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .casing {
    stroke: var(--card);
    stroke-width: 12;
  }
  .route {
    stroke: var(--day);
    stroke-width: 5.5;
  }
  .leader {
    stroke: var(--day);
    stroke-width: 1.5;
  }
  .anchor {
    fill: var(--day);
  }
  .pin {
    fill: var(--card);
    stroke: var(--day);
    stroke-width: 3;
  }
  .pin.end {
    fill: var(--day);
    stroke: var(--card);
  }
  .pin-n {
    text-anchor: middle;
    font-stretch: 100%;
    font-weight: 800;
    fill: var(--day);
  }
  .end + .pin-n {
    fill: #fff;
  }
  figcaption {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 4px 16px;
    min-height: 46px;
    padding: 6px 4px;
  }
  .label {
    font-stretch: 75%;
    font-weight: 700;
    font-size: 0.86rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
    font-variant-numeric: tabular-nums;
  }
  a {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 36px;
    font-weight: 650;
    font-size: 0.92rem;
    color: var(--day);
    text-decoration: underline;
    text-decoration-color: color-mix(in oklch, var(--day) 40%, transparent);
  }
  a:hover {
    text-decoration-color: currentColor;
  }
</style>
