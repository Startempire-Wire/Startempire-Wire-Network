import { auth } from '$lib/services';

// API endpoint configuration
const SCREENSHOT_API_BASE = 'https://startempirewire.network/wp-json/sewn/v1';
const LOG_PREFIX = '[Screenshot Service]';
const CACHE_TTL = 3600000; // 1 hour in milliseconds

const PREVIEW_API = 'https://startempirewire.network/wp-json/sewn/v1/preview';
const SCREENSHOT_API = 'https://startempirewire.network/wp-json/sewn/v1/screenshot';

/**
 * @typedef {Object} ScreenshotRequest
 * @property {string} url - URL to capture
 * @property {number} width - Viewport width
 * @property {number} height - Viewport height
 * @property {number} quality - Image quality (1-100)
 */

/**
 * @typedef {Object} ScreenshotResponse
 * @property {string} screenshot_url - URL of captured screenshot
 */

/**
 * Get a screenshot of a website
 * @param {string} url - URL to capture
 * @returns {Promise<string>} Screenshot URL
 * @throws {Error} If screenshot capture fails
 */
export async function getWebsiteScreenshot(url, previewOnly = false) {
  const logPrefix = `${LOG_PREFIX}[getWebsiteScreenshot]`;

  try {
    // Check cache first
    const isCached = await isScreenshotCached(url);
    if (isCached) {
      return await getCachedScreenshot(url);
    }

    // For unauthenticated preview requests
    if (previewOnly) {
      return await getPreviewScreenshot(url);
    }

    // Authenticated full screenshot flow
    const authToken = await auth.getToken();
    if (!authToken) {
      return await getPreviewScreenshot(url);
    }

    // Rest of existing authenticated screenshot logic...
  } catch (error) {
    console.error(`${logPrefix} Error:`, error);
    return null;
  }
}

async function getPreviewScreenshot(url) {
  const logPrefix = `${LOG_PREFIX}[getPreviewScreenshot]`;
  try {
    const response = await fetch(`${PREVIEW_API}/screenshot?url=${encodeURIComponent(url)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.preview_url;
  } catch (error) {
    console.error(`${logPrefix} Preview error:`, error);
    return null;
  }
}

/**
 * Cache a screenshot URL
 * @private
 * @param {string} url - Original URL
 * @param {string} screenshotUrl - Screenshot URL to cache
 */
async function cacheScreenshot(url, screenshotUrl) {
  const logPrefix = `${LOG_PREFIX}[cacheScreenshot]`;
  console.debug(`${logPrefix} Caching screenshot for:`, url);

  try {
    const cache = await chrome.storage.local.get('screenshots') || {};
    const screenshots = cache.screenshots || {};

    screenshots[url] = {
      data: screenshotUrl,
      timestamp: Date.now()
    };

    await chrome.storage.local.set({ screenshots });
    console.debug(`${logPrefix} Screenshot cached successfully`);
  } catch (error) {
    console.error(`${logPrefix} Failed to cache screenshot:`, error);
  }
}

/**
 * Clear screenshot cache from storage
 * @returns {Promise<void>}
 */
export async function clearScreenshotCache() {
  const logPrefix = `${LOG_PREFIX}[clearScreenshotCache]`;

  try {
    console.log(`${logPrefix} Clearing screenshot cache`);
    await chrome.storage.local.remove('screenshots');
    console.log(`${logPrefix} Cache cleared successfully`);
  } catch (error) {
    console.error(`${logPrefix} Failed to clear cache:`, error);
    throw error;
  }
}

/**
 * Check if a screenshot is cached and valid
 * @param {string} url - URL to check
 * @returns {Promise<boolean>} True if cached screenshot exists and is valid
 */
export async function isScreenshotCached(url) {
  const logPrefix = `${LOG_PREFIX}[isScreenshotCached]`;
  console.debug(`${logPrefix} Checking cache for URL:`, url);

  try {
    const cache = await chrome.storage.local.get('screenshots');
    const cacheEntry = cache?.screenshots?.[url];

    if (!cacheEntry) {
      console.debug(`${logPrefix} No cache entry found`);
      return false;
    }

    const age = Date.now() - cacheEntry.timestamp;
    const isValid = age < CACHE_TTL;

    console.debug(`${logPrefix} Cache entry ${isValid ? 'valid' : 'expired'} (age: ${age}ms)`);
    return isValid;
  } catch (error) {
    console.error(`${logPrefix} Cache check failed:`, error);
    return false;
  }
}

export async function fetchScreenshot(url, tier) {
  const quality = {
    free: '1280x720',
    extraWire: '2560x1440'
  }[tier];

  const response = await fetch(
    `https://startempirewire.network/wp-json/screenshots/v1/capture?url=${url}&quality=${quality}`
  );

  if (!response.ok) throw new Error('Screenshot capture failed');
  return response.blob();
} 