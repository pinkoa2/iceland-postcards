<script>
  import Icon from './Icon.svelte'
  import DayMap from './DayMap.svelte'
  import ZoomPan from './ZoomPan.svelte'
  import { tick } from 'svelte'

  // The full-screen viewer, like going through a camera roll: each photo (or
  // a day's map) shown as it is on a plain dark-grey ground. Swipe sideways
  // between them; pinch or double-tap to zoom. Desktop also gets arrows and
  // the arrow keys. Built on <dialog>, so focus is trapped and restored.
  let { items = [], index = $bindable(null), heading = '' } = $props()

  let dialog
  let track = $state()
  let current = $state(0)
  let zoomed = $state(false)
  let zooms = []

  $effect(() => {
    if (!dialog) return
    if (index !== null && !dialog.open) {
      dialog.showModal()
      current = index
      tick().then(() => track && (track.scrollLeft = index * track.clientWidth))
    }
    if (index === null && dialog.open) dialog.close()
  })

  function onscroll() {
    const k = Math.round(track.scrollLeft / track.clientWidth)
    if (k !== current) {
      zooms[current]?.reset()
      current = k
    }
  }
  function go(step) {
    const k = Math.max(0, Math.min(items.length - 1, current + step))
    track.scrollTo({ left: k * track.clientWidth, behavior: 'smooth' })
  }
  function onkeydown(e) {
    if (e.key === 'ArrowRight') go(1)
    else if (e.key === 'ArrowLeft') go(-1)
  }
  const item = $derived(items[current])
</script>

<dialog bind:this={dialog} aria-label={heading} onclose={() => (index = null)} {onkeydown}>
  {#if index !== null}
    <div class="track" class:locked={zoomed} bind:this={track} {onscroll}>
      {#each items as it, k}
        <div class="slide">
          {#if Math.abs(k - current) <= 2}
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
          {/if}
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
      <button class="nav prev" type="button" onclick={() => go(-1)} disabled={current === 0} aria-label="Previous"><Icon name="chevron-left" size={26} /></button>
      <button class="nav next" type="button" onclick={() => go(1)} disabled={current === items.length - 1} aria-label="Next"><Icon name="chevron-right" size={26} /></button>
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
  .track {
    display: flex;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    overscroll-behavior-x: contain;
  }
  .track::-webkit-scrollbar {
    display: none;
  }
  .track.locked {
    overflow-x: hidden;
  }
  .slide {
    flex: none;
    width: 100%;
    height: 100%;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    padding: max(56px, env(safe-area-inset-top)) 0 64px;
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
