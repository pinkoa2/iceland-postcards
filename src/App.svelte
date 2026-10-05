<script>
  import trip from 'virtual:trip'
  import Cover from './lib/Cover.svelte'
  import Day from './lib/Day.svelte'
  import DayNav from './lib/DayNav.svelte'
  import TripRail from './lib/TripRail.svelte'
  import Closing from './lib/Closing.svelte'
  import Lightbox from './lib/Lightbox.svelte'

  let viewer = $state({ items: [], index: null, heading: '' })
  let current = $state(null)
  let pastCover = $state(false)
  let coverEnd = $state()


  // On wide screens the map alternates sides from day to day.
  const layouts = trip.days.map((_, i) => (i % 2 ? 'right' : 'left'))

  function openDay(day, i) {
    viewer = { items: day.media, index: i, heading: `Day ${day.n}: ${day.title}` }
  }
  // Every photo of the trip, the cover first, for the pile on the cover.
  const allMedia = [trip.cover, ...trip.days.flatMap((d) => d.media.filter((m) => m.kind === 'photo'))]
  const allPhotos = allMedia.map((m, i) => ({ m, i }))

  function openMap(day) {
    viewer = {
      items: [{ kind: 'map', day, caption: `Day ${day.n}: ${day.title}`, link: day.gmaps }],
      index: 0,
      heading: `Map of day ${day.n}`,
    }
  }


  $effect(() => {
    const sections = trip.days.map((d) => document.getElementById(d.id))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) current = Number(e.target.id.split('-')[1])
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    // Past the cover once its end has scrolled above the top of the screen.
    const check = () => {
      pastCover = coverEnd.getBoundingClientRect().top < 0
      if (!pastCover) current = null
    }
    check()
    addEventListener('scroll', check, { passive: true })
    return () => {
      io.disconnect()
      removeEventListener('scroll', check)
    }
  })
</script>

<div id="top"></div>
<Cover {trip} photos={allPhotos} onopen={(i) => (viewer = { items: allMedia, index: i, heading: trip.heading })} />
<div bind:this={coverEnd} aria-hidden="true"></div>

<main>
  {#each trip.days as day, i (day.id)}
    <Day
      {day}
      {trip}
      layout={layouts[i]}
      onopen={(i) => openDay(day, i)}
      onmap={() => openMap(day)}
    />
  {/each}
</main>

<Closing />
<TripRail days={trip.days} visible={pastCover} />
<DayNav days={trip.days} {current} visible={pastCover} />
<Lightbox items={viewer.items} bind:index={viewer.index} heading={viewer.heading} />
