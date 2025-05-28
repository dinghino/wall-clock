<script lang="ts">
  import { fly, fade } from 'svelte/transition'

  import locations from '$lib/stores/location.svelte'
  import TimeCard from '$components/time-card'
</script>

<section class="container mx-auto flex flex-row flex-wrap items-start justify-center gap-3">
  {#if locations.list.length === 0}
    <div class="flex h-full flex-col items-center justify-center gap-16">
      <h1 class="text-4xl font-bold">Welcome to Clocks Wall</h1>
      <p class="text-md text-gray-600">Your personal weather and time dashboard</p>
      <p class="text-lg text-gray-500">Search your first location to get started!</p>
    </div>
  {:else}
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
