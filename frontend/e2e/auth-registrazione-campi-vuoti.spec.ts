import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('registrazione con campi vuoti mostra errore', async ({ page }) => {
  await page.goto('/auth');
  await page.getByRole('button', { name: 'Registrati' }).first().click();
  await page.locator('button', { hasText: 'Registrati' }).last().click();
  await expect(page.locator('.errore-box')).toBeVisible();
});
