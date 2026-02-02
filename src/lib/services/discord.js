import { authStore } from '../../services/auth';

const LOG_PREFIX = '[Discord Service]';
const DISCORD_API_BASE = 'https://discord.com/api/v10'; // Use latest API version

/**
 * @typedef {Object} DiscordUser
 * @property {string} id
 * @property {string} username
 * @property {string} avatar
 * @property {string} discriminator
 */


/**
 * Fetch current user's Discord information
 * Requires a valid Discord OAuth2 access token
 * @param {string} accessToken - Discord OAuth2 access token
 * @returns {Promise<DiscordUser>}
 */
export async function getDiscordUserInfo(accessToken) {
    const apiPrefix = `${LOG_PREFIX} [getUserInfo]`;
    console.log(`${apiPrefix} Fetching Discord user info`);

    try {
        const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const message = `Failed to fetch Discord user info: ${response.status} ${response.statusText}`;
            console.warn(`${apiPrefix} ${message}`);
            throw new Error(message);
        }

        const userData = await response.json();
        console.debug(`${apiPrefix} Discord user info fetched successfully`, userData);
        return userData;

    } catch (error) {
        console.error(`${apiPrefix} Error fetching Discord user info:`, error);
        throw error;
    }
}


/**
 * Get user's guilds (servers)
 * @param {string} accessToken - Discord OAuth2 access token
 * @returns {Promise<Array<DiscordGuild>>}
 */
export async function getDiscordUserGuilds(accessToken) {
    const apiPrefix = `${LOG_PREFIX} [getUserGuilds]`;
    console.log(`${apiPrefix} Fetching Discord user guilds`);

    try {
        const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const message = `Failed to fetch Discord user guilds: ${response.status} ${response.statusText}`;
            console.warn(`${apiPrefix} ${message}`);
            throw new Error(message);
        }

        const guildsData = await response.json();
        console.debug(`${apiPrefix} Discord user guilds fetched successfully`, guildsData);
        return guildsData;

    } catch (error) {
        console.error(`${apiPrefix} Error fetching Discord user guilds:`, error);
        throw error;
    }
}


/**
 * Example: Join a Discord guild (requires bot token and guild ID - usually done server-side for security)
 * **This is a simplified client-side example for demonstration -  guild joining is typically handled server-side for security and bot management.**
 * @param {string} botToken - Discord Bot token ( **Keep this secure - NEVER expose in client-side production code!**)
 * @param {string} guildId - Discord Guild ID to join
 * @param {string} userId - User ID to add to guild
 * @returns {Promise<boolean>} True if join was successful (may not always be accurate client-side)
 */
export async function joinDiscordGuildExample(botToken, guildId, userId) {
    const apiPrefix = `${LOG_PREFIX} [joinGuildExample]`;
    console.warn(`${apiPrefix} Client-side guild joining example - NOT RECOMMENDED FOR PRODUCTION`);
    console.log(`${apiPrefix} Attempting to add user ${userId} to guild ${guildId}`);

    try {
        const response = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/members/${userId}`, {
            method: 'PUT', // Use PUT to add or update member
            headers: {
                'Authorization': `Bot ${botToken}`, // **Bot token - VERY SENSITIVE!**
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ access_token: 'USER_OAUTH2_TOKEN' }) //  User's OAuth2 token -  replace placeholder
            // In real scenario, you might need to exchange user's OAuth2 token server-side for bot-initiated join
        });

        if (!response.ok) {
            const message = `Failed to add user to Discord guild: ${response.status} ${response.statusText}`;
            console.warn(`${apiPrefix} ${message}`);
            throw new Error(message);
        }

        console.debug(`${apiPrefix} User added to guild (example - may not be fully reliable client-side)`);
        return true; //  Indication of success - client-side check may not be definitive

    } catch (error) {
        console.error(`${apiPrefix} Error adding user to Discord guild:`, error);
        throw error;
    }
}


// ... Add more Discord service functions as needed (e.g., for chat, streaming, etc.) ...

export class VoiceHandler {
    constructor() {
        this.connection = null;
    }

    async joinChannel(channelId) {
        // Voice channels not available in extension context
        // TODO: Implement via Discord Bot API or webhook proxy
        console.log(`[Discord] Voice join requested for channel ${channelId} — not available in extension`);
    }
}

const DISCORD_API = 'https://discord.com/api/v9';

export async function getGuildRoles(guildId) {
    const { wpAuthToken } = await new Promise(resolve => {
        authStore.subscribe($auth => resolve($auth));
    });

    try {
        const response = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
            headers: {
                Authorization: `Bearer ${wpAuthToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch roles');
        return await response.json();
    } catch (error) {
        console.error('Discord API Error:', error);
        return [];
    }
}

// Sync roles with membership level
export async function updateDiscordRoles(userId, membershipLevel) {
    const roles = await getGuildRoles('YOUR_GUILD_ID');
    const targetRole = roles.find(r => r.name === membershipLevel);

    if (targetRole) {
        await fetch(`${DISCORD_API}/guilds/YOUR_GUILD_ID/members/${userId}/roles/${targetRole.id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    }
}

export async function verifyGuildMember(userId) {
    const response = await fetch(
        `https://discord.com/api/guilds/${GUILD_ID}/members/${userId}`,
        { headers: { Authorization: `Bot ${DISCORD_TOKEN}` } }
    );
    return response.status === 200;
}

export const getGuildInfo = async (guildId) => {
    return fetch(`https://discord.com/api/guilds/${guildId}`, {
        headers: { Authorization: `Bearer ${await getDiscordToken()}` }
    });
}; 