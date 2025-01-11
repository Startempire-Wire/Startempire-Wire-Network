<script>
  import { onMount } from 'svelte';
  import * as TabsPrimitive from '$lib/components/ui/tabs';
  import { getWebsiteScreenshot } from '$lib/services/screenshot';
  import { authStore } from '$lib/components/services/auth.js';
  import { auth } from '$lib/components/services/auth.js';
  
  const tabs = [
    { id: 'wirebot', label: '🤖 Wirebot', content: 'wirebot-content' },
    { id: 'network', label: '🌐 Network', content: 'network-content' },
    { id: 'settings', label: '⚙️ Settings', content: 'settings-content' }
  ];
  
  const businessSetupProgress = {
    total: 20,
    completed: 3,
    nextTask: 'Create Mission Statement'
  };

  const networkPartners = [
    { id: 'idea', label: 'Idea', icon: '💡' },
    { id: 'launch', label: 'Launch', icon: '🚀' },
    { id: 'growth', label: 'Growth', icon: '📈' }
  ];

  const dailyTasks = [
    { id: 1, task: 'Create Mission Statement', status: 'pending' },
    { id: 2, task: 'Create Mission Statement', status: 'pending' },
    { id: 3, task: 'Create Mission Statement', status: 'pending' }
  ];

  // Network data
  const networkStats = {
    totalSites: 42,
    newSites: 5,
    businessCategories: [
      { name: 'Technology', count: 15 },
      { name: 'Services', count: 12 },
      { name: 'Retail', count: 8 }
    ]
  };

  // Network sites (simplified for example)
  const networkSites = [
    { name: 'TechHub IE', category: 'Technology', status: 'active', memberType: 'ExtraWire' },
    { name: 'Local Services Co', category: 'Services', status: 'active', memberType: 'Wire' },
    { name: 'StartupBoost', category: 'Technology', status: 'active', memberType: 'FreeWire' }
  ];

  // User settings
  const userSettings = {
    notifications: true,
    darkMode: true,
    autoConnect: true,
    membershipLevel: 'Wire',
    email: 'user@example.com'
  };

  // Add after networkSites (line 44)
  let networkPreviews = [
    { 
      name: 'Google', 
      url: 'https://www.google.com', 
      screenshot: null 
    }
  ];

  const upcomingMembers = [
    { name: 'Innovation Labs', category: 'Technology', joinDate: '2024-04-01' },
    { name: 'Digital Solutions', category: 'Services', joinDate: '2024-04-03' },
    { name: 'Green Tech Co', category: 'Technology', joinDate: '2024-04-05' }
  ];

  let loading = true;
  let currentPreviewIndex = 0;

  async function loadScreenshots() {
    loading = true;
    try {
      const screenshot = await getWebsiteScreenshot(networkPreviews[currentPreviewIndex].url);
      if (screenshot) {
        networkPreviews[currentPreviewIndex].screenshot = screenshot;
        networkPreviews = networkPreviews; // Trigger Svelte reactivity
      }
    } catch (error) {
      console.error('Failed to load screenshot:', error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadScreenshots();
  });

  function nextPreview() {
    currentPreviewIndex = (currentPreviewIndex + 1) % networkPreviews.length;
  }

  function previousPreview() {
    currentPreviewIndex = (currentPreviewIndex - 1 + networkPreviews.length) % networkPreviews.length;
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
    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-200">Welcome, Verious!</h2>
      
      <!-- Business Setup Tasks -->
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center gap-2">
            <h3 class="font-medium text-sm text-gray-200">BUSINESS SETUP TASKS - 15%</h3>
            <button class="text-gray-400 hover:text-gray-200">
              <span>ℹ️</span>
            </button>
          </div>
          <span class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-200">
            20 TASKS COMPLETED
          </span>
        </div>
        
        <div class="w-full bg-gray-700 rounded-full h-1.5 mb-4">
          <div class="bg-blue-500 h-1.5 rounded-full" style="width: 15%"></div>
        </div>

        <div class="text-sm text-gray-200">
          <div class="font-medium mb-2">NEXT TASK: Create Mission Statement</div>
          <div class="flex items-center gap-2">
            <button class="text-xs px-3 py-1 bg-blue-600 text-blue-100 rounded-full hover:bg-blue-700">
              START
            </button>
            <span class="text-xs text-gray-400">Est. 5 min</span>
          </div>
        </div>
      </div>

      <!-- Finish Onboarding -->
      <div class="flex gap-4">
        {#each Array(3) as _, i}
          <div class="flex-1 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <h4 class="text-xs font-medium text-gray-200">Business Onboarding {i + 1}</h4>
          </div>
        {/each}
      </div>

      <!-- Network Growth Partners -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <h3 class="text-xs font-medium text-gray-200">NETWORK GROWTH PARTNERS</h3>
          <button class="text-xs text-blue-400 hover:text-blue-300">CONNECT ℹ️</button>
        </div>
        <div class="flex justify-between gap-2">
          {#each networkPartners as partner}
            <button class="flex-1 py-2 px-3 bg-gray-800 rounded-lg border border-gray-700
                         text-sm font-medium text-gray-200 hover:bg-gray-700">
              {partner.icon} {partner.label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Daily Stand Up Tasks -->
      <div class="space-y-2">
        <h3 class="text-xs font-medium text-gray-200">DAILY STAND UP TASKS</h3>
        <div class="space-y-2">
          {#each dailyTasks as task}
            <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg
                      border border-gray-700">
              <div class="flex items-center gap-3">
                <input type="checkbox" class="rounded border-gray-600 bg-gray-700 text-blue-500">
                <span class="text-sm text-gray-200">{task.task}</span>
              </div>
              <div class="flex gap-2">
                <button class="text-gray-400 hover:text-gray-200">⚙️</button>
                <button class="text-gray-400 hover:text-gray-200">📝</button>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Business Setup Tasks (Additional Section) -->
      <div class="space-y-2">
        <h3 class="text-xs font-medium text-gray-200">BUSINESS SETUP TASKS</h3>
        <div class="space-y-2">
          {#each dailyTasks as task}
            <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg
                      border border-gray-700">
              <div class="flex items-center gap-3">
                <input type="checkbox" class="rounded border-gray-600 bg-gray-700 text-blue-500">
                <span class="text-sm text-gray-200">{task.task}</span>
              </div>
              <div class="flex gap-2">
                <button class="text-gray-400 hover:text-gray-200">⚙️</button>
                <button class="text-gray-400 hover:text-gray-200">📝</button>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Ask Wire Bot -->
      <div class="mt-6">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Ask Wire Bot A Question..."
            class="w-full pl-4 pr-12 py-2.5 bg-gray-800 border border-gray-700 
                   rounded-lg text-sm text-gray-200 placeholder-gray-500"
          >
          <div class="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <button class="text-gray-400 hover:text-gray-200">➡️</button>
            <button class="text-gray-400 hover:text-gray-200">📧</button>
          </div>
        </div>
      </div>
    </div>
  </TabsPrimitive.Content>

  <TabsPrimitive.Content value="network" class="p-4">
    <div class="space-y-6">
      <!-- Website Preview Carousel -->
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-2">
          {#if loading}
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          {:else if !$authStore.isAuthenticated}
            <div class="absolute inset-0 flex items-center justify-center flex-col gap-2">
              <p class="text-sm text-gray-400">Please login to view screenshots</p>
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
        <h3 class="text-sm font-medium text-gray-200 mb-4">UPCOMING NETWORK MEMBERS</h3>
        <div class="space-y-2">
          {#each upcomingMembers as member}
            <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
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

      <!-- Network Stats (existing code) -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-200 mb-4">NETWORK OVERVIEW</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-gray-700 p-3 rounded-lg">
            <div class="text-2xl font-bold text-blue-400">{networkStats.totalSites}</div>
            <div class="text-xs text-gray-300">Total Sites</div>
          </div>
          <div class="bg-gray-700 p-3 rounded-lg">
            <div class="text-2xl font-bold text-green-400">{networkStats.newSites}</div>
            <div class="text-xs text-gray-300">New This Week</div>
          </div>
          <div class="bg-gray-700 p-3 rounded-lg">
            <div class="text-2xl font-bold text-purple-400">{networkStats.businessCategories.length}</div>
            <div class="text-xs text-gray-300">Categories</div>
          </div>
        </div>
      </div>

      <!-- Network Ring (existing code) -->
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-sm font-medium text-gray-200">NETWORK RING</h3>
          <button class="text-xs text-blue-400 hover:text-blue-300">VIEW ALL</button>
        </div>
        <div class="flex flex-wrap gap-2">
          {#each networkSites as site}
            <div class="bg-gray-700 p-3 rounded-lg border border-gray-600 flex-1 min-w-[200px]">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-sm font-medium text-gray-200">{site.name}</h4>
                <span class="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-300">
                  {site.memberType}
                </span>
              </div>
              <div class="text-xs text-gray-400">{site.category}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </TabsPrimitive.Content>

  <TabsPrimitive.Content value="settings" class="p-4">
    <div class="space-y-6">
      <!-- Account Settings -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-200 mb-4">ACCOUNT SETTINGS</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-200">Membership Level</span>
            <span class="text-sm text-blue-400">{userSettings.membershipLevel}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-200">Email</span>
            <span class="text-sm text-gray-400">{userSettings.email}</span>
          </div>
        </div>
      </div>

      <!-- Preferences -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-200 mb-4">PREFERENCES</h3>
        <div class="space-y-4">
          {#each Object.entries(userSettings) as [key, value]}
            {#if typeof value === 'boolean'}
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-200">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <button class="relative inline-flex h-6 w-11 items-center rounded-full
                             ${value ? 'bg-blue-600' : 'bg-gray-600'}">
                  <span class="translate-x-${value ? '6' : '1'} inline-block h-4 w-4 
                             rounded-full bg-white transition"></span>
                </button>
              </div>
            {/if}
          {/each}
        </div>
      </div>

      <!-- Data Management -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-200 mb-4">DATA MANAGEMENT</h3>
        <div class="space-y-2">
          <button class="w-full text-left text-sm text-gray-200 p-2 hover:bg-gray-700 rounded">
            Clear Cache
          </button>
          <button class="w-full text-left text-sm text-gray-200 p-2 hover:bg-gray-700 rounded">
            Export Data
          </button>
          <button class="w-full text-left text-sm text-red-400 p-2 hover:bg-gray-700 rounded">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </TabsPrimitive.Content>
</TabsPrimitive.Root> 