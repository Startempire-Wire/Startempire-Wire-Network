export async function getActivityStream(userId) {
    return fetch(`https://api.buddyboss.com/activity?user=${userId}`)
        .then(handleOAuthFlow());
} 