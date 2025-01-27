const { test, expect } = require('@playwright/test');

test('Premium member content access', async ({ page }) => {
    await page.goto(chromeExtensionURL);
    await auth.authenticateAs('wire');
    await expect(page.locator('.premium-content')).toBeVisible();
}); 