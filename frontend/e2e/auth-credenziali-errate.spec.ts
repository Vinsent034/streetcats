import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('login con credenziali errate mostra errore', async ({ page }) => {
  await page.goto('/auth');
  await page.locator('input[type="email"]').fill('test@sbagliato.it');
  await page.locator('input[type="password"]').fill('passworderrata');
  await page.getByRole('button', { name: 'Accedi' }).click();
  const errore = page.locator('.errore-box');
  await expect(errore).toBeVisible();
  await expect(errore).not.toBeEmpty();
});
