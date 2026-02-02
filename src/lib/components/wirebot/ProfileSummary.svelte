<script>
  /**
   * ProfileSummary — Compact pairing profile for Chrome Extension sidebar
   * 
   * Shows: pairing score, top 3 constructs, complement focus, accuracy.
   * Links to full scoreboard Profile tab for assessment flow.
   */
  import wirebotApi from '$lib/services/wirebot-api';

  let loading = true;
  let effective = null;
  let error = null;

  const constructLabels = {
    action_style: { icon: '⚡', label: 'Action' },
    disc: { icon: '💬', label: 'DISC' },
    energy: { icon: '🔋', label: 'Energy' },
    risk: { icon: '🎲', label: 'Risk' },
    cognitive: { icon: '🧠', label: 'Cognitive' },
  };

  export let scoreboardUrl = '';

  async function load() {
    loading = true;
    error = null;
    try {
      effective = await wirebotApi.getProfile();
    } catch (e) {
      error = e.message;
    }
    loading = false;
  }

  import { onMount } from 'svelte';
  onMount(load);

  $: pairingScore = effective?.pairing_score || 0;
  $: level = effective?.level || 'Initializing';
  $: accuracy = ((effective?.accuracy || 0) * 100).toFixed(0);

  // Top dimension per construct
  function topDim(construct) {
    const dims = effective?.[construct];
    if (!dims || typeof dims !== 'object') return null;
    const entries = Object.entries(dims).filter(([k,v]) => typeof v === 'number' && v > 0);
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return { code: entries[0][0], value: entries[0][1] };
  }

  // Complement top 3
  $: complementItems = (() => {
    const c = effective?.complement;
    if (!c) return [];
    return Object.entries(c)
      .filter(([k, v]) => typeof v === 'number' && v > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ name: k.replace(/_/g, ' '), pct: (v * 100).toFixed(0) }));
  })();
</script>

<div class="space-y-3">
  {#if loading}
    <div class="text-center py-4">
      <div class="animate-pulse text-2xl">🧬</div>
      <div class="text-xs text-gray-500 mt-1">Loading profile...</div>
    </div>
  {:else if error}
    <div class="text-center py-4">
      <div class="text-xs text-red-400">{error}</div>
      <button on:click={load} class="text-xs text-blue-400 mt-1 hover:underline">Retry</button>
    </div>
  {:else}
    <!-- Pairing Score -->
    <div class="flex items-center gap-3 bg-gray-800/60 rounded-lg p-3">
      <div class="relative w-12 h-12 rounded-full flex items-center justify-center"
        style="background: conic-gradient(#7c7cff {pairingScore}%, #222 0);">
        <div class="absolute inset-1 rounded-full bg-gray-900 flex items-center justify-center">
          <span class="text-sm font-bold text-white">{pairingScore}</span>
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-400">Pairing Score</div>
        <div class="text-sm font-semibold text-white">{level}</div>
        <div class="text-[10px] text-gray-500">{accuracy}% accurate</div>
      </div>
    </div>

    <!-- Construct Summaries -->
    <div class="grid grid-cols-5 gap-1">
      {#each Object.entries(constructLabels) as [key, { icon, label }]}
        {@const top = topDim(key)}
        <div class="text-center p-1">
          <div class="text-sm">{icon}</div>
          {#if top}
            <div class="text-[10px] text-gray-300 font-semibold">{top.code}</div>
            <div class="text-[9px] text-gray-500">{top.value.toFixed(1)}</div>
          {:else}
            <div class="text-[10px] text-gray-600">—</div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Complement Focus -->
    {#if complementItems.length > 0}
      <div class="bg-gray-800/40 rounded-lg p-2">
        <div class="text-[10px] text-gray-400 uppercase mb-1">🤖 Wirebot Focus</div>
        {#each complementItems as item}
          <div class="flex items-center justify-between text-xs py-0.5">
            <span class="text-gray-300 capitalize">{item.name}</span>
            <div class="flex items-center gap-1">
              <div class="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-purple-500 rounded-full" style="width:{item.pct}%"></div>
              </div>
              <span class="text-gray-500 text-[10px] w-6 text-right">{item.pct}%</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- CTA -->
    {#if pairingScore < 20}
      <button on:click={() => { if (scoreboardUrl) window.open(scoreboardUrl + '#profile', '_blank'); }}
        class="w-full py-2 text-xs bg-purple-600/20 text-purple-300 border border-purple-500/30
               rounded-lg hover:bg-purple-600/30 transition-colors">
        🧬 Complete your profile →
      </button>
    {/if}
  {/if}
</div>
