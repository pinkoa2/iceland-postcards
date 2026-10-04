// Scaffolds a new trip: npm run new-trip -- taiwan-2027
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const id = process.argv[2]
if (!id || !/^[a-z0-9-]+$/.test(id)) {
  console.error('Usage: npm run new-trip -- <trip-id>   (lowercase, hyphens, e.g. taiwan-2027)')
  process.exit(1)
}
const dir = path.join(root, 'trips', id)
if (existsSync(dir)) {
  console.error(`trips/${id} already exists`)
  process.exit(1)
}
await fs.mkdir(path.join(dir, 'media', 'day-1'), { recursive: true })
await fs.writeFile(
  path.join(dir, 'trip.js'),
  `// ${id} — see trips/iceland-2026/trip.js for a complete example.
export default {
  title: 'Taiwan',
  heading: 'Taiwan', // the page heading, e.g. 'Taiwan Roadtrip'
  year: 2027,
  travellers: [],
  subdomain: '${id.split('-')[0]}.pinkoa2.lol',
  units: 'mi', // distances on the page: 'mi' or 'km'
  country: 'Taiwan', // Natural Earth country name, drawn behind the maps
  cover: 'day-1/cover.jpg', // top postcard + link preview
  summary: '',
  days: [
    {
      title: 'Day one',
      description: '',
      stops: [
        // { name: 'Taipei 101', lat: 25.0339, lng: 121.5645 },
      ],
      media: [
        // { src: 'day-1/cover.jpg', alt: 'What the photo shows', caption: 'Place name', cover: true },
      ],
    },
  ],
}
`,
)
console.log(`Created trips/${id}/. Add photos to media/day-N/, fill in trip.js, then: TRIP=${id} npm run dev`)
