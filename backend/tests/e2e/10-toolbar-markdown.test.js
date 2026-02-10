// test toolbar markdown
const { test, expect } = require('@playwright/test');


// test bottone grassetto
test('bottone grassetto funziona', async ({ page }) => {
  
  // login
  await page.goto('/login.html');
  await page.fill('#login-email', 'test@example.com');
  await page.fill('#login-password', 'password123');
  
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  
  await page.click('button.btn-primary:has-text("Accedi")');
  await page.waitForTimeout(2000);
  

  // vado alla pagina pubblica gatto
  await page.click('button:has-text("Publica un gatto")');
  await page.waitForURL(/add-cat.html/);
  

  // scrivo del testo
  const textarea = page.locator('#descrizione-gatto');
  await textarea.fill('testo normale');
  

  // seleziono il testo
  await textarea.click();
  await page.keyboard.press('Control+A');
  

  // clicco bottone grassetto
  await page.click('#btn-bold');
  
  await page.waitForTimeout(500);
  

  // verifico che ci siano i **
  const valore = await textarea.inputValue();
  expect(valore).toContain('**');
  
});


// test bottone corsivo
test('bottone corsivo funziona', async ({ page }) => {
  
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
  

  const textarea = page.locator('#descrizione-gatto');
  await textarea.fill('testo corsivo');
  
  await textarea.click();
  await page.keyboard.press('Control+A');
  

  // clicco corsivo
  await page.click('#btn-italic');
  
  await page.waitForTimeout(500);
  

  // verifico che ci siano i *
  const valore = await textarea.inputValue();
  expect(valore).toContain('*');
  
});