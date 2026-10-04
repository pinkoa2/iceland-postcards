<script>
  // A perforated picture stamp: a crop of the day's photo inked in its colour.
  let { photo = null, colour, value = '', country = '', class: cls = '' } = $props()

  const uid = $props.id()
  // Perforation holes every 8 units around a 100 × 124 sheet.
  const holes = []
  for (let x = 4; x <= 100; x += 8) holes.push([x, 0], [x, 124])
  for (let y = 4; y <= 124; y += 8) holes.push([0, y], [100, y])
</script>

<svg class="stamp {cls}" viewBox="0 0 100 124" aria-hidden="true">
  <defs>
    <mask id="{uid}-perf">
      <rect width="100" height="124" fill="#fff" />
      {#each holes as [cx, cy]}<circle {cx} {cy} r="2.7" fill="#000" />{/each}
    </mask>
    <clipPath id="{uid}-art"><rect x="9" y="9" width="82" height="92" /></clipPath>
  </defs>
  <g mask="url(#{uid}-perf)">
    <rect width="100" height="124" fill="#fbfbf8" />
    <rect x="9" y="9" width="82" height="92" fill={colour.ink} />
    {#if photo}
      <image
        href={photo.srcset.split(', ')[0].split(' ')[0]}
        x="9"
        y="9"
        width="82"
        height="92"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#{uid}-art)"
      />
      <rect x="9" y="9" width="82" height="92" fill={colour.ink} opacity="0.28" style="mix-blend-mode: multiply" />
    {/if}
    <text class="value" x="14" y="27" fill="#fff">{value}</text>
    <text class="country" x="50" y="116" text-anchor="middle" fill={colour.ink}>{country}</text>
  </g>
</svg>

<style>
  .stamp {
    filter: drop-shadow(0 1px 1px rgb(22 32 64 / 0.2)) drop-shadow(0 3px 5px rgb(22 32 64 / 0.14));
  }
  .value {
    font-size: 17px;
    font-stretch: 125%;
    font-weight: 850;
    paint-order: stroke;
  }
  .country {
    font-size: 9px;
    font-stretch: 75%;
    font-weight: 750;
    letter-spacing: 0.28em;
    text-transform: uppercase;
  }
</style>
