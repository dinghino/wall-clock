<script lang="ts" module>
  import { tv, type VariantProps } from 'tailwind-variants'

  const variants = tv({
    slots: {
      trigger: [
        'group/detail',
        'transition-all duration-250 ease-in-out',
        'flex w-full flex-1 shrink-0 items-center justify-between gap-2',
      ],
      icon: 'group-hover/detail:stroke-primary stroke-muted-foreground/50 size-6 stroke-2 transition-colors duration-200',
    },

    variants: {
      layout: {
        vertical: {
          trigger: 'flex-col',
        },
        horizontal: {
          trigger: 'flex-row',
        },
      },
      type: {
        default: {
          trigger: '',
        },
        card: {
          trigger: cn(
            'dark:bg-accent/50 bg-accent rounded-sm p-4',
            'shadow-none shadow-black/10 hover:shadow-lg dark:shadow-black/20'
          ),
          icon: 'group-hover/card-section:stroke-primary',
        },
      },
    },
    defaultVariants: {
      type: 'card',
      layout: 'horizontal',
    },
  })

  export type WeatherDetailProps = {
    icon?: Component<IconProps>
    title?: string
    data?: any
    class?: string
  } & VariantProps<typeof variants>
</script>

<script lang="ts">
  import type { IconProps } from '@lucide/svelte'
  import type { Component } from 'svelte'
  import * as Tooltip from '$components/ui/tooltip'

  import { cn } from '$lib/utils'

  const { icon: Icon, title, data, class: className, type, layout }: WeatherDetailProps = $props()

  const classes = variants({ type, layout })
</script>

<Tooltip.Root>
  <Tooltip.Trigger class="w-full">
    <div class={cn(classes.trigger(), className, '')}>
      {#if Icon}
        <Icon class={cn(classes.icon())} />
      {/if}
      <span class="text-sm font-thin text-nowrap">{data}</span>
    </div>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <p>{title}</p>
  </Tooltip.Content>
</Tooltip.Root>
