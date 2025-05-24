<script lang="ts">
  import ThemeToggle from '$components/theme-toggle'

  import { Input } from '$components/ui/input'
  import { Button } from '$components/ui/button'
  import { MapPin, Search } from '@lucide/svelte'

  export interface HeaderProps {
    title?: string
    navigation?: {
      label: string
      href: string
    }[]
  }

  const { title = 'Clocks Wall', navigation = [] }: HeaderProps = $props()
</script>

<header class="flex h-16 items-center justify-between border-b px-4">
  <h1 class="text-2xl font-bold">{title}</h1>
  <nav>
    <ul class="flex space-x-4">
      {#each navigation as { label, href }}
        <li>
          <a {href} class="text-blue-500 hover:underline">{label}</a>
        </li>
      {/each}
    </ul>
  </nav>
  <section class="flex items-center space-x-4">
    <div class="relative flex">
      <Search class="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
      <Input placeholder="Add Location..." class="pl-8" />
    </div>
    <Button><Search /></Button>
    <Button variant="secondary"><MapPin /></Button>
    <ThemeToggle variant="ghost" />
  </section>
</header>
