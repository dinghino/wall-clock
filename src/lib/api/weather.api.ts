import { fetchWeatherApi } from 'openmeteo'
import type { GeoLocation } from '$lib/types/location'

// lib does not export the type. so sad.
export type WeatherResponse = Awaited<ReturnType<typeof fetchWeatherApi>>[number]
// note: some of these are duplicated in $lib/types/* we may want to check
export type WeatherData = ReturnType<typeof parseWeatherResponse>

export type CurrentWeather = WeatherData['current']
export type DailyForecast = WeatherData['daily'][number]
export type HourlyForecast = WeatherData['hourly']

const url = 'https://api.open-meteo.com/v1/forecast'

const params = {
  forecast_days: 4,
  daily: [
    'weather_code',
    'sunrise',
    'sunset',
    'precipitation_probability_max',
    'temperature_2m_max',
    'temperature_2m_min',
    'uv_index_max',
    'relative_humidity_2m_mean',
  ],
  // hourly: ['temperature_2m', 'precipitation', 'precipitation_probability', 'weather_code'],
  current: [
    'weather_code',
    'temperature_2m',
    'is_day',
    'apparent_temperature',
    'relative_humidity_2m',
    'precipitation',
    'rain',
    'wind_speed_10m',
  ],
}

export function makeRequestFor(location: GeoLocation) {
  return {
    ...params,
    latitude: location.lat,
    longitude: location.lon,
    timezone: location.timezone,
  }
}

export async function getWeatherData(location: GeoLocation) {
  return fetchWeatherApi(url, makeRequestFor(location))
    .then((data) => {
      // console.log(`weather data for ${location.name}:`, data)
      const parsed = data.map((i) => parseWeatherResponse(i))
      // console.log('Parsed weather data:', parsed)
      return parsed
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error)
      throw error
    })
}

// Helper function to form time ranges
const range = (start: number | bigint, stop: number | bigint, step: number) => {
  const s = Number(start)
  const e = Number(stop)
  return Array.from({ length: (e - s) / step }, (_, i) => s + i * step)
}

function parseCurrentWeather(data: NonNullable<ReturnType<WeatherResponse['current']>>) {
  return {
    weatherCode: data.variables(0)!.value(),
    temperature2m: data.variables(1)!.value(),
    isDay: data.variables(2)!.value(),
    apparentTemperature: data.variables(3)!.value(),
    humidity: data.variables(4)!.value(),
    precipitation: data.variables(5)!.value(),
    rain: data.variables(6)!.value(),
    windSpeed: data.variables(7)!.value(),
  }
}

function parseDailyForecast(
  daily: NonNullable<ReturnType<WeatherResponse['daily']>>,
  offset: number
) {
  const sunrise = daily.variables(1)!
  const sunset = daily.variables(2)!

  const data = {
    time: range(daily.time(), daily.timeEnd(), daily.interval()).map(
      (t) => new Date((t + offset) * 1000)
    ),
    weatherCode: daily.variables(0)!.valuesArray()!,
    sunrise: Array.from(
      { length: sunrise.valuesInt64Length() },
      (_, i) => new Date((Number(sunrise.valuesInt64(i)) + offset) * 1000)
    ),
    sunset: Array.from(
      { length: sunset.valuesInt64Length() },
      (_, i) => new Date((Number(sunset.valuesInt64(i)) + offset) * 1000)
    ),
    precipitation: daily.variables(3)!.valuesArray()!,
    temperature2mMax: daily.variables(4)!.valuesArray()!,
    temperature2mMin: daily.variables(5)!.valuesArray()!,
    uvMax: daily.variables(6)!.valuesArray()!,
    humidity: daily.variables(7)!.valuesArray()!,
  } as const

  return data.time.map((time, idx) => ({
    time,
    temperature: {
      max: data.temperature2mMax[idx],
      min: data.temperature2mMin[idx],
    },
    sunrise: data.sunrise[idx],
    sunset: data.sunset[idx],
    precipitation: data.precipitation[idx],
    weatherCode: data.weatherCode[idx],
    uvIndex: data.uvMax[idx],
    humidity: data.humidity[idx],
  }))
}

function parseWeatherResponse(data: WeatherResponse) {
  const utcOffsetSeconds = data.utcOffsetSeconds()
  const timezone = data.timezone()
  const timezoneAbbreviation = data.timezoneAbbreviation()
  const latitude = data.latitude()
  const longitude = data.longitude()

  const current = data.current()!
  const daily = data.daily()!
  // const hourly = data.hourly()!

  return {
    utcOffsetSeconds,
    timezone,
    timezoneAbbreviation,
    latitude,
    longitude,
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      ...parseCurrentWeather(current),
    },
    hourly: {
      // time: buildTimeArray(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()),
      // time: range(hourly.time(), hourly.timeEnd(), hourly.interval()).map(
      //   (t) => new Date((Number(t) + utcOffsetSeconds) * 1000)
      // )
      //   temperature2m: hourly.variables(0)!.valuesArray()!,
      //   precipitation: hourly.variables(1)!.valuesArray()!,
      //   precipitationProbability: hourly.variables(2)!.valuesArray()!,
      //   weatherCode: hourly.variables(3)!.valuesArray()!
    },
    daily: parseDailyForecast(daily, utcOffsetSeconds),
  }
}

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
    99: 'Thunderstorm with heavy hail',
  }

  return weatherCodes[code] || 'Unknown'
}
