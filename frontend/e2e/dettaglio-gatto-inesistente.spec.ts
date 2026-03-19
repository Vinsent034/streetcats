import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('dettaglio gatto inesistente mostra errore', async ({ page }) => {
  await page.goto('/dettaglio/99999');
  const errore = page.locator('.errore-box');
  await expect(errore).toBeVisible();
  await expect(errore).toContainText(/non trovato/i);
});
