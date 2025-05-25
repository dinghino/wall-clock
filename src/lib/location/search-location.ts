import type { GeocodingResponse, GeoLocation } from '$lib/types/location'
import dayjs from 'dayjs'

/**
 * Searches for locations based on a query string using the Open Meteo Geocoding API.
 * @param {string} query The search query for locations, i.e. a city name, region, or country.
 * @returns {Promise<GeoLocation[]>} A promise that resolves to an array of GeoLocation objects.
 * @see {@link GeoLocation} internal type
 * @see {@link GeocodingResponse} open-meteo response
 */
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

    return data.results.map(
      (result: GeocodingResponse) =>
        ({
          id: result.id.toString(),
          name: result.name,
          lat: result.latitude,
          lon: result.longitude,
          timezone: result.timezone,
          country: result.country,
          admin1: result.admin1,
          utcDelta: dayjs.utc().tz(result.timezone).format('Z')
        }) satisfies GeoLocation
    )
  } catch (error) {
    console.error('Error searching locations:', error)
    throw new Error('Failed to search locations')
  }
}
