// test login
const { test, expect } = require('@playwright/test');


// test login ok
test('login con credenziali corrette', async ({ page }) => {
  
  await page.goto('/login.html');
  
  
  // compilo email e password
  await page.fill('#login-email', 'test@example.com');
  await page.fill('#login-password', 'password123');
  
  
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  
  await page.click('button.btn-primary:has-text("Accedi")');
  
  await page.waitForTimeout(2000);
  
  
  // dovrei essere su index.html
  await expect(page).toHaveURL(/index.html/);
  
  // dovrei vedere il mio nome nella navbar
  await expect(page.locator('#navbar')).toContainText('Ciao');
  
});


// test login sbagliato
test('login con password sbagliata', async ({ page }) => {
  
  await page.goto('/login.html');
  

  await page.fill('#login-email', 'test@example.com');
  await page.fill('#login-password', 'passwordsbagliata');
  
  
  let errore = '';
  page.on('dialog', async dialog => {
    errore = dialog.message();
    await dialog.accept();
  });
  
  await page.click('button.btn-primary:has-text("Accedi")');
  
  await page.waitForTimeout(2000);
  
  
  // controllo errore
  expect(errore).toBeTruthy();
  expect(errore.toLowerCase()).toContain('errore');
  
});


// test logout
test('logout funziona', async ({ page }) => {
  
  // prima faccio login
  await page.goto('/login.html');
  await page.fill('#login-email', 'test@example.com');
  await page.fill('#login-password', 'password123');
  
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  
  await page.click('button.btn-primary:has-text("Accedi")');
  await page.waitForTimeout(2000);
  

  // poi faccio logout
  await page.click('button:has-text("Logout")');
  
  await page.waitForTimeout(1000);
  
  
  // verifico che vedo il bottone login
  await expect(page.locator('button:has-text("Login")')).toBeVisible();
  
});