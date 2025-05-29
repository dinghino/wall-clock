<script lang="ts">
  import { cn } from '$lib/utils'
  import type { Snippet } from 'svelte'
  import { tv, type VariantProps } from 'tailwind-variants'

  const variants = tv({
    base: 'relative flex flex-col items-center justify-between gap-4 p-4',
    variants: {
      background: {
        transparent: '',
        default: cn(
          'dark:bg-accent/50 bg-accent rounded-sm ',
          'shadow-none',
          'hover:shadow-lg shadow-black/10 dark:shadow-black/20',
          'transition-all duration-250 ease-in-out'
        ),
      },
    },
    defaultVariants: {
      background: 'default',
    },
  })

  type CardSectionProps = {
    children: Snippet
    class?: string
  } & VariantProps<typeof variants>

  const { children, background, class: cls = '', ...rest }: CardSectionProps = $props()
</script>

<div class={cn('group/card-section', variants({ background }), cls)} {...rest}>
  {@render children?.()}
</div>
