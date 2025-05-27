<script lang="ts">
  import { onMount } from 'svelte'
  import { MapPin, Heart, Trash, MoreHorizontal } from '@lucide/svelte'

  import dayjs from 'dayjs'
  import type { GeoLocation } from '$lib/types/location'
  import locations from '$lib/stores/location.svelte'

  import * as Card from '$components/ui/card'
  import { Button } from '$components/ui/button'
  import { Separator } from '$components/ui/separator'

  import api from '$lib/api'
  import WeatherIcon from '../weather-icon.svelte'
  import { cn } from '$lib/utils'

  export interface TimeCardProps {
    location: GeoLocation
  }

  const { location }: TimeCardProps = $props()

  const timezone = $derived(location.timezone)
  let now = $state(dayjs.utc())
  let time = $derived(now.tz(timezone))

  function updateTime() {
    now = dayjs.utc()
  }

  let interval: number | undefined
  onMount(() => {
    updateTime()
    interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  })
</script>

<Card.Root
  class="group dark:bg-muted/20 border-muted-foreground/20 hover:border-muted-foreground/30 w-full flex-1 gap-0 rounded-sm p-0 shadow-none transition-all duration-200 ease-in-out"
>
  <Card.Header class="bg-accent/50 flex items-center justify-between px-4 py-4">
    <Card.Title class="flex flex-row items-center gap-4">
      <div class="grid place-items-center">
        <MapPin class="stroke-muted-foreground size-4" />
      </div>

      <div>
        <h2 class="text-xl font-semibold">
          {location.name}
        </h2>
        <span class="text-muted-foreground text-xs">
          {location.admin1}{#if location.country}, {location.country}{/if}
        </span>
      </div>
    </Card.Title>
    <div class="flex items-center gap-0">
      <Button
        variant="ghost"
        class="rounded-md"
        size="icon"
        onclick={() => locations.toggleFavorite(location)}
      >
        <Heart
          class={cn('size-4 stroke-red-500 stroke-1', { 'fill-red-500/75': location.isFavorite })}
        />
      </Button>
      <Button
        variant="ghost"
        class="rounded-md"
        size="icon"
        onclick={() => locations.remove(location.id)}
      >
        <Trash class="stroke-muted-foreground size-4" />
      </Button>
      <Button variant="ghost" class="rounded-md" size="icon" disabled>
        <MoreHorizontal class="stroke-muted-foreground size-4" />
      </Button>
    </div>
  </Card.Header>
  <Separator class="mt-0" />
  <Card.Content class="flex flex-col gap-2 px-2 pt-4 font-mono">
    <p class="text-muted-foreground text-center text-xl">{time.format('dddd')}</p>
    <time class="w-full text-center text-7xl" datetime={time.toISOString()}>
      <span>{time.format('HH:mm')}</span>
    </time>
    <div class="flex flex-col items-center text-xs">
      <p class="text-muted-foreground font-thin">
        {location.timezone.replaceAll('_', ' ')}
      </p>
      <p class="text-muted-foreground mr-2">UTC {time?.format('Z')}</p>
    </div>
  </Card.Content>
  {#await api.weather.getWeatherData(location)}
    <Card.Content class="flex items-center justify-center p-4">
      <p class="text-muted-foreground">Loading weather...</p>
    </Card.Content>
  {:then response}
    {@const weather = response[0]}
    <Card.Content class="py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <WeatherIcon code={weather.current.weatherCode} size="md" className="text-primary" />
          <div class="text-3xl font-light">{weather.current.temperature2m.toFixed()}°</div>
        </div>
        <div class="text-right">
          <!-- <div class="text-sm">
            <span class="font-medium">{weather.daily.temperature2mMax.toFixed()}° /</span>
            <span class="text-neutral-500">{weather.daily.temperature2mMin}°</span>
          </div> -->
          <div class="text-sm text-neutral-500">
            {weather.current.weatherCode}
          </div>
        </div>
      </div>
    </Card.Content>
  {:catch error}
    <Card.Content class="flex items-center justify-center p-4">
      <p class="text-red-500">Error loading weather: {error.message}</p>
    </Card.Content>
  {/await}
  <!-- <Separator /> -->
  <!-- <Card.Footer class="flex justify-between px-2 pb-2 text-xs opacity-0 group-hover:opacity-100 ">
    <div class="items-Heartt flex flex-col justify-end text-xs">
      <p class="text-muted-foreground font-thin">
        {location.timezone.replaceAll('_', ' ')}
      </p>
      <p class="text-muted-foreground mr-2">UTC {time?.format('Z')}</p>
    </div>
    <div class="flex items-center gap-1">
      <Button variant="ghost" size="icon">
        <Heart class="size-4 stroke-amber-500" />
      </Button>
      <Button variant="ghost" size="icon" onclick={() => locations.remove(location.id)}>
        <Trash class="size-4 stroke-red-500/50" />
      </Button>
    </div>
  </Card.Footer> -->
</Card.Root>
