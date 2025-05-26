<script lang="ts">
  import TimeCard from '$components/time-card'
  import { fly } from 'svelte/transition'
  import locations from '$lib/stores/location.svelte'
 </script>

{#if locations.list.length === 0}
  <div class="flex h-full flex-col items-center justify-center gap-16">
    <h1 class="text-4xl font-bold">Welcome to Clocks Wall</h1>
    <p class="text-md text-gray-600">Your personal weather and time dashboard</p>
    <p class="text-lg text-gray-500">Search your first location to get started!</p>
  </div>
{:else}
  <div class="flex flex-row flex-wrap items-center justify-center gap-2">
    {#each locations.list as location, i (location.id)}
      <div
        in:fly|global={{ y: 20, duration: 150, delay: 100 * i }}
        class="flex w-full md:max-w-72"
      >
        <TimeCard {location} />
      </div>
    {/each}
  </div>
{/if}
