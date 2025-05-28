<script lang="ts">
  import { Loader, RefreshCwIcon } from '@lucide/svelte'

  import type { GeoLocation } from '$lib/types/location'
  import api, { type WeatherData } from '$lib/api'

  import WeatherIcon from '$components/weather-icon.svelte'
  import { Button } from '$components/ui/button'
  import { formatTemperature } from '$lib/utils'
  import dayjs from 'dayjs'

  type Props = {
    location: GeoLocation
  }
  const { location }: Props = $props()

  async function getWeather(): Promise<WeatherData[]> {
    return new Promise((res, rej) => {
      api.weather
        .getWeatherData(location)
        .then((data) => res(data))
        .catch((error) => rej(error))
    })
  }

  let weatherData = $state(getWeather())
</script>

{#await weatherData}
  <div class="grid h-full w-full place-items-center">
    <Loader class="text-primary size-6 animate-spin" />
  </div>
{:then response}
  {#each response as { current, daily }, _ (current.time)}
    <!-- weather data. first element is current weather summary -->
    <div
      class="group/weather dark:bg-accent/50 bg-accent relative flex flex-col items-center justify-between gap-4 rounded-sm p-4 md:flex-row"
    >
      <div class="flex flex-col items-center justify-center gap-1">
        <WeatherIcon code={current.weatherCode} size="md" className="text-primary" />
      </div>
      <div class="text-center font-light">
        <p class="text-3xl">{formatTemperature(current.temperature2m)}</p>
        <p class="text-xs">feels {formatTemperature(current.apparentTemperature)}</p>
      </div>
      <!-- refresh button w/ overlay. this is in the wrong place. -->
      <div
        class="absolute -inset-4 z-10 grid place-items-center opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover/weather:opacity-100"
      >
        <Button variant="secondary" size="icon" onclick={() => (weatherData = getWeather())}>
          <RefreshCwIcon class="size-4" />
        </Button>
      </div>
    </div>
    <!-- daily forecast -->
    <div class="hidden flex-row justify-between gap-2 md:flex md:flex-nowrap">
      {#each daily as day, i (day.time)}
        <div
          class="dark:bg-accent/50 bg-accent flex shrink-0 flex-col items-center justify-center gap-2 rounded-sm px-5 py-4"
        >
          <WeatherIcon code={day.weatherCode} size="sm" className="text-muted-foreground" />
          <p class="text-muted-foreground text-xs">
            <span class="font-semibold"
              >{formatTemperature(day.temperature2mMax, { unit: false })}</span
            >
            /
            <span class="font-thin">
              {formatTemperature(day.temperature2mMin, { unit: false })}
            </span>
          </p>
          <p class="text-[.75rem] font-thin">{dayjs(day.time).format('ddd')}</p>
        </div>
      {/each}
    </div>
  {/each}
{:catch error}
  <p class="text-red-500">Error loading weather: {error.message}</p>
{/await}

<!-- group-hover:opacity-100 opacity-0 -->
