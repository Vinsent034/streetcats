import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('la homepage si carica e mostra il titolo', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Gatti di Napoli')).toBeVisible();
});
