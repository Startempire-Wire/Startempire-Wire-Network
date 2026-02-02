import { test } from '@playwright/test';

test('Content script injection time', async ({ page }) => {
    const start = Date.now();
    await page.goto('https://startempirewire.com');
    const injectionTime = Date.now() - start;
    test.expect(injectionTime).toBeLessThan(1000);
}); 