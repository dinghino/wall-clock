<script lang="ts">
  import dayjs from 'dayjs'
  import { onMount } from 'svelte'

  type Props = {
    timezone: string
    show?: {
      utc?: boolean
      timezone?: boolean
      date?: boolean
    }
  }

  const { timezone, show = {} }: Props = $props()

  let now = $state(dayjs.utc())
  let time = $derived(now.tz(timezone))

  function updateTime() {
    now = dayjs.utc()
  }

  let timeTick: number | undefined
  onMount(() => {
    updateTime()
    timeTick = setInterval(updateTime, 1000)
    return () => clearInterval(timeTick)
  })

  const showExtra = show.timezone || show.utc
</script>

<section class="grid flex-1 place-items-center gap-4" data-role="time">
  {#if show.date}
    <p class="text-muted-foreground text-center text-xl">{time.format('dddd')}</p>
  {/if}
  <time class="w-full text-center text-7xl" datetime={time.toISOString()}>
    <span>{time.format('HH:mm')}</span>
  </time>
  {#if showExtra}
    <div class="flex flex-col items-center text-xs">
      {#if show.timezone}
        <p class="text-muted-foreground font-thin">{timezone.replaceAll('_', ' ')}</p>
      {/if}
      {#if show.utc}<p class="text-muted-foreground mr-2">UTC {time?.format('Z')}</p>{/if}
    </div>
  {/if}
</section>
