<script lang="ts">
  import CardSection from './card-section.svelte'
  import { WeatherIcon } from '$lib/components/weather'
  import { formatTemperature } from '$lib/utils'
  import dayjs from 'dayjs'
  import type { WeatherData } from '$lib/api'

  type Props = {
    daily: WeatherData['daily']
  }
  const { daily }: Props = $props()
</script>

<div class="flex flex-row flex-wrap justify-between gap-2">
  {#each daily as day (day.time)}
    <CardSection class="flex-1 justify-center gap-2 px-5">
      <WeatherIcon
        code={day.weatherCode}
        size="sm"
        className="text-muted-foreground/50 group-hover/card-section:stroke-primary"
      />
      <p class="text-muted-foreground text-xs">
        <span class="font-semibold">{formatTemperature(day.temperature.max, { unit: false })}</span
        >
        /
        <span class="font-thin">{formatTemperature(day.temperature.min, { unit: false })}</span>
      </p>
      <p class="text-[.75rem] font-thin">{dayjs(day.time).format('ddd')}</p>
    </CardSection>
  {/each}
</div>
