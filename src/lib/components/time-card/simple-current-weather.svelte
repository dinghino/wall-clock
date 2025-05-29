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
    class: className,
    show = { temperature: true }
  }: Props = $props()

  const variants = tv({
    variants: {
      layout: {
        default: 'flex-col md:flex-row items-center justify-between gap-1',
        horizontal: 'flex-row items-center justify-between gap-2',
        vertical: 'flex-col items-center justify-center gap-4'
      }
    },
    defaultVariants: {
      layout: 'default'
    }
  })
</script>

{#if !data}
  <div class="grid h-full w-full place-items-center">
    <p class="text-muted-foreground">No current weather data available</p>
  </div>
{:else}
  <div
    data-role="current-weather"
    class={cn('flex w-full flex-1', variants({ layout }), className, {
      [`group/${group}`]: !!group
    })}
  >
    <WeatherIcon
      size="md"
      code={data.weatherCode}
      className={cn(
        'stroke-muted-foreground/50 stroke-[1.5px] flex-1',
        `group-hover/${group}:stroke-primary`
      )}
    />
    <div class="text-center font-light">
      {#if show.temperature}
        <p class="text-3xl">{formatTemperature(data.temperature2m)}</p>
      {/if}
      {#if show.apparent}
        <p class="text-muted-foreground mt-2 text-xs">
          feels {formatTemperature(data.apparentTemperature)}
        </p>
      {/if}
    </div>
  </div>
{/if}
