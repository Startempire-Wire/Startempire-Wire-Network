<script>
  import { onMount } from 'svelte';
  import * as TabsPrimitive from '$lib/components/ui/tabs';
  import { getWebsiteScreenshot } from '$lib/services/screenshot';
  import { authStore } from '$lib/services';
  import { auth } from '$lib/services';
  import { getNetworkStats, getNetworkContent } from '$lib/services/network';
  import WirebotTab from '$lib/components/wirebot/WirebotTab.svelte';
  import LoginForm from '$lib/components/auth/LoginForm.svelte';

  const tabs = [
    { id: 'wirebot', label: '🤖 Wirebot', content: 'wirebot-content' },
    { id: 'network', label: '🌐 Network', content: 'network-content' },
    { id: 'settings', label: '⚙️ Settings', content: 'settings-content' },
  ];

  // Live network data (fetched from Ring Leader)
  let networkStats = { totalMembers: 0, tiers: 0, content: 0 };
  let networkContent = [];
  let networkLoading = true;

  // Screenshot previews
  let networkPreviews = [
    { name: 'Startempire Wire', url: 'https://startempirewire.com', screenshot: null },
  ];

  let loading = true;
  let currentPreviewIndex = 0;

  async function loadNetworkData() {
    networkLoading = true;
    try {
      const stats = await getNetworkStats();
      if (stats.length > 0) {
        networkStats = {
          totalMembers: stats.find(s => s.label === 'Members')?.value || 0,
          tiers: stats.find(s => s.label === 'Tiers')?.value || 0,
          content: stats.find(s => s.label === 'Content')?.value || 0,
        };
      }
      networkContent = await getNetworkContent('posts', 1);
    } catch (err) {
      console.error('Failed to load network data:', err);
    } finally {
      networkLoading = false;
    }
  }

  async function loadScreenshots() {
    loading = true;
    try {
      const screenshot = await getWebsiteScreenshot(
        networkPreviews[currentPreviewIndex].url
      );
      if (screenshot) {
        networkPreviews[currentPreviewIndex].screenshot = screenshot;
        networkPreviews = networkPreviews;
      }
    } catch (error) {
      console.error('Failed to load screenshot:', error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    auth.initialize();
    loadScreenshots();
    loadNetworkData();
  });

  function nextPreview() {
    currentPreviewIndex = (currentPreviewIndex + 1) % networkPreviews.length;
  }

  function previousPreview() {
    currentPreviewIndex =
      (currentPreviewIndex - 1 + networkPreviews.length) %
      networkPreviews.length;
  }

  async function handleLogout() {
    await auth.logout();
  }
</script>

<TabsPrimitive.Root value="wirebot" class="w-full">
  <TabsPrimitive.List class="flex border-b border-gray-700">
    {#each tabs as tab}
      <TabsPrimitive.Trigger
        value={tab.id}
        class="flex-1 px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200
               data-[state=active]:text-blue-400 data-[state=active]:border-b-2 
               data-[state=active]:border-blue-400"
      >
        {tab.label}
      </TabsPrimitive.Trigger>
    {/each}
  </TabsPrimitive.List>

  <TabsPrimitive.Content value="wirebot" class="p-4">
    <WirebotTab />
  </TabsPrimitive.Content>

  <TabsPrimitive.Content value="network" class="p-4">
    <div class="space-y-6">
      <!-- Website Preview Carousel -->
      <div class="bg-gray-800 rounded-lg p-4">
        <div
          class="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-2"
        >
          {#if loading}
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"
              ></div>
            </div>
          {:else if !$authStore.isAuthenticated}
            <div
              class="absolute inset-0 flex items-center justify-center flex-col gap-2"
            >
              <p class="text-sm text-gray-400">
                Please login to view screenshots
              </p>
              <button
                class="px-4 py-2 bg-blue-600 text-sm text-blue-100 rounded-lg hover:bg-blue-700"
                on:click={() => auth.login()}
              >
                Login
              </button>
            </div>
          {:else if networkPreviews[currentPreviewIndex].screenshot}
            <img
              src={networkPreviews[currentPreviewIndex].screenshot}
              alt={networkPreviews[currentPreviewIndex].name}
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 flex items-center justify-between p-2">
              <button
                class="p-2 bg-gray-800/80 rounded-full text-gray-200 hover:bg-gray-700/80"
                on:click={previousPreview}
              >
                ◀️
              </button>
              <button
                class="p-2 bg-gray-800/80 rounded-full text-gray-200 hover:bg-gray-700/80"
                on:click={nextPreview}
              >
                ▶️
              </button>
            </div>
          {:else}
            <div class="absolute inset-0 flex items-center justify-center">
              <p class="text-sm text-gray-400">No screenshot available</p>
            </div>
          {/if}
        </div>
        <div class="flex justify-between items-center">
          <a
            href={networkPreviews[currentPreviewIndex].url}
            class="text-sm text-blue-400 hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            {networkPreviews[currentPreviewIndex].url}
          </a>
          <button
            class="text-xs text-gray-400 hover:text-gray-300"
            on:click={() => loadScreenshots()}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <!-- Upcoming Network Members -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-200 mb-4">
          UPCOMING NETWORK MEMBERS
        </h3>
        <div class="space-y-2">
          {#each upcomingMembers as member}
            <div
              class="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div>
                <h4 class="text-sm font-medium text-gray-200">{member.name}</h4>
                <span class="text-xs text-gray-400">{member.category}</span>
              </div>
              <span class="text-xs text-gray-400">
                Joining {new Date(member.joinDate).toLocaleDateString()}
              </span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Web Ring Navigation -->
      <div class="flex justify-center">
        <button
          class="px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-700
                 flex items-center gap-2 font-medium"
        >
          <span>🌐</span> Deploy Web Ring Navigation
        </button>
      </div>

      <!-- Network Stats (live from Ring Leader) -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-200 mb-4">NETWORK OVERVIEW</h3>
        {#if networkLoading}
          <div class="text-center py-4">
            <div class="animate-spin inline-block w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          </div>
        {:else}
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-gray-700 p-3 rounded-lg text-center">
              <div class="text-2xl font-bold text-blue-400">{networkStats.totalMembers}</div>
              <div class="text-xs text-gray-300">Members</div>
            </div>
            <div class="bg-gray-700 p-3 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-400">{networkStats.tiers}</div>
              <div class="text-xs text-gray-300">Tiers</div>
            </div>
            <div class="bg-gray-700 p-3 rounded-lg text-center">
              <div class="text-2xl font-bold text-purple-400">{networkStats.content}</div>
              <div class="text-xs text-gray-300">Content</div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Network Content Feed (live from Ring Leader) -->
      {#if networkContent.length > 0}
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-200 mb-3">LATEST FROM THE NETWORK</h3>
        <div class="space-y-2">
          {#each networkContent.slice(0, 5) as post}
            <a href={post.link || '#'} target="_blank" rel="noopener noreferrer"
               class="block p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div class="text-sm text-gray-200">{@html post.title?.rendered || post.title || 'Untitled'}</div>
              {#if post.date}
                <div class="text-xs text-gray-400 mt-1">
                  {new Date(post.date).toLocaleDateString()}
                </div>
              {/if}
            </a>
          {/each}
        </div>
      </div>
      {/if}
    </div>
  </TabsPrimitive.Content>

  <TabsPrimitive.Content value="settings" class="p-4">
    <div class="space-y-4">
      {#if !$authStore.isAuthenticated}
        <!-- Login Form -->
        <LoginForm on:login={() => {}} />
      {:else}
        <!-- Account Info -->
        <div class="bg-gray-800 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium text-gray-200">ACCOUNT</h3>
            <span class="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-300 uppercase">
              {$authStore.tier || 'free'}
            </span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">Name</span>
              <span class="text-gray-200">{$authStore.user?.display_name || '—'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Email</span>
              <span class="text-gray-200">{$authStore.user?.email || '—'}</span>
            </div>
            {#if $authStore.scoreboardId}
            <div class="flex justify-between">
              <span class="text-gray-400">Scoreboard</span>
              <a href="https://wins.wirebot.chat/{$authStore.scoreboardId}" 
                 target="_blank" class="text-blue-400 hover:text-blue-300">
                View →
              </a>
            </div>
            {/if}
          </div>
        </div>

        <!-- Features -->
        <div class="bg-gray-800 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-200 mb-3">FEATURES</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">⚡ Wirebot AI</span>
              <span class={$authStore.features?.wirebot ? 'text-green-400' : 'text-gray-500'}>
                {$authStore.features?.wirebot ? '✅ Active' : '🔒 Upgrade'}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">📊 Scoreboard</span>
              <span class={$authStore.features?.scoreboard ? 'text-green-400' : 'text-gray-500'}>
                {$authStore.features?.scoreboard ? '✅ Active' : '🔒 Upgrade'}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">🔄 Refresh Rate</span>
              <span class="text-gray-300">
                {Math.round(($authStore.features?.refreshRate || 3600000) / 60000)}min
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-2">
          <a href="https://startempirewire.com/account/" target="_blank"
             class="block w-full text-center text-sm text-blue-400 hover:text-blue-300 
                    py-2 border border-gray-700 rounded-lg">
            Manage Membership →
          </a>
          <button on:click={handleLogout}
                  class="w-full text-sm text-red-400 hover:text-red-300 
                         py-2 border border-gray-700 rounded-lg hover:bg-gray-800">
            Sign Out
          </button>
        </div>
      {/if}

      <!-- Version -->
      <div class="text-center text-xs text-gray-600 mt-4">
        Startempire Wire Network v0.1.0
      </div>
    </div>
  </TabsPrimitive.Content>
</TabsPrimitive.Root>
