<script>
  import '../../styles/app.css';
  import Tabs from '$lib/components/navigation/Tabs.svelte';
  import { onMount } from 'svelte';
  import { authStore } from '$lib/services';
  import { getNetworkStats } from '$lib/services/network';

  let stats = [];

  onMount(async () => {
    console.log('Sidepanel mounted');
    stats = await getNetworkStats();
  });
</script>

<div class="min-h-screen bg-gray-900 text-gray-100">
  <header class="border-b border-gray-700 px-4 py-3 flex items-center gap-2">
    <span class="text-lg">⚡</span>
    <h1 class="text-base font-semibold">
      Startempire Wire Network
    </h1>
  </header>

  <Tabs />

  {#if stats.length > 0}
  <dl class="grid grid-cols-3 gap-2 px-4 py-2 border-t border-gray-700">
    {#each stats as stat}
      <div class="text-center">
        <dd class="text-lg font-bold text-blue-400">{stat.value}</dd>
        <dt class="text-xs text-gray-400">{stat.label}</dt>
      </div>
    {/each}
  </dl>
  {/if}
</div>
