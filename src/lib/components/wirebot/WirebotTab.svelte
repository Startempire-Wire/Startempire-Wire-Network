<script>
  /**
   * WirebotTab — The AI Business Operating Dashboard tab
   * 
   * This is the FIRST tab and original product concept.
   * Shows: score, checklist progress, daily tasks, "Ask Wirebot" input.
   * Fetches live data from Ring Leader (sewn/v1) + Scoreboard API.
   */
  import { onMount } from 'svelte';
  import { authStore } from '../../../services/auth';
  import wirebotApi from '$lib/services/wirebot-api';
  import ProfileSummary from './ProfileSummary.svelte';

  let loading = true;
  let score = null;
  let user = null;
  let askInput = '';
  let chatResponse = '';
  let chatLoading = false;
  let chatSessionId = null;
  let scoreboardUrl = null;
  let error = null;

  // Drift system state
  let drift = null;
  let handshakeLoading = false;

  // Scoreboard data
  let scoreData = {
    score: 0,
    signal: 'red',
    ship_today: 0,
    streak: { current: 0 },
    record: '0W-0L',
    season: { name: 'Loading...', days_elapsed: 0 },
    intent: '',
    lanes: { shipping: 0, distribution: 0, revenue: 0, systems: 0 },
    feed: []
  };

  // Checklist summary
  let checklistSummary = {
    total: 0,
    completed: 0,
    nextTask: 'Loading...',
    percent: 0
  };

  const signalColors = {
    green: { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-500' },
    yellow: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-500' },
    red: { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-500' }
  };

  $: colors = signalColors[scoreData.signal] || signalColors.red;

  onMount(async () => {
    try {
      // Get user info
      user = await wirebotApi.validateAuth();
      
      // Get scoreboard
      const sb = await wirebotApi.getScoreboard();
      if (sb && sb.provisioned !== false) {
        scoreboardUrl = sb.url || null;
        const merged = sb.scoreboard || sb;
        
        // Map scoreboard response to our format
        if (merged.score) {
          const s = merged.score;
          scoreData = {
            score: s.execution_score || 0,
            signal: s.execution_score >= 60 ? 'green' : s.execution_score >= 30 ? 'yellow' : 'red',
            ship_today: s.ships_count || 0,
            streak: merged.streak || { current: 0 },
            record: merged.season?.record || '0W-0L',
            season: merged.season || { name: 'Season 1', days_elapsed: 0 },
            intent: s.intent || '',
            lanes: {
              shipping: s.shipping_score || 0,
              distribution: s.distribution_score || 0,
              revenue: s.revenue_score || 0,
              systems: s.systems_score || 0
            },
            feed: merged.feed || sb.feed || []
          };
        } else {
          scoreData = { ...scoreData, ...merged };
          if (sb.feed) scoreData.feed = sb.feed;
        }

        // Checklist from dashboard mode
        if (sb.checklist) {
          checklistSummary = {
            total: sb.checklist.total || 0,
            completed: sb.checklist.completed || 0,
            percent: sb.checklist.percent || 0,
            nextTask: sb.checklist.next_task || '',
          };
        }
      }
      // Fetch Drift state
      try {
        const driftData = await wirebotApi.getDrift();
        if (driftData && driftData.drift) {
          drift = driftData.drift;
        }
      } catch (e) {
        console.warn('Drift fetch failed:', e);
      }
    } catch (err) {
      console.error('WirebotTab load error:', err);
      error = err.message;
    } finally {
      loading = false;
    }
  });

  async function handleAsk() {
    if (!askInput.trim()) return;
    chatLoading = true;
    chatResponse = '';
    
    const result = await wirebotApi.askWirebot(askInput, { 
      scoreboardUrl, 
      sessionId: chatSessionId 
    });
    chatResponse = result.content || result.error || 'No response';
    if (result.sessionId) chatSessionId = result.sessionId;
    askInput = '';
    chatLoading = false;
  }

  async function handleHandshake() {
    handshakeLoading = true;
    try {
      const result = await wirebotApi.handshake();
      if (result && result.drift_score !== undefined) {
        drift = { ...drift, score: result.drift_score, signal: result.drift_signal, handshake_streak: result.handshake_streak };
      }
    } catch (e) {
      console.error('Handshake failed:', e);
    }
    handshakeLoading = false;
  }

  function driftSignalLabel(signal) {
    const labels = { deep_sync: 'DEEP SYNC', in_drift: 'IN DRIFT', drifting: 'DRIFTING', weak: 'WEAK', disconnected: 'OFFLINE' };
    return labels[signal] || signal?.toUpperCase() || '?';
  }

  function driftSignalColor(signal) {
    const colors = { deep_sync: '#00ff64', in_drift: '#4a9eff', drifting: '#ffc800', weak: '#ff9500', disconnected: '#ff3232' };
    return colors[signal] || '#666';
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  function timeAgo(ts) {
    if (!ts) return '';
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  const laneIcons = {
    shipping: '📦', distribution: '📣', revenue: '💰', systems: '⚙️'
  };
</script>

<div class="space-y-4">
  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
    </div>
  {:else}
    <!-- Greeting + Score -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-200">
        {user ? `Welcome, ${user.display_name || 'Operator'}!` : 'Welcome to Wirebot ⚡'}
      </h2>
      {#if user}
        <span class="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-300 uppercase">
          {user.tier || 'free'}
        </span>
      {/if}
    </div>

    <!-- Execution Score Card -->
    <div class="{colors.bg} rounded-lg p-4 border {colors.border}">
      <div class="flex items-center justify-between mb-2">
        <div>
          <div class="text-3xl font-bold {colors.text}">{scoreData.score}</div>
          <div class="text-xs text-gray-400 uppercase">{scoreData.signal} signal</div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-300">{scoreData.record}</div>
          <div class="text-xs text-gray-400">{scoreData.season?.name || 'Season'}</div>
          <div class="text-xs text-gray-500">Day {scoreData.season?.days_elapsed || 0}</div>
        </div>
      </div>
      
      <!-- Lanes -->
      <div class="grid grid-cols-4 gap-2 mt-3">
        {#each ['shipping', 'distribution', 'revenue', 'systems'] as lane}
          <div class="text-center">
            <div class="text-xs text-gray-400">{laneIcons[lane]}</div>
            <div class="w-full bg-gray-700 rounded-full h-1 mt-1">
              <div class="bg-blue-500 h-1 rounded-full" 
                   style="width: {Math.min(100, (scoreData.lanes?.[lane] || 0) / (lane === 'shipping' ? 40 : lane === 'distribution' ? 25 : lane === 'revenue' ? 20 : 15) * 100)}%">
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-0.5">{scoreData.lanes?.[lane] || 0}</div>
          </div>
        {/each}
      </div>

      <!-- Quick stats row -->
      <div class="flex justify-between mt-3 text-xs text-gray-400">
        <span>📦 {scoreData.ship_today} shipped</span>
        <span>🔥 {scoreData.streak?.current || 0} streak</span>
        {#if scoreData.intent}
          <span>🎯 {scoreData.intent.slice(0, 20)}{scoreData.intent.length > 20 ? '...' : ''}</span>
        {/if}
      </div>
    </div>

    <!-- Neural Drift Card -->
    {#if drift}
      <div class="rounded-lg p-3 border" 
           style="background: {driftSignalColor(drift.signal)}10; border-color: {driftSignalColor(drift.signal)}30">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-sm">🧠</span>
            <span class="text-xs font-bold uppercase tracking-widest" style="color: {driftSignalColor(drift.signal)}">
              {driftSignalLabel(drift.signal)}
            </span>
          </div>
          <span class="text-lg font-bold" style="color: {driftSignalColor(drift.signal)}">{drift.score}%</span>
        </div>
        <div class="w-full bg-gray-700/50 rounded-full h-1.5">
          <div class="h-1.5 rounded-full transition-all" 
               style="width: {drift.score}%; background: linear-gradient(90deg, {driftSignalColor(drift.signal)}, {driftSignalColor(drift.signal)}88)">
          </div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-400">
          {#if drift.handshake_streak > 0}
            <span>🤝 {drift.handshake_streak}d streak</span>
          {:else}
            <button class="text-blue-400 hover:text-blue-300" 
                    on:click={handleHandshake} disabled={handshakeLoading}>
              {handshakeLoading ? '⏳' : '🤝'} {handshakeLoading ? 'Syncing...' : 'Start Handshake'}
            </button>
          {/if}
          <span style="opacity:0.5">modesty: {Math.round((1 - (drift.modesty_reflex || 0)) * 100)}% open</span>
        </div>
      </div>

      <!-- R.A.B.I.T. Alert -->
      {#if drift.rabbit?.active}
        <div class="rounded-lg p-3 border border-amber-500/30 bg-amber-900/20">
          <div class="flex items-start gap-2">
            <span class="text-lg">🐇</span>
            <div>
              <div class="text-xs font-bold text-amber-400 uppercase">R.A.B.I.T. DETECTED</div>
              <div class="text-sm text-gray-300 mt-1">{drift.rabbit.message}</div>
            </div>
          </div>
        </div>
      {/if}
    {/if}

    <!-- Pairing Profile Summary -->
    {#if user}
      <ProfileSummary {scoreboardUrl} />
    {/if}

    <!-- Recent Activity Feed (compact) -->
    {#if scoreData.feed && scoreData.feed.length > 0}
      <div class="space-y-1">
        <h3 class="text-xs font-medium text-gray-400 uppercase">Recent Activity</h3>
        <div class="space-y-1 max-h-32 overflow-y-auto">
          {#each scoreData.feed.slice(0, 5) as item}
            <div class="flex items-center justify-between px-2 py-1 bg-gray-800/50 rounded text-xs">
              <span class="text-gray-300 truncate flex-1">
                {laneIcons[item.lane] || '•'} {item.title || item.type}
              </span>
              <span class="text-gray-500 ml-2 shrink-0">{timeAgo(item.timestamp)}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Business Setup Progress -->
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-medium text-sm text-gray-200">
          BUSINESS SETUP — {checklistSummary.percent}%
        </h3>
        <span class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
          {checklistSummary.completed}/{checklistSummary.total} TASKS
        </span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-1.5 mb-3">
        <div class="bg-blue-500 h-1.5 rounded-full transition-all" 
             style="width: {checklistSummary.percent}%"></div>
      </div>
      {#if checklistSummary.nextTask && checklistSummary.nextTask !== 'Loading...'}
        <div class="text-sm text-gray-300">
          <span class="text-gray-400">Next:</span> {checklistSummary.nextTask}
        </div>
      {/if}
    </div>

    <!-- Ask Wirebot -->
    <div class="mt-4">
      {#if chatResponse}
        <div class="mb-3 p-3 bg-gray-800 rounded-lg text-sm text-gray-200 border border-gray-700">
          <div class="text-xs text-blue-400 mb-1">⚡ Wirebot</div>
          <div class="whitespace-pre-wrap">{chatResponse}</div>
        </div>
      {/if}
      <div class="relative">
        <input
          type="text"
          bind:value={askInput}
          on:keydown={handleKeydown}
          placeholder="Ask Wirebot a question..."
          disabled={chatLoading}
          class="w-full pl-4 pr-12 py-2.5 bg-gray-800 border border-gray-700
                 rounded-lg text-sm text-gray-200 placeholder-gray-500
                 focus:border-blue-500 focus:outline-none disabled:opacity-50"
        />
        <button 
          on:click={handleAsk}
          disabled={chatLoading || !askInput.trim()}
          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 
                 hover:text-blue-400 disabled:opacity-30"
        >
          {chatLoading ? '⏳' : '➡️'}
        </button>
      </div>
    </div>
  {/if}
</div>
