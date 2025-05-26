<script lang="ts">
  import { cn } from '$lib/utils'

  import { Button } from '$components/ui/button'
  import * as Command from '$components/ui/command'
  import type { AppCommandProps } from './app-command.types'

  import api from '$lib/api'
  import type { GeoLocation } from '$lib/types/location'
  import locations from '$lib/stores/location.svelte'

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

  let interval: number | undefined = $state(undefined)

  async function runQuery(query: string) {
    if (query.trim() === '') {
      return []
    }
    // await new Promise((resolve) => {
    //   clearTimeout(interval)
    //   interval = setTimeout(resolve, debounce)
    // })
    // try {
    //   return api.location.search(query)
    // } catch (error) {
    //   // Handle error gracefully, return empty array or rethrow
    //   console.error('Error fetching locations:', error)
    //   return []
    // }

    clearTimeout(interval)
    return new Promise<GeoLocation[]>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const results = await api.location.search(query)
          resolve(results)
        } catch (error) {
          reject(error)
        }
      }, debounce)
    })
  }
</script>

<svelte:document onkeydown={openCommand} />

{#snippet LocationItem(location: GeoLocation)}
  <Command.Item
    value={location.id}
    class={cn('inline-flex w-full cursor-pointer items-center justify-between gap-2')}
    onSelect={() => {
      locations.toggle(location)
      toggle()
      searchQuery = '' // Clear search after selection
    }}
  >
    <article class="flex w-full items-center gap-2">
      {#if locations.has(location)}
        <!-- Show a filled blue circle if already selected -->
        <div class="mr-2 inline-block h-4 w-4 rounded-full bg-blue-500"></div>
      {:else}
        <!-- Show an empty circle if not selected -->
        <div class="mr-2 inline-block h-4 w-4 rounded-full border-2 border-blue-500"></div>
      {/if}
      <div class="flex flex-col">
        <h4 class="font-semibold">{location.name}</h4>
        <span class="text-muted-foreground text-xs">
          {location.country}{location.admin1 && `, ${location.admin1}`}
        </span>
      </div>
    </article>
    <div class="text-muted-foreground flex flex-col items-end gap-1 text-xs">
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
  <Command.Group heading="Locations">
    <Command.List>
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
        {:else}
          <Command.Item disabled class="text-muted-foreground">
            Start typing to search for locations
          </Command.Item>
        {/if}
      {:catch error}
        <Command.Item disabled class="text-red-500">
          Error loading locations: {error.message}
        </Command.Item>
      {/await}
    </Command.List>
  </Command.Group>
  <Command.Group heading="Active">
    <Command.List>
      {#each locations.list as location (location.id)}
        {@render LocationItem(location)}
      {/each}
    </Command.List>
  </Command.Group>
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
    // 'md:w-40 lg:w-56 xl:w-64',
    'w-full max-w-96',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4'
  )}
>
  <span class=" hidden lg:inline-flex">Search locations...</span>
  <span class="inline-flex lg:hidden">Search...</span>
  <kbd
    class="bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] h-5 items-center gap-1 rounded border px-1.5 font-mono text-sm font-medium opacity-100 select-none sm:flex"
  >
    <span class="text-xs">⌘</span> + {shortcut.toUpperCase()}
  </kbd>
</Button>
