<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import {
    MapPin,
    MoreHorizontal,
    RefreshCwIcon,
    SunIcon,
    MoonStarIcon,
    Loader,
    TriangleAlert
  } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import type { GeoLocation } from '$lib/types/location'

  import locations from '$lib/stores/location.svelte'

  import * as Card from '$components/ui/card'
  import { Button } from '$components/ui/button'

  import api from '$lib/api'

  import WeatherCardHeader from './card-header.svelte'
  import SimpleCurrentWeather from './simple-current-weather.svelte'
  import CardSection from '$components/card-section.svelte'

  import Actions from './actions'
  import Clock from './clock'
  import { WeatherDialog, CurrentWeather } from '$lib/components/weather'
  import dayjs from 'dayjs'

  export interface TimeCardProps {
    location: GeoLocation
  }

  const { location }: TimeCardProps = $props()
  const timezone = $derived(location.timezone)

  async function getData() {
    return api.weather.getWeatherData(location)
  }
  let weatherTick: number | undefined
  onMount(() => {
    weatherTick = setInterval(() => (weather = getData()), 15 * 60 * 1000) // update every 15 minutes
    return () => clearInterval(weatherTick)
  })

  let weather = $state(getData())

  function handleRefresh() {
    weather = getData()
  }
</script>

<Card.Root
  class={cn(
    'relative',
    'group/card',
    'dark:bg-muted/20 bg-muted/30',
    'border-primary/10 hover:border-muted-foreground/20',
    'w-full flex-1 gap-0 overflow-hidden rounded-md p-0',
    'shadow-none transition-all duration-200 ease-in-out'
  )}
>
  <WeatherCardHeader
    {location}
    background="default"
    visibility="visible"
    {icon}
    {title}
    {actions}
  />

  <Card.Content class=" relative flex flex-1 flex-col gap-6 p-4 px-2">
    <Clock {timezone} show={{ utc: false, date: false, timezone: false }} />
    {#await weather}
      <div class="grid h-16 place-items-center">
        <Loader class="stroke-muted-foreground size-8 animate-spin" />
      </div>
    {:then response}
      {@const data = response[0]}
      <WeatherDialog {location} {data}>
        {#snippet trigger()}
          <!-- <CardSection class="m-4 cursor-pointer max-w-fit mx-auto" background="default"> -->
          <SimpleCurrentWeather data={data.current} layout="horizontal" class="justify-center" />
          <!-- </CardSection> -->
        {/snippet}
        {#snippet current(data)}
          <CurrentWeather {location} {data} />
        {/snippet}
      </WeatherDialog>
    {/await}
  </Card.Content>
</Card.Root>

{#snippet icon()}
  <!-- renders the day/night icon or the map pin if we are still fetching -->
  {#await weather}
    <MapPin class="stroke-muted-foreground size-5" />
  {:then response}
    {@const data = response[0].current}
    {@const isday = typeof data.isDay === 'boolean' ? data.isDay : data.isDay > 0}
    {@const Icon = isday ? SunIcon : MoonStarIcon}
    {@const color = isday ? 'stroke-amber-500' : 'stroke-sky-500'}
    <Icon class={cn('size-5', color, 'stroke-[1.5px]')} />
  {:catch}
    <MapPin class="size-5 stroke-red-500" />
  {/await}
{/snippet}
{#snippet title()}
  <div class="mb-2 flex flex-col gap-0">
    <h2 class="text-xl font-semibold">
      {location.name}
    </h2>
    <p class="text-muted-foreground text-[10px]">
      {location.admin1}{#if location.country}, {location.country}{/if}
    </p>
  </div>
  <p class="text-muted-foreground text-[12px]">
    UTC {dayjs.utc().tz(timezone).format('Z')}
  </p>
{/snippet}
{#snippet actions()}
  {@const favorite = location.isFavorite}
  <div
    class="bg-accent text-accent-foreground absolute -right-28 rounded-l-md duration-200 ease-in-out group-hover/card:right-0 shadow-none group-hover/card:shadow-md"
  >
    <Actions.Favorite {favorite} onclick={() => locations.toggleFavorite(location.id)} />
    <Actions.Delete onclick={() => locations.remove(location.id)} />
    <Button variant="ghost" class="rounded-md" size="icon" onclick={() => handleRefresh()}>
      <RefreshCwIcon class="stroke-muted-foreground s size-4" />
    </Button>
    <Button variant="ghost" class="rounded-md" size="icon" disabled>
      <MoreHorizontal class="stroke-muted-foreground size-4" />
    </Button>
  </div>
{/snippet}
