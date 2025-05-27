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
    this.#locations = this.#locations.filter((e) => e.id !== id)
    saveLocations(this.#locations)
  }

  set = (entries: GeoLocation[]) => {
    this.#locations = entries
  }

  clear = () => {
    this.#locations = []
    saveLocations(this.#locations)
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
  toggleFavorite = (location: GeoLocation|string) => {
    // allow passing object or id only, for tests and convenience
    const id = typeof location === 'string' ? location : location.id
    
    // idx of operated location
    const index = this.#locations.findIndex((e) => e.id === id)
    if (index === -1) return
    
    // find previous favorite and remove it. do it only if not this one
    const prevIdx = this.#locations.findIndex((e) => e.isFavorite && e.id !== id)
    if (prevIdx !== -1) {
      this.#locations[prevIdx].isFavorite = false
    }

    this.#locations[index].isFavorite = !this.#locations[index].isFavorite
    saveLocations(this.#locations)
  }
}
const store = new LocationStore()
export default store
