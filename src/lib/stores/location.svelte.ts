import { browser } from '$app/environment'
import type { GeoLocation } from '$lib/types/location'

const LOCALSTORAGE_KEY = 'wallclock.locations'

// Load from localStorage
function loadLocations(): GeoLocation[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Save to localStorage
function saveLocations(entry: GeoLocation[]) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(entry))
}

class LocationStore {
  #locations: GeoLocation[] = $state([])

  constructor() {
    if (!browser) return
    this.#locations = loadLocations()
  }

  #setLocations(locations: GeoLocation[]) {
    this.#locations = locations.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return a.name.localeCompare(b.name)
    })
    saveLocations(this.#locations)
  }

  get list() {
    return this.#locations
  }

  add = (location: GeoLocation) => {
    if (!this.#locations.some((e) => e.id === location.id)) {
      this.#locations = [...this.#locations, location]
      saveLocations(this.#locations)
    }
  }

  remove = (id: string) => {
    this.#setLocations(this.#locations.filter((e) => e.id !== id))
  }

  set = (entries: GeoLocation[]) => {
    this.#setLocations(entries)
  }

  clear = () => {
    this.#setLocations([])
  }

  has = (location: GeoLocation | string) => {
    const id = typeof location === 'string' ? location : location.id
    return this.#locations.some((e) => e.id === id)
  }

  toggle = (location: GeoLocation) => {
    if (this.has(location)) {
      this.remove(location.id)
    } else {
      this.add(location)
    }
  }
  toggleFavorite = (location: GeoLocation | string) => {
    // allow passing object or id only, for tests and convenience
    const id = typeof location === 'string' ? location : location.id

    // idx of operated location
    const index = this.#locations.findIndex((e) => e.id === id)
    if (index === -1) return

    const updated = this.#locations.map((loc, i) => {
      if (i === index) {
        // Toggle favorite for this location
        return { ...loc, isFavorite: !loc.isFavorite }
      }
      // Remove favorite from any other location
      if (loc.isFavorite && loc.id !== id) {
        return { ...loc, isFavorite: false }
      }
      return loc
    })
    this.#setLocations(updated)
  }
}
const store = new LocationStore()
export default store
