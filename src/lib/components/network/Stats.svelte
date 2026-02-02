<script>
  import { getNetworkStats, getNetworkContent } from '$lib/services/network';

  export let networkStats = {
    totalMembers: 0,
    tiers: 0,
    content: 0
  };

  let loading = true;
  let error = null;

  const loadData = async () => {
    try {
      const stats = await getNetworkStats();
      if (stats.length > 0) {
        networkStats = {
          totalMembers: stats.find(s => s.label === 'Members')?.value || 0,
          tiers: stats.find(s => s.label === 'Tiers')?.value || 0,
          content: stats.find(s => s.label === 'Content')?.value || 0
        };
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  };

  loadData();
</script>

{#if loading}
  <div class="text-center p-4">
    <div class="animate-spin inline-block w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
    <p class="mt-2 text-sm text-gray-400">Loading network data...</p>
  </div>
{:else if error}
  <div class="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
    Error loading stats: {error}
  </div>
{:else}
  <div class="space-y-3">
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-gray-800 p-3 rounded-lg text-center">
        <div class="text-2xl font-bold text-blue-400">{networkStats.totalMembers}</div>
        <div class="text-xs text-gray-400">Members</div>
      </div>
      <div class="bg-gray-800 p-3 rounded-lg text-center">
        <div class="text-2xl font-bold text-green-400">{networkStats.tiers}</div>
        <div class="text-xs text-gray-400">Tiers</div>
      </div>
      <div class="bg-gray-800 p-3 rounded-lg text-center">
        <div class="text-2xl font-bold text-purple-400">{networkStats.content}</div>
        <div class="text-xs text-gray-400">Content</div>
      </div>
    </div>
  </div>
{/if}
