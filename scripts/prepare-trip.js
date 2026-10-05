// Turns content/ into everything the page needs at build time:
//   .generated/public/   responsive WebP sizes, videos, link-preview image
//   .generated/trip.json the manifest the Svelte app imports
// Road routes are fetched once from the public OSRM server and cached in
// content/routes.json, so CI builds never hit the network.
//
// Usage: npm run prepare-trip (dev and build run it first)

import fs from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { geoAzimuthalEqualArea, geoPath, geoBounds, geoCentroid } from 'd3-geo'
import { feature } from 'topojson-client'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const WIDTHS = [480, 960, 1600]
const VIDEO = /\.(mp4|mov|webm|m4v)$/i
// Hues too close to the airmail-blue ground; stamp colours avoid them.
const GROUND_HUE = [215, 290]
const FALLBACK_HUES = [25, 145, 300, 55, 175, 340, 95]

const tripDir = path.join(root, 'content')
const mediaDir = path.join(tripDir, 'media')
const outDir = path.join(root, '.generated')
const pubDir = path.join(outDir, 'public')
const trip = (await import(pathToFileURL(path.join(tripDir, 'trip.js')).href + `?t=${Date.now()}`)).default

await fs.mkdir(pubDir, { recursive: true })

// ---------- images ----------

const fresh = (src, out) => existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs

async function image(rel) {
  const src = path.join(mediaDir, rel)
  if (!existsSync(src)) throw new Error(`Missing media file: content/media/${rel}`)
  const meta = await sharp(src).rotate().metadata()
  // .rotate() bakes orientation; width/height may be swapped by EXIF.
  const turned = (meta.orientation ?? 1) >= 5
  const w = turned ? meta.height : meta.width
  const h = turned ? meta.width : meta.height
  const base = rel.replace(/\.[^.]+$/, '')
  const widths = WIDTHS.filter((x) => x < w).concat(w <= WIDTHS.at(-1) ? [w] : []).slice(0, 3)
  const srcset = []
  for (const width of widths) {
    const name = `m/${base}-${width}.webp`
    const out = path.join(pubDir, name)
    if (!fresh(src, out)) {
      await fs.mkdir(path.dirname(out), { recursive: true })
      await sharp(src).rotate().resize({ width }).webp({ quality: 78 }).toFile(out)
    }
    srcset.push(`/${name} ${width}w`)
  }
  const tiny = await sharp(src).rotate().resize(24).blur(2).webp({ quality: 40 }).toBuffer()
  return {
    w,
    h,
    src: srcset.at(-1).split(' ')[0],
    srcset: srcset.join(', '),
    placeholder: `data:image/webp;base64,${tiny.toString('base64')}`,
    file: src,
  }
}

async function video(rel) {
  const src = path.join(mediaDir, rel)
  const out = path.join(pubDir, 'm', rel)
  if (!fresh(src, out)) {
    await fs.mkdir(path.dirname(out), { recursive: true })
    await fs.copyFile(src, out)
  }
  return `/m/${rel}`
}

// ---------- colour ----------

function srgbToOklch([r, g, b]) {
  const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const [R, G, B] = [lin(r), lin(g), lin(b)]
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { L, C: Math.hypot(a, bb), H: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 }
}

// Ranked hue candidates from a photo: saturated, non-ground-blue colour mass.
async function hueCandidates(file) {
  const { data } = await sharp(file).rotate().resize(48, 48, { fit: 'cover' }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const bins = new Map()
  for (let i = 0; i < data.length; i += 3) {
    const { L, C, H } = srgbToOklch([data[i], data[i + 1], data[i + 2]])
    if (C < 0.045 || L < 0.25 || L > 0.95) continue
    if (H >= GROUND_HUE[0] && H <= GROUND_HUE[1]) continue
    const bin = Math.round(H / 15) % 24
    const e = bins.get(bin) ?? { weight: 0, h: 0, c: 0 }
    e.weight += C
    e.h += H * C
    e.c += C * C
    bins.set(bin, e)
  }
  return [...bins.values()]
    .filter((e) => e.weight > 0.6)
    .sort((a, b) => b.weight - a.weight)
    .map((e) => ({ h: e.h / e.weight, c: e.c / e.weight }))
    .filter((e) => e.h < GROUND_HUE[0] - 10 || e.h > GROUND_HUE[1] + 10)
}

const hueGap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b))

// Where the photo's subject sits horizontally (0 = left edge, 1 = right), so
// the card back can be laid over the side the subject isn't on.
async function subjectX(file) {
  const W = 120
  const small = await sharp(file).rotate().resize({ width: 300 }).png().toBuffer({ resolveWithObject: true })
  const ar = small.info.width / small.info.height
  const { info } = await sharp(small.data).resize(W, W, { fit: 'cover', position: sharp.strategy.attention }).toBuffer({ resolveWithObject: true })
  const preW = ar >= 1 ? W * ar : W
  return +Math.min(1, Math.max(0, (info.attentionX ?? preW / 2) / preW)).toFixed(2)
}

function stampColours(h, c) {
  const chroma = Math.min(Math.max(c * 1.6, 0.11), 0.17)
  const f = (n) => n.toFixed(3)
  return {
    hue: Math.round(h),
    ink: `oklch(0.5 ${f(chroma)} ${h.toFixed(1)})`,
    bright: `oklch(0.72 ${f(chroma)} ${h.toFixed(1)})`,
    wash: `oklch(0.93 ${f(chroma * 0.28)} ${h.toFixed(1)})`,
  }
}

// ---------- routes ----------

const routesFile = path.join(tripDir, 'routes.json')
const routeCache = existsSync(routesFile) ? JSON.parse(await fs.readFile(routesFile, 'utf8')) : {}
let routesDirty = false

async function route(stops) {
  const key = stops.map((s) => `${s.lng.toFixed(5)},${s.lat.toFixed(5)}`).join(';')
  if (routeCache[key]) return routeCache[key]
  const url = `https://router.project-osrm.org/route/v1/driving/${key}?overview=full&geometries=geojson`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'iceland-postcards' } })
    const json = await res.json()
    if (json.code !== 'Ok') throw new Error(json.code)
    const r = json.routes[0]
    routeCache[key] = {
      km: Math.round(r.distance / 1000),
      coordinates: r.geometry.coordinates.map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]),
    }
    routesDirty = true
    console.log(`  fetched road route: ${stops[0].name} → ${stops.at(-1).name}`)
  } catch (err) {
    console.warn(`  ! no road route for ${stops[0].name} → ${stops.at(-1).name} (${err.message}); drawing straight lines`)
    return { km: null, coordinates: stops.map((s) => [s.lng, s.lat]) }
  }
  return routeCache[key]
}

// ---------- maps ----------

const atlas = JSON.parse(await fs.readFile(path.join(root, 'node_modules/world-atlas/countries-10m.json'), 'utf8'))
const countries = feature(atlas, atlas.objects.countries).features
const land = countries.find((f) => f.properties.name === trip.country)
if (trip.country && !land) throw new Error(`Country "${trip.country}" not found in Natural Earth data`)

const line = (coordinates) => ({ type: 'LineString', coordinates })

function localProjection(target) {
  const [lng, lat] = geoCentroid(target)
  return geoAzimuthalEqualArea().rotate([-lng, -lat])
}

// Ramer–Douglas–Peucker in screen space: routes carry every GPS point, the
// drawing only needs what survives at this scale.
function simplify(pts, tol) {
  if (pts.length < 3) return pts
  const [a, b] = [pts[0], pts.at(-1)]
  let max = 0
  let at = 0
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / len
    if (d > max) [max, at] = [d, i]
  }
  if (max <= tol) return [a, b]
  return simplify(pts.slice(0, at + 1), tol).slice(0, -1).concat(simplify(pts.slice(at), tol))
}

function drawMap(target, w, h, pad, lines, points) {
  const proj = localProjection(target).fitExtent([[pad, pad], [w - pad, h - pad]], target)
  proj.clipExtent([[0, 0], [w, h]])
  const p = geoPath(proj).digits(1)
  const linePath = (coords) =>
    'M' + simplify(coords.map((c) => proj(c)), w / 900).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')
  return {
    w,
    h,
    land: land ? p(land) : null,
    lines: lines.map(linePath),
    points: points.map((pt) => proj([pt.lng, pt.lat]).map((n) => +n.toFixed(1))),
  }
}

// A day's own map: its road route in full, the rest of the trip faint for
// context, numbered stops nudged apart where they crowd (each keeps a leader
// back to its true position). Days without a drive get a pin on a local map.
function dayMap(stops, coords, place, context) {
  const W = 800
  const H = 600
  let target
  if (coords) target = line(coords)
  else if (place?.lat != null) {
    const { lat, lng } = place
    target = { type: 'MultiPoint', coordinates: [[lng - 0.45, lat - 0.16], [lng + 0.45, lat + 0.16]] }
  } else return null
  const proj = localProjection(target).fitExtent([[70, 60], [W - 70, H - 60]], target)
  proj.clipExtent([[0, 0], [W, H]])
  const p = geoPath(proj).digits(1)
  const linePath = (c) => 'M' + simplify(c.map((x) => proj(x)), 0.8).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')
  const pins = (coords ? stops : [place]).map((s, i, all) => {
    const [x, y] = proj([s.lng, s.lat])
    return { n: i + 1, ax: x, ay: y, x, y, end: i === 0 || i === all.length - 1 }
  })
  for (let pass = 0; pass < 60; pass++) {
    for (const a of pins) {
      for (const b of pins) {
        if (a === b) continue
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy)
        if (d < 42) {
          const ux = d ? dx / d : 0.7
          const uy = d ? dy / d : 0.7
          const push = (42 - d) / 2
          a.x -= ux * push
          a.y -= uy * push
          b.x += ux * push
          b.y += uy * push
        }
      }
    }
  }
  const r = (n) => +n.toFixed(1)
  return {
    w: W,
    h: H,
    land: land ? p(land) : null,
    context: context.map((c) => linePath(c)),
    route: coords ? linePath(coords) : null,
    pins: pins.map((q) => ({ n: q.n, end: q.end, x: r(q.x), y: r(q.y), ax: r(q.ax), ay: r(q.ay) })),
  }
}

const unit = trip.units === 'mi' ? 'mi' : 'km'
const toUnit = (km) => Math.round(unit === 'mi' ? km * 0.621371 : km)

// ---------- assemble ----------

console.log('Preparing the trip')

const days = []
const allRouteLines = []

for (const [i, day] of trip.days.entries()) {
  const n = i + 1
  const media = []
  for (const m of day.media ?? []) {
    if (VIDEO.test(m.src)) {
      if (!m.poster) throw new Error(`Video ${m.src} needs a poster image`)
      media.push({ kind: 'video', video: await video(m.src), ...(await image(m.poster)), alt: m.alt ?? '', caption: m.caption ?? null })
    } else {
      media.push({ kind: 'photo', ...(await image(m.src)), alt: m.alt ?? '', caption: m.caption ?? null, cover: !!m.cover })
    }
  }
  const coverIndex = Math.max(0, media.findIndex((m) => m.cover))
  const cover = media[coverIndex] ?? null

  // Stamp colour candidates, sampled from the cover photo then the rest of
  // the day. Colours are assigned once every day is known (below).
  const sources = [cover, ...media.filter((x) => x !== cover)].filter(Boolean).map((m) => m.file)
  // A photo-less day wears the trip's cover on its stamp; sample that.
  if (!sources.length && trip.cover) sources.push(path.join(mediaDir, trip.closing?.src ?? trip.cover))
  const candidates = []
  if (!day.stamp) for (const f of sources) candidates.push(...(await hueCandidates(f)))
  const focusX = sources[0] ? await subjectX(sources[0]) : 0.5

  const stops = day.stops ?? []
  const place = typeof day.place === 'string' ? { name: day.place } : day.place ?? null
  let r = null
  if (stops.length >= 2) {
    r = await route(stops)
    allRouteLines.push({ day: n, coordinates: r.coordinates })
  }
  const coordsOf = r?.coordinates ?? null

  const gmaps =
    stops.length >= 2
      ? 'https://www.google.com/maps/dir/?api=1&travelmode=driving' +
        `&origin=${stops[0].lat},${stops[0].lng}` +
        `&destination=${stops.at(-1).lat},${stops.at(-1).lng}` +
        (stops.length > 2 ? `&waypoints=${stops.slice(1, -1).map((s) => `${s.lat},${s.lng}`).join('%7C')}` : '')
      : place
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.lat != null ? `${place.lat},${place.lng}` : `${place.name}, ${trip.country ?? trip.title}`)}`
        : null

  days.push({
    n,
    id: `day-${n}`,
    title: day.title,
    description: day.description ?? '',
    place: place?.name ?? stops.at(-1)?.name ?? null,
    stops: stops.map((s) => s.name),
    // Each stop (or the day's single place) opens on its own in Google Maps.
    stopLinks: (stops.length ? stops : place?.lat != null ? [place] : []).map(
      (s) => `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`,
    ),
    // Distance in the trip's units (routes are cached in km).
    dist: r?.km != null ? toUnit(r.km) : null,
    colour: null,
    candidates,
    stampOverride: day.stamp ?? null,
    focusX,
    coverIndex,
    media: media.map(({ file, cover, ...m }) => m),
    _map: { stops, coords: coordsOf, place },
    gmaps,
  })
}

// Every day gets its own stamp colour, at least 40° of hue from every other
// day where the photos allow it. The most constrained day (fewest candidate
// hues) chooses first; overrides are fixed points.
const assigned = new Map()
for (const d of days) if (d.stampOverride) assigned.set(d.n, stampColours(d.stampOverride.hue, d.stampOverride.chroma ?? 0.14))
const pending = days.filter((d) => !assigned.has(d.n)).sort((a, b) => a.candidates.length - b.candidates.length)
const outsideGround = (h) => !(h >= GROUND_HUE[0] - 10 && h <= GROUND_HUE[1] + 10)

// Try the widest spacing first; each day takes a sampled hue, or failing that
// one nudged at most 45° from its own photo's hues.
function assignAll(gap) {
  const out = new Map(assigned)
  for (const d of pending) {
    const taken = [...out.values()].map((c) => c.hue)
    const clear = (h) => outsideGround(h) && taken.every((u) => hueGap(u, h) >= gap)
    let pick = d.candidates.find((c) => clear(c.h))
    for (let step = 5; step <= 45 && !pick; step += 5) {
      for (const c of d.candidates) {
        for (const h of [(c.h + step) % 360, (c.h - step + 360) % 360]) if (!pick && clear(h)) pick = { h, c: c.c }
      }
    }
    if (!pick && !d.candidates.length) {
      const h = FALLBACK_HUES.find(clear)
      if (h != null) pick = { h, c: 0.08 }
    }
    if (!pick) return null
    out.set(d.n, stampColours(pick.h, pick.c))
  }
  return out
}
let result = null
for (let gap = 40; gap >= 16 && !result; gap -= 2) result = assignAll(gap)
for (const [k, v] of result ?? []) assigned.set(k, v)
for (const d of days) {
  d.colour = assigned.get(d.n)
  delete d.candidates
  delete d.stampOverride
}

// Day maps, each with every other day's route as faint context.
for (const d of days) {
  const { stops, coords, place } = d._map
  const context = allRouteLines.filter((l) => l.day !== d.n).map((l) => l.coordinates)
  d.map = dayMap(stops, coords, place, context)
  delete d._map
}

if (routesDirty) await fs.writeFile(routesFile, JSON.stringify(routeCache, null, 0) + '\n')

// Overview map: the whole country with every day's route, or the routes alone.
const overviewTarget =
  trip.mapFocus === 'route' || !land
    ? { type: 'MultiLineString', coordinates: allRouteLines.map((l) => l.coordinates) }
    : land
const [[w0, s0], [e0, n0]] = geoBounds(overviewTarget)
const aspect = Math.min(Math.max(((e0 - w0) * Math.cos(((s0 + n0) / 2) * (Math.PI / 180))) / (n0 - s0), 0.7), 1.8)
const OW = 1000
const OH = Math.round(OW / aspect)
// Each day's marker sits where it ended: the last stop, or its single place.
const dayStarts = trip.days.map((d) => (d.stops?.length ? d.stops.at(-1) : d.place?.lat != null ? d.place : null))
const overview = drawMap(
  overviewTarget,
  OW,
  OH,
  40,
  allRouteLines.map((l) => l.coordinates),
  dayStarts.filter(Boolean),
)
overview.routes = allRouteLines.map((l, i) => ({ day: l.day, d: overview.lines[i] }))
overview.markers = dayStarts
  .map((s, i) => (s ? { day: i + 1, name: s.name } : null))
  .filter(Boolean)
  .map((m, i) => ({ ...m, at: overview.points[i] }))
  .filter((m) => m.at)
delete overview.lines
delete overview.points
// Days that end in the same town would stack their markers; push them apart.
for (let pass = 0; pass < 40; pass++) {
  for (const a of overview.markers) {
    for (const b of overview.markers) {
      if (a === b) continue
      const dx = b.at[0] - a.at[0]
      const dy = b.at[1] - a.at[1]
      const d = Math.hypot(dx, dy)
      const min = 46
      if (d < min) {
        const ux = d ? dx / d : 1
        const uy = d ? dy / d : 0
        const push = (min - d) / 2
        a.at = [a.at[0] - ux * push, a.at[1] - uy * push]
        b.at = [b.at[0] + ux * push, b.at[1] + uy * push]
      }
    }
  }
}
for (const m of overview.markers) m.at = m.at.map((n) => +n.toFixed(1))

const coverImage = await image(trip.cover ?? trip.days.flatMap((d) => d.media ?? []).find((m) => !VIDEO.test(m.src)).src)
const closing = trip.closing ? { ...(await image(trip.closing.src)), alt: trip.closing.alt ?? '' } : null
coverImage.alt = trip.coverAlt ?? ''
delete coverImage.file
if (closing) delete closing.file

// Link preview: 1200×630 crop of the cover.
const ogOut = path.join(pubDir, 'og.jpg')
const coverSrc = path.join(mediaDir, trip.cover)
await sharp(coverSrc).rotate().resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82 }).toFile(ogOut)

// GitHub Pages custom domain for this trip's site.
if (trip.subdomain) await fs.writeFile(path.join(pubDir, 'CNAME'), trip.subdomain + '\n')

await fs.writeFile(
  path.join(pubDir, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#1b3a8c"/><circle cx="32" cy="32" r="21" fill="none" stroke="#f6f7f4" stroke-width="4"/><circle cx="32" cy="32" r="13" fill="none" stroke="#f6f7f4" stroke-width="2"/><path d="M4 22h56M4 42h56" stroke="#d4332b" stroke-width="3"/></svg>\n`,
)

const totals = {
  days: days.length,
  dist: days.reduce((a, d) => a + (d.dist ?? 0), 0),
  stops: new Set(trip.days.flatMap((d) => (d.stops ?? []).map((s) => s.name))).size,
  photos: days.reduce((a, d) => a + d.media.filter((m) => m.kind === 'photo').length, 0),
  videos: days.reduce((a, d) => a + d.media.filter((m) => m.kind === 'video').length, 0),
}

const manifest = {
  title: trip.title,
  heading: trip.heading ?? trip.title,
  year: trip.year ?? null,
  travellers: trip.travellers ?? [],
  summary: trip.summary ?? '',
  unit,
  subdomain: trip.subdomain ?? null,
  cover: coverImage,
  closing,
  totals,
  overview,
  days,
}
await fs.writeFile(path.join(outDir, 'trip.json'), JSON.stringify(manifest))
console.log(`  ${totals.days} days · ${totals.photos} photos · ${totals.videos} videos · ${totals.dist} ${unit}`)
