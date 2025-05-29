<script lang="ts">
  import { fly } from 'svelte/transition'

  import locations from '$lib/stores/location.svelte'
  import TimeCard from '$components/time-card'
  import { Loader } from '@lucide/svelte'
  import { cn } from '$lib/utils'
</script>

<section
  class={cn(
    'container mx-auto gap-2 px-4 pt-4',
    // 'flex flex-row flex-wrap items-start justify-start',
    'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    {
      'h-screen': locations.loading || locations.count === 0,
      'h-auto': !locations.loading && locations.count > 0
    }
  )}
>
  {#if locations.loading}
    <div class="grid place-items-center gap-16">
      <Loader class="text-primary size-10 animate-spin" />
    </div>
  {:else if locations.count === 0}
    <div class="flex h-full flex-col items-center justify-center gap-16">
      <h1 class="text-4xl font-bold">Welcome to Clocks Wall</h1>
      <p class="text-md text-gray-600">Your personal weather and time dashboard</p>
      <p class="text-lg text-gray-500">Search your first location to get started!</p>
    </div>
  {:else}
    <!-- {@const sorted = [...locations.list].sort((a, b) => (a.isFavorite ? -1 : 1))} -->
    {#each locations.list as location, i (location.id)}
      <article
        in:fly|global={{ y: 20, duration: 150, delay: 100 * i }}
        out:fly|global={{ y: 20, duration: 150, delay: 100 * i }}
        class="flex w-full md:max-w-96"
      >
        <TimeCard {location} />
      </article>
    {/each}
  {/if}
</section>
