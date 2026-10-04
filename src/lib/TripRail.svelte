<script>
  // Where you are in the trip: a winding road at the right edge, one equal
  // stretch per day, each filling in its day's colour as you read through that
  // day, with a red map pin marking exactly where you are.
  let { days, visible = false } = $props()

  let progress = $state(0)
  let height = $state(0)
  let wide = $state(false)
  let sections = []

  // ---------- scroll position → trip progress ----------

  function measure() {
    sections = days.map((d) => {
      const el = document.getElementById(d.id)
      return { top: el.getBoundingClientRect().top + scrollY, height: el.offsetHeight }
    })
    wide = matchMedia('(min-width: 960px)').matches
    update()
  }

  function update() {
    if (!sections.length) return
    const at = scrollY + innerHeight * 0.45
    const n = sections.length
    let p = 0
    for (let i = 0; i < n; i++) {
      const { top, height: h } = sections[i]
      if (at >= top + h) p = i + 1
      else if (at >= top) {
        p = i + (at - top) / h
        break
      } else break
    }
    progress = Math.min(1, p / n)
  }

  let frame = 0
  function onscroll() {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(update)
  }

  $effect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => ro.disconnect()
  })

  // ---------- the road ----------

  const W = $derived(wide ? 72 : 28)
  const PAD = $derived(wide ? 15 : 7)

  // A winding line sampled every few pixels, with its running length, so
  // points and fills can be placed by distance along the road. The bends
  // vary: the frequency drifts (lazy curves, then tighter turns) and the
  // swing grows and shrinks (some near-straight stretches).
  const road = $derived.by(() => {
    const H = height
    if (!H) return null
    const amp = (W - PAD * 2) / 2
    const TAU = Math.PI * 2
    const pts = []
    for (let y = 0; y <= H; y += 3) {
      const t = y / H
      const phase = TAU * (4.6 * t + 0.55 * Math.sin(TAU * 1.15 * t + 0.4) + 0.18 * Math.sin(TAU * 3.1 * t))
      const swing = 0.35 + 0.65 * Math.abs(Math.sin(TAU * 0.85 * t + 0.9))
      const wobble = 0.1 * Math.sin(TAU * 6.7 * t + 2.1)
      const x = W / 2 + amp * Math.max(-1, Math.min(1, swing * Math.sin(phase) + wobble * swing))
      pts.push([x, y])
    }
    const len = [0]
    for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    const d = 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y}`).join('L')
    return { pts, len, total: len.at(-1), d }
  })

  function pointAt(s) {
    const { pts, len } = road
    let i = 1
    while (i < len.length - 1 && len[i] < s) i++
    const t = (s - len[i - 1]) / (len[i] - len[i - 1] || 1)
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, angle: (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI }
  }

  const seg = $derived(road ? road.total / days.length : 0)
  const fill = (i) => Math.max(0, Math.min(1, progress * days.length - i))
  const currentIndex = $derived(Math.min(days.length - 1, Math.floor(progress * days.length)))
  const stops = $derived(road ? days.map((_, i) => pointAt(i * seg + (i === 0 ? 0.01 : 0))) : [])
  const car = $derived(road ? pointAt(Math.max(0.5, Math.min(road.total - 0.5, progress * road.total))) : null)
</script>

<svelte:window {onscroll} onresize={measure} />

<nav class="rail" class:visible aria-label="Trip progress" bind:clientHeight={height} style="width: {W}px">
  {#if road}
    <svg width={W} height={height} viewBox="0 0 {W} {height}" aria-hidden="true">
      <path class="road" d={road.d} />
      <path class="centre" d={road.d} />
      {#each days as d, i}
        {@const f = fill(i)}
        {#if f > 0}
          <path class="done" d={road.d} style="stroke: {d.colour.ink}" stroke-dasharray="0 {i * seg} {f * seg} {road.total}" />
        {/if}
      {/each}
    </svg>

    <ol>
      {#each days as d, i}
        <li style="left: {stops[i].x}px; top: {stops[i].y}px; --day: {d.colour.ink}">
          <a href="#{d.id}" aria-label="Day {d.n}: {d.title}" class:current={i === currentIndex} class:passed={fill(i) > 0} aria-current={i === currentIndex ? 'step' : undefined}>
            <span class="dot">{d.n}</span>
            <span class="tip">{d.title}</span>
          </a>
        </li>
      {/each}
    </ol>

    <!-- You are here: a red map pin, its point on the road. -->
    <svg class="pin" style="left: {car.x}px; top: {car.y}px" viewBox="0 0 24 32" aria-hidden="true">
      <path d="M12 31C12 31 2 19.2 2 11.5A10 10 0 0 1 22 11.5C22 19.2 12 31 12 31Z" class="pin-body" />
      <circle cx="12" cy="11.5" r="4" class="pin-hole" />
    </svg>
  {/if}
</nav>

<style>
  .rail {
    position: fixed;
    z-index: 9;
    right: 8px;
    top: 50%;
    height: min(66vh, 580px);
    translate: 8px -50%;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 300ms var(--ease-out),
      translate 300ms var(--ease-out);
  }
  .rail.visible {
    opacity: 1;
    translate: 0 -50%;
    pointer-events: auto;
  }
  svg {
    position: absolute;
    inset: 0;
    overflow: visible;
  }
  path {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .road {
    stroke: #c6cbc3;
    stroke-width: 6;
  }
  .centre {
    stroke: var(--card);
    stroke-width: 0.8;
    stroke-dasharray: 3 4;
  }
  .done {
    stroke-width: 6;
    stroke-linecap: butt;
  }
  ol {
    position: absolute;
    inset: 0;
  }
  li {
    position: absolute;
    translate: -50% -50%;
  }
  a {
    position: relative;
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  .dot {
    display: block;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: var(--ground);
    box-shadow: inset 0 0 0 2px var(--on-ground-faint);
    font-size: 0;
    transition:
      scale 250ms var(--ease-out),
      background 250ms;
  }
  .passed .dot {
    background: var(--day);
    box-shadow: 0 0 0 2px var(--ground);
  }
  .tip {
    display: none;
  }
  .pin {
    position: absolute;
    inset: auto;
    width: 19px;
    height: 25px;
    /* The point of the pin sits on the road. */
    translate: -50% -96%;
    filter: drop-shadow(0 2px 2px rgb(22 32 64 / 0.35));
  }
  .pin-body {
    fill: var(--airmail-red);
    stroke: var(--card);
    stroke-width: 1.6;
  }
  .pin-hole {
    fill: var(--card);
  }

  @media (min-width: 960px) {
    .rail {
      right: 30px;
    }
    .road {
      stroke-width: 10;
    }
    .centre {
      stroke-width: 1.2;
      stroke-dasharray: 5 6;
    }
    .done {
      stroke-width: 10;
    }
    .dot {
      display: grid;
      place-items: center;
      width: 25px;
      height: 25px;
      font-size: 0.76rem;
      font-stretch: 112%;
      font-weight: 800;
      color: var(--on-ground-soft);
      background: var(--card);
      box-shadow:
        inset 0 0 0 2px var(--on-ground-faint),
        0 1px 3px rgb(22 32 64 / 0.2);
    }
    .passed .dot {
      color: #fff;
      box-shadow:
        0 0 0 2px var(--card),
        0 1px 3px rgb(22 32 64 / 0.25);
    }
    .tip {
      display: block;
      position: absolute;
      right: 32px;
      padding: 5px 10px;
      white-space: nowrap;
      font-size: 0.85rem;
      font-weight: 650;
      color: var(--ink);
      background: var(--card);
      box-shadow: var(--shadow-print);
      opacity: 0;
      translate: 6px 0;
      pointer-events: none;
      transition:
        opacity 200ms var(--ease-out),
        translate 200ms var(--ease-out);
    }
    a:hover .tip,
    a:focus-visible .tip {
      opacity: 1;
      translate: none;
    }
    .pin {
      width: 29px;
      height: 39px;
    }
  }
</style>
