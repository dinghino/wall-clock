<script lang="ts">
  import { onMount } from 'svelte'
  import { MapPin, Star, Trash } from '@lucide/svelte'

  import dayjs from 'dayjs'
  import type { GeoLocation } from '$lib/types/location'
  import locations from '$lib/stores/location.svelte'

  import * as Card from '$components/ui/card'
  import { Button } from '$components/ui/button'

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
  class="group bg-muted/50 dark:bg-muted/20 border-muted-foreground/20 hover:border-muted-foreground/50 w-full flex-1 gap-2 rounded-sm p-0 shadow-none transition-all duration-200 ease-in-out"
>
  <Card.Header class="flex items-center justify-between px-4 py-2">
    <Card.Title class="flex flex-row items-baseline gap-2">
      <MapPin class="stroke-muted-foreground size-4" />
      <div>
        <h2 class="text-lg font-semibold">
          {location.name}
        </h2>
        <span class="text-muted-foreground text-xs">
          {location.admin1}
          {#if location.country}, {location.country}{/if}
        </span>
      </div>
    </Card.Title>

    <div
      class="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
      <Button variant="ghost" size="icon">
        <Star class="size-4 stroke-amber-500" />
      </Button>
      <Button variant="ghost" size="icon" onclick={() => locations.remove(location.id)}>
        <!-- todo: delete action on location store -->
        <Trash class="size-4 stroke-red-500/50" />
      </Button>
    </div>
  </Card.Header>
  <Card.Content class="flex flex-col gap-2 px-2 font-mono">
    <p class="text-muted-foreground text-center text-xl">{time.format('dddd')}</p>
    <time class="w-full text-center text-7xl" datetime={time.toISOString()}>
      <span>{time.format('HH:mm')}</span>
    </time>
  </Card.Content>
  <Card.Footer class="flex justify-between px-2 py-4 text-xs opacity-0 group-hover:opacity-100 ">
    <!-- <div class="flex flex-col items-start justify-end text-xs"> -->
    <p class="text-muted-foreground font-thin">
      {location.timezone.replaceAll('_', ' ')}
    </p>
    <p class="text-muted-foreground mr-2">UTC {time?.format('Z')}</p>
    <!-- </div> -->
  </Card.Footer>
</Card.Root>
