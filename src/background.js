import { auth } from '$lib/services';
import * as wordpressService from '$lib/services/wordpress.js';
// Discord integration planned — uses Chrome messaging API, not discord.js Node lib
// import Discord from 'discord.js';

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
  extraWire: { duration: 24 * 60 * 60 * 1000 }, // 24 hours
  wire: { duration: 12 * 60 * 60 * 1000 },      // 12 hours
  freeWire: { duration: 6 * 60 * 60 * 1000 },   // 6 hours
  free: { duration: 1 * 60 * 60 * 1000 }        // 1 hour
};

const CACHE_TIERS = {
  Free: { duration: 30 * 60 * 1000 },
  FreeWire: { duration: 60 * 60 * 1000 },
  Wire: { duration: 300 * 60 * 1000 },
  ExtraWire: { duration: 1000 * 60 * 1000 }
};

const CONTENT_CLASSIFIER = {
  message_boards: /message-boards/,
  articles: /articles/,
  podcasts: /podcasts/
};

function classifyContent(url) {
  return Object.entries(CONTENT_CLASSIFIER).find(([_, regex]) =>
    regex.test(url)
  )?.[0] || 'unknown';
}

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

  chrome.storage.local.set({ installed: Date.now() });

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

      case 'fetchArticles':
        console.debug(`${msgPrefix} Fetch articles request received`);
        handleFetchArticlesRequest(request, sender, sendResponse);
        return true; // Keep channel open for async response

      case 'UPDATE_CONTENT':
        console.debug(`${msgPrefix} Content update request received`);
        handleContentUpdateRequest(request, sender, sendResponse);
        return true; // Keep channel open for async response

      case 'WS_CONNECT':
        console.debug(`${msgPrefix} WebSocket connection request received`);
        handleWebSocketConnection(request, sender, sendResponse);
        return true; // Keep channel open for async response

      case 'discordMessage':
        console.debug(`${msgPrefix} Discord message received:`, request.message);
        handleDiscordMessage(request, sender, sendResponse);
        return true; // Keep channel open for async response

      case 'wirebotQuery':
        console.debug(`${msgPrefix} Wirebot query received:`, request.query);
        handleWirebotQuery(request, sender, sendResponse);
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

/**
 * Handle fetch articles requests
 * Manages fetching articles from WordPress REST API
 */
async function handleFetchArticlesRequest(request, sender, sendResponse) {
  const articles = await wordpressService.fetchArticles();
  sendResponse({ articles: articles }); // Send data back to sender (e.g., popup)
  return true; // Indicate asynchronous response
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

const realtimeConnections = {}; // Store WebSocket connections per tab/user

function setupRealtimeConnection(tabId, membershipLevel) {
  const wsPrefix = `${LOG_PREFIX} [WebSocket]`;
  console.log(`${wsPrefix} Setting up WebSocket for tab ${tabId}, level: ${membershipLevel}`);

  if (realtimeConnections[tabId]) {
    console.log(`${wsPrefix} Connection already exists for tab ${tabId}, closing old one`);
    realtimeConnections[tabId].close();
  }

  const ws = new WebSocket('wss://startempirewire.network/socket');
  realtimeConnections[tabId] = ws;

  ws.onopen = () => {
    console.log(`${wsPrefix} WebSocket connection opened for tab ${tabId}`);
    ws.send(JSON.stringify({ type: 'auth', membership: membershipLevel })); // Send auth info
  };

  ws.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    console.debug(`${wsPrefix} Received message from server:`, messageData);

    // Example: Dispatch DOM update to content script
    if (messageData.type === 'domUpdate') {
      chrome.tabs.sendMessage(tabId, {
        action: 'updateDOM',
        data: messageData.payload // Assuming payload contains DOMUpdateData
      });
    } else if (messageData.type === 'notification') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon_48.png',
        title: 'Network Update',
        message: messageData.message
      });
    }
    // ... handle other message types ...
  };

  ws.onerror = (error) => {
    console.error(`${wsPrefix} WebSocket error for tab ${tabId}:`, error);
    delete realtimeConnections[tabId]; // Remove on error
  };

  ws.onclose = () => {
    console.log(`${wsPrefix} WebSocket connection closed for tab ${tabId}`);
    delete realtimeConnections[tabId]; // Remove on close
  };
}

// Listen for changes in authentication state (example - adjust to your auth logic)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "authStatusChanged") {
    const tabId = sender.tab?.id;
    const membershipLevel = request.membershipLevel; // Get membership level from auth status

    if (tabId && membershipLevel) {
      setupRealtimeConnection(tabId, membershipLevel);
    } else {
      console.warn(`${LOG_PREFIX} [Auth Status] Tab ID or membership level missing, cannot setup WebSocket`);
    }
  }
  sendResponse({ result: "Auth status processed by background script" });
  return true; // Required for async sendResponse in some cases
});

// Example: On tab activation, re-establish connection if needed (optional - adjust logic)
chrome.tabs.onActivated.addListener(activeInfo => {
  // ... (logic to check auth state and re-setup connection if necessary) ...
  // This is a simplified example - you might need more robust connection management
});

// Cache cleanup
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'cleanCache') {
    const data = await chrome.storage.local.get('networkContent');
    if (data.networkContent?.expiresAt < Date.now()) {
      await chrome.storage.local.remove('networkContent');
    }
  }
});

async function handleContentUpdateRequest(request, sender, sendResponse) {
  try {
    const memberTier = await getMemberTier();
    const cacheData = {
      content: request.data,
      timestamp: Date.now(),
      expiresAt: Date.now() + getTierDuration(memberTier)
    };

    await chrome.storage.local.set({
      networkContent: cacheData
    });

    // Schedule cache cleanup
    chrome.alarms.create('cleanCache', {
      delayInMinutes: CACHE_CONFIG[memberTier].duration / (60 * 1000)
    });

    sendResponse({ success: true });
  } catch (error) {
    console.error('Content update failed:', error);
    sendResponse({ success: false, error: error.message });
  }
}

let ws;
const maintainSocket = () => {
  if (ws) return;
  ws = new WebSocket('wss://network-api/ws');
  ws.onmessage = (event) => {
    chrome.runtime.sendMessage({ type: 'WS_UPDATE', data: event.data });
  };
  chrome.alarms.create('ws_keepalive', { periodInMinutes: 1 });
};

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'reconnect-ws') maintainSocket();
});

// Add to background.js
chrome.webRequest.onBeforeRequest.addListener(details => {
  if (rateLimitExceeded(details.url)) return { cancel: true };
}, { urls: ["<all_urls>"] }, ["blocking"]);

function getContentRules(tier) {
  return TIER_RULES[tier] || DEFAULT_RULES;
}

chrome.webRequest.onCompleted.addListener(
  handleMemberPress
);

const CONTENT_RULES = {
  free: { refresh: 60, domains: ['startempirewire.com'] },
  extraWire: { refresh: 10, domains: ['*'] }
};

chrome.webNavigation.onCompleted.addListener(async ({ tabId, url }) => {
  const tier = await getMemberTier();
  chrome.scripting.executeScript({
    target: { tabId },
    files: [`content-${tier}.js`]
  });
});

// Replace content script WebSocket with background service
const wsConnections = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'WS_PROXY') {
    const tabId = sender.tab.id;
    if (!wsConnections.has(tabId)) {
      const ws = new WebSocket(request.url);
      ws.onmessage = (event) => {
        chrome.tabs.sendMessage(tabId, { type: 'WS_UPDATE', data: event.data });
      };
      wsConnections.set(tabId, ws);
    }
    return true;
  }
});

// Discord messaging via REST API (no discord.js in browser extension)
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'discordMessage') {
    // TODO: Implement via Discord webhook or Ring Leader proxy
    console.log('[Background] Discord message queued:', request.message);
  }
});

const setupWebSocket = (tier) => {
  const ws = new WebSocket(`wss://network.startempirewire.com/ws?tier=${tier}`);
  ws.onmessage = (event) => {
    chrome.storage.session.set({ lastUpdate: Date.now() });
    chrome.runtime.sendMessage({ type: 'NETWORK_UPDATE', data: event.data });
  };
  return ws;
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'wirebotQuery') {
    // Use Wirebot gateway chat completions API
    fetch('https://helm.wirebot.chat/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'wirebot',
        messages: [{ role: 'user', content: request.query }]
      })
    })
      .then(response => response.json())
      .then(data => {
        const content = data.choices?.[0]?.message?.content || 'No response';
        chrome.tabs.sendMessage(request.tabId, { content });
      })
      .catch(err => {
        chrome.tabs.sendMessage(request.tabId, { error: err.message });
      });
  }
});

