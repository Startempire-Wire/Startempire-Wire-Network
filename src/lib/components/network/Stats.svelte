<script>
  import { Card, CardContent, CardHeader, CardTitle } from 'shadcn-svelte';
  import { Progress } from 'shadcn-svelte';
  import { Badge } from 'shadcn-svelte';
  import { networkHealth } from '$lib/services/wordpress';
  import { Tabs, TabsList, TabsTrigger } from 'shadcn-svelte';

  export let networkStats = {
    totalSites: 0,
    newSites: 0,
    categories: [],
  };

  let loading = true;
  let error = null;

  const loadData = async () => {
    try {
      const response = await fetch(`${PARENT_API}/network-stats`);
      if (!response.ok) throw new Error('Network response failed');
      networkStats = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  };

  // Replace hardcoded networkStats with:
  async function loadNetworkData() {
    const res = await fetch('https://startempirewire.network/api/stats');
    return res.json();
  }

  loadData();
</script>

{#if loading}
  <div class="text-center p-4">
    <div
      class="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full"
    />
    <p class="mt-2 text-sm">Loading network data...</p>
  </div>
{:else if error}
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    <p>Error loading stats: {error}</p>
  </div>
{:else}
  <Card>
    <CardHeader>
      <CardTitle>Network Stats</CardTitle>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardContent>
  </Card>
  <Card class="mb-4">
    <CardHeader>
      <CardTitle>Network Growth</CardTitle>
      <Badge variant="outline" class="ml-2">Live</Badge>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div>
          <span class="text-sm">Total Sites: {networkStats.totalSites}</span>
          <Progress
            value={(networkStats.newSites / networkStats.totalSites) * 100}
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          {#each networkStats.categories as category}
            <div>
              <span class="text-sm">{category.name}</span>
              <Progress value={category.count} />
            </div>
          {/each}
        </div>
      </div>
    </CardContent>
  </Card>
  <div class="health-metric">
    <span>Connectivity: {networkHealth.connectivity}%</span>
    <progress value={networkHealth.connectivity} max="100" />
  </div>

  <div class="grid grid-cols-3 gap-4">
    {#each Object.entries(networkStats) as [key, value]}
      <div class="bg-card p-4 rounded-lg">
        <h3 class="text-sm font-medium">{key}</h3>
        <p class="text-2xl font-bold">{value}</p>
      </div>
    {/each}
  </div>

  {#if tier === 'extraWire'}
    <PremiumMetrics />
  {:else}
    <BasicMetrics />
  {/if}
{/if}
