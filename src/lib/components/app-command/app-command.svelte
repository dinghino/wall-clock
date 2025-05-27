<script lang="ts">
  import { cn } from '$lib/utils'

  import { Button } from '$components/ui/button'
  import * as Command from '$components/ui/command'
  import type { AppCommandProps } from './app-command.types'

  import api from '$lib/api'
  import type { GeoLocation } from '$lib/types/location'
  import locations from '$lib/stores/location.svelte'
  import dayjs from 'dayjs'
  import { SearchIcon } from '@lucide/svelte'

  const { shortcut = 'j', debounce = 250 }: AppCommandProps = $props()

  let open = $state(false)
  let searchQuery = $state('')

  function toggle() {
    open = !open
  }

  function openCommand(e: KeyboardEvent) {
    if (e.key === shortcut && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      open = !open
    }
  }

  let interval: number | undefined = undefined
  async function runQuery(query: string) {
    if (query.trim() === '') {
      return []
    }
    clearTimeout(interval)
    return new Promise<GeoLocation[]>((resolve, reject) => {
      interval = setTimeout(async () => {
        try {
          const results = await api.location.search(query)
          resolve(results)
        } catch (error) {
          reject(error)
        }
      }, debounce)
    })
  }

  function handleSelect(location: GeoLocation) {
    locations.toggle(location)
    toggle()
    searchQuery = '' // Clear search after selection
  }

  $effect(() => {
    if (open) {
      searchQuery = ''
    }
  })
</script>

<svelte:document onkeydown={openCommand} />

{#snippet LocationItem(location: GeoLocation)}
  <Command.Item
    value={location.id}
    class={cn('inline-flex w-full cursor-pointer items-center justify-between gap-8 font-mono')}
    onSelect={() => handleSelect(location)}
  >
    <div class="flex w-full items-center gap-2">
      {#if locations.has(location)}
        <!-- Show a filled blue circle if already selected -->
        <div class="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500"></div>
      {:else}
        <!-- Show an empty circle if not selected -->
        <div class="mr-2 inline-block h-2 w-2 rounded-full border-2 border-blue-500"></div>
      {/if}
      <div class="flex flex-col">
        <h4 class="font-semibold">{location.name}</h4>
        <p class="text-sm font-extrabold">
          {dayjs.utc().tz(location.timezone).format('HH:mm')}
          <span class="text-muted-foreground text-xs">
            {location.country}{location.admin1 && `, ${location.admin1}`}
          </span>
        </p>
      </div>
    </div>

    <div class="text-muted-foreground flex max-w-72 min-w-24 flex-col items-end gap-1 text-xs">
      <span class="">
        {location.timezone}
      </span>
      <span class="">
        UTC {location.utcDelta}
      </span>
    </div>
  </Command.Item>
{/snippet}

<Command.Dialog bind:open shouldFilter={false}>
  <Command.Input bind:value={searchQuery} placeholder="Type a command or search..." />
  <Command.List>
    <Command.Group heading="Locations">
      <Command.Empty class="text-muted-foreground">
        <span class="animate-pulse">Start typing to search for locations</span>
      </Command.Empty>
      {#await runQuery(searchQuery)}
        <Command.Item class="text-muted-foreground">
          <span class="animate-pulse">Loading locations...</span>
        </Command.Item>
      {:then results}
        {#if results.length}
          {#each results as location (location.id)}
            {@render LocationItem(location)}
          {/each}
        {:else if searchQuery.trim() !== ''}
          <Command.Item disabled class="text-muted-foreground">
            No locations found for "{searchQuery}"
          </Command.Item>
        {/if}
      {:catch error}
        <Command.Item disabled class="text-red-500">
          Error loading locations: {error.message}
        </Command.Item>
      {/await}
    </Command.Group>
    <Command.Group heading="Active">
      {#each locations.list as location (location.id)}
        {@render LocationItem(location)}
      {/each}
    </Command.Group>
  </Command.List>
</Command.Dialog>

<!-- trigger for command. renders in place -->

<Button
  onclick={toggle}
  class={cn(
    'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20',
    'dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    'hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
    'bg-muted/50 text-muted-foreground relative',
    'inline-flex h-8 shrink-0 items-center justify-between gap-2 rounded-sm border text-sm font-normal whitespace-nowrap shadow-none',
    'transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none',
    'disabled:opacity-50 has-[>svg]:px-3 aria-disabled:pointer-events-none aria-disabled:opacity-50 sm:pr-12',
    'md:w-40 lg:w-56 xl:w-64',
    // 'w-full max-w-96',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4'
  )}
>
  <div class="inline-flex w-full items-center gap-2">
    <SearchIcon class="inline-flex size-4 md:hidden" />
    <span class="hidden lg:inline-flex">Search locations...</span>
    <span class="inline-flex lg:hidden">Search...</span>
  </div>
  <kbd
    class="bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-sm font-medium opacity-100 select-none sm:flex lg:visible"
  >
    <span class="text-xs">⌘</span> + {shortcut.toUpperCase()}
  </kbd>
</Button>
