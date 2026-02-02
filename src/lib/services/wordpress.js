const API_TIMEOUT = 5000;

export async function getMemberData() {
    try {
        const response = await fetch('https://startempirewire.com/wp-json/mp/v1/members', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${await getAuthToken()}`,
            },
            signal: AbortSignal.timeout(API_TIMEOUT)
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Member data fetch failed:', error);
        throw error;
    }
}

export async function fetchArticles() {
    try {
        const response = await fetch('https://startempirewire.com/wp-json/wp/v2/posts'); // Example endpoint for posts
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const articles = await response.json();
        return articles;
    } catch (error) {
        console.error("Failed to fetch articles:", error);
        return null; // Or throw a more specific error
    }
}

export async function fetchMemberData(userId) {
    try {
        const res = await fetch(
            `https://startempirewire.com/wp-json/wp/v2/users/${userId}?context=edit`,
            {
                headers: {
                    'X-WP-Nonce': await getWordPressNonce() // Review nonce usage for Chrome Extension context
                }
            }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error('WP Member fetch failed:', error);
        throw new MemberDataError('Failed to retrieve member data');
    }
}

export async function fetchMessageBoards() {
    return fetch('https://startempirewire.com/api/message-boards');
}

export async function getMemberRoles(userId) {
    const response = await fetch(
        `https://startempirewire.com/wp-json/wp/v2/users/${userId}`,
        { credentials: 'include' }
    );
    return response.json();
}

export async function syncRoles(userId) {
    const [wpUser, bbProfile] = await Promise.all([
        fetchWP(`/wp/v2/users/${userId}`),
        fetchBB(`/buddyboss/v1/members/${userId}`)
    ]);

    await chrome.storage.local.set({
        roles: {
            wp: wpUser.roles,
            buddyboss: bbProfile.roles
        }
    });
}

export async function syncBuddyBossActivity(userId) {
    const activities = await fetch(
        `https://startempirewire.com/wp-json/buddyboss/v1/activity/${userId}`
    );
    await chrome.storage.session.set({ bbActivities: activities });
}

export async function verifyMembership(userId) {
    const response = await fetch(
        'https://startempirewire.com/wp-json/mp/v1/subscriptions',
        {
            headers: new Headers({
                'X-WP-Nonce': await getAuthNonce()
            })
        }
    );
    return response.json(); // Handle tier data
}

export async function getMemberTier() {
    const response = await fetch('https://startempirewire.com/wp-json/mp/v1/membership', {
        headers: new Headers({
            'Authorization': `Bearer ${await chrome.identity.getAuthToken()}`
        })
    });
    return response.json().tier;
}