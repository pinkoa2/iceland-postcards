import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// The trip to build: TRIP=<id>, or the only trip in trips/.
export function resolveTripId() {
  const trips = readdirSync(path.join(root, 'trips')).filter((d) => existsSync(path.join(root, 'trips', d, 'trip.js')))
  const wanted = process.env.TRIP
  if (wanted) {
    if (!trips.includes(wanted)) throw new Error(`No trip "${wanted}". Have: ${trips.join(', ')}`)
    return wanted
  }
  if (trips.length === 1) return trips[0]
  throw new Error(`Several trips exist (${trips.join(', ')}). Pick one, e.g. TRIP=${trips[0]} npm run dev`)
}
