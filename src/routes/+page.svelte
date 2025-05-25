<script lang="ts">
  import TimeCard from '$components/time-card'
  import { fly } from 'svelte/transition'

  const timezones = $state([
    'Europe/Rome',
    'Europe/London',
    'America/New_York',
    'America/Chicago',
    // 'Asia/Tokyo',
    'America/Los_Angeles',
  ])
</script>

{#if !timezones || timezones.length === 0}
  <div class="flex h-full items-center justify-center">
    <h1 class="text-4xl font-bold">Welcome to Clocks Wall</h1>
    <p class="text-lg text-gray-600">Your personal weather and time dashboard</p>
  </div>
{:else}
  <div class="flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row md:gap-8">
    {#each timezones as timeZone, i (timeZone)}
      <article
        in:fly|global={{ y: 20, duration: 150, delay: 100 * i }}
        class="grid w-full max-w-sm place-items-center"
      >
        <TimeCard {timeZone} />
      </article>
    {/each}
  </div>
{/if}
