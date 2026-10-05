<script>
  import Icon from './Icon.svelte'
  import DayMap from './DayMap.svelte'

  // The day's drive on its own card. Tapping the map opens it large in the
  // viewer, like a photo; the caption links out to Google Maps.
  let { day, unit = 'km', onopen, class: cls = '' } = $props()
  const fmt = new Intl.NumberFormat('en')
  const label = day.dist ? `${fmt.format(day.dist)} ${unit} · ${day.stops.length} stops` : day.place
</script>

<figure class="mapcard {cls}">
  <button class="mapview" type="button" onclick={onopen} aria-label="View the map of day {day.n} full screen">
    <DayMap {day} />
  </button>
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
    width: 100%;
    padding: 0;
    border: 1px solid var(--rule);
    background: none;
    cursor: zoom-in;
  }
  .mapcard:has(.mapview:hover),
  .mapcard:has(.mapview:focus-visible) {
    translate: 0 -4px;
    box-shadow: var(--shadow-card), 0 18px 30px -18px rgb(22 32 64 / 0.3);
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
