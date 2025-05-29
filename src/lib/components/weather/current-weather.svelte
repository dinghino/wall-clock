<script lang="ts">
  import { type WeatherData } from '$lib/api'
  import type { GeoLocation } from '$lib/types/location'
  import { cn, formatTemperature } from '$lib/utils'
  import WeatherDetail from './weather-detail.svelte'
  import { ThermometerSnowflake, ThermometerSun } from '@lucide/svelte'
  import WeatherIcon from './weather-icon.svelte'

  import * as blocks from './blocks'

  type Props = {
    location: GeoLocation
    data: WeatherData
  }
  let { data }: Props = $props()
  const today = $derived(data.daily[0])
</script>

<div class="my-4 mb-16 flex flex-row items-center justify-center gap-6">
  <WeatherIcon
    size="xl"
    code={data.current.weatherCode}
    className={cn('stroke-accent-foreground stroke-2 flex-1')}
  />

  <div>
    <p class="mb-4 text-7xl">{formatTemperature(data.current.temperature2m)}</p>
    <div class="flex flex-row justify-center gap-4">
      <div class="flex flex-row items-center gap-2">
        <ThermometerSun class="size-4 stroke-red-500/50" />
        <p>{formatTemperature(today.temperature.max)}</p>
      </div>

      <div class="flex flex-row items-center gap-2">
        <ThermometerSnowflake class="size-4 stroke-sky-500/50" />
        <p>{formatTemperature(today.temperature.min)}</p>
      </div>
    </div>
  </div>
</div>

<div class="flex flex-col gap-4">
  <div class="grid grid-cols-4 gap-2">
    <WeatherDetail {...blocks.humidity(data.current)} />
    <WeatherDetail {...blocks.wind(data.current)} />
    <WeatherDetail {...blocks.precipitation(data.current)} />
    <WeatherDetail {...blocks.uv(today)} />
  </div>
  <div class="grid grid-cols-2 gap-2">
    <WeatherDetail {...blocks.sunrise(today)} />
    <WeatherDetail {...blocks.sunset(today)} />
  </div>
</div>
