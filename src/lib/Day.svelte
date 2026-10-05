<script>
  import Postmark from './Postmark.svelte'
  import Stamp from './Stamp.svelte'
  import Prints from './Prints.svelte'
  import MapCard from './MapCard.svelte'
  import Icon from './Icon.svelte'

  // One day, sent home as a postcard: the printed back (postmark, a picture
  // stamp of the day's main photo, the message and the route) beside the
  // map of the day's drive, then all of the day's photos as polaroids.
  // `layout` puts the map on the left or the right on wide screens.
  let { day, trip, layout = 'left', onopen, onmap } = $props()

  let el
  let dealt = $state(false)
  const fmt = new Intl.NumberFormat('en')
  // Small per-day variations in tilt and placement.
  const v = [
    { m: 1.1, b: -0.8, y: '5vh' },
    { m: -1.5, b: 1.6, y: '11vh' },
    { m: 2, b: -1.4, y: '2vh' },
    { m: -0.9, b: 1.2, y: '8vh' },
  ][day.n % 4]
  const main = day.media[day.coverIndex] ?? null
  const photos = day.media.map((m, i) => ({ m, i }))
  const facts = day.dist
    ? `${fmt.format(day.dist)} ${trip.unit} · ${day.stops.length} stops`
    : [day.media.length ? `${day.media.length} photos` : null, trip.year].filter(Boolean).join(' · ')

  $effect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          dealt = true
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -18% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  })
</script>

<section
  bind:this={el}
  id={day.id}
  class="day {layout}"
  class:dealt
  style="--day: {day.colour.ink}; --day-wash: {day.colour.wash}; --tm: {v.m}deg; --tb: {v.b}deg; --by: {v.y}"
  aria-labelledby="{day.id}-title"
>
  <div class="pair">
    <article class="back">
      <div class="franking">
        <Postmark class="pm" top={day.place ?? trip.title} bottom={facts} label="DAY" figure={String(day.n)} ink="var(--day)" cancel waves={3} />
        {#if main}
          <button class="stamp-btn" type="button" onclick={() => onopen(day.coverIndex)} aria-label="Open photo{main.caption ? `: ${main.caption}` : ''}">
            <Stamp class="stamp" photo={main} colour={day.colour} value={String(day.n)} country={trip.title} />
          </button>
        {:else}
          <Stamp class="stamp" photo={trip.cover} colour={day.colour} value={String(day.n)} country={trip.title} />
        {/if}
      </div>

      <div class="message">
        <h2 id="{day.id}-title">{day.title}</h2>
        {#if day.description}<p>{day.description}</p>{/if}
      </div>

      {#if day.stops.length}
        <div class="address">
          <ol class="stops" aria-label="Route">
            {#each day.stops as s, i}
              <li>
                <a href={day.stopLinks[i]} target="_blank" rel="noopener" aria-label="{s}, open in Google Maps">
                  <span class="i">{i + 1}</span><span class="stop">{s}</span><Icon name="arrow-out" size={15} class="out" />
                </a>
              </li>
            {/each}
          </ol>
        </div>
      {:else if day.place}
        <div class="address">
          <ol class="stops" aria-label="Where">
            <li>
              <a href={day.stopLinks[0]} target="_blank" rel="noopener" aria-label="{day.place}, open in Google Maps">
                <span class="i dot" aria-hidden="true"></span><span class="stop">{day.place}</span><Icon name="arrow-out" size={15} class="out" />
              </a>
            </li>
          </ol>
        </div>
      {/if}
    </article>

    {#if day.map}
      <MapCard {day} unit={trip.unit} onopen={onmap} class="map" />
    {/if}
  </div>

  {#if photos.length}
    <Prints items={photos} {onopen} />
  {/if}
</section>

<style>
  .day {
    position: relative;
    /* Cards and polaroids layer among themselves, never over the road or nav. */
    isolation: isolate;
    max-width: 1240px;
    margin: 0 auto;
    padding: clamp(72px, 11vw, 150px) var(--gutter) 0;
  }
  /* Phones: more breathing room, and a lane on the right for the trip road. */
  @media (max-width: 959px) {
    .day {
      padding-inline: 26px 46px;
    }
  }

  .pair {
    display: grid;
    margin-bottom: clamp(40px, 5vw, 72px);
  }

  /* ---------- back ---------- */
  .back {
    position: relative;
    z-index: 2;
    justify-self: center;
    width: 100%;
    max-width: 620px;
    padding: 20px 20px 22px;
    color: var(--ink);
    background: var(--card);
    box-shadow: var(--shadow-card);
    rotate: var(--tb);
    border: 9px solid transparent;
    border-image: repeating-linear-gradient(
        -45deg,
        var(--airmail-red) 0 9px,
        var(--card) 9px 16px,
        var(--airmail-blue) 16px 25px,
        var(--card) 25px 32px
      )
      9;
    transition:
      rotate 900ms var(--ease-out),
      translate 900ms var(--ease-out);
  }

  .pair :global(.map) {
    position: relative;
    z-index: 1;
    justify-self: center;
    width: calc(100% - 6px);
    max-width: 640px;
    margin-top: 22px;
    rotate: var(--tm);
    transition:
      rotate 900ms var(--ease-out) 90ms,
      translate 900ms var(--ease-out) 90ms;
  }

  /* The picture stamp carries the day's main photo, big enough to read. */
  .franking {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    height: 196px;
    margin-bottom: 12px;
  }
  .franking :global(.stamp) {
    width: 150px;
    rotate: 2deg;
  }
  .stamp-btn {
    position: relative;
    z-index: 1;
    padding: 0;
    border: 0;
    background: none;
    cursor: zoom-in;
    transition:
      rotate 300ms var(--ease-out),
      scale 300ms var(--ease-out);
  }
  .stamp-btn:hover {
    rotate: -2deg;
    scale: 1.04;
  }
  /* The circle sits left of the stamp; its cancellation lines run over it. */
  .franking :global(.pm) {
    position: absolute;
    z-index: 2;
    top: 30px;
    right: 108px;
    width: 152px;
    rotate: -6deg;
    opacity: 0.9;
    mix-blend-mode: multiply;
    pointer-events: none;
    transform-origin: 23% 50%;
  }

  h2 {
    font-size: clamp(1.7rem, 3.4vw, 2.6rem);
    font-stretch: 125%;
    font-weight: 850;
    line-height: 0.98;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    text-wrap: balance;
  }
  .message p {
    margin-top: 14px;
    font-size: 1.0625rem;
    line-height: 1.6;
    max-width: 60ch;
    text-wrap: pretty;
  }

  .address {
    margin-top: 22px;
  }
  .stops {
    border-top: 1px solid var(--rule);
  }
  .stops li {
    border-bottom: 1px solid var(--rule);
    font-size: 0.98rem;
    font-weight: 560;
    line-height: 1.3;
  }
  /* Every stop opens on its own in Google Maps. */
  .stops a {
    display: flex;
    gap: 12px;
    align-items: baseline;
    min-height: 40px;
    padding: 9px 2px 7px;
    text-decoration: none;
    transition: background 200ms;
  }
  .stop {
    flex: 1;
  }
  .stops a :global(.out) {
    align-self: center;
    color: var(--on-ground-faint);
    opacity: 0.55;
    transition:
      opacity 200ms,
      color 200ms,
      translate 200ms var(--ease-out);
  }
  .stops a:hover,
  .stops a:focus-visible {
    background: var(--card-shade);
  }
  .stops a:hover .stop,
  .stops a:focus-visible .stop {
    color: var(--day);
  }
  .stops a:hover :global(.out),
  .stops a:focus-visible :global(.out) {
    opacity: 1;
    color: var(--day);
    translate: 2px -2px;
  }
  .i {
    flex: none;
    width: 1.4em;
    font-stretch: 75%;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
    color: var(--day);
  }
  .dot::before {
    content: '';
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--day);
    translate: 0 -2px;
  }

  /* ---------- the deal ---------- */
  :global(.motion) .day:not(.dealt) .back {
    translate: -8% 80px;
    rotate: -8deg;
  }
  :global(.motion) .day:not(.dealt) .pair :global(.map) {
    translate: 8% 90px;
    rotate: 7deg;
  }
  :global(.motion) .day:not(.dealt) .franking :global(.pm) {
    opacity: 0;
  }
  :global(.motion) .day.dealt .franking :global(.pm) {
    animation: stamp 520ms var(--ease-out) 620ms backwards;
  }
  @keyframes stamp {
    0% {
      opacity: 0;
      scale: 1.6;
      rotate: -16deg;
    }
    55% {
      opacity: 0.95;
      scale: 0.94;
    }
    100% {
      opacity: 0.9;
      scale: 1;
      rotate: -6deg;
    }
  }

  /* ---------- wide: the back and the map side by side ---------- */
  @media (min-width: 960px) {
    .back {
      padding: 26px 30px 28px;
    }
    .franking {
      height: 258px;
    }
    .franking :global(.stamp) {
      width: 200px;
    }
    .franking :global(.pm) {
      width: 220px;
      top: 50px;
      right: 150px;
    }
    .pair {
      grid-template-columns: 1fr 1fr;
      grid-template-areas: 'back map';
      align-items: start;
    }
    .right .pair {
      grid-template-areas: 'map back';
    }
    .back {
      grid-area: back;
      justify-self: end;
    }
    .pair :global(.map) {
      grid-area: map;
      justify-self: start;
      width: 100%;
      margin: var(--by) 0 0 -4%;
    }
    .right .back {
      justify-self: start;
    }
    .right .pair :global(.map) {
      justify-self: end;
      margin: var(--by) -4% 0 0;
    }
    :global(.motion) .right:not(.dealt) .back {
      translate: 8% 80px;
      rotate: 8deg;
    }
    :global(.motion) .right:not(.dealt) .pair :global(.map) {
      translate: -8% 90px;
      rotate: -7deg;
    }
  }
</style>
