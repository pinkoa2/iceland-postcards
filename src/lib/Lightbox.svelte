<script>
  import Icon from './Icon.svelte'

  // Full-screen viewer for one day's photos and videos: swipe, arrow keys,
  // Escape to close. Built on <dialog> so focus is trapped and restored natively.
  let { items = [], index = $bindable(null), heading = '' } = $props()

  let dialog
  let startX = null
  const current = $derived(index === null ? null : items[index])

  $effect(() => {
    if (!dialog) return
    if (index !== null && !dialog.open) dialog.showModal()
    if (index === null && dialog.open) dialog.close()
  })

  const step = (d) => (index = (index + d + items.length) % items.length)

  function onkeydown(e) {
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
  }
  function down(e) {
    if (e.pointerType !== 'mouse') startX = e.clientX
  }
  function up(e) {
    if (startX === null) return
    const dx = e.clientX - startX
    startX = null
    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1)
  }
</script>

<dialog
  bind:this={dialog}
  aria-label={heading}
  onclose={() => (index = null)}
  {onkeydown}
  onclick={(e) => e.target === dialog && dialog.close()}
>
  {#if current}
    <div class="stage" onpointerdown={down} onpointerup={up} role="presentation">
      {#key index}
        <figure>
          {#if current.kind === 'video'}
            <!-- svelte-ignore a11y_media_has_caption -->
            <video src={current.video} poster={current.src} controls autoplay playsinline></video>
          {:else}
            <img src={current.src} srcset={current.srcset} sizes="100vw" alt={current.alt} width={current.w} height={current.h} style="background-image: url({current.placeholder})" />
          {/if}
          <figcaption>
            <span class="count">{index + 1} / {items.length}</span>
            {#if current.caption}<span class="caption">{current.caption}</span>{/if}
          </figcaption>
        </figure>
      {/key}
    </div>
    {#if items.length > 1}
      <button class="nav prev" type="button" onclick={() => step(-1)} aria-label="Previous"><Icon name="chevron-left" size={26} /></button>
      <button class="nav next" type="button" onclick={() => step(1)} aria-label="Next"><Icon name="chevron-right" size={26} /></button>
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
    color: #fff;
    background: transparent;
    overscroll-behavior: contain;
  }
  dialog::backdrop {
    background: rgb(9 20 52 / 0.94);
    backdrop-filter: blur(10px);
  }
  dialog[open] {
    animation: open 320ms var(--ease-out);
  }
  @keyframes open {
    from {
      opacity: 0;
    }
  }
  .stage {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 64px 12px 24px;
    touch-action: pan-y;
  }
  figure {
    display: grid;
    justify-items: center;
    gap: 14px;
    max-width: 100%;
    animation: in 380ms var(--ease-out);
  }
  @keyframes in {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
  }
  img,
  video {
    width: auto;
    height: auto;
    max-width: min(100%, 1600px);
    max-height: calc(100dvh - 150px);
    object-fit: contain;
    background-size: cover;
    border: 6px solid var(--card);
    box-shadow: var(--shadow-card);
  }
  figcaption {
    display: flex;
    gap: 14px;
    align-items: baseline;
    font-size: 0.95rem;
  }
  .count {
    font-stretch: 75%;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: rgb(255 255 255 / 0.65);
    font-variant-numeric: tabular-nums;
  }
  .caption {
    font-weight: 550;
  }
  button {
    position: absolute;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 0;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.1);
    cursor: pointer;
    transition: background 200ms;
  }
  button:hover {
    background: rgb(255 255 255 / 0.22);
  }
  .close {
    top: max(12px, env(safe-area-inset-top));
    right: 12px;
  }
  .nav {
    top: 50%;
    translate: 0 -50%;
  }
  .prev {
    left: 12px;
  }
  .next {
    right: 12px;
  }
  @media (max-width: 640px) {
    .stage {
      padding-bottom: 84px;
    }
    .nav {
      top: auto;
      bottom: max(14px, env(safe-area-inset-bottom));
      translate: none;
    }
  }
</style>
