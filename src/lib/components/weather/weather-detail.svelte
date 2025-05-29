<script lang="ts" module>
  export type WeatherDetailProps = {
    icon?: Component<IconProps>
    title?: string
    data?: any
    class?: string
  }
</script>

<script lang="ts">
  import type { IconProps } from '@lucide/svelte'
  import type { Component } from 'svelte'
  import * as Tooltip from '$components/ui/tooltip'

  import { cn } from '$lib/utils'

  const { icon: Icon, title, data, class: className }: WeatherDetailProps = $props()
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    <div
      class={cn(
        'group/detail',
        'dark:bg-accent/50 bg-accent rounded-sm p-4',
        'shadow-none shadow-black/10 hover:shadow-lg dark:shadow-black/20',
        'transition-all duration-250 ease-in-out',
        'shrink-1',
        'flex flex-col items-start justify-between gap-2',
        className
      )}
    >
      <!-- <span class="text-start text-xs text-neutral-500">{title}</span> -->

      <div class="flex w-full flex-1 items-center justify-between gap-2">
        {#if Icon}
          <Icon
            class="group-hover/detail:stroke-primary stroke-muted-foreground/50 size-6 stroke-2 transition-colors duration-200"
          />
        {/if}
        <span class="text-sm font-thin text-nowrap">{data}</span>
      </div>
    </div>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <p>{title}</p>
  </Tooltip.Content>
</Tooltip.Root>
