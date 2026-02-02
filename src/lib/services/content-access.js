import { getCurrentTier, TIER_PERMISSIONS } from './membership';

export class ContentAccessService {
    constructor() {
        this.cache = new Map();
    }

    async canAccessContent(contentType, url) {
        const currentTier = await getCurrentTier();
        const permissions = TIER_PERMISSIONS[currentTier];

        // Check domain access
        if (!this.isAllowedDomain(url, permissions.domains)) {
            return false;
        }

        // Check feature access
        return this.hasFeatureAccess(contentType, permissions.features);
    }

    async enforceContentRules(document) {
        const currentTier = await getCurrentTier();
        const permissions = TIER_PERMISSIONS[currentTier];

        const restrictedElements = document.querySelectorAll('[data-access-level]');
        restrictedElements.forEach(element => {
            const requiredLevel = element.dataset.accessLevel;
            if (!this.hasFeatureAccess(requiredLevel, permissions.features)) {
                element.style.display = 'none';
            }
        });
    }

    private isAllowedDomain(url, allowedDomains) {
        if (allowedDomains.includes('*')) return true;
        return allowedDomains.some(domain => url.includes(domain));
    }

    private hasFeatureAccess(feature, allowedFeatures) {
        return allowedFeatures.includes(feature) || allowedFeatures.includes('all_content');
    }
} 