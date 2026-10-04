<script>
  // The whole trip on one map: coastline, every day's road route in its stamp
  // colour, and numbered markers that jump to each day.
  let { overview, days } = $props()
  const colourOf = (n) => days[n - 1].colour
</script>

<svg class="map" viewBox="0 0 {overview.w} {overview.h}" role="img" aria-label="Map of the route, coloured by day">
  <rect class="sea" width={overview.w} height={overview.h} />
  {#if overview.land}<path class="land" d={overview.land} />{/if}
  {#each overview.routes as r}
    <path class="route-under" d={r.d} />
  {/each}
  {#each overview.routes as r}
    <path class="route" d={r.d} style="stroke: {colourOf(r.day).ink}" />
  {/each}
  {#each overview.markers as m}
    <a href="#day-{m.day}" aria-label="Day {m.day}: {days[m.day - 1].title}">
      <g class="marker" transform="translate({m.at[0]} {m.at[1]})">
        <circle r="21" style="fill: {colourOf(m.day).ink}" />
        <text y="8" text-anchor="middle">{m.day}</text>
      </g>
    </a>
  {/each}
</svg>

<style>
  .map {
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .sea {
    fill: var(--sea);
  }
  .land {
    fill: var(--land);
    stroke: var(--land-edge);
    stroke-width: 1.5;
    stroke-linejoin: round;
  }
  .route-under,
  .route {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .route-under {
    stroke: var(--card);
    stroke-width: 13;
  }
  .route {
    stroke-width: 6;
  }
  .marker circle {
    stroke: var(--card);
    stroke-width: 4;
    transition: r 250ms var(--ease-out);
  }
  .marker text {
    fill: #fff;
    font-size: 23px;
    font-stretch: 112%;
    font-weight: 800;
  }
  a:hover circle,
  a:focus-visible circle {
    r: 26;
  }
  a:focus-visible {
    outline: none;
  }
  a:focus-visible circle {
    stroke: var(--focus);
  }
</style>
