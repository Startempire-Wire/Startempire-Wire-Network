import { writable } from 'svelte/store';

// Constants for logging and API endpoints
const LOG_PREFIX = '[Auth Service]';
const AUTH_ENDPOINTS = {
  validate: 'https://startempirewire.com/wp-json/v1/auth/validate',
  buddybossAuth: 'https://startempirewire.com/wp-json/buddyboss/v1/auth', // BuddyBoss Auth Endpoint
  openidConnectAuth: 'https://startempirewire.network/openid/auth' // OpenID Connect Auth Endpoint - Example
};

// Add guilds scope for server verification
const discordScopes = [
  'identify',
  'guilds',
  'guilds.members.read'
];

// Constants
const NETWORK_API = 'https://startempirewire.network/wp-json/sewn/v1';
const PARENT_API = 'https://startempirewire.com/wp-json/sewn/v1';

/**
 * Global authentication store
 * Manages reactive auth state across the extension
 * @type {import('svelte/store').Writable<AuthState>}
 */
export const authStore = writable({
  isAuthenticated: false,
  user: null,
  membershipLevel: null,
  wpAuthToken: null,
  membershipFeatures: []
});

export class AuthService {
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
  }

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
  }

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

  async verifyMembership(token) {
    const response = await fetch('https://startempirewire.com/wp-json/memberpress/v1/membership', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Invalid membership');
    return response.json().tier; // Returns 'freeWire', 'wire', etc
  }
}

// Create and export singleton instance
export const auth = new AuthService();

/**
 * Authenticate with BuddyBoss using username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<AuthResponse>}
 */
export async function authenticateWithBuddyBoss(username, password) {
  const authPrefix = `${LOG_PREFIX} [BuddyBoss Auth]`;
  console.log(`${authPrefix} Attempting BuddyBoss authentication for user:`, username);

  try {
    const response = await fetch(AUTH_ENDPOINTS.buddybossAuth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const message = `BuddyBoss authentication failed: ${response.status} ${response.statusText}`;
      console.warn(`${authPrefix} ${message}`);
      throw new Error(message);
    }

    const authData = await response.json();
    console.debug(`${authPrefix} BuddyBoss authentication successful`, authData);
    return authData; // Adjust based on actual BuddyBoss auth response structure

  } catch (error) {
    console.error(`${authPrefix} BuddyBoss authentication error:`, error);
    throw error;
  }
}

/**
 * Authenticate with OpenID Connect
 * This is a simplified example - actual OIDC flow is more complex (redirects, etc.)
 * @param {string} openIdToken -  OpenID Connect token obtained from provider
 * @returns {Promise<AuthResponse>}
 */
export async function authenticateWithOpenIdConnect(openIdToken) {
  const authPrefix = `${LOG_PREFIX} [OpenID Connect Auth]`;
  console.log(`${authPrefix} Attempting OpenID Connect authentication`);

  try {
    const response = await fetch(AUTH_ENDPOINTS.openidConnectAuth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openIdToken}` // Or however OIDC backend expects token
      }
    });

    if (!response.ok) {
      const message = `OpenID Connect authentication failed: ${response.status} ${response.statusText}`;
      console.warn(`${authPrefix} ${message}`);
      throw new Error(message);
    }

    const authData = await response.json();
    console.debug(`${authPrefix} OpenID Connect authentication successful`, authData);
    return authData; // Adjust based on actual OIDC auth response structure

  } catch (error) {
    console.error(`${authPrefix} OpenID Connect authentication error:`, error);
    throw error;
  }
}

// Example - needs adaptation for WordPress specifics and error handling
const WORDPRESS_AUTH_ENDPOINT = 'YOUR_WORDPRESS_AUTH_ENDPOINT'; // Replace with actual endpoint

export async function authenticateWithWordPress() {
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow({
      url: WORDPRESS_AUTH_ENDPOINT, // Construct full auth URL with client_id, redirect_uri, etc.
      interactive: true // Or false for non-interactive login if appropriate
    }, async function (redirect_url) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      // Extract authorization code from redirect_url
      const authorizationCode = extractCodeFromRedirectURL(redirect_url);
      if (!authorizationCode) {
        reject(new Error("Authorization code not found."));
        return;
      }

      // Exchange authorization code for access token (Backend API call to WordPress)
      const tokenResponse = await fetchTokenFromCode(authorizationCode); // Implement fetchTokenFromCode
      if (!tokenResponse.accessToken) {
        reject(new Error("Failed to retrieve access token."));
        return;
      }

      // Store access token
      await chrome.storage.local.set({ 'wordpressAccessToken': tokenResponse.accessToken });
      resolve(tokenResponse.accessToken);
    });
  });
}

export async function getWordPressAccessToken() {
  const result = await chrome.storage.local.get('wordpressAccessToken');
  return result.wordpressAccessToken;
}

// ... Implement fetchTokenFromCode, extractCodeFromRedirectURL, token refresh logic, etc. ... 

export async function wordpressOAuthFlow() {
  const redirectURL = chrome.identity.getRedirectURL();
  const authURL = new URL('https://startempirewire.com/oauth/authorize');

  authURL.searchParams.append('response_type', 'code');
  authURL.searchParams.append('client_id', WORDPRESS_CLIENT_ID);
  authURL.searchParams.append('redirect_uri', redirectURL);
  authURL.searchParams.append('scope', 'openid profile network');

  try {
    const { code } = await chrome.identity.launchWebAuthFlow({
      url: authURL.toString(),
      interactive: true
    });

    const tokenResponse = await fetch('https://startempirewire.com/oauth/token', {
      method: 'POST',
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectURL
      })
    });

    const { access_token } = await tokenResponse.json();
    authStore.update($auth => ({ ...$auth, wpAuthToken: access_token }));

  } catch (error) {
    console.error('OAuth Flow Failed:', error);
  }
}

export async function refreshMemberPressRoles() {
  const response = await fetch('https://startempirewire.com/wp-json/mp/v1/roles');
  chrome.storage.local.set({ memberpressRoles: await response.json() });
} 