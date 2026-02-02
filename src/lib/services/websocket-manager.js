import { getCurrentTier } from './membership';

export class WebSocketManager {
    constructor() {
        this.connections = new Map();
        this.reconnectAttempts = new Map();
    }

    async connect(tabId) {
        const tier = await getCurrentTier();
        const ws = new WebSocket('wss://startempirewire.network/socket');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: 'auth',
                tier,
                tabId
            }));
        };

        ws.onmessage = this.handleMessage.bind(this, tabId);
        ws.onclose = () => this.handleDisconnect(tabId);

        this.connections.set(tabId, ws);
    }

    private handleMessage(tabId, event) {
        const data = JSON.parse(event.data);

        chrome.tabs.sendMessage(tabId, {
            type: 'WS_UPDATE',
            data
        });
    }

    private async handleDisconnect(tabId) {
        const attempts = this.reconnectAttempts.get(tabId) || 0;
        if (attempts < 3) {
            this.reconnectAttempts.set(tabId, attempts + 1);
            await this.connect(tabId);
        }
    }
} 