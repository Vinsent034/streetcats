// test pubblicazione gatto
const { test, expect } = require('@playwright/test');
const path = require('path');


// test pubblico gatto
test('pubblicazione gatto completo', async ({ page }) => {
  
  // prima devo fare login
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
  

  // compilo il form
  await page.fill('#nome-gatto', 'Gatto Test ' + Date.now());
  await page.fill('#descrizione-gatto', 'Questo è un **gatto di test**');
  

  // clicco sulla mappa per mettere la posizione
  const mappa = page.locator('#map');
  await mappa.click({ position: { x: 100, y: 100 } });
  
  await page.waitForTimeout(500);
  

  // carico una foto fake
  const fotoPath = path.join(__dirname, '..', 'fixtures', 'test-cat.jpg');
  
  // se non esiste la foto creo un buffer fake
  await page.setInputFiles('#foto-gatto', {
    name: 'test-cat.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake image data')
  });
  

  // invio il form
  await page.click('button.btn-submit');
  
  await page.waitForTimeout(2000);
  
  
  // dovrei tornare alla home
  await expect(page).toHaveURL(/index.html/);
  
});


// test non loggato non puo pubblicare
test('senza login non posso pubblicare', async ({ page }) => {
  
  await page.goto('/add-cat.html');
  
  await page.waitForTimeout(1000);
  
  
  // dovrei essere reindirizzato al login
  await expect(page).toHaveURL(/login.html/);
  
});