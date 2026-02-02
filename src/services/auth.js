import { writable, get } from 'svelte/store';

/**
 * Auth Service — Startempire Wire Network Extension
 * 
 * Authentication flow:
 * 1. User enters WP credentials → POST to startempirewire.com JWT endpoint
 * 2. WP JWT token received → Exchange with Ring Leader for ecosystem JWT
 * 3. Ring Leader JWT stored → Used for all sewn/v1 API calls
 * 4. JWT includes tier info → Controls feature access
 * 
 * Architecture:
 * - startempirewire.com = identity source (MemberPress + WordPress)
 * - Ring Leader (sewn/v1) = auth relay + content distribution
 * - Chrome extension stores JWT in chrome.storage.local
 */

const LOG_PREFIX = '[Auth]';

// API endpoints
const PARENT_SITE = 'https://startempirewire.com';
const RING_LEADER = 'https://startempirewire.network/wp-json/sewn/v1';

// Tier feature permissions
const TIER_FEATURES = {
  free: {
    level: 0,
    wirebot: false,
    scoreboard: false,
    refreshRate: 3600000, // 1hr
  },
  freewire: {
    level: 1,
    wirebot: true,
    scoreboard: false,
    refreshRate: 1800000, // 30min
  },
  wire: {
    level: 2,
    wirebot: true,
    scoreboard: true,
    refreshRate: 600000, // 10min
  },
  extrawire: {
    level: 3,
    wirebot: true,
    scoreboard: true,
    refreshRate: 300000, // 5min
  }
};

/**
 * @typedef {Object} AuthState
 * @property {boolean} isAuthenticated
 * @property {Object|null} user
 * @property {string|null} tier
 * @property {string|null} jwt - Ring Leader JWT
 * @property {string|null} scoreboardId - Member's scoreboard randID
 * @property {Object} features - Tier-based feature flags
 * @property {number} expiresAt - JWT expiry timestamp
 */

/** @type {import('svelte/store').Writable<AuthState>} */
export const authStore = writable({
  isAuthenticated: false,
  user: null,
  tier: null,
  jwt: null,
  scoreboardId: null,
  features: TIER_FEATURES.free,
  expiresAt: 0,
});

export class AuthService {

  /**
   * Initialize auth from stored session
   */
  async initialize() {
    console.log(`${LOG_PREFIX} Initializing`);
    try {
      const stored = await chrome.storage.local.get(['sewn_auth']);
      if (stored.sewn_auth) {
        const auth = stored.sewn_auth;
        
        // Check if JWT expired
        if (auth.expiresAt && auth.expiresAt < Date.now()) {
          console.log(`${LOG_PREFIX} Stored JWT expired, clearing`);
          await this.logout();
          return;
        }

        // Validate token is still good
        const valid = await this._validateToken(auth.jwt);
        if (valid) {
          const tier = (auth.tier || 'free').toLowerCase();
          auth.features = TIER_FEATURES[tier] || TIER_FEATURES.free;
          authStore.set(auth);
          console.log(`${LOG_PREFIX} Restored session: ${auth.user?.display_name} (${tier})`);
        } else {
          console.log(`${LOG_PREFIX} Stored JWT invalid, clearing`);
          await this.logout();
        }
      }
    } catch (err) {
      console.error(`${LOG_PREFIX} Init error:`, err);
    }
  }

  /**
   * Login with WordPress credentials
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<AuthState>}
   */
  async login(username, password) {
    console.log(`${LOG_PREFIX} Login attempt for: ${username}`);

    // Step 1: Get WordPress JWT token
    // Using WP REST API application passwords or JWT plugin
    let wpToken;
    try {
      // Try JWT Authentication plugin endpoint first
      const wpResp = await fetch(`${PARENT_SITE}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (wpResp.ok) {
        const wpData = await wpResp.json();
        wpToken = wpData.token;
      } else {
        // Fallback: Use WP application password (Basic Auth)
        wpToken = btoa(`${username}:${password}`);
      }
    } catch (err) {
      // Fallback: Basic Auth encoding
      wpToken = btoa(`${username}:${password}`);
    }

    if (!wpToken) {
      throw new Error('Failed to get WordPress token');
    }

    // Step 2: Exchange with Ring Leader for ecosystem JWT
    const rlResp = await fetch(`${RING_LEADER}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wpToken}`,
      },
    });

    if (!rlResp.ok) {
      // Try direct validation if token exchange fails
      const valResp = await fetch(`${RING_LEADER}/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${wpToken}`,
        },
      });

      if (!valResp.ok) {
        const err = await valResp.json().catch(() => ({}));
        throw new Error(err.error || `Authentication failed (${valResp.status})`);
      }

      const valData = await valResp.json();
      if (!valData.valid) {
        throw new Error('Invalid credentials');
      }

      // Use validation data directly
      return this._setAuth({
        jwt: wpToken,
        user: valData.user,
        tier: valData.user?.tier || 'free',
        expiresAt: Date.now() + 86400000, // 24hr
      });
    }

    const rlData = await rlResp.json();

    // Step 3: Get member details including scoreboard
    let scoreboardId = null;
    try {
      const memberResp = await fetch(`${RING_LEADER}/member/scoreboard`, {
        headers: { 'Authorization': `Bearer ${rlData.token}` },
      });
      if (memberResp.ok) {
        const memberData = await memberResp.json();
        scoreboardId = memberData.scoreboard_id || null;
      }
    } catch (e) {
      console.warn(`${LOG_PREFIX} Could not fetch scoreboard info:`, e);
    }

    // Step 4: Store and set auth
    return this._setAuth({
      jwt: rlData.token,
      user: rlData.user || { display_name: username },
      tier: rlData.tier || 'free',
      scoreboardId,
      expiresAt: Date.now() + (rlData.expires_in || 86400) * 1000,
    });
  }

  /**
   * Login via WordPress cookie (for users already logged into the site)
   * Uses the Connect plugin's auth exchange endpoint
   */
  async loginViaCookie() {
    console.log(`${LOG_PREFIX} Attempting cookie-based login`);
    
    try {
      // Get WP nonce from the parent site
      const nonceResp = await fetch(`${PARENT_SITE}/wp-json/sewn-connect/v1/auth/exchange`, {
        method: 'POST',
        credentials: 'include', // Send cookies
      });

      if (!nonceResp.ok) {
        return null; // Not logged in on the site
      }

      const data = await nonceResp.json();
      if (data.jwt) {
        return this._setAuth({
          jwt: data.jwt,
          user: data.user,
          tier: data.tier || 'free',
          scoreboardId: null,
          expiresAt: Date.now() + 86400000,
        });
      }
    } catch (err) {
      console.warn(`${LOG_PREFIX} Cookie login failed:`, err);
    }
    return null;
  }

  /**
   * Logout — clear all stored auth
   */
  async logout() {
    console.log(`${LOG_PREFIX} Logging out`);
    await chrome.storage.local.remove(['sewn_auth', 'sewn_jwt']);
    authStore.set({
      isAuthenticated: false,
      user: null,
      tier: null,
      jwt: null,
      scoreboardId: null,
      features: TIER_FEATURES.free,
      expiresAt: 0,
    });
  }

  /**
   * Get current JWT for API calls
   */
  async getToken() {
    const state = get(authStore);
    if (!state.jwt || (state.expiresAt && state.expiresAt < Date.now())) {
      return null;
    }
    return state.jwt;
  }

  /**
   * Check if user has access to a feature
   * @param {string} feature - Feature name (wirebot, scoreboard)
   */
  hasFeature(feature) {
    const state = get(authStore);
    return state.features?.[feature] || false;
  }

  /**
   * Get tier level (0-3)
   */
  getTierLevel() {
    const state = get(authStore);
    return state.features?.level || 0;
  }

  // ─── Private ──────────────────────────────────────────────

  async _validateToken(jwt) {
    if (!jwt) return false;
    try {
      const resp = await fetch(`${RING_LEADER}/auth/validate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${jwt}` },
      });
      const data = await resp.json();
      return data.valid === true;
    } catch {
      return false;
    }
  }

  async _setAuth({ jwt, user, tier, scoreboardId, expiresAt }) {
    const tierKey = (tier || 'free').toLowerCase();
    const auth = {
      isAuthenticated: true,
      user,
      tier: tierKey,
      jwt,
      scoreboardId,
      features: TIER_FEATURES[tierKey] || TIER_FEATURES.free,
      expiresAt,
    };

    await chrome.storage.local.set({ sewn_auth: auth, sewn_jwt: jwt });
    authStore.set(auth);
    console.log(`${LOG_PREFIX} Authenticated: ${user?.display_name} (${tierKey})`);
    return auth;
  }
}

// Singleton
export const auth = new AuthService();
