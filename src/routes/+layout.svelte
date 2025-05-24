<script lang="ts">
  import '../app.css'
  import { ModeWatcher } from 'mode-watcher'
  import ThemeToggle from '$lib/components/theme-toggle'

  let { children } = $props()
</script>

<ModeWatcher defaultMode="dark" />

<header class="flex h-16 items-center justify-between px-4">
  <h1 class="text-2xl font-bold">Clocks Wall</h1>
  <nav></nav>
  <ThemeToggle />
</header>

<main class="container flex h-full flex-col items-center justify-center gap-6">
  {@render children?.()}
</main>
