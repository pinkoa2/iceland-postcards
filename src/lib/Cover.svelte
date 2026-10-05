<script>
  import PolaroidDeck from './PolaroidDeck.svelte'
  import Postmark from './Postmark.svelte'
  import OverviewMap from './OverviewMap.svelte'
  import Icon from './Icon.svelte'

  // The bundle as it arrives: the trip's name lettered on the envelope, a pile
  // of printed photos (every photo of the trip, the cover on top) to flick
  // through, and the map card that indexes the days.
  // `photos` is the whole trip in order, as { m, i } for the viewer.
  let { trip, photos, onopen } = $props()

  const fmt = new Intl.NumberFormat('en')
  const t = trip.totals
  // The heading's first word is lettered large; the rest rides with the year.
  const [place, ...kindWords] = trip.heading.split(' ')
  const kind = kindWords.join(' ')
  const ringTop = [trip.title, trip.year].filter(Boolean).join(' · ')
</script>

<header class="cover">
  <h1 class="title">
    <span class="place">{place}</span>
    {#if kind || trip.year}
      <span class="kind">
        <span class="chevron" aria-hidden="true"></span>
        {#if kind}<span>{kind}</span>{/if}
        {#if kind && trip.year}<span class="sep" aria-hidden="true">·</span>{/if}
        {#if trip.year}<span class="year">{trip.year}</span>{/if}
      </span>
    {/if}
  </h1>

  <div class="bundle">
    <div class="sub">
      {#if trip.summary}<p class="summary">{trip.summary}</p>{/if}
    </div>

    <div class="stack">
      <PolaroidDeck items={photos} {onopen} variant="print" ratio={1.32} maxW={500} inset={84} />
    </div>

    <nav class="card mapcard" aria-label="Days of the trip">
      <Postmark
        class="mapmark"
        top={ringTop}
        bottom="{fmt.format(t.dist)} {trip.unit} · {t.stops} stops"
        label="DAYS"
        figure={String(t.days)}
        ink="var(--airmail-blue)"
      />
      <OverviewMap overview={trip.overview} days={trip.days} />
      <p class="jump">Tap a day to jump to it</p>
      <ol class="index">
        {#each trip.days as d}
          <li style="--day: {d.colour.ink}">
            <a href="#{d.id}">
              <span class="num">{d.n}</span>
              <span class="name">{d.title}</span>
              <span class="km">{d.dist ? `${fmt.format(d.dist)} ${trip.unit}` : ''}</span>
              <Icon name="chevron-right" size={18} class="go" />
            </a>
          </li>
        {/each}
      </ol>
    </nav>
  </div>
</header>

<style>
  .cover {
    position: relative;
    isolation: isolate;
    padding: clamp(28px, 5vw, 64px) var(--gutter) 0;
    max-width: 1520px;
    margin: 0 auto;
  }

  .title {
    display: grid;
    gap: 10px;
    color: var(--title);
  }
  .place {
    font-size: clamp(3rem, 15vw, 5rem);
    font-stretch: 118%;
    font-weight: 760;
    line-height: 0.9;
    letter-spacing: -0.035em;
  }
  /* The kind of trip and its year, stamped in red beside a strip of airmail. */
  .kind {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: clamp(0.85rem, 3.4vw, 1.05rem);
    font-stretch: 78%;
    font-weight: 720;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--airmail-red);
  }
  .chevron {
    flex: none;
    width: 46px;
    height: 9px;
    background: repeating-linear-gradient(
      -45deg,
      var(--airmail-red) 0 6px,
      transparent 6px 10px,
      var(--airmail-blue) 10px 16px,
      transparent 16px 20px
    );
  }
  .sep {
    letter-spacing: 0;
    opacity: 0.6;
  }
  .year {
    color: var(--title);
  }


  .sub {
    grid-area: sub;
    display: grid;
    gap: 10px;
    max-width: 38rem;
    margin-bottom: 34px;
  }
  .summary {
    font-size: clamp(1.05rem, 1.6vw, 1.3rem);
    line-height: 1.45;
    color: var(--on-ground);
    text-wrap: pretty;
  }

  .card {
    background: var(--card);
    box-shadow: var(--shadow-card);
  }

  .bundle {
    display: grid;
    grid-template-areas: 'sub' 'stack' 'map';
    margin-top: clamp(16px, 2.5vw, 28px);
  }

  .stack {
    grid-area: stack;
    position: relative;
    justify-self: center;
    width: min(100%, 520px);
  }

  .mapcard {
    grid-area: map;
    position: relative;
    z-index: 1;
    width: min(100%, 560px);
    justify-self: center;
    margin-top: 18px;
    padding: 18px 18px 14px;
    color: var(--ink);
    rotate: 1.4deg;
    border: 9px solid transparent;
    border-image: repeating-linear-gradient(
        -45deg,
        var(--airmail-red) 0 9px,
        var(--card) 9px 16px,
        var(--airmail-blue) 16px 25px,
        var(--card) 25px 32px
      )
      9;
  }
  /* The trip's postmark, struck inside the card over the open sea. */
  .mapcard :global(.mapmark) {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 112px;
    rotate: -12deg;
    opacity: 0.92;
    mix-blend-mode: multiply;
  }

  .jump {
    margin-top: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--on-ground-faint);
  }
  .index {
    margin-top: 6px;
    border-top: 1px solid var(--rule);
  }
  .index a {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: 12px;
    min-height: 46px;
    padding: 6px 2px;
    border-bottom: 1px solid var(--rule);
    text-decoration: none;
    transition: background 200ms;
  }
  .index a :global(.go) {
    color: var(--on-ground-faint);
    transition:
      translate 250ms var(--ease-out),
      color 250ms;
  }
  .index a:hover,
  .index a:focus-visible {
    background: var(--card-shade);
  }
  .index a:hover .name,
  .index a:focus-visible .name {
    color: var(--day);
  }
  .index a:hover :global(.go),
  .index a:focus-visible :global(.go) {
    color: var(--day);
    translate: 3px 0;
  }
  .num {
    background: var(--day);
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: #fff;
    font-size: 0.85rem;
    font-stretch: 112%;
    font-weight: 800;
  }
  .name {
    font-weight: 600;
    font-size: 1rem;
    transition: color 250ms;
  }
  .km {
    font-stretch: 75%;
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 0.06em;
    color: var(--ink-soft);
    font-variant-numeric: tabular-nums;
  }

  @media (min-width: 960px) {
    .place {
      font-size: clamp(4.4rem, 7.4vw, 7.2rem);
    }
    .kind {
      font-size: 1.2rem;
    }
    .chevron {
      width: 64px;
      height: 11px;
    }
    .bundle {
      grid-template-columns: 1.1fr 1fr;
      grid-template-rows: auto 1fr;
      grid-template-areas: 'stack sub' 'stack map';
      column-gap: clamp(32px, 5vw, 80px);
      margin-top: clamp(28px, 3vw, 44px);
    }
    .sub {
      align-self: start;
      margin: 8px 0 0;
    }
    .stack {
      justify-self: end;
      width: min(100%, 560px);
    }
    .mapcard {
      justify-self: start;
      align-self: start;
      margin: 44px 0 0 -12%;
      rotate: 2.2deg;
      padding: 22px 24px 16px;
    }
    .mapcard :global(.mapmark) {
      width: 138px;
      top: 8px;
      right: 8px;
    }
  }
</style>
