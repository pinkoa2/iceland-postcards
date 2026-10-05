<script>
  import Photo from './Photo.svelte'
  import Icon from './Icon.svelte'

  // A pile of photos you flick through: swipe (or drag) the top one away to
  // bring up the next, swipe the other way to bring the last one back. A tap
  // opens the photo full screen. Two looks: `polaroid` (instant film with a
  // caption strip, the day piles) and `print` (an even white border, the
  // cover). Every card has its own resting angle, place in the pile, pivot
  // and throw, so no two flicks look alike.
  // `inset` is the room kept free at the sides for cards peeking out.
  let { items, onopen, variant = 'polaroid', ratio = 1.06, maxW = 330, inset = 56 } = $props()

  let width = $state(0)
  let index = $state(0)
  let dx = $state(0)
  let dragging = $state(false)
  let leaving = $state(null) // 'left' | 'right' while the top card flies off
  let entering = $state(null) // the card sliding back on top

  const n = $derived(items.length)
  const print = $derived(variant === 'print')
  const PAD = $derived(print ? 10 : 8)
  const STRIP = $derived(print ? PAD : 42)
  const cardW = $derived(Math.round(Math.min(width - inset, maxW)))
  const photoH = $derived(Math.round((cardW - PAD * 2) * ratio))
  const H = $derived(photoH + PAD + STRIP + 56)

  // Stable pseudo-random numbers per photo.
  function rand(src, salt) {
    let h = 2166136261 ^ salt
    for (let k = 0; k < src.length; k++) h = Math.imul(h ^ src.charCodeAt(k), 16777619)
    return ((h >>> 0) % 10000) / 10000
  }
  // Each card's own character, fixed for that photo.
  function character(src) {
    const r = (s) => rand(src, s)
    const side = r(9) < 0.5 ? -1 : 1
    return {
      // Kept modest so a card never swings out to the screen edge.
      rest: (r(1) * 2 - 1) * 2.2, // angle when on top
      under: { r: side * (2 + r(2) * 4.5), x: side * (6 + r(3) * 12), y: -8 + r(4) * 26 },
      pivot: `${25 + r(5) * 50}% ${55 + r(6) * 40}%`,
      tilt: 0.025 + r(7) * 0.04, // degrees per pixel dragged
      out: { r: 9 + r(8) * 20, y: -70 + r(10) * 150, t: 220 + Math.round(r(11) * 140) },
    }
  }

  // Each card's place in the pile: 0 on top, 1–3 peek out, the rest wait.
  const slot = (j) => (j - index + n) % n
  function place(k, c) {
    if (k === 0) return { r: c.rest, x: 0, y: 0 }
    // Deeper cards spread a little further.
    const f = 0.8 + Math.min(k, 3) * 0.1
    return { r: c.under.r * f, x: c.under.x * f, y: c.under.y + k * 3 }
  }
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

  function go(step) {
    if (leaving || n < 2) return
    if (step > 0) {
      if (reduced) return (index = (index + 1) % n)
      const c = character(items[index].m.src)
      leaving = dx > 0 ? 'right' : 'left'
      setTimeout(() => {
        index = (index + 1) % n
        leaving = null
        dx = 0
      }, c.out.t)
    } else {
      index = (index - 1 + n) % n
      dx = 0
      if (!reduced) {
        entering = index
        setTimeout(() => (entering = null), 380)
      }
    }
  }

  let startX = 0
  let startY = 0
  let moved = false
  let axis = null
  function down(e) {
    if (leaving) return
    startX = e.clientX
    startY = e.clientY
    moved = false
    axis = null
    dragging = true
  }
  function move(e) {
    if (!dragging) return
    const mx = e.clientX - startX
    const my = e.clientY - startY
    if (!axis && Math.hypot(mx, my) > 8) {
      axis = Math.abs(mx) > Math.abs(my) ? 'x' : 'y'
      // Only a sideways drag takes the pointer, so a plain tap still opens.
      if (axis === 'x') e.currentTarget.setPointerCapture?.(e.pointerId)
    }
    if (axis === 'x') {
      moved = true
      dx = mx
    }
  }
  function up() {
    if (!dragging) return
    dragging = false
    if (axis === 'x' && Math.abs(dx) > 70) go(dx < 0 ? 1 : -1)
    else dx = 0
  }
  function tap(i) {
    if (!moved) onopen(i)
  }
</script>

<div class="deck" class:print bind:clientWidth={width}>
  {#if width}
    <div class="pile" style="height: {H}px" role="group" aria-roledescription="carousel" aria-label="{n} photos">
      <!-- Every card is a lasting element in a fixed order; a swipe only
           changes each card's place, so they glide rather than redraw. -->
      {#each items as it, j (it.m.src)}
        {@const k = slot(j)}
        {@const c = character(it.m.src)}
        {@const top = k === 0}
        {@const pl = place(k, c)}
        <div
          class="card"
          class:top
          class:hidden={k > 3}
          class:dragging={top && dragging}
          class:leave-left={top && leaving === 'left'}
          class:leave-right={top && leaving === 'right'}
          class:enter={entering === j}
          style="width: {cardW}px; transform-origin: {c.pivot}; --r: {pl.r}deg; --dx: {top ? dx : pl.x}px; --dxn: {top ? dx : 0}; --tilt: {c.tilt}deg; --lift: {pl.y}px; --shrink: {1 - Math.min(k, 4) * 0.015}; --out-r: {c.out.r}deg; --out-y: {c.out.y}px; --out-t: {c.out.t}ms; z-index: {top && entering === null ? 30 : 20 - k}"
          onpointerdown={top ? down : undefined}
          onpointermove={top ? move : undefined}
          onpointerup={top ? up : undefined}
          onpointercancel={top ? up : undefined}
          aria-hidden={!top}
        >
          <button
            type="button"
            class:film={!print}
            class:paper={print}
            tabindex={top ? 0 : -1}
            onclick={() => tap(it.i)}
            onkeydown={(e) => {
              if (e.key === 'ArrowRight') go(1)
              else if (e.key === 'ArrowLeft') go(-1)
            }}
            aria-label="Open {it.m.kind === 'video' ? 'video' : 'photo'}{it.m.caption ? `: ${it.m.caption}` : ''}"
          >
            <span class="shot" style="height: {photoH}px">
              <Photo media={it.m} sizes="{cardW}px" eager={k < 4} />
              {#if it.m.kind === 'video'}<span class="play"><Icon name="play" size={22} /></span>{/if}
            </span>
            {#if !print}
              <span class="caption">{it.m.caption ?? ''}</span>
            {/if}
          </button>
        </div>
      {/each}
    </div>

    {#if n > 1}
      <p class="hint">
        <span class="touch">Try swiping left and right</span>
        <span class="mouse">Drag the photo aside to flip through</span>
      </p>
    {/if}
  {/if}
</div>

<style>
  .pile {
    position: relative;
    touch-action: pan-y;
    user-select: none;
  }
  .card {
    position: absolute;
    left: 50%;
    top: 22px;
    translate: calc(-50% + var(--dx)) var(--lift);
    rotate: calc(var(--r) + var(--dxn) * var(--tilt));
    scale: var(--shrink);
    transition:
      translate 460ms var(--ease-out),
      rotate 460ms var(--ease-out),
      scale 460ms var(--ease-out),
      opacity 300ms var(--ease-out);
  }
  /* Going to the bottom of the pile is instant (it has already flown off);
     coming back into view fades and glides in. */
  .card.hidden {
    opacity: 0;
    pointer-events: none;
    transition: none;
  }
  .card.dragging {
    transition: none;
  }
  /* Each card leaves at its own angle, height and speed. */
  .card.leave-left {
    translate: calc(-50% - 130vw) var(--out-y);
    rotate: calc(var(--out-r) * -1);
    transition-duration: var(--out-t);
  }
  .card.leave-right {
    translate: calc(-50% + 130vw) var(--out-y);
    rotate: var(--out-r);
    transition-duration: var(--out-t);
  }
  .card.enter {
    z-index: 40 !important;
    animation: enter 380ms var(--ease-out);
  }
  @keyframes enter {
    from {
      translate: calc(-50% - 110vw) var(--out-y);
      rotate: calc(var(--out-r) * -1);
    }
  }
  button {
    display: block;
    width: 100%;
    padding: 8px 8px 0;
    border: 0;
    text-align: left;
    box-shadow: var(--shadow-print);
    cursor: zoom-in;
  }
  .top button {
    box-shadow: var(--shadow-card);
  }
  .shot {
    position: relative;
    display: block;
    overflow: hidden;
  }
  .shot :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
  .caption {
    display: block;
    min-height: 42px;
    padding: 12px 2px 8px;
    overflow: hidden;
    font-size: 0.86rem;
    font-weight: 600;
    line-height: 1.25;
    white-space: nowrap;
    text-overflow: ellipsis;
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
  /* ---------- instant film ---------- */
  .film {
    background: var(--polaroid-paper);
    background-color: var(--polaroid);
    outline: 1px solid rgb(22 32 64 / 0.06);
    outline-offset: -1px;
  }
  /* The photo sits slightly recessed in the frame, under a faint gloss. */
  .film .shot::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    box-shadow:
      inset 0 0 0 1px rgb(0 0 0 / 0.1),
      inset 0 2px 4px rgb(0 0 0 / 0.18);
    background: linear-gradient(128deg, rgb(255 255 255 / 0.16) 0%, rgb(255 255 255 / 0) 38%);
  }
  /* ---------- printed photo ---------- */
  .paper {
    padding: 10px;
    background: var(--card);
  }
  .hint {
    margin-top: 6px;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--on-ground-faint);
  }
  .mouse {
    display: none;
  }
  @media (hover: hover) and (pointer: fine) {
    .touch {
      display: none;
    }
    .mouse {
      display: inline;
    }
  }
</style>
