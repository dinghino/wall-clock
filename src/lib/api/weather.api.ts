import { fetchWeatherApi } from 'openmeteo'
import type { GeoLocation } from '$lib/types/location'

const url = 'https://api.open-meteo.com/v1/forecast'

const params = {
  forecast_days: 4,
  daily: [
    'temperature_2m_max',
    'sunrise',
    'sunset',
    'temperature_2m_min',
    'precipitation_probability_max',
    'weather_code'
  ],
  // hourly: ['temperature_2m', 'precipitation', 'precipitation_probability', 'weather_code'],
  current: [
    'temperature_2m',
    'weather_code',
    'is_day',
    'apparent_temperature',
    'relative_humidity_2m',
    'precipitation'
  ]
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
    .then((data) => {
      console.log(`weather data for ${location.name}:`, data)
      const parsed = data.map((i) => parseWeatherResponse(i))
      console.log('Parsed weather data:', parsed)
      return parsed
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error)
      throw error
    })
}

// lib does not export the type. so sad.
type WeatherResponse = Awaited<ReturnType<typeof fetchWeatherApi>>[number]

function parseCurrentWeather(data: NonNullable<ReturnType<WeatherResponse['current']>>) {
  return {
    temperature2m: data.variables(0)!.value(),
    weatherCode: data.variables(1)!.value(),
    isDay: data.variables(2)!.value(),
    apparentTemperature: data.variables(3)!.value(),
    relativeHumidity2m: data.variables(4)!.value(),
    precipitation: data.variables(5)!.value()
  }
}

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

  const rawDailyData = {
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
    precipitationProbabilityMax: daily.variables(4)!.valuesArray()!,
    weatherCode: daily.variables(5)!.valuesArray()!
  } as const

  // daily data is an array of objects where each object has the same keys as rawDailyData
  // and the values of each array at the index correspond to the same day

  const dailyData = rawDailyData.time.map((time, idx) => ({
    time,
    temperature2mMax: rawDailyData.temperature2mMax[idx],
    sunrise: rawDailyData.sunrise[idx],
    sunset: rawDailyData.sunset[idx],
    temperature2mMin: rawDailyData.temperature2mMin[idx],
    precipitationProbabilityMax: rawDailyData.precipitationProbabilityMax[idx],
    weatherCode: rawDailyData.weatherCode[idx]
  }))

  return {
    utcOffsetSeconds,
    timezone,
    timezoneAbbreviation,
    latitude,
    longitude,
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      ...parseCurrentWeather(current)
    },
    // hourly: {
    //   time: buildTimeArray(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()),
    //   temperature2m: hourly.variables(0)!.valuesArray()!,
    //   precipitation: hourly.variables(1)!.valuesArray()!,
    //   precipitationProbability: hourly.variables(2)!.valuesArray()!,
    //   weatherCode: hourly.variables(3)!.valuesArray()!
    // },
    daily: dailyData
  }
}

export type WeatherData = ReturnType<typeof parseWeatherResponse>
export type DailyForecast = WeatherData['daily'][number]

// Map WMO weather codes to descriptions
// https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
export function getWeatherDescription(code: number): string {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  }

  return weatherCodes[code] || 'Unknown'
}
