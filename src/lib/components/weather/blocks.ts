/**
 * Props factories for WeatherDetail component.
 *
 * Takes a data object (WeatherData, CurrentWeather, DailyForecast, ...) and returns
 * a valid props object for WeatherDetail component.
 */
import dayjs from 'dayjs'

import type { DailyForecast } from '$lib/api/weather.api'
import type { WeatherDetailProps } from './weather-detail.svelte'

import { Droplets, Sparkles, Sunrise, Sunset, ThermometerSun, Umbrella, Wind } from '@lucide/svelte'
import { formatTemperature } from '$lib/utils'

type WeatherBlock<T extends object> = (
  data: T,
  opts?: Partial<WeatherDetailProps>
) => WeatherDetailProps

export function makeBlock<T extends object>(func: WeatherBlock<T>): WeatherBlock<T> {
  return (data, opts) => ({
    ...func(data, opts),
  })
}

export const sunrise = makeBlock<DailyForecast>((data) => ({
  title: 'Sunrise',
  data: dayjs(data.sunrise).format('HH:mm'),
  icon: Sunrise,
}))
export const sunset = makeBlock<DailyForecast>((data) => ({
  title: 'Sunset',
  data: dayjs(data.sunset).format('HH:mm'),
  icon: Sunset,
}))

type Temperatures = { temperatures: { max: number; min: number } }

export const maxTemp = makeBlock<Temperatures>((data) => ({
  title: 'Max Temperature',
  data: formatTemperature(data.temperatures.max),
  icon: ThermometerSun,
}))

export const minTemp = makeBlock<Temperatures>((data) => ({
  title: 'Min Temperature',
  data: formatTemperature(data.temperatures.min),
  icon: ThermometerSun,
}))

export const wind = makeBlock<{ windSpeed: number }>(({ windSpeed }) => ({
  title: 'Wind Speed',
  data: `${windSpeed.toFixed()} km/h`,
  icon: Wind,
}))

export const precipitation = makeBlock<{ precipitation: number }>(({ precipitation }) => ({
  title: 'Rain chance',
  data: `${precipitation.toFixed()}%`,
  icon: Umbrella,
}))

export const humidity = makeBlock<{ humidity: number }>(({ humidity }) => ({
  title: 'Humidity',
  data: `${humidity.toFixed()}%`,
  icon: Droplets,
}))

export const uv = makeBlock<{ uvIndex: number }>(({ uvIndex }) => ({
  title: 'UV Index',
  data: `${uvIndex.toFixed(1)}`,
  icon: Sparkles,
}))

const blocks = {
  sunrise,
  sunset,
  maxTemp,
  minTemp,
  wind,
  precipitation,
  humidity,
  uv,
} as const

export default blocks
export type WeatherBlocks = keyof typeof blocks
