// test commenti
const { test, expect } = require('@playwright/test');


// test aggiungo commento
test('aggiungo un commento', async ({ page }) => {
  
  // faccio login
  await page.goto('/login.html');
  await page.fill('#login-email', 'test@example.com');
  await page.fill('#login-password', 'password123');
  
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  
  await page.click('button.btn-primary:has-text("Accedi")');
  await page.waitForTimeout(2000);
  

  // vado a un gatto
  await page.goto('/index.html');
  await page.waitForTimeout(2000);
  
  const marker = page.locator('.leaflet-marker-icon').first();
  await marker.click();
  await page.waitForTimeout(1000);
  
  await page.click('button:has-text("Vedi dettagli")');
  await page.waitForURL(/detail-cat.html/);
  

  // scrivo un commento
  await page.fill('#Commento', 'Questo è un commento di test');
  
  await page.click('#AggiungiCommento button:has-text("Invia")');
  
  await page.waitForTimeout(2000);
  

  // verifico che il commento appaia
  const listaCommenti = page.locator('#ListaCommenti');
  await expect(listaCommenti).toContainText('Questo è un commento di test');
  
});


// test senza login non vedo textarea
test('senza login non posso commentare', async ({ page }) => {
  
  await page.goto('/index.html');
  await page.waitForTimeout(2000);
  
  const marker = page.locator('.leaflet-marker-icon').first();
  await marker.click();
  await page.waitForTimeout(1000);
  
  await page.click('button:has-text("Vedi dettagli")');
  await page.waitForURL(/detail-cat.html/);
  

  // la sezione commenti dovrebbe essere nascosta
  const aggiungiCommento = page.locator('#AggiungiCommento');
  await expect(aggiungiCommento).toBeHidden();
  
});