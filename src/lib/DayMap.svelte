<script>
  // A day's drive drawn as a map: coastline, the rest of the trip faint, this
  // day's road route in its colour, numbered stops matching the card back.
  // Used on the map card and, large, in the photo viewer.
  let { day } = $props()
  const map = day.map
</script>

<svg class="daymap" style="--day: {day.colour.ink}" viewBox="0 0 {map.w} {map.h}" role="img" aria-label="Map of day {day.n}: {day.stops.length ? day.stops.join(', ') : day.place}">
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

<style>
  .daymap {
    display: block;
    width: 100%;
    height: auto;
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
</style>
