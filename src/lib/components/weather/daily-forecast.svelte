<script lang="ts">
  import CardSection from '$components/card-section.svelte'
  import { WeatherDetail, WeatherIcon, blocks } from '$lib/components/weather'
  import { formatTemperature } from '$lib/utils'
  import dayjs from 'dayjs'
  import type { WeatherData } from '$lib/api'
  import { Separator } from '$components/ui/separator'

  type Props = {
    daily: WeatherData['daily']
  }
  const { daily }: Props = $props()
</script>

<div class="flex flex-row flex-wrap justify-between gap-2">
  {#each daily as day (day.time)}
    <div class="flex flex-col gap-4">
      <CardSection class="flex-1 justify-center gap-2 px-5 py-2">
        <p class="text-md font-bold">{dayjs(day.time).format('ddd')}</p>
      </CardSection>
      <CardSection class="aspect-square flex-1 justify-center gap-2">
        <WeatherIcon
          code={day.weatherCode}
          size="sm"
          className="text-muted-foreground/50 group-hover/card-section:stroke-primary"
        />
        <p class="text-muted-foreground text-sm">
          <span class="font-bold">{formatTemperature(day.temperature.max, { unit: false })}</span>
          /
          <span class="font-thin">{formatTemperature(day.temperature.min, { unit: false })}</span>
        </p>
      </CardSection>
      <Separator class="my-2" />
      <CardSection class="flex flex-1 flex-col items-center justify-between gap-4 p-4 ">
        <WeatherDetail type="default" {...blocks.precipitation(day)} />
        <WeatherDetail type="default" {...blocks.humidity(day)} />
        <WeatherDetail type="default" {...blocks.uv(day)} />
        <WeatherDetail type="default" {...blocks.sunrise(day)} />
        <WeatherDetail type="default" {...blocks.sunset(day)} />
      </CardSection>
    </div>
    <!-- <WeatherDetail {...blocks.wind(day)} /> -->
  {/each}
</div>
