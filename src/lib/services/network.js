export async function getNetworkStats() {
    return fetch('https://startempirewire.com/api/network-stats');
}