export async function fetchMemberData(userId) {
    try {
        const res = await fetch(
            `https://startempirewire.com/wp-json/wp/v2/users/${userId}?context=edit`,
            {
                headers: {
                    'X-WP-Nonce': await getWordPressNonce()
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