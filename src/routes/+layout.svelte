<script lang="ts">
  import '../app.css'
  import { ModeWatcher } from 'mode-watcher'
  import { Header } from '$components/header'
  // register the dayjs plugin globally
  import '$lib/dayjs'
  // import locations from '$lib/stores/location.svelte'

  // locations.init()

  let { children } = $props()
</script>

<svelte:head>
  <title>Clocks Wall</title>
</svelte:head>

<ModeWatcher defaultMode="dark" />

<Header title="🕒" />

<main class="flex flex-1 flex-col gap-6 overflow-auto p-6">
  {@render children?.()}
</main>
