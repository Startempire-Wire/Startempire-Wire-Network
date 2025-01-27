// Add feature detection
export function supportsSidePanel() {
    return typeof browser.sidePanel !== 'undefined';
}

// Conditional initialization
if (supportsSidePanel()) {
    initializeNetworkPanel();
} else {
    showCompatibilityWarning();
} 