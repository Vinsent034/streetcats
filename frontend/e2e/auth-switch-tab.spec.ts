import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('switch tra tab Login e Registrazione funziona', async ({ page }) => {
  await page.goto('/auth');
  await page.getByText('Registrati').click();
  const campoNome = page.locator('input[placeholder*="nome"], input[name="nome"]').first();
  await expect(campoNome).toBeVisible();
  await page.getByText('Login').click();
  await expect(campoNome).not.toBeVisible();
});
