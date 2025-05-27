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
  import SimpleWeather from './simple-weather.svelte'

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

  const showOnHoverClass = 'opacity-0 transition-opacity duration-200 group-hover/card:opacity-100'
</script>

<Card.Root
  class="group/card dark:bg-muted/20 border-muted-foreground/20 hover:border-muted-foreground/30 w-full flex-1 gap-0 overflow-hidden rounded-sm p-0 shadow-none transition-all duration-200 ease-in-out"
>
  <Card.Header class="dark:bg-accent/20 bg-accent flex items-center justify-between px-4 py-2">
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
    <div class={cn('flex items-center gap-0', showOnHoverClass)}>
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
  <div class="flex flex-row md:flex-col">
    <Card.Content class="flex flex-1 flex-row gap-2 p-4 px-2 font-mono md:flex-col">
      <!-- <section class="flex flex-1 flex-col gap-2" data-role="time"> -->
      <section class="grid flex-1 place-items-center gap-4" data-role="time">
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
      </section>
    </Card.Content>
    <Card.Content class="flex flex-col m-4 min-h-16 shrink-0 items-stretch justify-between gap-4 p-2">
      <SimpleWeather {location} />
    </Card.Content>
  </div>
</Card.Root>
