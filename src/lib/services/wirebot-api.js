/**
 * Wirebot API Service
 * 
 * Connects to Ring Leader (sewn/v1) for auth/content and
 * Wirebot gateway for AI chat. Fetches scoreboard data
 * from the member's provisioned scoreboard URL.
 * 
 * Per bigpicture.mdx:
 * - Ring Leader distributes content based on membership tier
 * - Chrome Extension reads + displays data from Ring Leader
 * - Wirebot is the AI concierge embedded in the extension
 */

const RING_LEADER_API = 'https://startempirewire.network/wp-json/sewn/v1';
const WIREBOT_API = 'https://helm.wirebot.chat';

/**
 * Get Ring Leader JWT from stored auth
 */
async function getToken() {
  try {
    const stored = await chrome.storage.local.get(['sewn_auth', 'sewn_jwt']);
    return stored.sewn_auth?.jwt || stored.sewn_jwt || null;
  } catch {
    // Not in extension context (dev mode)
    return null;
  }
}

/**
 * Set Ring Leader JWT
 */
async function setToken(jwt) {
  try {
    await chrome.storage.local.set({ sewn_jwt: jwt });
  } catch {
    // Not in extension context
  }
}

/**
 * Exchange WordPress auth token for Ring Leader JWT
 */
export async function exchangeToken(wpToken) {
  const resp = await fetch(`${RING_LEADER_API}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${wpToken}`
    }
  });
  const data = await resp.json();
  if (data.token) {
    await setToken(data.token);
    return data;
  }
  throw new Error(data.error || 'Token exchange failed');
}

/**
 * Validate current auth and get user data
 */
export async function validateAuth() {
  const token = await getToken();
  if (!token) return null;
  
  try {
    const resp = await fetch(`${RING_LEADER_API}/auth/validate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await resp.json();
    return data.valid ? data.user : null;
  } catch {
    return null;
  }
}

/**
 * Fetch tier-gated content from Ring Leader
 */
export async function getContent(type = 'posts', page = 1, perPage = 10) {
  const token = await getToken();
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  const resp = await fetch(
    `${RING_LEADER_API}/content/${type}?page=${page}&per_page=${perPage}`,
    { headers }
  );
  return resp.json();
}

/**
 * Get network stats (public, no auth needed)
 */
export async function getNetworkStats() {
  const resp = await fetch(`${RING_LEADER_API}/network/stats`);
  return resp.json();
}

/**
 * Get current user's scoreboard data
 * 
 * Flow: Ring Leader JWT → /member/scoreboard → scoreboard URL → live data
 * The scoreboard accepts Ring Leader JWT for auth (HMAC-verified).
 */
export async function getScoreboard() {
  const token = await getToken();
  if (!token) return null;

  // First get the scoreboard URL from Ring Leader
  const resp = await fetch(`${RING_LEADER_API}/member/scoreboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await resp.json();
  
  if (!data.provisioned || !data.scoreboard_url) {
    return { provisioned: false };
  }

  // Fetch actual scoreboard data — pass Ring Leader JWT for auth
  try {
    const sbResp = await fetch(`${data.scoreboard_url}/v1/scoreboard?mode=dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!sbResp.ok) {
      return { provisioned: true, url: data.scoreboard_url, id: data.scoreboard_id };
    }
    const sbData = await sbResp.json();
    return {
      provisioned: true,
      url: data.scoreboard_url,
      id: data.scoreboard_id,
      ...sbData
    };
  } catch {
    return { provisioned: true, url: data.scoreboard_url, id: data.scoreboard_id };
  }
}

/**
 * Get checklist tasks from Wirebot
 */
export async function getChecklist() {
  const token = await getToken();
  if (!token) return null;

  // Use Ring Leader to proxy to Wirebot, or call direct if available
  try {
    const resp = await fetch(`${RING_LEADER_API}/content?type=checklist`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return resp.json();
  } catch {
    return null;
  }
}

/**
 * Send message to Wirebot AI
 * 
 * Uses the scoreboard's /v1/chat proxy which handles:
 * - Session persistence (auto-creates/resumes sessions)
 * - Pairing protocol injection
 * - Live scoreboard context injection
 * - Forwarding to OpenClaw gateway
 * 
 * Falls back to direct gateway if scoreboard unavailable.
 */
export async function askWirebot(message, { scoreboardUrl = null, sessionId = null } = {}) {
  const token = await getToken();
  
  // Prefer scoreboard chat proxy (has context injection)
  const chatUrl = scoreboardUrl 
    ? `${scoreboardUrl}/v1/chat` 
    : 'https://wins.wirebot.chat/v1/chat';
  
  try {
    const body = {
      message,
      stream: false,
    };
    if (sessionId) body.session_id = sessionId;

    const resp = await fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
    
    if (!resp.ok) {
      // Fallback to direct gateway
      return askWirebotDirect(message, token);
    }
    
    const data = await resp.json();
    return { 
      content: data.choices?.[0]?.message?.content || data.content || 'No response',
      sessionId: data.session_id || sessionId
    };
  } catch (err) {
    // Fallback to direct gateway
    return askWirebotDirect(message, token);
  }
}

async function askWirebotDirect(message, token) {
  try {
    const resp = await fetch(`${WIREBOT_API}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        model: 'wirebot',
        messages: [{ role: 'user', content: message }]
      })
    });
    
    if (!resp.ok) return { error: `Wirebot unavailable (${resp.status})` };
    
    const data = await resp.json();
    return { content: data.choices?.[0]?.message?.content || 'No response' };
  } catch (err) {
    return { error: `Connection failed: ${err.message}` };
  }
}

/**
 * Get member's current tier info
 */
export async function getMemberInfo() {
  const token = await getToken();
  if (!token) return null;

  try {
    const resp = await fetch(`${RING_LEADER_API}/member/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await resp.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export default {
  exchangeToken,
  validateAuth,
  getContent,
  getNetworkStats,
  getScoreboard,
  getChecklist,
  askWirebot,
  getMemberInfo,
  getToken,
  setToken
};
