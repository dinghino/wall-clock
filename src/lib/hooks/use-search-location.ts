import * as locations from '$lib/api/location'
import type { GeoLocation } from '$lib/types/location'

export async function useSearchLocation(query: string): Promise<GeoLocation[]> {
  try {
    const results = await locations.search(query)
    return results
  } catch (error) {
    console.error('Error in useSearchLocation:', error)
    return []
  }
}
