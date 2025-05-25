import type { GeocodingResponse, GeoLocation } from '$lib/types/location'

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    )

    if (!response.ok) {
      throw new Error('Failed to search locations')
    }

    const data = await response.json()

    if (!data.results || !Array.isArray(data.results)) {
      return []
    }
    return data.results.map((result: GeocodingResponse) => ({
      id: result.id,
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
      country: result.country,
      region: result.admin1,
      isFeatured: false
    }))
  } catch (error) {
    console.error('Error searching locations:', error)
    throw new Error('Failed to search locations')
  }
}
