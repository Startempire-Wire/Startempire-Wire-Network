import { writable } from 'svelte/store';

// Constants for logging and API endpoints
const LOG_PREFIX = '[Auth Service]';
const AUTH_ENDPOINTS = {
  validate: 'https://startempirewire.com/wp-json/startempire-wire-network/v1/auth/validate'
};

/**
 * Global authentication store
 * Manages reactive auth state across the extension
 * @type {import('svelte/store').Writable<AuthState>}
 */
export const authStore = writable({
  isAuthenticated: false,
  user: null,
  membershipLevel: null,
  wpAuthToken: null
});

/**
 * Authentication service
 * Handles user authentication and token management
 */
export const auth = {
  /**
   * Initialize auth state from storage
   * Called on extension startup
   */
  async initialize() {
    const logPrefix = `${LOG_PREFIX}[initialize]`;
    console.log(`${logPrefix} Initializing auth service`);
    
    try {
      const stored = await chrome.storage.local.get(['auth']);
      if (stored.auth) {
        console.debug(`${logPrefix} Found stored auth data:`, {
          isAuthenticated: stored.auth.isAuthenticated,
          membershipLevel: stored.auth.membershipLevel,
          hasToken: !!stored.auth.wpAuthToken
        });
        authStore.set(stored.auth);
      } else {
        console.debug(`${logPrefix} No stored auth data found`);
      }
    } catch (error) {
      console.error(`${logPrefix} Failed to initialize:`, error);
      throw error;
    }
  },

  /**
   * Authenticate user with WordPress OAuth
   * Handles token acquisition and validation
   */
  async login() {
    const logPrefix = `${LOG_PREFIX}[login]`;
    console.log(`${logPrefix} Starting login flow`);

    try {
      // Get WordPress OAuth token
      console.debug(`${logPrefix} Requesting OAuth token`);
      const token = await chrome.identity.getAuthToken({ 
        interactive: true,
        scopes: ['https://startempirewire.com/wp-json/']
      });
      
      console.debug(`${logPrefix} Token received, validating with WordPress`);
      // Validate with WordPress
      const response = await fetch(AUTH_ENDPOINTS.validate, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error(`${logPrefix} Validation failed:`, response.status);
        throw new Error(`Auth validation failed: ${response.status}`);
      }

      const userData = await response.json();
      console.debug(`${logPrefix} User data received:`, {
        userId: userData.user?.id,
        membershipLevel: userData.membership_level
      });
      
      // Store auth data
      const authData = {
        isAuthenticated: true,
        user: userData.user,
        membershipLevel: userData.membership_level,
        wpAuthToken: token
      };

      console.debug(`${logPrefix} Storing auth data`);
      await chrome.storage.local.set({ auth: authData });
      authStore.set(authData);

      console.log(`${logPrefix} Login completed successfully`);
      return authData;

    } catch (error) {
      console.error(`${logPrefix} Login failed:`, error);
      console.error(`${logPrefix} Error stack:`, error.stack);
      throw error;
    }
  },

  /**
   * Clear authentication state
   * Removes stored tokens and resets auth store
   */
  async logout() {
    const logPrefix = `${LOG_PREFIX}[logout]`;
    console.log(`${logPrefix} Processing logout`);

    try {
      console.debug(`${logPrefix} Clearing stored auth data`);
      await chrome.storage.local.remove(['auth']);
      
      console.debug(`${logPrefix} Resetting auth store`);
      authStore.set({
        isAuthenticated: false,
        user: null,
        membershipLevel: null,
        wpAuthToken: null
      });

      console.log(`${logPrefix} Logout completed successfully`);
    } catch (error) {
      console.error(`${logPrefix} Logout failed:`, error);
      console.error(`${logPrefix} Error stack:`, error.stack);
      throw error;
    }
  }
}; 