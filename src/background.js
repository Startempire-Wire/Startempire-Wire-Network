import { auth } from '$lib/services';

// Port management for sidepanel communication
let sidePanelPort = null;

// Logging prefix for better tracing
const LOG_PREFIX = '[Background Service]';

// Add caching strategy
const CACHE_DURATIONS = {
  free: 3600,
  freeWire: 21600,
  wire: 43200,
  extraWire: 86400
};

// Implement tiered caching strategy
const CACHE_CONFIG = {
  free: {
    strategy: 'StaleWhileRevalidate',
    options: { cacheName: 'free-cache', maxAgeSeconds: 3600 }
  },
  extraWire: {
    strategy: 'CacheFirst',
    options: { cacheName: 'premium-cache', maxAgeSeconds: 86400 }
  }
};

/**
 * Initialize extension storage and settings on installation
 * Sets up default preferences and clears any existing auth state
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log(`${LOG_PREFIX} Extension installation event:`, details.reason);

  if (details.reason === 'install') {
    console.log(`${LOG_PREFIX} Performing first-time installation setup`);
    try {
      await chrome.storage.local.set({
        preferences: {
          theme: 'light',
          notifications: true
        },
        membershipCache: null,
        authTokens: null
      });
      console.log(`${LOG_PREFIX} Initial storage setup completed`);
    } catch (error) {
      console.error(`${LOG_PREFIX} Installation setup failed:`, error);
      console.error(`${LOG_PREFIX} Error stack:`, error.stack);
    }
  }
});

/**
 * Handle sidepanel connection management
 * Maintains connection state for messaging
 */
chrome.runtime.onConnect.addListener(function (port) {
  console.log(`${LOG_PREFIX} New port connection:`, port.name);
  console.assert(port.name === "sidepanel", "Unexpected port name");

  if (port.name === "sidepanel") {
    console.log(`${LOG_PREFIX} Sidepanel connected`);
    sidePanelPort = port;

    port.onDisconnect.addListener(function () {
      console.log(`${LOG_PREFIX} Sidepanel disconnected`);
      sidePanelPort = null;
    });
  }
});

/**
 * Central message handling system
 * Routes messages to appropriate handlers based on type
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const msgPrefix = `${LOG_PREFIX} [Message Handler]`;
  console.log(`${msgPrefix} Received message:`, { type: request.type, sender });

  try {
    switch (request.type) {
      case 'buttonClicked':
        console.debug(`${msgPrefix} Button click event received`);
        if (sidePanelPort) {
          sidePanelPort.postMessage({ message: request.message });
          console.debug(`${msgPrefix} Message forwarded to sidepanel`);
        } else {
          console.warn(`${msgPrefix} No sidepanel connection available`);
        }
        break;

      case 'auth':
        console.debug(`${msgPrefix} Auth request received:`, request.action);
        handleAuthMessage(request, sender, sendResponse);
        break;

      case 'captureScreenshot':
        console.debug(`${msgPrefix} Screenshot capture request:`, request.url);
        handleScreenshotRequest(request, sender, sendResponse);
        return true; // Keep channel open for async response

      case 'CACHE_CONTENT':
        console.debug(`${msgPrefix} Cache content request received:`, request.url);
        handleCacheContentRequest(request, sender, sendResponse);
        return true; // Keep channel open for async response

      default:
        console.warn(`${msgPrefix} Unknown message type:`, request.type);
    }
  } catch (error) {
    console.error(`${msgPrefix} Message handling error:`, error);
    console.error(`${msgPrefix} Error stack:`, error.stack);
    sendResponse({ error: error.message });
  }

  return true; // Keep message channel open for async responses
});

/**
 * Handle messages from external sources (web pages)
 * Validates sender and routes messages appropriately
 */
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  const extPrefix = `${LOG_PREFIX} [External Message]`;
  console.log(`${extPrefix} Message from ${sender.url}:`, request);

  try {
    if (sidePanelPort) {
      console.debug(`${extPrefix} Forwarding to sidepanel`);
      sidePanelPort.postMessage({ message: request.message });
    } else {
      console.warn(`${extPrefix} No sidepanel connection available`);
    }

    sendResponse({ message: request.message });
  } catch (error) {
    console.error(`${extPrefix} Error handling external message:`, error);
    sendResponse({ error: error.message });
  }

  return true;
});

/**
 * Handle authentication related messages
 * Manages login, logout, and auth state checks
 */
async function handleAuthMessage(request, sender, sendResponse) {
  const authPrefix = `${LOG_PREFIX} [Auth Handler]`;
  console.log(`${authPrefix} Processing auth action:`, request.action);

  try {
    switch (request.action) {
      case 'login':
        console.debug(`${authPrefix} Processing login request`);
        const authResult = await auth.login();
        console.debug(`${authPrefix} Login successful:`, authResult);
        sendResponse({ success: true, data: authResult });
        break;

      case 'logout':
        console.debug(`${authPrefix} Processing logout request`);
        await auth.logout();
        console.debug(`${authPrefix} Logout completed`);
        sendResponse({ success: true });
        break;

      case 'checkAuth':
        console.debug(`${authPrefix} Checking auth state`);
        const stored = await chrome.storage.local.get(['auth']);
        console.debug(`${authPrefix} Current auth state:`, {
          isAuthenticated: stored.auth?.isAuthenticated || false,
          membershipLevel: stored.auth?.membershipLevel || null
        });
        sendResponse({
          isAuthenticated: stored.auth?.isAuthenticated || false,
          membershipLevel: stored.auth?.membershipLevel || null
        });
        break;
    }
  } catch (error) {
    console.error(`${authPrefix} Auth handler error:`, error);
    console.error(`${authPrefix} Error stack:`, error.stack);
    sendResponse({ error: error.message });
  }
}

/**
 * Handle screenshot capture requests
 * Manages caching and interaction with screenshot service
 */
async function handleScreenshotRequest(request, sender, sendResponse) {
  const ssPrefix = `${LOG_PREFIX} [Screenshot Handler]`;
  console.log(`${ssPrefix} Processing screenshot request for:`, request.url);

  try {
    // Check cache first
    const cache = await chrome.storage.local.get('screenshots');
    const cacheEntry = cache?.screenshots?.[request.url];

    if (cacheEntry && (Date.now() - cacheEntry.timestamp) < 3600000) {
      console.debug(`${ssPrefix} Cache hit for URL:`, request.url);
      sendResponse({ success: true, data: cacheEntry.data });
      return;
    }

    console.debug(`${ssPrefix} Cache miss, fetching fresh screenshot`);
    const screenshotUrl = await getWebsiteScreenshot(request.url);

    if (screenshotUrl) {
      // Cache the result
      const screenshots = cache?.screenshots || {};
      screenshots[request.url] = {
        data: screenshotUrl,
        timestamp: Date.now()
      };

      console.debug(`${ssPrefix} Caching new screenshot`);
      await chrome.storage.local.set({ screenshots });

      sendResponse({ success: true, data: screenshotUrl });
    } else {
      throw new Error('Failed to capture screenshot');
    }

  } catch (error) {
    console.error(`${ssPrefix} Screenshot capture failed:`, error);
    console.error(`${ssPrefix} Error stack:`, error.stack);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Handle cache content requests
 * Manages caching of content based on membership tier
 */
async function handleCacheContentRequest(request, sender, sendResponse) {
  const cachePrefix = `${LOG_PREFIX} [Cache Handler]`;
  console.log(`${cachePrefix} Processing cache content request for:`, request.url);

  try {
    caches.open('content-v1').then(cache => {
      cache.put(request.url, request.response, {
        maxAge: CACHE_DURATIONS[request.tier]
      });
    });

    sendResponse({ success: true });
  } catch (error) {
    console.error(`${cachePrefix} Cache handling error:`, error);
    console.error(`${cachePrefix} Error stack:`, error.stack);
    sendResponse({ error: error.message });
  }
}

// Log extension installation completion
chrome.runtime.onInstalled.addListener(() => {
  console.log(`${LOG_PREFIX} Extension installed successfully - Screenshot service ready`);
});

const createRealtimeConnection = () => {
  try {
    const ws = new WebSocket('wss://network.hub');
    return ws;
  } catch {
    return new EventSource('https://network.hub/events');
  }
};

