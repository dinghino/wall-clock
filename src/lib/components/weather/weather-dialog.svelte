<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { WeatherData } from '$lib/api'
  import type { GeoLocation } from '$lib/types/location'
  import { cn } from '$lib/utils'

  import * as Dialog from '$lib/components/ui/dialog'
  import * as Tabs from '$components/ui/tabs'

  import DailyForecast from './daily-forecast.svelte'

  type Props = {
    location: GeoLocation
    data: WeatherData
    class?: string
    trigger: Snippet
    current: Snippet<[data: WeatherData]>
  }

  let { location, data, class: className, trigger, current }: Props = $props()

</script>

<Dialog.Root>
  <Dialog.Trigger class="cursor-pointer">
      {@render trigger()}
  </Dialog.Trigger>
  <Dialog.Content class={cn(className)}>
    <Tabs.Root value="current">
      <Dialog.Header>
        <Dialog.Title>{location.name}</Dialog.Title>
      </Dialog.Header>
      <Tabs.List class="bg-accent dark:bg-accent/50 my-4 w-full flex-1 px-4">
        <Tabs.Trigger value="current" class="flex items-center gap-2 text-xs">Current</Tabs.Trigger>
        <Tabs.Trigger disabled value="hourly" class="flex items-center gap-2 text-xs">
          Hourly
        </Tabs.Trigger>
        <Tabs.Trigger value="daily" class="flex items-center gap-2 text-xs">Daily</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="current" class="flex-1">
        {@render current(data)}
      </Tabs.Content>

      <Tabs.Content value="daily" class="flex-1">
        <DailyForecast daily={data.daily} />
      </Tabs.Content>
    </Tabs.Root>
  </Dialog.Content>
</Dialog.Root>
