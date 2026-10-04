<script>
  import Photo from './Photo.svelte'
  import Postmark from './Postmark.svelte'
  import OverviewMap from './OverviewMap.svelte'
  import Icon from './Icon.svelte'

  // The bundle as it arrives: the trip's name printed on the envelope, the top
  // postcard over the edges of the others, and the map card that indexes them.
  let { trip, onopen } = $props()

  const fmt = new Intl.NumberFormat('en')
  const t = trip.totals
  // Three other days' fronts peek out from under the top card.
  const under = trip.days
    .map((d) => d.media[d.coverIndex])
    .filter((m) => m && m.src !== trip.cover.src)
    .slice(0, 3)
  const byline = [trip.travellers.join(' & '), trip.year].filter(Boolean).join(' · ')
</script>

<header class="cover">
  <h1 class="title">{trip.heading}</h1>

  <div class="bundle">
    <div class="sub">
      {#if byline}<p class="byline">{byline}</p>{/if}
      {#if trip.summary}<p class="summary">{trip.summary}</p>{/if}
    </div>

    <div class="stack">
      {#each under as m, i}
        <div class="card under u{i}" aria-hidden="true">
          <Photo media={m} sizes="480px" />
        </div>
      {/each}
      <button class="card top" type="button" onclick={onopen} aria-label="Open the cover photo">
        <Photo media={trip.cover} sizes="(min-width: 960px) 46vw, 88vw" eager />
      </button>
    </div>

    <nav class="card mapcard" aria-label="Days of the trip">
      <Postmark
        class="mapmark"
        top={byline}
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
    padding: clamp(28px, 5vw, 64px) var(--gutter) 0;
    max-width: 1520px;
    margin: 0 auto;
  }

  .title {
    color: var(--title);
    font-size: clamp(2.3rem, 10vw, 4rem);
    font-stretch: 104%;
    font-weight: 620;
    line-height: 1;
    letter-spacing: -0.03em;
    text-wrap: balance;
  }

  .sub {
    grid-area: sub;
    display: grid;
    gap: 10px;
    max-width: 38rem;
    margin-bottom: 34px;
  }
  .byline {
    font-stretch: 75%;
    font-weight: 650;
    font-size: 0.9rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--on-ground-soft);
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
  .top {
    position: relative;
    display: block;
    width: 100%;
    padding: 10px 10px 40px;
    border: 0;
    cursor: zoom-in;
    rotate: -2.5deg;
    transition: rotate 500ms var(--ease-out), translate 500ms var(--ease-out);
  }
  .top:hover {
    rotate: -1.5deg;
    translate: 0 -4px;
  }
  .top :global(img) {
    width: 100%;
    max-height: 72svh;
    object-fit: cover;
  }
  .under {
    position: absolute;
    inset: 0 0 0 0;
    padding: 8px;
    overflow: hidden;
  }
  .under :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .u0 {
    rotate: 5deg;
    translate: 4% 1%;
  }
  .u1 {
    rotate: -7deg;
    translate: -5% 2%;
  }
  .u2 {
    rotate: 2deg;
    translate: 1% -3%;
  }

  .mapcard {
    grid-area: map;
    position: relative;
    z-index: 1;
    width: min(100%, 560px);
    justify-self: center;
    margin-top: -28px;
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
    .title {
      font-size: clamp(3.6rem, 5.4vw, 5.6rem);
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
    .top :global(img) {
      max-height: 76vh;
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
