import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('click su Login naviga alla pagina auth', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Login').click();
  await expect(page).toHaveURL(/\/auth/);
});
