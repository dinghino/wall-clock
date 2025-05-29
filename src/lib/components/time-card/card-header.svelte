<script lang="ts">
  import type { Snippet } from 'svelte'

  import type { GeoLocation } from '$lib/types/location'
  import { cn } from '$lib/utils'

  import * as Card from '$components/ui/card'
  import { tv, type VariantProps } from 'tailwind-variants'

  const variants = tv({
    slots: {
      wrapper: 'flex items-center justify-between px-4 py-2',
      icons: 'flex items-center gap-0',
      favorite: 'size-4 stroke-red-500 stroke-1'
    },
    variants: {
      background: {
        default: {
          wrapper: '',
          icons: ''
        },
        primary: {
          wrapper: 'bg-primary text-primary-foreground',
          icons: 'text-primary-foreground'
        },
        accent: {
          wrapper: 'bg-accent dark:bg-accent/50 text-accent-foreground',
          icons: 'text-accent-foreground'
        }
      },
      visibility: {
        visible: { wrapper: '', icons: '' },
        dynamic: {
          wrapper: '',
          icons: 'opacity-0 transition-opacity duration-200 group-hover/card:opacity-100'
        }
      },
      favorite: {
        true: {
          favorite: 'fill-red-500/75'
        },
        false: {
          favorite: ''
        }
      }
    },
    defaultVariants: {
      background: 'default',
      visibility: 'dynamic',
      favorite: false
    }
  })

  type Props = {
    location: GeoLocation
    // snippets
    title: Snippet
    icon?: Snippet
    actions?: Snippet
  } & VariantProps<typeof variants>

  const { background, visibility, favorite, title, icon, actions }: Props = $props()

  const classes = variants({ background, visibility, favorite })
</script>

<Card.Header class={cn(classes.wrapper())}>
  <Card.Title class="flex flex-row items-center gap-4">
    {#if icon}
      <div class="grid place-items-center">
        {@render icon()}
      </div>
    {/if}
    <div>
      {@render title()}
    </div>
  </Card.Title>
  {#if actions}
    <div class={cn(classes.icons())}>
      {@render actions()}
    </div>
  {/if}
</Card.Header>
