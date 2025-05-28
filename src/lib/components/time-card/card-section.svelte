<script lang="ts" module>
  export type CardSectionProps = {
    children: Snippet
    class?: string
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import type { Snippet } from 'svelte'

  const { children, class: cls = '', ...rest }: CardSectionProps = $props()
</script>

<div
  class={cn(
    'dark:bg-accent/50 bg-accent relative flex flex-col items-center justify-between gap-4 rounded-sm p-4',
    cls
  )}
  {...rest}
>
  {@render children?.()}
</div>
