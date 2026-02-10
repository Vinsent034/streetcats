// test per registrazione
const { test, expect } = require('@playwright/test');

// genero email random
function generaEmailRandom() {
  const timestamp = Date.now();
  return `test${timestamp}@example.com`;
}


// test registrazione ok
test('test registrazione utente', async ({ page }) => {
  
  await page.goto('/login.html');
  
  await expect(page).toHaveTitle(/Login - StreetCats/);
  
  
  // clicco registrati
  await page.click('text=Registrati');
  
  await expect(page.locator('#form-registrazione')).toBeVisible();
  
  
  // compilo form
  const emailTest = generaEmailRandom();
  const nomeTest = 'Mario Rossi';
  const passwordTest = 'password123';
  
  await page.fill('#reg-nome', nomeTest);
  await page.fill('#reg-email', emailTest);
  await page.fill('#reg-password', passwordTest);

  
  // clicco crea account
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  
  await page.click('button.btn-primary:has-text("Crea Account")');
  

  await page.waitForTimeout(2000);
  

  // verifico che resto su login
  await expect(page).toHaveURL(/login.html/);

  
});



// test email gia esistente
test('test email duplicata', async ({ page }) => {
  
  const emailEsistente = 'test@example.com';
  
  await page.goto('/login.html');
  await page.click('text=Registrati');
  

  // metto email esistente
  await page.fill('#reg-nome', 'Test Duplicato');
  await page.fill('#reg-email', emailEsistente);
  await page.fill('#reg-password', 'password123');

  
  
  let messaggioErrore = '';
  page.on('dialog', async dialog => {
    messaggioErrore = dialog.message();
    await dialog.accept();
  });
  
  await page.click('button.btn-primary:has-text("Crea Account")');
  await page.waitForTimeout(2000);
  
  
  // controllo errore
  expect(messaggioErrore).toBeTruthy();
  expect(messaggioErrore.toLowerCase()).toContain('esiste');

  
});



// test campi vuoti
test('test form vuoto', async ({ page }) => {
  
  await page.goto('/login.html');
  await page.click('text=Registrati');
  
  
  // provo a inviare vuoto
  await page.click('button.btn-primary:has-text("Crea Account")');
  
  

  // verifico che il campo nome sia required
  const nomeInput = page.locator('#reg-nome');
  await expect(nomeInput).toHaveAttribute('required', '');

  
});



// test password corta
test('test password troppo corta', async ({ page }) => {
  
  await page.goto('/login.html');
  await page.click('text=Registrati');
  
  
  // metto password di 5 caratteri
  await page.fill('#reg-nome', 'Test Password');
  await page.fill('#reg-email', generaEmailRandom());
  await page.fill('#reg-password', '12345');
  
  
  let messaggioErrore = '';
  page.on('dialog', async dialog => {
    messaggioErrore = dialog.message();
    await dialog.accept();
  });
  
  await page.click('button.btn-primary:has-text("Crea Account")');
  await page.waitForTimeout(2000);
  
  
  // verifico errore password
  expect(messaggioErrore).toBeTruthy();
  expect(messaggioErrore.toLowerCase()).toMatch(/password|caratteri|6/);

  
});