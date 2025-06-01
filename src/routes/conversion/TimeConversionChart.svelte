<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import dayjs from '$lib/dayjs'
  import locationStore from '$lib/stores/location.svelte'
  import type { GeoLocation } from '$lib/types/location'
  import { cn } from '$lib/utils'

  let locations = Array.from(locationStore.list)
  let baseIdx = 0
  const hoursToShow = 12
  const slotStep = 1
  const now = dayjs()

  // Generate the time slots (e.g., 12 slots, 1 hour each)
  let slots = Array.from({ length: hoursToShow }, (_, i) => now.add(i, 'hour'))

  function setBase(idx: number) {
    baseIdx = idx
  }

  function getTimeFor(loc: GeoLocation, slotIdx: number) {
    if (!loc || !slots[slotIdx]) return undefined
    const baseTime = slots[slotIdx]
    const baseLoc = locations[baseIdx]
    if (!baseLoc) return undefined
    const utc = baseTime.tz(baseLoc.timezone).utc()
    return utc.tz(loc.timezone)
  }

  // Tailwind Variants (CVA) for table and button
  const tableClass = cn('min-w-full border text-sm', 'bg-background', 'border-border')
  const thClass = cn('border px-2 py-1 whitespace-nowrap', 'border-border', 'bg-muted')
  const tdLocClass = cn('border px-2 py-1 font-bold', 'border-border')
  const tdCellClass = cn(
    'border border-border',
    'px-2 py-1 text-center',
    'transition-colors duration-100'
  )
</script>

{#if locations.length === 0}
  <div class={cn('text-muted-foreground p-4')}>
    No locations found. Add some locations to use the time chart.
  </div>
{:else}
  <div class="overflow-x-auto">
    <table class={tableClass}>
      <thead>
        <tr>
          <th class={thClass}>Location</th>
          {#each slots as slot, i}
            <th class={thClass}>{slot.format('HH:mm')}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each locations as loc, idx}
          <tr>
            <td class={tdLocClass}>
              <Button
                size="sm"
                variant="secondary"
                onclick={() => setBase(idx)}
                class={cn('w-full rounded-sm', { 'font-bold': baseIdx === idx })}
              >
                {loc?.name}
              </Button>
            </td>
            {#each slots as _, slotIdx}
              {@const time = getTimeFor(loc, slotIdx)}
              <td class={cn(tdCellClass, { 'bg-accent': baseIdx === idx })}>
                {time?.format('HH:mm')}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <div class={cn('text-muted-foreground mt-2 text-xs')}>
      Click a location name to set it as the base for the timeline.
    </div>
  </div>
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
