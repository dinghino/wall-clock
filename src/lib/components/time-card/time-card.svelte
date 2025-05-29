<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { MapPin, MoreHorizontal, RefreshCwIcon, SunIcon, MoonStarIcon } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import type { GeoLocation } from '$lib/types/location'

  import locations from '$lib/stores/location.svelte'

  import * as Card from '$components/ui/card'
  import { Button } from '$components/ui/button'

  import api from '$lib/api'

  import WeatherCardHeader from './card-header.svelte'
  import SimpleCurrentWeather from './simple-current-weather.svelte'
  import CardSection from './card-section.svelte'

  import Actions from './actions'
  import Clock from './clock'
  import WeatherDialog from './weather-dialog.svelte'
  import { CurrentWeather } from '$lib/components/weather'

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
    weatherTick = setInterval(() => (weather = getData()), 60 * 60 * 1000) // update every hour
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
    'dark:bg-muted/20 bg-muted/50',
    'border-card hover:border-muted-foreground/20 dark:border-none',
    'w-full flex-1 gap-0 overflow-hidden rounded-md p-0',
    'shadow-none transition-all duration-200 ease-in-out'
  )}
>
  <WeatherCardHeader {location} background="accent" visibility="dynamic" {icon} {title} {actions} />

  <Card.Content class=" relative flex flex-1 flex-row gap-2 p-4 px-2 font-mono">
    <Clock {timezone} show={{ utc: true, date: false, timezone: false }} />
    {#await weather then response}
      {@const data = response[0]}
      <WeatherDialog {location} {data}>
        {#snippet trigger()}
          <CardSection class="m-4 cursor-pointer" background="default">
            <SimpleCurrentWeather data={data.current} layout="vertical" />
          </CardSection>
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
  <h2 class="text-xl font-semibold">
    {location.name}
  </h2>
  <span class="text-muted-foreground text-[10px]">
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
