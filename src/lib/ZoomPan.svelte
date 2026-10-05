<script>
  // Pinch (two fingers), double-tap or double-click to zoom into what it
  // wraps; drag to look around while zoomed. `zoomed` tells the viewer to
  // pause swiping between photos until you zoom back out.
  let { zoomed = $bindable(false), children } = $props()

  let scale = $state(1)
  let x = $state(0)
  let y = $state(0)
  let el
  const pointers = new Map()
  let pinch = null
  let pan = null
  let lastTap = 0

  const MAX = 4

  function clamp() {
    if (scale <= 1.01) {
      scale = 1
      x = 0
      y = 0
    } else {
      const r = el.getBoundingClientRect()
      const w = r.width / scale
      const h = r.height / scale
      const mx = (w * (scale - 1)) / 2
      const my = (h * (scale - 1)) / 2
      x = Math.max(-mx, Math.min(mx, x))
      y = Math.max(-my, Math.min(my, y))
    }
    zoomed = scale > 1
  }

  // Zoom to `next`, keeping the point under (cx, cy) in place.
  function zoomAt(next, cx, cy) {
    const r = el.getBoundingClientRect()
    const ox = cx - (r.left + r.width / 2)
    const oy = cy - (r.top + r.height / 2)
    const k = next / scale
    x = ox - (ox - x) * k
    y = oy - (oy - y) * k
    scale = next
    clamp()
  }

  function down(e) {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()]
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: scale }
      pan = null
    } else if (scale > 1) {
      pan = { x: e.clientX, y: e.clientY, ox: x, oy: y }
      el.setPointerCapture?.(e.pointerId)
    }
  }
  function move(e) {
    if (!pointers.has(e.pointerId)) return
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      zoomAt(Math.max(1, Math.min(MAX, (pinch.s * d) / pinch.d)), (a.x + b.x) / 2, (a.y + b.y) / 2)
    } else if (pan) {
      x = pan.ox + (e.clientX - pan.x)
      y = pan.oy + (e.clientY - pan.y)
      clamp()
    }
  }
  function up(e) {
    pointers.delete(e.pointerId)
    if (pointers.size < 2) pinch = null
    if (!pointers.size) {
      if (pan && Math.hypot(e.clientX - pan.x, e.clientY - pan.y) > 6) lastTap = 0
      pan = null
    }
  }
  function tap(e) {
    const now = Date.now()
    if (now - lastTap < 300) {
      zoomAt(scale > 1 ? 1 : 2.5, e.clientX, e.clientY)
      lastTap = 0
    } else lastTap = now
  }

  export function reset() {
    scale = 1
    x = 0
    y = 0
    zoomed = false
  }
</script>

<div
  class="zoom"
  class:zoomed
  bind:this={el}
  onpointerdown={down}
  onpointermove={move}
  onpointerup={up}
  onpointercancel={up}
  onclick={tap}
  role="presentation"
>
  <div class="inner" style="transform: translate({x}px, {y}px) scale({scale})" class:moving={pinch || pan}>
    {@render children()}
  </div>
</div>

<style>
  .zoom {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* The viewer handles every gesture itself (swipe, pinch, pan). */
    touch-action: none;
    cursor: zoom-in;
  }
  .zoom.zoomed {
    touch-action: none;
    cursor: grab;
  }
  .inner {
    display: grid;
    place-items: center;
    max-width: 100%;
    max-height: 100%;
    transform-origin: center;
    transition: transform 250ms var(--ease-out);
    will-change: transform;
  }
  .inner.moving {
    transition: none;
  }
</style>
