import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('la mappa viene renderizzata nella homepage', async ({ page }) => {
  await page.goto('/');
  const mappa = page.locator('#mappa-home');
  await expect(mappa).toBeVisible();
  await expect(mappa.locator('.leaflet-container')).toBeVisible();
});
