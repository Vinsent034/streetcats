import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('la pagina aggiungi redirige a auth se non loggato', async ({ page }) => {
  await page.goto('/aggiungi');
  await page.waitForURL(/\/auth/);
  await expect(page).toHaveURL(/\/auth/);
});
