// test eliminazione gatto
const { test, expect } = require('@playwright/test');
const path = require('path');


// test elimino il mio gatto
test('posso eliminare il mio gatto', async ({ page }) => {
  
  // login
  await page.goto('/login.html');
  await page.fill('#login-email', 'test@example.com');
  await page.fill('#login-password', 'password123');
  
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  
  await page.click('button.btn-primary:has-text("Accedi")');
  await page.waitForTimeout(2000);
  

  // pubblico un gatto
  await page.click('button:has-text("Publica un gatto")');
  await page.waitForURL(/add-cat.html/);
  
  await page.fill('#nome-gatto', 'Gatto da eliminare ' + Date.now());
  await page.fill('#descrizione-gatto', 'Questo gatto verrà eliminato');
  
  const mappa = page.locator('#map');
  await mappa.click({ position: { x: 100, y: 100 } });
  await page.waitForTimeout(500);
  
  await page.setInputFiles('#foto-gatto', {
    name: 'test.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake')
  });
  
  await page.click('button.btn-submit');
  await page.waitForTimeout(2000);
  

  // vado al dettaglio dell'ultimo gatto (quello appena creato)
  await page.waitForTimeout(1000);
  const markers = page.locator('.leaflet-marker-icon');
  const ultimoMarker = markers.last();
  await ultimoMarker.click();
  await page.waitForTimeout(1000);
  
  await page.click('button:has-text("Vedi dettagli")');
  await page.waitForURL(/detail-cat.html/);
  

  // dovrei vedere il bottone elimina
  const bottoneElimina = page.locator('#BottoneElimina');
  await expect(bottoneElimina).toBeVisible();
  

  // clicco elimina
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  
  await bottoneElimina.click();
  
  await page.waitForTimeout(2000);
  

  // dovrei tornare alla home
  await expect(page).toHaveURL(/index.html/);
  
});


// test non vedo bottone elimina se non mio
test('non vedo elimina se non è mio gatto', async ({ page }) => {
  
  // vado su un gatto senza login
  await page.goto('/index.html');
  await page.waitForTimeout(2000);
  
  const marker = page.locator('.leaflet-marker-icon').first();
  await marker.click();
  await page.waitForTimeout(1000);
  
  await page.click('button:has-text("Vedi dettagli")');
  await page.waitForURL(/detail-cat.html/);
  

  // non dovrei vedere il bottone elimina
  const bottoneElimina = page.locator('#BottoneElimina');
  await expect(bottoneElimina).toBeHidden();
  
});