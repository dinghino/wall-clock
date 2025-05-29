import { browser } from '$app/environment'
import type { GeoLocation } from '$lib/types/location'
import { SvelteMap } from 'svelte/reactivity'

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
  // #locations: GeoLocation[] = $state([])

  #data = new SvelteMap<string, GeoLocation>([])
  #loading = $state(true)

  constructor() {
    if (!browser) return
    const data = loadLocations()
    data.forEach((loc) => this.#data.set(loc.id, loc))
    this.#loading = false
  }
  #save() {
    saveLocations([...this.#data.values()])
  }
  get loading() {
    return this.#loading
  }
  get count() {
    return this.#data.size
  }
  get list() {
    return this.#data.values()
  }

  add = (location: GeoLocation) => {
    this.#data.set(location.id, location)
    this.#save()
  }

  remove = (id: string) => {
    this.#data.delete(id)
    this.#save()
  }

  set = (entries: GeoLocation[]) => {
    this.#data.clear()
    entries.forEach((loc) => this.#data.set(loc.id, loc))
    this.#save()
  }

  clear = () => {
    this.#data.clear()
    this.#save()
  }

  has = (location: GeoLocation | string) => {
    const id = typeof location === 'string' ? location : location.id
    return this.#data.has(id)
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

    const item = this.#data.get(id)
    if (!item) return
    const prev = item.isFavorite
    this.#data.forEach((l) => {
      l.isFavorite = false
    }) // reset all favorites
    this.#data.set(id, { ...item, isFavorite: !prev })
    this.#save()
  }
}
const store = new LocationStore()
export default store
