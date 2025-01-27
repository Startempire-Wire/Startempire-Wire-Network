export class VoiceHandler {
    constructor() {
        this.connection = null;
    }

    async joinChannel(channelId) {
        const { voice } = await import('@discordjs/voice');
        this.connection = voice.joinVoiceChannel({
            channelId,
            guildId: chrome.storage.local.get('guildId'),
            adapterCreator: chrome.runtime.getURL('discord-adapter')
        });
    }
} 