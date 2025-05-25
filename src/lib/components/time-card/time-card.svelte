<script lang="ts">
  import { onMount } from 'svelte'
  import * as Card from '$components/ui/card'
  import dayjs from 'dayjs'

  const { timeZone = 'UTC' }: { timeZone: string } = $props()

  let currentTime: dayjs.Dayjs | null = $state(null)

  const shortName = timeZone.split('/').pop()?.replace('_', ' ') ?? timeZone

  function updateTime() {
    const nowUtc = dayjs.utc()
    currentTime = nowUtc.tz(timeZone)
  }

  let interval: number | undefined

  onMount(() => {
    updateTime()
    interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  })
</script>

<Card.Root class="bg-muted dark:bg-muted/50 w-full flex-1 gap-2 p-2 shadow-none">
  <Card.Header>
    <Card.Title class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">
        {shortName}
      </h2>
      <span class="text-muted-foreground text-xs">UTC {currentTime?.format('Z')}</span>
    </Card.Title>
  </Card.Header>
  <Card.Content
    class="flex flex-row items-center justify-between gap-2 font-mono text-5xl uppercase"
  >
    {#if currentTime}
      <p class="text-muted-foreground text-2xl">{currentTime.format('ddd')}</p>
      <time class="" datetime={currentTime.toISOString()}>
        <span>{currentTime.format('HH:mm')}</span>
      </time>
    {:else}
      <p>Loading...</p>
    {/if}
  </Card.Content>
</Card.Root>
