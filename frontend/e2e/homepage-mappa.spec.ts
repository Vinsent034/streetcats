import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('la homepage mostra il div della mappa', async ({ page }) => {
  const mappa = page.locator('#mappa-home');
  await expect(mappa).toBeVisible();
});
