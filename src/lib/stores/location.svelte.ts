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
}
const store = new LocationStore()
export default store
