<script>
  import Photo from './Photo.svelte'
  import Icon from './Icon.svelte'

  // Phones: the day's polaroids as one pile. The top one is fully visible, the
  // next ones peek out behind at their own angles, and a swipe (or the arrows)
  // flicks through them. A tap opens the photo full screen.
  let { items, onopen, scatter, frameNo } = $props()

  let width = $state(0)
  let index = $state(0)
  let dx = $state(0)
  let dragging = $state(false)
  let leaving = $state(null) // 'left' | 'right' while the top card flies off
  let entering = $state(null) // index of the previous card sliding back on top

  const n = items.length
  // Every polaroid in the pile is the same format, like real instant film:
  // a near-square photo window that the photo fills. The full, uncropped
  // photo is a tap away.
  const PAD = 8
  const STRIP = 42
  const cardW = $derived(Math.round(Math.min(width - 60, 330)))
  const photoH = $derived(Math.round((cardW - PAD * 2) * 1.06))
  const H = $derived(photoH + PAD + STRIP + 48)
  const size = () => ({ w: cardW, photoH })

  // Each polaroid's place in the pile: 0 is on top, 1 and 2 peek out behind,
  // the rest wait unseen at the bottom.
  const slot = (j) => (j - index + n) % n

  // Where each place in the pile sits: the polaroids behind fan out to
  // alternate sides at clearly different angles, each with its own jitter.
  const SLOTS = [
    { r: 0, x: 0, y: 0 },
    { r: 8.5, x: 24, y: -4 },
    { r: -9.5, x: -26, y: 12 },
    { r: 4, x: 12, y: 22 },
  ]
  function place(k, sc) {
    const p = SLOTS[Math.min(k, 3)]
    if (k === 0) return { r: sc.r * 0.5, x: 0, y: 0 }
    return { r: p.r + sc.r * 0.6, x: p.x + sc.x * 0.8, y: p.y }
  }
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

  function go(step) {
    if (leaving || n < 2) return
    if (step > 0) {
      if (reduced) return (index = (index + 1) % n)
      leaving = dx > 0 ? 'right' : 'left'
      setTimeout(() => {
        index = (index + 1) % n
        leaving = null
        dx = 0
      }, 260)
    } else {
      index = (index - 1 + n) % n
      dx = 0
      if (!reduced) {
        entering = index
        setTimeout(() => (entering = null), 340)
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
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  function move(e) {
    if (!dragging) return
    const mx = e.clientX - startX
    const my = e.clientY - startY
    if (!axis && Math.hypot(mx, my) > 8) axis = Math.abs(mx) > Math.abs(my) ? 'x' : 'y'
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

<div class="deck" bind:clientWidth={width}>
  {#if width}
    <div class="pile" style="height: {H}px" role="group" aria-roledescription="carousel" aria-label="{n} photos and videos">
      <!-- Every polaroid is a lasting card in a fixed order; a swipe only
           changes each card's place, so they glide rather than redraw. -->
      {#each items as it, j (it.m.src)}
        {@const k = slot(j)}
        {@const s = size()}
        {@const sc = scatter(it.m.src)}
        {@const top = k === 0}
        {@const shown = Math.min(k, 4)}
        {@const pl = place(k, sc)}
        <div
          class="card"
          class:top
          class:hidden={k > 3}
          class:dragging={top && dragging}
          class:leave-left={top && leaving === 'left'}
          class:leave-right={top && leaving === 'right'}
          class:enter={entering === j}
          style="width: {s.w}px; --r: {pl.r}deg; --dx: {top ? dx : pl.x}px; --dxn: {top ? dx : 0}; --lift: {pl.y}px; --shrink: {1 - shown * 0.015}; z-index: {top && entering === null ? 30 : 20 - k}"
          onpointerdown={top ? down : undefined}
          onpointermove={top ? move : undefined}
          onpointerup={top ? up : undefined}
          onpointercancel={top ? up : undefined}
          aria-hidden={!top}
        >
          <button
            type="button"
            class="film"
            tabindex={top ? 0 : -1}
            onclick={() => tap(it.i)}
            onkeydown={(e) => {
              if (e.key === 'ArrowRight') go(1)
              else if (e.key === 'ArrowLeft') go(-1)
            }} aria-label="Open {it.m.kind === 'video' ? 'video' : 'photo'}{it.m.caption ? `: ${it.m.caption}` : ''}">
            <span class="shot" style="height: {s.photoH}px">
              <Photo media={it.m} sizes="{s.w}px" eager={k < 4} />
              {#if it.m.kind === 'video'}<span class="play"><Icon name="play" size={22} /></span>{/if}
            </span>
            <span class="caption strip">
              {#if it.m.caption}<span class="caption-text">{it.m.caption}</span>{/if}
              <span class="frame">{frameNo(it.i)}</span>
            </span>
          </button>
        </div>
      {/each}
    </div>

    {#if n > 1}
      <div class="controls">
        <span class="count" aria-live="polite">{index + 1} / {n}</span>
        <span class="hint">Try swiping left and right</span>
      </div>
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
    top: 8px;
    translate: calc(-50% + var(--dx)) var(--lift);
    rotate: calc(var(--r) + var(--dxn) * 0.04deg);
    scale: var(--shrink);
    transition:
      translate 420ms var(--ease-out),
      rotate 420ms var(--ease-out),
      scale 420ms var(--ease-out),
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
  .card.leave-left {
    translate: calc(-50% - 130vw) 0;
    rotate: -18deg;
    transition-duration: 260ms;
  }
  .card.leave-right {
    translate: calc(-50% + 130vw) 0;
    rotate: 18deg;
    transition-duration: 260ms;
  }
  .card.enter {
    z-index: 40 !important;
    animation: enter 340ms var(--ease-out);
  }
  @keyframes enter {
    from {
      translate: calc(-50% - 110vw) 0;
      rotate: -14deg;
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
    display: flex;
    align-items: center;
    min-height: 42px;
    padding: 4px 2px 6px;
    font-size: 0.86rem;
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
  .strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
    .caption-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .frame {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
    font-size: 0.7rem;
    font-stretch: 75%;
    font-weight: 750;
    letter-spacing: 0.14em;
    color: var(--day, var(--ink-soft));
    font-variant-numeric: tabular-nums;
  }
  .frame::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.8;
  }
  .controls {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 12px;
    margin-top: 12px;
  }
  .hint {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--on-ground-faint);
  }
  .count {
    font-stretch: 75%;
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.12em;
    color: var(--on-ground-soft);
    font-variant-numeric: tabular-nums;
  }
</style>
