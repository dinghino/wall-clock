<script lang="ts">
  import { Input } from '$components/ui/input'
  import { Button } from '$components/ui/button'
  import { MapPin, Search } from '@lucide/svelte'

  export interface LocationSearchProps {
    onSearch: (query: string) => void
    debounce?: number
  }

  const { onSearch, debounce = 250 }: LocationSearchProps = $props()

  let searchQuery = $state('')

  async function handleSearch() {
    if (searchQuery.trim() === '') return
    onSearch(searchQuery)
  }

  $effect(() => {
    let id: number | undefined

    if (searchQuery) {
      id = setTimeout(() => {
        handleSearch()
      }, debounce)
    }
    return () => clearTimeout(id)
  })
</script>

<div class="flex w-full max-w-xl items-center space-x-0">
  <div class="relative flex w-full flex-row">
    <Search class="absolute top-1/2 left-2 size-4 -translate-y-1/2 text-gray-500" />
    <Input
      bind:value={searchQuery}
      placeholder="Search location..."
      class="placeholder:text-muted-foreground bg-background rounded-r-none border-1 pl-8"
    />
  </div>
  <Button class="rounded-l-none"><Search /></Button>
</div>
<Button><MapPin /></Button>
