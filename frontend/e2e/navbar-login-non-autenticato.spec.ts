import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('la navbar mostra Login se non autenticato', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Login')).toBeVisible();
});
