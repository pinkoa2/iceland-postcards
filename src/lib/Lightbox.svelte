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
  // Whether the viewer was opened by touch or mouse rather than the keyboard:
  // then no focus ring shows on the close button or, after closing, on the
  // photo that was tapped.
  let byPointer = true
  let opener = null
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
      opener = document.activeElement
      dialog.showModal()
      if (byPointer) dialog.focus()
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

  function closed() {
    index = null
    if (byPointer && opener?.isConnected) opener.focus({ preventScroll: true, focusVisible: false })
    opener = null
  }

  function onkeydown(e) {
    if (e.key === 'ArrowRight') go(1)
    else if (e.key === 'ArrowLeft') go(-1)
  }
  const item = $derived(items[current])

  // While a full-size photo downloads, the copy the page already showed sits
  // underneath, so the photo is there at once and only sharpens. `loaded` and
  // `failed` are per photo; `tries` remounts one to try it again. Only when
  // neither copy loads does the viewer say so.
  let loaded = $state({})
  let failed = $state({})
  let previewFailed = $state({})
  let tries = $state({})
  function preview(it) {
    const shown = [...document.images].find((img) => img.srcset === it.srcset && img.complete && img.naturalWidth)
    return shown?.currentSrc || it.srcset.split(' ')[0]
  }
  function retry(k) {
    failed[k] = false
    previewFailed[k] = false
    tries[k] = (tries[k] || 0) + 1
  }

  // The open video: 'loading' until it plays, 'waiting' when it stalls,
  // 'blocked' when the browser won't autoplay it, 'failed' when it can't load.
  let video = $state('loading')
  function startVideo(el) {
    video = 'loading'
    el.play().catch((err) => {
      if (err.name === 'NotAllowedError') video = 'blocked'
    })
  }
  let videoEl = $state()
  function retryVideo() {
    video = 'loading'
    videoEl.load()
    startVideo(videoEl)
  }

  const slow = $derived(
    item?.kind === 'photo'
      ? !loaded[current] && !failed[current]
      : item?.kind === 'video' && (video === 'loading' || video === 'waiting'),
  )
  const broken = $derived(item?.kind === 'photo' ? failed[current] && previewFailed[current] : item?.kind === 'video' && video === 'failed')
</script>

<svelte:window onpointerdowncapture={() => (byPointer = true)} onkeydowncapture={() => (byPointer = false)} />

<dialog bind:this={dialog} tabindex="-1" aria-label={heading} onclose={closed} {onkeydown}>
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
              <video
                bind:this={videoEl}
                src={it.video}
                poster={it.src}
                controls
                playsinline
                {@attach startVideo}
                onplaying={() => (video = 'playing')}
                onwaiting={() => (video = 'waiting')}
                onpause={() => video === 'playing' && (video = 'paused')}
                onerror={() => (video = 'failed')}
              ></video>
            {:else if it.kind === 'video'}
              <img src={it.src} srcset={it.srcset} sizes="100vw" alt={it.alt} width={it.w} height={it.h} style="background-image: url({it.placeholder})" draggable="false" />
            {:else}
              {#key tries[k]}
                <div class="photo">
                  <img
                    src={preview(it)}
                    alt=""
                    width={it.w}
                    height={it.h}
                    style="background-image: url({it.placeholder})"
                    draggable="false"
                    onerror={() => (previewFailed[k] = true)}
                  />
                  <img
                    class="full"
                    class:ready={loaded[k]}
                    src={it.src}
                    srcset={it.srcset}
                    sizes="100vw"
                    alt={it.alt}
                    width={it.w}
                    height={it.h}
                    draggable="false"
                    onload={() => (loaded[k] = true)}
                    onerror={() => (failed[k] = true)}
                  />
                </div>
              {/key}
            {/if}
          </ZoomPan>
        </div>
      {/each}
    </div>

    {#if slow}
      <div class="loading" role="status">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <circle cx="11" cy="11" r="8.5" />
          <circle class="arc" cx="11" cy="11" r="8.5" />
        </svg>
        <span class="visually-hidden">Loading</span>
      </div>
    {/if}
    {#if broken}
      <div class="problem" role="alert">
        <p>Couldn’t load this {item.kind}.</p>
        <button type="button" onclick={() => (item.kind === 'video' ? retryVideo() : retry(current))}>Try again</button>
      </div>
    {:else if item?.kind === 'video' && video === 'blocked'}
      <button class="play" type="button" onclick={() => videoEl.play()} aria-label="Play video"><Icon name="play" size={34} /></button>
    {/if}

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
  dialog:focus {
    outline: none;
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
  .photo {
    display: grid;
  }
  .photo > img {
    grid-area: 1 / 1;
  }
  .full {
    opacity: 0;
    transition: opacity 300ms var(--ease-out);
  }
  .full.ready {
    opacity: 1;
  }
  /* Only shows when loading is slow, so quick loads never flash it. */
  .loading {
    position: fixed;
    top: max(10px, env(safe-area-inset-top));
    left: 10px;
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.08);
    pointer-events: none;
    animation: appear 240ms 500ms var(--ease-out) both;
  }
  .loading circle {
    fill: none;
    stroke: rgb(255 255 255 / 0.18);
    stroke-width: 2;
  }
  .loading .arc {
    stroke: #f2f2f2;
    stroke-linecap: round;
    stroke-dasharray: 14 60;
    transform-origin: center;
    animation: spin 900ms linear infinite;
  }
  @keyframes appear {
    from {
      opacity: 0;
    }
  }
  @keyframes spin {
    to {
      rotate: 1turn;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .loading .arc {
      animation: pulse 1.6s ease-in-out infinite alternate;
    }
    @keyframes pulse {
      to {
        opacity: 0.3;
      }
    }
  }
  .problem {
    position: fixed;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    display: grid;
    justify-items: center;
    gap: 14px;
    width: max-content;
    max-width: calc(100vw - 32px);
    padding: 20px 24px;
    border-radius: 14px;
    background: rgb(20 20 20 / 0.82);
    text-align: center;
  }
  .problem button {
    position: static;
    width: auto;
    height: 44px;
    padding: 0 20px;
    border-radius: 22px;
    font-weight: 600;
  }
  .play {
    top: 50%;
    left: 50%;
    width: 76px;
    height: 76px;
    translate: -50% -50%;
    background: rgb(20 20 20 / 0.55);
    backdrop-filter: blur(6px);
  }
  .play:hover {
    background: rgb(20 20 20 / 0.7);
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
