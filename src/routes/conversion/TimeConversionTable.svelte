<script lang="ts">
  import { onMount } from 'svelte'
  import dayjs from '$lib/dayjs'
  import locationStore from '$lib/stores/location.svelte'

  // Use runes for reactivity
  const locations = $derived(Array.from(locationStore.list))
  const times = $state<Record<string, string>>({})
  let editing: string | null = $state(null)

  onMount(() => {
    // Initialize times to now in each location
    const now = dayjs()
    locations.forEach((loc) => {
      times[loc.id] = now.tz(loc.timezone).format('YYYY-MM-DDTHH:mm')
    })
  })

  function handleInputChange(locId: string, value: string) {
    editing = locId
    // Convert the input value to the other timezones
    const baseLoc = locations.find((l) => l.id === locId)
    if (!baseLoc) return
    const baseTime = dayjs.tz(value, baseLoc.timezone)
    locations.forEach((loc) => {
      times[loc.id] = baseTime.tz(loc.timezone).format('YYYY-MM-DDTHH:mm')
    })
  }

  function setEditing(locId: string) {
    editing = locId
  }
</script>

{#if locations.length === 0}
  <div class="p-4 text-gray-500">
    No locations found. Add some locations to use the time conversion table.
  </div>
{:else}
  <table class="min-w-full border border-gray-300">
    <thead>
      <tr>
        <th class="border px-2 py-1">Location</th>
        <th class="border px-2 py-1">Date/Time</th>
      </tr>
    </thead>
    <tbody>
      {#each locations as loc}
        <tr>
          <td class="border px-2 py-1">{loc.name}</td>
          <td
            class="border px-2 py-1"
            onmouseover={() => setEditing(loc.id)}
            onfocus={() => setEditing(loc.id)}
            onblur={() => (editing = null)}
            onmouseleave={() => (editing = null)}
          >
            {#if !times[loc.id]}
              <span class="text-gray-500">Loading...</span>
            {/if}
            <!-- {#if editing === null || editing !== loc.id}
              <button
                type="button"
                onclick={() => setEditing(loc.id)}
                class="m-0 cursor-pointer border-none bg-transparent p-0 text-inherit hover:underline"
                style="background: none; border: none; padding: 0; margin: 0; text-align: left;"
              >
                {dayjs(times[loc.id]).tz(loc.timezone).format('YYYY-MM-DD HH:mm')}
              </button>
            {/if}
            {#if editing === loc.id} -->
              <input
                type="datetime-local"
                bind:value={times[loc.id]}
                oninput={(e) => !!e && handleInputChange(loc.id, e.target?.value! ?? '')}
                onblur={() => (editing = null)}
                class="rounded border px-2 py-1"
              />
            <!-- {:else}
              <button
                type="button"
                onclick={() => setEditing(loc.id)}
                class="m-0 cursor-pointer border-none bg-transparent p-0 text-inherit hover:underline"
                style="background: none; border: none; padding: 0; margin: 0; text-align: left;"
              >
                {dayjs(times[loc.id]).tz(loc.timezone).format('YYYY-MM-DD HH:mm')}
              </button>
            {/if} -->
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  table {
    border-collapse: collapse;
  }
  th,
  td {
    text-align: left;
  }
</style>
