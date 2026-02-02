import { auth } from './auth';

export const MEMBERSHIP_TIERS = {
    FREE: 'free',
    FREE_WIRE: 'freeWire',
    WIRE: 'wire',
    EXTRA_WIRE: 'extraWire'
};

export const TIER_PERMISSIONS = {
    [MEMBERSHIP_TIERS.FREE]: {
        refreshRate: 60,
        cacheExpiry: 3600,
        domains: ['startempirewire.com'],
        features: ['basic_content']
    },
    [MEMBERSHIP_TIERS.FREE_WIRE]: {
        refreshRate: 30,
        cacheExpiry: 21600,
        domains: ['startempirewire.com', 'startempirewire.network'],
        features: ['basic_content', 'network_exposure']
    },
    [MEMBERSHIP_TIERS.WIRE]: {
        refreshRate: 15,
        cacheExpiry: 43200,
        domains: ['*'],
        features: ['premium_content', 'wirebot_basic']
    },
    [MEMBERSHIP_TIERS.EXTRA_WIRE]: {
        refreshRate: 5,
        cacheExpiry: 86400,
        domains: ['*'],
        features: ['all_content', 'wirebot_premium']
    }
};

export async function getCurrentTier() {
    const membershipData = await auth.getMembershipStatus();
    return membershipData?.tier || MEMBERSHIP_TIERS.FREE;
}

export async function verifyTierAccess(tier) {
    const response = await fetch('https://startempirewire.com/wp-json/memberpress/v1/access', {
        headers: new Headers({ 'X-WP-Nonce': await auth.getNonce() })
    });
    return response.json().accessLevel >= TIER_MAP[tier];
}
