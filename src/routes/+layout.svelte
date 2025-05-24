<script lang="ts">
  import '../app.css'
  import { ModeWatcher } from 'mode-watcher'
  import ThemeToggle from '$lib/components/theme-toggle'

  let { children } = $props()
</script>

<ModeWatcher
  defaultMode="dark"
  on:modeChange={(e) => {
    document.documentElement.setAttribute('data-theme', e.detail.mode)
  }}
/>
<header class="flex h-16 items-center justify-between px-4">
  <h1 class="text-2xl font-bold">Clock Wall</h1>
  <nav></nav>
  <ThemeToggle />
</header>
<main class="flex flex-col items-center justify-center h-full gap-6">
  {@render children?.()}
</main>
