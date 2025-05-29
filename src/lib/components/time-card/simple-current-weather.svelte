<script lang="ts">
  import { tv, type VariantProps } from 'tailwind-variants'

  import type { WeatherData } from '$lib/api'
  import { cn, formatTemperature } from '$lib/utils'
  import { WeatherIcon } from '$lib/components/weather'

  type Props = {
    data: WeatherData['current']
    class?: string
    group?: string
    show?: {
      temperature?: boolean
      apparent?: boolean
    }
  } & VariantProps<typeof variants>

  const {
    data,
    group = 'card-section',
    layout,
    cursor = true,
    class: className,
    show = { temperature: true },
  }: Props = $props()

  const variants = tv({
    slots: {
      wrapper: 'flex',
      icon: 'stroke-muted-foreground/50 stroke-[1.5px] flex-1',
      text: 'text-4xl font-thin',
    },
    variants: {
      layout: {
        default: {
          wrapper: 'flex flex-col md:flex-row items-center gap-4',
        },
        horizontal: {
          wrapper: 'flex flex-row items-center gap-6',
        },
        vertical: {
          wrapper: 'flex flex-col items-center gap-6',
        },
      },
      cursor: {
        true: { wrapper: 'cursor-pointer' },
      },
    },
    defaultVariants: {
      layout: 'default',
    },
  })
  const classes = variants({ layout, cursor })
</script>

<div
  data-role="current-weather"
  class={cn(classes.wrapper(), className, { [`group/${group}`]: !!group })}
>
  <WeatherIcon
    size="md"
    code={data.weatherCode}
    className={cn(`group-hover/${group}:stroke-primary`, classes.icon())}
  />
  <p class={cn(classes.text())}>{formatTemperature(data.temperature2m)}</p>
</div>
