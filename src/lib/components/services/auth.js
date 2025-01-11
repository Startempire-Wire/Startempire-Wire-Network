import { writable } from 'svelte/store';

// Initialize auth store with default values
export const authStore = writable({
  isAuthenticated: false,
  user: null,
  membershipLevel: null,
  wpAuthToken: null,
  membershipFeatures: []
});

// API endpoints for authentication
const NETWORK_API = 'https://startempirewire.network/wp-json/sewn/v1';
const PARENT_API = 'https://startempirewire.com/wp-json/sewn/v1';

export class AuthService {
  /**
   * Authenticate user with WordPress OAuth
   * Handles both network and parent site authentication flows
   * 
   * @param {string} site - 'network' or 'parent' site to authenticate against
   * @returns {Promise<boolean>} Authentication success
   * @throws {Error} If authentication fails
   */
  async authenticate(site = 'network') {
    const logPrefix = `[AuthService.authenticate][${site}]`;
    console.log(`${logPrefix} Starting authentication flow`);
    console.debug(`${logPrefix} Current auth store state:`, await this.#getAuthState());

    try {
      // Determine OAuth endpoint based on site parameter
      const baseUrl = site === 'network' ? NETWORK_API : PARENT_API;
      console.log(`${logPrefix} Using OAuth endpoint: ${baseUrl}`);
      
      const authUrl = `${baseUrl}/auth/connect`;
      const redirectUrl = chrome.identity.getRedirectURL();
      console.debug(`${logPrefix} Redirect URL configured as: ${redirectUrl}`);
      
      // Launch Chrome's OAuth flow
      console.log(`${logPrefix} Initiating OAuth flow...`);
      const token = await this.#launchOAuthFlow(authUrl, redirectUrl);
      console.debug(`${logPrefix} Received initial token (truncated):`, token?.substring(0, 10) + '...');
      
      // For parent site auth, exchange token for network token
      if (site === 'parent') {
        console.log(`${logPrefix} Parent site auth - exchanging token for network access`);
        const networkToken = await this.#exchangeToken(token);
        console.debug(`${logPrefix} Network token received (truncated):`, networkToken?.substring(0, 10) + '...');
        await this.#storeAuth({ wpAuthToken: networkToken });
      } else {
        await this.#storeAuth({ wpAuthToken: token });
      }
      
      console.log(`${logPrefix} Authentication completed successfully`);
      return true;

    } catch (error) {
      console.error(`${logPrefix} Authentication failed:`, error);
      console.error(`${logPrefix} Error stack:`, error.stack);
      
      // Log detailed error response if available
      if (error.response) {
        try {
          const errorText = await error.response.text();
          console.error(`${logPrefix} Error response details:`, errorText);
        } catch (e) {
          console.error(`${logPrefix} Could not parse error response:`, e);
        }
      }

      // Log Chrome runtime errors if present
      if (chrome.runtime.lastError) {
        console.error(`${logPrefix} Chrome runtime error:`, chrome.runtime.lastError);
      }

      throw error;
    }
  }

  /**
   * Exchange parent site token for network token
   * Required when authenticating through parent site
   * 
   * @private
   * @param {string} parentToken - Token from parent site auth
   * @returns {Promise<string>} Network authentication token
   * @throws {Error} If token exchange fails
   */
  #exchangeToken = async (parentToken) => {
    const logPrefix = '[AuthService.exchangeToken]';
    console.log(`${logPrefix} Starting token exchange`);
    console.debug(`${logPrefix} Parent token (truncated):`, parentToken?.substring(0, 10) + '...');

    try {
      console.debug(`${logPrefix} Making exchange request to: ${NETWORK_API}/auth/exchange`);
      const response = await fetch(`${NETWORK_API}/auth/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parentToken}`
        }
      });

      console.debug(`${logPrefix} Exchange response status:`, response.status);

      if (!response.ok) {
        console.error(`${logPrefix} Exchange failed:`, response.status, response.statusText);
        const errorBody = await response.text();
        console.error(`${logPrefix} Error response body:`, errorBody);
        throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
      }

      const { token } = await response.json();
      console.log(`${logPrefix} Token exchange completed successfully`);
      console.debug(`${logPrefix} New network token (truncated):`, token?.substring(0, 10) + '...');
      return token;

    } catch (error) {
      console.error(`${logPrefix} Exchange error:`, error);
      console.error(`${logPrefix} Error stack:`, error.stack);
      throw error;
    }
  }

  /**
   * Store authentication data in chrome.storage.local
   * Also updates the auth store for reactive updates
   * 
   * @private
   * @param {Object} authData - Authentication data to store
   * @throws {Error} If storage fails
   */
  #storeAuth = async (authData) => {
    const logPrefix = '[AuthService.storeAuth]';
    const timestamp = Date.now();
    
    console.log(`${logPrefix} Storing auth data...`);
    console.debug(`${logPrefix} Auth data to store:`, {
      ...authData,
      wpAuthToken: authData.wpAuthToken?.substring(0, 10) + '...',
      timestamp
    });

    try {
      // Store in chrome.storage.local
      await chrome.storage.local.set({
        auth: {
          ...authData,
          timestamp
        }
      });

      // Update Svelte store
      authStore.update(state => ({
        ...state,
        ...authData,
        isAuthenticated: true
      }));

      console.log(`${logPrefix} Auth data stored successfully`);
      console.debug(`${logPrefix} Updated auth store state:`, await this.#getAuthState());

    } catch (error) {
      console.error(`${logPrefix} Storage failed:`, error);
      console.error(`${logPrefix} Error stack:`, error.stack);
      throw error;
    }
  }

  /**
   * Helper to get current auth state
   * @private
   */
  #getAuthState = async () => {
    const stored = await chrome.storage.local.get(['auth']);
    return {
      ...stored.auth,
      wpAuthToken: stored.auth?.wpAuthToken?.substring(0, 10) + '...'
    };
  }

  /**
   * Launch Chrome identity API OAuth flow
   * Handles the actual browser OAuth popup/redirect flow
   * 
   * @private
   * @param {string} authUrl - Base authentication URL
   * @param {string} redirectUrl - OAuth redirect URL
   * @returns {Promise<string>} Authentication token
   * @throws {Error} If OAuth flow fails
   */
  #launchOAuthFlow = async (authUrl, redirectUrl) => {
    const logPrefix = '[AuthService.launchOAuthFlow]';
    const fullAuthUrl = `${authUrl}?redirect_uri=${encodeURIComponent(redirectUrl)}`;
    
    console.log(`${logPrefix} Starting OAuth flow`);
    console.debug(`${logPrefix} Full auth URL:`, fullAuthUrl);
    
    try {
      console.log(`${logPrefix} Launching web auth flow...`);
      const responseUrl = await chrome.identity.launchWebAuthFlow({
        url: fullAuthUrl,
        interactive: true
      });
      
      console.debug(`${logPrefix} Received response URL:`, responseUrl);
      const url = new URL(responseUrl);
      const token = url.searchParams.get('token');
      
      if (!token) {
        console.error(`${logPrefix} No token in response URL`);
        throw new Error('No token received in OAuth response');
      }
      
      console.log(`${logPrefix} OAuth flow completed successfully`);
      console.debug(`${logPrefix} Token received (truncated):`, token.substring(0, 10) + '...');
      return token;

    } catch (error) {
      console.error(`${logPrefix} OAuth flow failed:`, error);
      console.error(`${logPrefix} Error stack:`, error.stack);
      
      if (chrome.runtime.lastError) {
        console.error(`${logPrefix} Chrome runtime error:`, chrome.runtime.lastError);
      }
      
      throw error;
    }
  }

  // Add login method to match previous interface
  async login() {
    const logPrefix = '[AuthService.login]';
    try {
      // Add required permissions to manifest.json
      if (!chrome.identity) {
        throw new Error('Identity API not available');
      }

      const redirectURL = chrome.identity.getRedirectURL();
      const clientId = 'your_client_id'; // Get from WordPress site
      
      const authURL = new URL(`${NETWORK_API}/oauth/authorize`);
      authURL.searchParams.append('client_id', clientId);
      authURL.searchParams.append('redirect_uri', redirectURL);
      authURL.searchParams.append('response_type', 'token');
      
      console.log(`${logPrefix} Starting OAuth flow with URL:`, authURL.toString());
      
      const responseUrl = await chrome.identity.launchWebAuthFlow({
        url: authURL.toString(),
        interactive: true
      });

      // Handle OAuth response...
    } catch (error) {
      console.error(`${logPrefix} Login failed:`, error);
      throw error;
    }
  }
  
  // Add logout method to match previous interface
  async logout() {
    const logPrefix = '[AuthService.logout]';
    console.log(`${logPrefix} Processing logout`);

    try {
      console.debug(`${logPrefix} Clearing stored auth data`);
      await chrome.storage.local.remove(['auth']);
      
      console.debug(`${logPrefix} Resetting auth store`);
      authStore.set({
        isAuthenticated: false,
        user: null,
        membershipLevel: null,
        wpAuthToken: null,
        membershipFeatures: []
      });

      console.log(`${logPrefix} Logout completed successfully`);
    } catch (error) {
      console.error(`${logPrefix} Logout failed:`, error);
      console.error(`${logPrefix} Error stack:`, error.stack);
      throw error;
    }
  }
}

// Create and export singleton instance
export const auth = new AuthService(); 