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

<div class="min-h-screen bg-white dark:bg-gray-800">
  <header class="border-b border-gray-200 dark:border-gray-700 p-4">
    <h1 class="text-xl font-bold text-gray-900 dark:text-white">
      Startempire Wire Network
    </h1>
  </header>

  <Tabs />

  <dl class="grid grid-cols-3 gap-4">
    {#each stats as stat}
      <div class="border p-4">
        <dt class="text-sm">{stat.label}</dt>
        <dd class="text-2xl font-bold">{stat.value}</dd>
      </div>
    {/each}
  </dl>
</div>
