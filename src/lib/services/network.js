/**
 * Network statistics service
 * Fetches from Ring Leader's public stats endpoint
 */
const RING_LEADER_API = 'https://startempirewire.network/wp-json/sewn/v1';

export async function getNetworkStats() {
  try {
    const resp = await fetch(`${RING_LEADER_API}/network/stats`);
    const data = await resp.json();
    
    // Transform to display format for sidepanel
    return [
      { label: 'Members', value: data.total_members || 0 },
      { label: 'Tiers', value: (data.membership_tiers || []).length },
      { label: 'Content', value: (data.total_posts || 0) + (data.total_events || 0) + (data.total_podcasts || 0) }
    ];
  } catch (err) {
    console.error('[Network] Failed to fetch stats:', err);
    return [];
  }
}

export async function getNetworkContent(type = 'posts', page = 1) {
  try {
    const resp = await fetch(`${RING_LEADER_API}/content/${type}?page=${page}&per_page=10`);
    const data = await resp.json();
    return data.data || [];
  } catch (err) {
    console.error(`[Network] Failed to fetch ${type}:`, err);
    return [];
  }
}
