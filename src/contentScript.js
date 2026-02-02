const LOG_PREFIX = '[Content Script]';

/**
 * @typedef {Object} DOMUpdateData
 * @property {string} selector - CSS selector for target element
 * @property {string} content - HTML content to inject
 */

/**
 * @typedef {Object} StyleUpdateData
 * @property {string} selector - CSS selector for target element
 * @property {Object.<string, string>} styles - Style properties to apply
 */

/**
 * Handle DOM update requests
 * @param {DOMUpdateData} data - Update configuration
 */
function handleDOMUpdate(data) {
  const updatePrefix = `${LOG_PREFIX} [DOM Update]`;
  console.debug(`${updatePrefix} Updating element:`, data.selector);

  try {
    const element = document.querySelector(data.selector);
    if (element) {
      element.innerHTML = data.content;
      console.debug(`${updatePrefix} Update successful`);
    } else {
      console.warn(`${updatePrefix} Element not found:`, data.selector);
    }
  } catch (error) {
    console.error(`${updatePrefix} Update failed:`, error);
  }
}

/**
 * Handle style update requests
 * @param {StyleUpdateData} data - Style update configuration
 */
function handleStyleUpdate(data) {
  const stylePrefix = `${LOG_PREFIX} [Style Update]`;
  console.debug(`${stylePrefix} Updating styles for:`, data.selector);

  try {
    const element = document.querySelector(data.selector);
    if (element) {
      Object.assign(element.style, data.styles);
      console.debug(`${stylePrefix} Style update successful`);
    } else {
      console.warn(`${stylePrefix} Element not found:`, data.selector);
    }
  } catch (error) {
    console.error(`${stylePrefix} Style update failed:`, error);
  }
}

/**
 * Handle DOM mutation events
 * @param {MutationRecord} mutation - DOM mutation record
 */
function handleDOMChange(mutation) {
  const mutationPrefix = `${LOG_PREFIX} [DOM Change]`;
  console.debug(`${mutationPrefix} Processing mutation:`, {
    type: mutation.type,
    target: mutation.target
  });

  // Add your DOM change handling logic here
}

/**
 * Initialize content script functionality
 * Sets up message listeners and DOM observers
 */
function initialize() {
  console.log(`${LOG_PREFIX} Initializing content script`);

  try {
    setupMessageListener();
    setupDOMObserver();
    injectStyles();
    console.log(`${LOG_PREFIX} Initialization complete`);
  } catch (error) {
    console.error(`${LOG_PREFIX} Initialization failed:`, error);
    console.error(`${LOG_PREFIX} Error stack:`, error.stack);
  }
}

/**
 * Set up communication with background script
 */
function setupMessageListener() {
  console.debug(`${LOG_PREFIX} Setting up message listener`);

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const msgPrefix = `${LOG_PREFIX} [Message Handler]`;
    console.debug(`${msgPrefix} Received message:`, request);

    try {
      switch (request.type) {
        case 'DOM_UPDATE':
          handleDOMUpdate(request.data);
          break;
        case 'STYLE_UPDATE':
          handleStyleUpdate(request.data);
          break;
        default:
          console.warn(`${msgPrefix} Unknown message type:`, request.type);
      }
      sendResponse({ success: true });
    } catch (error) {
      console.error(`${msgPrefix} Message handling failed:`, error);
      sendResponse({ success: false, error: error.message });
    }
  });
}

/**
 * Set up MutationObserver to watch for DOM changes
 */
function setupDOMObserver() {
  console.debug(`${LOG_PREFIX} Setting up DOM observer`);

  const observer = new MutationObserver((mutations) => {
    const observerPrefix = `${LOG_PREFIX} [DOM Observer]`;
    console.debug(`${observerPrefix} DOM mutations detected:`, mutations.length);

    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        handleDOMChange(mutation);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Inject required styles into the page
 */
function injectStyles() {
  console.debug(`${LOG_PREFIX} Injecting styles`);

  try {
    const style = document.createElement('style');
    style.textContent = `
      .sewn-overlay {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
      }
      .sewn-badge {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
    console.debug(`${LOG_PREFIX} Styles injected successfully`);
  } catch (error) {
    console.error(`${LOG_PREFIX} Style injection failed:`, error);
  }
}

/**
 * Apply content restrictions based on membership level
 * @param {string} membershipLevel - Current user's membership level
 */
function applyContentRestrictions(membershipLevel) {
  const restrictionPrefix = `${LOG_PREFIX} [Content Restriction]`;
  console.debug(`${restrictionPrefix} Applying content restrictions for level:`, membershipLevel);

  const contentSelectors = {
    'free': ['.premium-content'], // Selectors for content hidden for 'free' tier
    'freeWire': ['.extra-wire-content'], // Selectors hidden for 'freeWire'
    'wire': ['.extra-wire-content'], // Selectors hidden for 'wire' (same as freeWire in this example)
    'extraWire': [] // No restrictions for 'extraWire'
  };

  const selectorsToHide = contentSelectors[membershipLevel] || contentSelectors['free']; // Default to 'free' restrictions

  selectorsToHide.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.style.display = 'none'; // Hide restricted content
      console.debug(`${restrictionPrefix} Hidden element:`, selector, element);
    });
  });

  console.debug(`${restrictionPrefix} Content restrictions applied`);
}

// Initialize content script
initialize();
