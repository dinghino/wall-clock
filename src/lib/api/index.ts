import * as location from './locations.api'
import * as weather from './weather.api'

export type { WeatherData } from './weather.api'

export const api = {
  location,
  weather,
}

export default api
