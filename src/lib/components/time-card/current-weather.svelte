<script lang="ts">
  import WeatherIcon from '$components/weather-icon.svelte'
  import { cn, formatTemperature } from '$lib/utils'
  import type { WeatherData } from '$lib/api'
  import { tv, type VariantProps } from 'tailwind-variants'

  type Props = {
    data: WeatherData['current']
    class?: string
  } & VariantProps<typeof variants>

  const { data, layout, class: className }: Props = $props()

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
  <div data-role="current-weather" class={cn('w-full flex flex-1', variants({ layout }), className)}>
    <WeatherIcon
      size="md"
      code={data.weatherCode}
      className={cn('stroke-muted-foreground stroke-[1.5px] flex-1')}
    />
    <div class="text-center font-light">
      <p class="text-3xl">{formatTemperature(data.temperature2m)}</p>
      <p class="text-xs text-muted-foreground mt-2">feels {formatTemperature(data.apparentTemperature)}</p>
    </div>
  </div>
{/if}
