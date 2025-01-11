<script>
  import '../../styles/app.css';
  import Tabs from '$lib/components/navigation/Tabs.svelte';
  import { onMount } from 'svelte';
  import { authStore } from '$lib/components/services/auth.js';

  onMount(() => {
    console.log('Sidepanel mounted');
  });
</script>

<div class="min-h-screen bg-white dark:bg-gray-800">
  <header class="border-b border-gray-200 dark:border-gray-700 p-4">
    <h1 class="text-xl font-bold text-gray-900 dark:text-white">
      Startempire Wire Network
    </h1>
  </header>

  <Tabs />
</div> 