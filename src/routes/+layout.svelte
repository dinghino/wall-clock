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

<main class="z-10 bg-background flex-1 flex flex-col">
  <TooltipProvider>
    {@render children?.()}
  </TooltipProvider>
</main>

<footer class="sticky bottom-0 w-full">
  <section class="container mx-auto p-4 flex flex-row justify-between items-center">
    <p class="text-muted-foreground text-center text-sm flex items-center gap-1">
      Made with <Heart class="size-4 fill-red-600/90 stroke-0 inline" /> by <a href="https://github.com/dinghino">dinghino</a>
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
