<script>
  import Icon from './Icon.svelte'
  import DayMap from './DayMap.svelte'
  import ZoomPan from './ZoomPan.svelte'
  import { tick } from 'svelte'

  // The full-screen viewer, like going through a camera roll: each photo (or
  // a day's map) shown as it is on a plain dark-grey ground. Swipe sideways
  // between them; the roll loops, so it keeps going round however fast you
  // swipe. Pinch or double-tap to zoom. Desktop also gets arrows and the arrow
  // keys. Built on <dialog>, so focus is trapped and restored.
  let { items = [], index = $bindable(null), heading = '' } = $props()

  let dialog
  let stage = $state()
  let current = $state(0)
  let zoomed = $state(false)
  let zooms = {}

  // The current photo and its neighbours round the loop, each placed one
  // screen-width apart; `dx` slides them all together.
  let dx = $state(0)
  let animating = $state(false)
  let pending = 0 // step waiting to be committed when the slide finishes
  let timer = 0
  const DURATION = 280

  const n = $derived(items.length)
  const mod = (k) => ((k % n) + n) % n
  const visible = $derived.by(() => {
    if (n === 1) return [{ k: current, pos: 0 }]
    if (n === 2) {
      // Only one other photo: put it on the side it's coming from.
      const side = pending || (dx > 0 ? -1 : 1)
      return [{ k: current, pos: 0 }, { k: mod(current + 1), pos: side }]
    }
    return [
      { k: mod(current - 1), pos: -1 },
      { k: current, pos: 0 },
      { k: mod(current + 1), pos: 1 },
    ]
  })

  $effect(() => {
    if (!dialog) return
    if (index !== null && !dialog.open) {
      dialog.showModal()
      current = index
      dx = 0
    }
    if (index === null && dialog.open) dialog.close()
  })

  // Finish any slide in progress straight away.
  function commit() {
    clearTimeout(timer)
    if (pending) {
      zooms[current]?.reset()
      current = mod(current + pending)
      pending = 0
    }
    animating = false
    dx = 0
  }

  function go(step) {
    if (n < 2) return
    commit()
    pending = step
    animating = true
    dx = -step * stage.clientWidth
    timer = setTimeout(commit, DURATION)
  }

  // Dragging sideways (one finger or the mouse), unless zoomed in.
  let drag = null
  function down(e) {
    if (n < 2 || zoomed || e.button > 0) return
    if (drag) return (drag = null) // a second finger: that's a pinch
    commit()
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, axis: null, t: Date.now() }
  }
  function move(e) {
    if (!drag || e.pointerId !== drag.id) return
    const mx = e.clientX - drag.x
    const my = e.clientY - drag.y
    if (!drag.axis && Math.hypot(mx, my) > 8) drag.axis = Math.abs(mx) > Math.abs(my) ? 'x' : 'y'
    if (drag.axis === 'x') dx = mx
  }
  function up(e) {
    if (!drag || e.pointerId !== drag.id) return
    const fast = Math.abs(dx) / Math.max(1, Date.now() - drag.t) > 0.4
    const far = Math.abs(dx) > stage.clientWidth * 0.18
    const wasX = drag.axis === 'x'
    drag = null
    if (wasX && (far || (fast && Math.abs(dx) > 30))) go(dx < 0 ? 1 : -1)
    else {
      animating = true
      dx = 0
      timer = setTimeout(() => (animating = false), DURATION)
    }
  }

  function onkeydown(e) {
    if (e.key === 'ArrowRight') go(1)
    else if (e.key === 'ArrowLeft') go(-1)
  }
  const item = $derived(items[current])
</script>

<dialog bind:this={dialog} aria-label={heading} onclose={() => (index = null)} {onkeydown}>
  {#if index !== null}
    <div
      class="stage"
      bind:this={stage}
      onpointerdown={down}
      onpointermove={move}
      onpointerup={up}
      onpointercancel={up}
      role="presentation"
    >
      {#each visible as { k, pos } (k)}
        {@const it = items[k]}
        <div class="slide" class:animating style="transform: translateX(calc({pos * 100}% + {dx}px))">
          <ZoomPan bind:this={zooms[k]} bind:zoomed>
            {#if it.kind === 'map'}
              <div class="map"><DayMap day={it.day} /></div>
            {:else if it.kind === 'video' && k === current}
              <!-- svelte-ignore a11y_media_has_caption -->
              <video src={it.video} poster={it.src} controls autoplay playsinline></video>
            {:else}
              <img src={it.src} srcset={it.srcset} sizes="100vw" alt={it.alt} width={it.w} height={it.h} style="background-image: url({it.placeholder})" draggable="false" />
            {/if}
          </ZoomPan>
        </div>
      {/each}
    </div>

    {#if item?.caption || item?.link}
      <p class="caption">
        {#if item.caption}<span>{item.caption}</span>{/if}
        {#if item.link}<a href={item.link} target="_blank" rel="noopener">Open in Google Maps <Icon name="arrow-out" size={15} /></a>{/if}
      </p>
    {/if}

    {#if items.length > 1}
      <button class="nav prev" type="button" onclick={() => go(-1)} aria-label="Previous"><Icon name="chevron-left" size={26} /></button>
      <button class="nav next" type="button" onclick={() => go(1)} aria-label="Next"><Icon name="chevron-right" size={26} /></button>
    {/if}
    <button class="close" type="button" onclick={() => dialog.close()} aria-label="Close"><Icon name="close" size={24} /></button>
  {/if}
</dialog>

<style>
  dialog {
    width: 100vw;
    max-width: none;
    height: 100dvh;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    color: #f2f2f2;
    background: #141414;
    overscroll-behavior: contain;
  }
  dialog::backdrop {
    background: #141414;
  }
  dialog[open] {
    animation: open 260ms var(--ease-out);
  }
  @keyframes open {
    from {
      opacity: 0;
    }
  }
  .stage {
    position: absolute;
    inset: 0;
    overflow: hidden;
    touch-action: none;
    user-select: none;
  }
  .slide {
    position: absolute;
    inset: 0;
    padding: max(56px, env(safe-area-inset-top)) 0 64px;
    will-change: transform;
  }
  .slide.animating {
    transition: transform 280ms var(--ease-out);
  }
  img,
  video {
    display: block;
    width: auto;
    height: auto;
    max-width: 100vw;
    max-height: calc(100dvh - 120px);
    object-fit: contain;
    background-size: cover;
    user-select: none;
    -webkit-user-drag: none;
  }
  .map {
    width: min(100vw, calc((100dvh - 120px) * 4 / 3), 1400px);
  }
  .caption {
    position: fixed;
    left: 0;
    right: 0;
    bottom: max(16px, env(safe-area-inset-bottom));
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px 18px;
    padding: 0 64px;
    font-size: 0.95rem;
    font-weight: 550;
    text-align: center;
    pointer-events: none;
  }
  .caption a {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #f2f2f2;
    pointer-events: auto;
    text-decoration-color: rgb(255 255 255 / 0.4);
  }
  button {
    position: fixed;
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: #f2f2f2;
    background: rgb(255 255 255 / 0.08);
    cursor: pointer;
    transition: background 200ms;
  }
  button:hover {
    background: rgb(255 255 255 / 0.18);
  }
  button:disabled {
    opacity: 0.25;
    cursor: default;
  }
  .close {
    top: max(10px, env(safe-area-inset-top));
    right: 10px;
  }
  .nav {
    top: 50%;
    translate: 0 -50%;
  }
  .prev {
    left: 14px;
  }
  .next {
    right: 14px;
  }
  /* Phones swipe; no arrows. */
  @media (hover: none), (max-width: 700px) {
    .nav {
      display: none;
    }
  }
</style>
