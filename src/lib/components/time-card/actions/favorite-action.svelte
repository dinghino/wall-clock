<script lang="ts">
  import { cn } from '$lib/utils'
  import { Heart } from '@lucide/svelte'
  import { tv, type VariantProps } from 'tailwind-variants'

  import { Button } from '$lib/components/ui/button'

  type Props = {
    onclick: () => void
  } & VariantProps<typeof variants>

  const { favorite, onclick }: Props = $props()

  const variants = tv({
    slots: {
      button: 'rounded-md',
      icon: 'size-4 stroke-red-500/75 stroke-2'
    },
    variants: {
      favorite: {
        true: { icon: 'fill-red-500/75 stroke-0' },
        false: { icon: '' }
      }
    }
  })
  const classes = $derived(variants({ favorite }))
</script>

<Button variant="ghost" size="icon" class={classes.button()} {onclick}>
  <Heart class={cn(classes.icon())} />
</Button>
