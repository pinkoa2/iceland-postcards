<script>
  // The small postmark that rides along once the cover has scrolled away. It
  // shows the day you're reading and opens a jump list of every day.
  let { days, current = null, visible = false } = $props()

  let open = $state(false)
  let panel = $state()
  const day = $derived(current ? days[current - 1] : null)

  function onkeydown(e) {
    if (e.key === 'Escape' && open) open = false
  }
  function outside(e) {
    if (open && panel && !panel.parentElement.contains(e.target)) open = false
  }
</script>

<svelte:window {onkeydown} onclick={outside} />

<div class="daynav" class:visible style="--day: {day?.colour.ink ?? 'var(--airmail-blue)'}">
  <button class="mark" type="button" aria-expanded={open} aria-controls="daynav-list" onclick={() => (open = !open)}>
    <span class="label">{day ? 'Day' : 'Days'}</span>
    <span class="fig">{day ? day.n : days.length}</span>
    <span class="visually-hidden">: jump to a day</span>
  </button>
  {#if open}
    <ol class="list" id="daynav-list" bind:this={panel}>
      {#each days as d}
        <li>
          <a href="#{d.id}" aria-current={d.n === current ? 'true' : undefined} onclick={() => (open = false)}>
            <span class="num" style="background: {d.colour.ink}">{d.n}</span>
            {d.title}
          </a>
        </li>
      {/each}
      <li><a class="top" href="#top" onclick={() => (open = false)}>Back to the map</a></li>
    </ol>
  {/if}
</div>

<style>
  .daynav {
    position: fixed;
    z-index: 10;
    top: max(12px, env(safe-area-inset-top));
    right: 12px;
    opacity: 0;
    translate: 0 -12px;
    pointer-events: none;
    transition:
      opacity 300ms var(--ease-out),
      translate 300ms var(--ease-out);
  }
  .daynav.visible {
    opacity: 1;
    translate: none;
    pointer-events: auto;
  }
  .mark {
    display: grid;
    place-content: center;
    width: 64px;
    height: 64px;
    border: 0;
    border-radius: 50%;
    color: var(--day);
    background: var(--card);
    box-shadow:
      inset 0 0 0 3px var(--card),
      inset 0 0 0 5px currentColor,
      inset 0 0 0 8px var(--card),
      inset 0 0 0 9px currentColor,
      var(--shadow-print);
    cursor: pointer;
    line-height: 1;
    transition: color 400ms var(--ease-out), scale 200ms var(--ease-out);
  }
  .mark:hover {
    scale: 1.06;
  }
  .label {
    font-size: 0.6rem;
    font-stretch: 75%;
    font-weight: 750;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    padding-left: 0.24em;
  }
  .fig {
    font-size: 1.45rem;
    font-stretch: 125%;
    font-weight: 900;
  }
  .list {
    position: absolute;
    top: 74px;
    right: 0;
    width: min(320px, calc(100vw - 24px));
    padding: 6px 14px;
    color: var(--ink);
    background: var(--card);
    box-shadow: var(--shadow-card);
    animation: drop 260ms var(--ease-out);
  }
  @keyframes drop {
    from {
      opacity: 0;
      translate: 0 -8px;
    }
  }
  .list a {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 46px;
    border-bottom: 1px solid var(--rule);
    font-weight: 600;
    text-decoration: none;
  }
  .list li:last-child a {
    border-bottom: 0;
  }
  .list a[aria-current] {
    color: var(--day);
  }
  .list a:hover {
    text-decoration: underline;
  }
  .num {
    flex: none;
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    color: #fff;
    font-size: 0.8rem;
    font-stretch: 112%;
    font-weight: 800;
  }
  .top {
    color: var(--ink-soft);
    font-stretch: 85%;
  }
  @media (min-width: 960px) {
    .daynav {
      top: 22px;
      right: 22px;
    }
    .mark {
      width: 76px;
      height: 76px;
    }
    .fig {
      font-size: 1.75rem;
    }
  }
</style>
