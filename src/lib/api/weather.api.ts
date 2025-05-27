import { fetchWeatherApi } from 'openmeteo'
import type { GeoLocation } from '$lib/types/location'

const url = 'https://api.open-meteo.com/v1/forecast'

const params = {
  daily: [
    'temperature_2m_max',
    'sunrise',
    'sunset',
    'temperature_2m_min',
    'precipitation_probability_max'
  ],
  // hourly: ['temperature_2m', 'precipitation', 'precipitation_probability', 'weather_code'],
  current: ['temperature_2m', 'weather_code', 'is_day']
}

export function makeRequestFor(location: GeoLocation) {
  return {
    ...params,
    latitude: location.lat,
    longitude: location.lon,
    timezone: location.timezone
  }
}

export async function getWeatherData(location: GeoLocation) {
  return fetchWeatherApi(url, makeRequestFor(location))
    .then((data) => data.map((item) => parseWeatherResponse(item)))
    .catch((error) => {
      console.error('Error fetching weather data:', error)
      throw error
    })
}

// lib does not export the type. so sad.
type WeatherResponse = Awaited<ReturnType<typeof fetchWeatherApi>>[number]

function parseWeatherResponse(data: WeatherResponse) {
  const utcOffsetSeconds = data.utcOffsetSeconds()
  const timezone = data.timezone()
  const timezoneAbbreviation = data.timezoneAbbreviation()
  const latitude = data.latitude()
  const longitude = data.longitude()

  const current = data.current()!
  // const hourly = data.hourly()!
  const daily = data.daily()!

  const sunrise = daily.variables(1)!
  const sunset = daily.variables(2)!

  // Build time arrays for hourly and daily
  const buildTimeArray = (start: number, end: number, interval: number) =>
    Array.from(
      { length: (end - start) / interval },
      (_, i) => new Date((start + i * interval + utcOffsetSeconds) * 1000)
    )

  return {
    utcOffsetSeconds,
    timezone,
    timezoneAbbreviation,
    latitude,
    longitude,
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
      weatherCode: current.variables(1)!.value(),
      isDay: current.variables(2)!.value()
    },
    // hourly: {
    //   time: buildTimeArray(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()),
    //   temperature2m: hourly.variables(0)!.valuesArray()!,
    //   precipitation: hourly.variables(1)!.valuesArray()!,
    //   precipitationProbability: hourly.variables(2)!.valuesArray()!,
    //   weatherCode: hourly.variables(3)!.valuesArray()!
    // },
    daily: {
      time: buildTimeArray(Number(daily.time()), Number(daily.timeEnd()), daily.interval()),
      temperature2mMax: daily.variables(0)!.valuesArray()!,
      sunrise: Array.from(
        { length: sunrise.valuesInt64Length() },
        (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
      ),
      sunset: Array.from(
        { length: sunset.valuesInt64Length() },
        (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
      ),
      temperature2mMin: daily.variables(3)!.valuesArray()!,
      precipitationProbabilityMax: daily.variables(4)!.valuesArray()!
    }
  }
}

export type WeatherData = ReturnType<typeof parseWeatherResponse>
