<script lang="ts">
  import type { GeoLocation } from '$lib/types/location'

  import { Separator } from '$lib/components/ui/separator'

  import TimeConversionTable from './TimeConversionTable.svelte'
  import TimeConversionChart from './TimeConversionChart.svelte'

  import locationStore from '$lib/stores/location.svelte'
  import TimeBar from './time-bar.svelte'

  type Comparer = (a: GeoLocation, b: GeoLocation) => number

  const favoriteFirst: Comparer = (a, b) => (a.isFavorite ? -1 : b.isFavorite ? 1 : 0)

  const locations = $derived(Array.from(locationStore.list).sort(favoriteFirst))
</script>

<main class="p-4">
  <h1 class="mb-4 text-2xl font-bold">Time Conversion Table</h1>
  <TimeConversionTable />
  <Separator class="my-8" />
  <h2 class="mt-8 mb-4 text-xl font-bold">Time Conversion Chart</h2>
  <TimeConversionChart />
  <Separator class="my-8" />

  <article class="flex flex-row">
    <div class="relative flex flex-col gap-1 overflow-x-auto pb-4">
      {#each locations as loc}
        <TimeBar location={loc} />
      {/each}
    </div>
  </article>
</main>
