<script>
  // The site's few icons, drawn on one 24px grid with one stroke weight.
  let { name, size = 20, class: cls = '' } = $props()
  const paths = {
    'arrow-out': 'M7 17 17 7M9 7h8v8',
    'chevron-left': 'm15 5-7 7 7 7',
    'chevron-right': 'm9 5 7 7-7 7',
    close: 'M6 6l12 12M18 6 6 18',
    'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  }
</script>

<svg class={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {#if name === 'play'}
    <path d="M8.5 5.8v12.4a.6.6 0 0 0 .9.5l9.7-6.2a.6.6 0 0 0 0-1L9.4 5.3a.6.6 0 0 0-.9.5Z" fill="currentColor" stroke="none" />
  {:else}
    <path d={paths[name]} />
  {/if}
</svg>
