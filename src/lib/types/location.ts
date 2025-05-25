// Types for location and weather data

export interface GeoLocation {
  id: string // unique id (could be geonameid, or lat+lon hash)
  name: string
  country?: string
  admin1?: string // region/state
  lat: number
  lon: number
  timezone: string
  isFavorite?: boolean
  isSelected?: boolean
}

export type GeocodingResponse = {
  id: number
  name: string
  latitude: number
  longitude: number
  timezone: string
  country: string
  admin1?: string // region/state
}

export interface Weather {
  temperature: number // current temp
  min: number
  max: number
  icon: string // weather icon code
  description: string
  time: string // ISO string
  delta?: number // time delta from default location, in hours
}

export interface LocationWithWeather extends GeoLocation {
  weather?: Weather
}

// For Open-Meteo API responses (simplified)
export interface OpenMeteoCurrentWeather {
  temperature: number
  weathercode: number
  time: string
}

export interface OpenMeteoForecastDay {
  date: string
  min: number
  max: number
  icon: string
  description: string
}

export interface OpenMeteoResponse {
  latitude: number
  longitude: number
  timezone: string
  current_weather: OpenMeteoCurrentWeather
  daily?: OpenMeteoForecastDay[]
}
