<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button'
  import type { GeoLocation } from '$lib/types/location'
  import { cn } from '$lib/utils'
  import dayjs from 'dayjs'

  type Props = {
    location: GeoLocation
  }
  const { location }: Props = $props()

  // Calculate UTC offset in hours for the location (at midnight today)
  const today = dayjs().startOf('day')
  const now = dayjs().tz(location.timezone).startOf('hour')

  // Generate 24 hour slots for the location's day
  const slots = Array.from({ length: 24 }, (_, i) => today.tz(location.timezone).add(i, 'hour'))

  const daysBefore = 0
  const daysAfter = 1
  const totalDays = daysBefore + daysAfter + 1 // + today

  // generate a list of lists, one for each day, containing 24 hour slots
  const allSlots = Array.from({ length: totalDays }, (_, dayOffset) => {
    return Array.from({ length: 24 }, (_, hour) =>
      today
        .tz(location.timezone)
        .add(dayOffset - daysBefore, 'day')
        .add(hour, 'hour')
    )
  })

  console.log('allSlots', allSlots)

  // function sameDateAndHour(slot: dayjs.Dayjs, now: dayjs.Dayjs): boolean {
  //   return slot.isSame(now, 'hour')
  // }
</script>

<section class="z-10 flex flex-row items-center gap-2">
  <div class="bg-background sticky left-0 rounded-md p-0">
    <p class={cn(buttonVariants({ size: 'sm', variant: 'default' }), 'min-w-32 justify-end')}>
      {location.name}
    </p>
  </div>
  <div class="flex flex-1 flex-row items-center gap-2 px-2">
    {#each allSlots as day}
      <div class="flex flex-row items-center gap-0">
        <p class="bg-primary/75 text-primary-foreground border rounded-l-md self-stretch p-1 pr-2 min-w-12 text-xs font-semibold flex items-center justify-end">{day[0].format('ddd')}</p>
        <div class="bg-accent/75 flex flex-row flex-nowrap gap-1 rounded-md rounded-l-none border-l-0 border p-1">
          {#each day as slot}
            <p
              class={cn(
                'w-10 shrink-0 rounded-md py-1 text-center text-sm font-semibold',
                {
                  'bg-primary text-primary-foreground ': slot.isSame(now, 'hour'),
                  // 'bg-secondary text-secondary-foreground': !slot.isSame(now, 'hour'),
                }
              )}
            >
              {slot.format('HH')}
            </p>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>
