// test responsive design
const { test, expect } = require('@playwright/test');


// test mobile
test('sito funziona su mobile', async ({ page }) => {
  
  // imposto viewport mobile
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('/index.html');
  

  // verifico che il sito si carichi
  await expect(page.locator('.header')).toBeVisible();
  await expect(page.locator('#map')).toBeVisible();
  

  // provo il login
  await page.goto('/login.html');
  
  await page.fill('#login-email', 'test@example.com');
  await page.fill('#login-password', 'password123');
  
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  
  await page.click('button.btn-primary:has-text("Accedi")');
  
  await page.waitForTimeout(2000);
  
  await expect(page).toHaveURL(/index.html/);
  
});


// test tablet
test('sito funziona su tablet', async ({ page }) => {
  
  // viewport tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  
  await page.goto('/index.html');
  

  await expect(page.locator('.header')).toBeVisible();
  await expect(page.locator('#map')).toBeVisible();
  
  
  // provo a pubblicare un gatto
  await page.goto('/login.html');
  await page.fill('#login-email', 'test@example.com');
  await page.fill('#login-password', 'password123');
  
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  
  await page.click('button.btn-primary');
  await page.waitForTimeout(2000);
  
  
  await page.click('button:has-text("Publica un gatto")');
  await page.waitForURL(/add-cat.html/);
  
  
  // verifico che il form sia visibile
  await expect(page.locator('#FormAddCat')).toBeVisible();
  
});