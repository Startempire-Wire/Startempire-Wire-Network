<script>
  /**
   * LoginForm — WordPress credential login for Startempire Wire Network
   * 
   * Flow: username/password → Ring Leader JWT → stored in chrome.storage
   * On success: authStore updates, parent components react
   */
  import { auth, authStore } from '../../../services/auth';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let username = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      error = 'Enter your username and password';
      return;
    }

    loading = true;
    error = '';

    try {
      const result = await auth.login(username.trim(), password.trim());
      dispatch('login', result);
    } catch (err) {
      error = err.message || 'Login failed';
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') handleLogin();
  }
</script>

<div class="space-y-4">
  <div class="text-center mb-4">
    <div class="text-2xl mb-1">⚡</div>
    <h2 class="text-lg font-semibold text-gray-200">Sign In</h2>
    <p class="text-xs text-gray-400 mt-1">
      Use your startempirewire.com credentials
    </p>
  </div>

  {#if error}
    <div class="bg-red-900/30 border border-red-700 text-red-300 px-3 py-2 rounded-lg text-sm">
      {error}
    </div>
  {/if}

  <div class="space-y-3">
    <input
      type="text"
      bind:value={username}
      on:keydown={handleKeydown}
      placeholder="Username or email"
      disabled={loading}
      class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
             text-sm text-gray-200 placeholder-gray-500
             focus:border-blue-500 focus:outline-none disabled:opacity-50"
    />
    <input
      type="password"
      bind:value={password}
      on:keydown={handleKeydown}
      placeholder="Password"
      disabled={loading}
      class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
             text-sm text-gray-200 placeholder-gray-500
             focus:border-blue-500 focus:outline-none disabled:opacity-50"
    />
    <button
      on:click={handleLogin}
      disabled={loading}
      class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
             text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors"
    >
      {loading ? 'Signing in...' : 'Sign In'}
    </button>
  </div>

  <div class="text-center">
    <a href="https://startempirewire.com/register/"
       target="_blank"
       class="text-xs text-blue-400 hover:text-blue-300">
      Join Startempire Wire →
    </a>
  </div>
</div>
