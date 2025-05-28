<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { Trash } from '@lucide/svelte'
  import { tv, type VariantProps } from 'tailwind-variants'

  type Props = {
    onclick: () => void
  }

  const { onclick }: Props = $props()

  const variants = tv({
    slots: {
      button: 'rounded-md',
      icon: 'stroke-muted-foreground size-4'
    },
    variants: {}
  })

  const classes = variants()
</script>

<Button variant="ghost" class={classes.button()} size="icon" {onclick}>
  <Trash class={classes.icon()} />
</Button>
