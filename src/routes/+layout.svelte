<script lang="ts">
  import '../app.css'
  import { ModeWatcher } from 'mode-watcher'
  import { Header } from '$components/header'
  // register the dayjs plugin globally
  import '$lib/dayjs'
  import { TooltipProvider } from '$lib/components/ui/tooltip'
  import { Button } from '$lib/components/ui/button'
  import { ExternalLink, Github, Heart } from '@lucide/svelte'

  let { children } = $props()
</script>

<svelte:head>
  <title>Clocks Wall</title>
</svelte:head>

<ModeWatcher defaultMode="dark" />

<Header title="🕒" />

<main class="bg-background z-10 flex flex-1 flex-col">
  <TooltipProvider>
    {@render children?.()}
  </TooltipProvider>
</main>

<footer class="sticky bottom-0 w-full">
  <section class="container mx-auto flex flex-row items-center justify-between p-4">
    <p class="text-muted-foreground flex items-center gap-1 text-center text-sm">
      Made with <Heart class="inline size-4 fill-red-600/90 stroke-0" /> by
      <a href="https://github.com/dinghino">dinghino</a>
    </p>
    <div>
      <Button
        variant="ghost"
        size="icon"
        class="cursor-pointer rounded-md"
        href="https://github.com/dinghino/wall-clock"
      >
        <Github />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="cursor-pointer rounded-md"
        href="https://dinghino.dev"
      >
        <ExternalLink />
      </Button>
    </div>
  </section>
</footer>
