<script>
  // A responsive photo: right-sized WebP from the srcset, a blurred placeholder
  // underneath while it loads, intrinsic size reserved so nothing jumps.
  let { media, sizes = '100vw', eager = false, class: cls = '', style = '' } = $props()
</script>

<img
  class={cls}
  src={media.src}
  srcset={media.srcset}
  {sizes}
  width={media.w}
  height={media.h}
  alt={media.alt}
  loading={eager ? 'eager' : 'lazy'}
  fetchpriority={eager ? 'high' : 'auto'}
  decoding="async"
  style="background-image: url({media.placeholder}); {style}"
/>

<style>
  img {
    background-size: cover;
    background-position: center;
    height: auto;
  }
</style>
