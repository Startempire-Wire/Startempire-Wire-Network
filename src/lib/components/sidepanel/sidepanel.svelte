<script>
  import { onMount } from 'svelte';
  let messages = [];

  onMount(() => {
    const port = chrome.runtime.connect({ name: 'sidepanel' });
    port.onMessage.addListener((msg) => {
      if (msg.message) {
        messages = [...messages, msg.message];
      }
    });
  });
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold">Welcome, Verious!</h1>
  <div class="my-4 border-t" />
  <div id="messageContainer">
    {#each messages as message}
      <p>{message}</p>
    {/each}
  </div>
  <Card>
    <CardHeader>
      <CardTitle>Network Stats</CardTitle>
    </CardHeader>
    <CardContent>
      <dl class="grid grid-cols-2 gap-4">
        <div v-for="stat in networkStats">
          <dt class="text-sm font-medium">{stat.label}</dt>
          <dd class="mt-1 text-3xl font-semibold">{stat.value}</dd>
        </div>
      </dl>
    </CardContent>
  </Card>
  <Card class="p-6">
    <CardHeader class="pb-4">
      <CardTitle class="text-lg font-semibold">Network Growth</CardTitle>
    </CardHeader>
    <CardContent>
      <LineChart
        data={networkStats}
        config={{
          axis: { x: { label: 'Days' }, y: { label: 'Sites' } },
          markers: [{ shape: 'circle', size: 4 }],
        }}
      />
    </CardContent>
  </Card>
</div>
