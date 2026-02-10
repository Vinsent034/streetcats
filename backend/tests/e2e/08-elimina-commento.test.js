// test eliminazione commento
const { test, expect } = require('@playwright/test');


// test elimino mio commento
test('posso eliminare il mio commento', async ({ page }) => {
  
  // login
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
  

  // aggiungo un commento
  const testoCommento = 'Commento da eliminare ' + Date.now();
  await page.fill('#Commento', testoCommento);
  await page.click('#AggiungiCommento button:has-text("Invia")');
  await page.waitForTimeout(2000);
  

  // dovrei vedere il bottone elimina sul mio commento
  const listaCommenti = page.locator('#ListaCommenti');
  const bottoneElimina = listaCommenti.locator('button:has-text("Elimina")').last();
  
  await expect(bottoneElimina).toBeVisible();
  

  // clicco elimina
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  
  await bottoneElimina.click();
  
  await page.waitForTimeout(2000);
  

  // il commento non dovrebbe piu esserci
  const commenti = await listaCommenti.textContent();
  expect(commenti).not.toContain(testoCommento);
  
});