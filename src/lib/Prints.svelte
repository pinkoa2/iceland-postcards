<script>
  import Photo from './Photo.svelte'
  import Icon from './Icon.svelte'
  import PolaroidDeck from './PolaroidDeck.svelte'

  // Phones get the day's photos as one swipeable pile (PolaroidDeck). Wider
  // screens get them as polaroids tipped out onto the table:
  // masonry columns (two on phones, three on wide screens) keep every photo
  // visible at its natural shape and the order reading left to right, while
  // each print lands at its own angle, a little off its column, overlapping
  // its neighbours. Nothing scrolls sideways; every print opens full screen.
  let { items, onopen } = $props()

  let width = $state(0)

  // Stable pseudo-random numbers per photo, so the scatter never reshuffles.
  function rand(src, salt) {
    let h = 2166136261 ^ salt
    for (let k = 0; k < src.length; k++) h = Math.imul(h ^ src.charCodeAt(k), 16777619)
    return ((h >>> 0) % 10000) / 10000
  }
  const scatter = (src) => ({
    r: (rand(src, 1) * 2 - 1) * 4.2,
    x: (rand(src, 2) * 2 - 1) * 7,
    z: Math.floor(rand(src, 3) * 5) + 1,
  })

  const columns = $derived.by(() => {
    if (!width) return []
    const count = width >= 700 ? 3 : 2
    const cols = Array.from({ length: count }, () => ({ h: 0, items: [] }))
    for (const it of items) {
      const col = cols.reduce((a, b) => (b.h < a.h - 0.01 ? b : a))
      col.items.push(it)
      // Height in column widths: the photo plus a little for a caption.
      col.h += it.m.h / it.m.w + 0.14
    }
    return cols.map((c) => c.items)
  })

</script>

<div class="prints" bind:clientWidth={width} style="--cols: {columns.length || 2}">
  {#if width && width < 700}
    <PolaroidDeck {items} {onopen} />
  {:else}
    <div class="cols">
      {#each columns as col}
        <ul class="col">
          {#each col as { m, i } (m.src)}
            {@const sc = scatter(m.src)}
            <li style="--r: {sc.r.toFixed(2)}deg; --x: {sc.x.toFixed(1)}%; --z: {sc.z}">
              <button type="button" class="film" onclick={() => onopen(i)} aria-label="Open {m.kind === 'video' ? 'video' : 'photo'}{m.caption ? `: ${m.caption}` : ''}">
                <span class="shot">
                  <Photo media={m} sizes="(min-width: 700px) 30vw, 46vw" />
                  {#if m.kind === 'video'}
                    <span class="play"><Icon name="play" size={22} /></span>
                  {/if}
                </span>
                <span class="caption">{m.caption ?? ''}</span>
              </button>
            </li>
          {/each}
        </ul>
      {/each}
    </div>
  {/if}
</div>

<style>
  .cols {
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
    gap: 10px;
    align-items: start;
    padding: 6px 4px 0;
  }
  .col {
    display: grid;
  }
  li {
    position: relative;
    z-index: var(--z);
    /* Polaroids overlap the one above them a little. */
    margin-bottom: -14px;
    rotate: var(--r);
    translate: var(--x) 0;
    transition:
      rotate 350ms var(--ease-out),
      translate 350ms var(--ease-out),
      scale 350ms var(--ease-out);
  }
  li:hover,
  li:focus-within {
    z-index: 20;
    rotate: 0deg;
    scale: 1.03;
  }
  button {
    display: block;
    width: 100%;
    padding: 7px 7px 0;
    border: 0;
    text-align: left;
    box-shadow: var(--shadow-print);
    cursor: pointer;
    transition: box-shadow 350ms var(--ease-out);
  }
  li:hover button,
  li:focus-within button {
    box-shadow: var(--shadow-card);
  }
  .shot {
    position: relative;
    display: block;
  }
  .shot :global(img) {
    width: 100%;
  }
  /* The polaroid's thick bottom strip, with the caption written in it. */
  .caption {
    display: flex;
    align-items: center;
    min-height: 34px;
    padding: 4px 2px 6px;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.25;
    color: var(--ink-soft);
  }
  .play {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    padding-left: 3px;
    border-radius: 50%;
    color: var(--ink);
    background: color-mix(in srgb, var(--card) 92%, transparent);
    box-shadow: 0 4px 14px rgb(22 32 64 / 0.3);
  }
  @media (min-width: 700px) {
    .cols {
      gap: 22px;
      padding: 10px 12px 0;
    }
    li {
      margin-bottom: -6px;
    }
    button {
      padding: 10px 10px 0;
    }
    .caption {
      min-height: 46px;
      font-size: 0.88rem;
      padding: 6px 4px 10px;
    }
  }

  /* ---------- instant film ---------- */
  .film {
    background: var(--polaroid-paper);
    background-color: var(--polaroid);
    outline: 1px solid rgb(22 32 64 / 0.06);
    outline-offset: -1px;
  }
  /* The photo sits slightly recessed in the frame, under a faint gloss. */
  .shot::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    box-shadow:
      inset 0 0 0 1px rgb(0 0 0 / 0.1),
      inset 0 2px 4px rgb(0 0 0 / 0.18);
    background: linear-gradient(128deg, rgb(255 255 255 / 0.16) 0%, rgb(255 255 255 / 0) 38%);
  }
</style>
