<script lang="ts">
  import { cn } from '$lib/utils'
  import {
    Sun,
    Cloud,
    CloudSun,
    CloudFog,
    CloudRain,
    CloudSnow,
    CloudLightning,
    Droplets
  } from '@lucide/svelte'

  type WeatherIconProps = {
    code: number
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    className?: string
  }

  const { code, size = 'lg', className }: WeatherIconProps = $props()

  const clsName = $derived(
    cn(
      {
        'size-4': size === 'xs',
        'size-6': size === 'sm',
        'size-10': size === 'md',
        'size-16': size === 'lg',
        'size-24': size === 'xl'
      },
      className
    )
  )
</script>

<div class={cn('flex-shrink-0', {})}>
  {#if code === 0 || code === 1}
    <Sun class={clsName} />
  {:else if code >= 2 && code <= 3}
    <CloudSun class={clsName} />
  {:else if code >= 45 && code <= 49}
    <CloudFog class={clsName} />
  {:else if code >= 50 && code <= 59}
    <Droplets class={clsName} />
  {:else if code >= 60 && code <= 69}
    <CloudRain class={clsName} />
  {:else if code >= 70 && code <= 79}
    <CloudSnow class={clsName} />
  {:else if code >= 95 && code <= 99}
    <CloudLightning class={clsName} />
  {:else}
    <Cloud class={clsName} />
  {/if}
</div>
