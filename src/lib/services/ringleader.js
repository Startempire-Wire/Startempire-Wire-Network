export async function fetchNetworkContent(tier) {
    const response = await fetch(
        `https://startempirewire.network/api/content?tier=${tier}`,
        { headers: { Authorization: `Bearer ${await getAuthToken()}` } }
    );
    return response.json();
} 