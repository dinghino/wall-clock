<script lang="ts">
  import { onMount } from 'svelte'
  import {
    MapPin,
    MoreHorizontal,
    Loader,
    RefreshCwIcon,
    SunIcon,
    MoonStarIcon,
    ClockIcon,
    CloudSunRain,
  } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import type { GeoLocation } from '$lib/types/location'

  import locations from '$lib/stores/location.svelte'

  import * as Card from '$components/ui/card'
  import * as Tabs from '$components/ui/tabs'
  import { Button } from '$components/ui/button'
  import { Separator } from '$components/ui/separator'

  import api, { type WeatherData } from '$lib/api'

  import WeatherCardHeader from './card-header.svelte'
  import CurrentWeather from './simple-current-weather.svelte'
  import { DailyForecast } from '$components/weather'
  import CardSection from '$components/card-section.svelte'

  import Actions from './actions'
  import Clock from './clock'

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
  class="group/card dark:bg-muted/20 bg-accent/30 border-muted-foreground/10 hover:border-muted-foreground/50 w-full flex-1 gap-0 overflow-hidden rounded-md border-none p-0 shadow-none transition-all duration-200 ease-in-out"
>
  <Tabs.Root value="time" class="gap-0">
    <WeatherCardHeader {location} background="accent" visibility="dynamic">
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
        <h2 class="text-xl font-semibold">
          {location.name}
        </h2>
        <span class="text-muted-foreground text-xs">
          {location.admin1}{#if location.country}, {location.country}{/if}
        </span>
      {/snippet}
      {#snippet actions()}
        {@const favorite = location.isFavorite}
        <Actions.Favorite {favorite} onclick={() => locations.toggleFavorite(location.id)} />
        <Actions.Delete onclick={() => locations.remove(location.id)} />
        <Button variant="ghost" class="rounded-md" size="icon" onclick={() => handleRefresh()}>
          <RefreshCwIcon class="stroke-muted-foreground s size-4" />
        </Button>
        <Button variant="ghost" class="rounded-md" size="icon" disabled>
          <MoreHorizontal class="stroke-muted-foreground size-4" />
        </Button>
      {/snippet}
    </WeatherCardHeader>

    <Tabs.List class="bg-accent dark:bg-accent/50 w-full flex-1 rounded-none">
      <Tabs.Trigger value="time" class="flex items-center gap-2 text-xs">
        <ClockIcon class="stroke-muted-foreground" />Time
      </Tabs.Trigger>
      <Tabs.Trigger value="weather" class="flex items-center gap-2 text-xs">
        <CloudSunRain class="stroke-muted-foreground" />Weather
      </Tabs.Trigger>
    </Tabs.List>

    <!-- <Separator class="mt-0" /> -->

    <!-- clock section -->
    <Tabs.Content value="time" class="flex-1">
      <div class="flex flex-row md:flex-col">
        <Card.Content class="flex flex-1 flex-row gap-2 p-4 px-2 font-mono md:flex-col">
          <Clock {timezone} />
        </Card.Content>
        {#await weather then response}
          {@const data = response[0].current}
          <CardSection class="group/weather m-4 md:flex-row">
            <CurrentWeather {data} />
          </CardSection>
        {/await}
      </div>
    </Tabs.Content>
    <!-- weather section -->
    <Tabs.Content value="weather" class="flex-1">
      <Card.Content
        class="m-4 flex min-h-16 shrink-0 flex-col items-stretch justify-between gap-4 p-2"
      >
        {#await weather}
          <CardSection>
            <div class="grid h-32 w-full place-items-center">
              <Loader class="text-primary size-6 animate-spin" />
            </div>
          </CardSection>
        {:then response}
          {#each response as data, i}
            {#if i > 0}
              <Separator class="my-2" />
            {/if}
            <CardSection class="group/weather">
              <CurrentWeather data={data.current} layout="horizontal" />
            </CardSection>
            <DailyForecast daily={data.daily} />
          {/each}
        {:catch error}
          <div class="grid h-full w-full place-items-center">
            <p class="text-red-500">Error loading weather: {error.message}</p>
          </div>
        {/await}
      </Card.Content>
    </Tabs.Content>
  </Tabs.Root>
</Card.Root>
