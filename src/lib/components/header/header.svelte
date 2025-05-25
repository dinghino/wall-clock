<script lang="ts">
  import ThemeToggle from '$components/theme-toggle'
  import LocationSearch from './location-search.svelte'
  import AppSettings from './settings.svelte'

  import AppCommand from '$components/app-command'

  // import * as api from '$lib/location'

  export interface HeaderProps {
    title?: string
    navigation?: {
      label: string
      href: string
    }[]
  }

  const { title = 'Clocks Wall', navigation = [] }: HeaderProps = $props()
</script>

<!-- <header class="bg-background sticky top-0 z-10 border-b"> -->
<header
  class="border-border/90 bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-50 w-full border-b backdrop-blur-md"
>
  <div class="container mx-auto flex h-16 flex-row items-center justify-between gap-4 px-4">
    <h1 class="text-2xl font-bold">{title}</h1>
    <!-- <nav>
      <ul class="flex space-x-4">
        {#each navigation as { label, href }}
          <li>
            <a {href} class="text-blue-500 hover:underline">{label}</a>
          </li>
        {/each}
      </ul>
    </nav> -->
    <section class="flex flex-1 items-center justify-center space-x-4">
      <!-- <LocationSearch onSearch={console.log} debounce={400} /> -->
      <AppCommand />
    </section>
    <div>
      <ThemeToggle variant="ghost" />
      <AppSettings />
    </div>
  </div>
</header>
