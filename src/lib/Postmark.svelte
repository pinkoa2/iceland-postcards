<script>
  // A circular rubber-stamp postmark: place around the top, measured facts
  // around the bottom, a big centre figure, optional wavy cancellation lines.
  // `waves` sets how far the cancellation lines run (in wave segments).
  let { top = '', bottom = '', label = '', figure = '', ink = 'currentColor', cancel = false, waves = 6, class: cls = '' } = $props()

  const uid = $props.id()
  const fit = (text, room) => (text.length * 5.6 > room ? room : undefined)
  const W = $derived(cancel ? 124 + waves * 23 : 120)
</script>

<svg class="postmark {cls}" viewBox="0 0 {W} 120" style="--ink: {ink}" aria-hidden="true">
  <defs>
    <path id="{uid}-t" d="M 17 60 A 43 43 0 0 1 103 60" />
    <path id="{uid}-b" d="M 10 60 A 50 50 0 0 0 110 60" />
    <!-- Rubber on paper: uneven pressure, slightly broken edges. -->
    <filter id="{uid}-ink" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.7" result="holes" />
      <feComposite in="SourceGraphic" in2="holes" operator="in" />
    </filter>
  </defs>
  <g filter="url(#{uid}-ink)" fill="none" stroke="var(--ink)">
    <circle cx="60" cy="60" r="56" stroke-width="2.6" />
    <circle cx="60" cy="60" r="35" stroke-width="1.4" />
    {#if cancel}
      {#each [24, 42, 60, 78, 96] as y, i}
        <path
          d="M 122 {y} q 11 -{5 + (i % 2)} 23 0{' t 23 0'.repeat(waves - 1)}"
          stroke-width="2.2"
          stroke-linecap="round"
        />
      {/each}
    {/if}
    <g fill="var(--ink)" stroke="none">
      <text class="ring" font-size="10.5">
        <textPath href="#{uid}-t" startOffset="50%" text-anchor="middle" textLength={fit(top, 132)} lengthAdjust="spacingAndGlyphs">{top}</textPath>
      </text>
      <text class="ring" font-size="10.5">
        <textPath href="#{uid}-b" startOffset="50%" text-anchor="middle" textLength={fit(bottom, 150)} lengthAdjust="spacingAndGlyphs">{bottom}</textPath>
      </text>
      {#if label}<text class="label" x="60" y="49" text-anchor="middle" font-size="9">{label}</text>{/if}
      <text class="figure" x="60" y={label ? 80 : 72} text-anchor="middle" font-size={figure.length > 2 ? 22 : 32}>{figure}</text>
    </g>
  </g>
</svg>

<style>
  .postmark {
    overflow: visible;
    color: var(--ink);
  }
  .ring {
    font-stretch: 75%;
    font-weight: 650;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .label {
    font-stretch: 75%;
    font-weight: 700;
    letter-spacing: 0.3em;
  }
  .figure {
    font-stretch: 125%;
    font-weight: 850;
    letter-spacing: -0.02em;
  }
</style>
