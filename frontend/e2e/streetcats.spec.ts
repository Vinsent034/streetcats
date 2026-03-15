import { test, expect } from '@playwright/test';

// tutti i test dell'app streetcats in un unico posto
test.describe('StreetCats E2E', () => {

  // prima di ogni test puliamo il localStorage così l'utente risulta sempre scollegato
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  // test 1: la home si carica e mostra il titolo principale
  test('la homepage si carica e mostra il titolo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Gatti di Napoli')).toBeVisible();
  });

  // test 2: la mappa leaflet deve essere presente nella home
  test('la mappa viene renderizzata nella homepage', async ({ page }) => {
    await page.goto('/');
    const mappa = page.locator('#mappa-home');
    await expect(mappa).toBeVisible();
    // leaflet aggiunge questa classe quando la mappa è inizializzata
    await expect(mappa.locator('.leaflet-container')).toBeVisible();
  });

  // test 3: se non sei loggato, la navbar deve mostrare il link login
  test('la navbar mostra Login se non autenticato', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Login')).toBeVisible();
  });

  // test 4: cliccando login vai alla pagina di autenticazione
  test('click su Login naviga alla pagina auth', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Login').click();
    await expect(page).toHaveURL(/\/auth/);
  });

  // test 5: la pagina auth deve avere i campi email, password e il bottone accedi
  test('la pagina auth mostra il form di login', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByText('Accedi')).toBeVisible();
  });

  // test 6: lo switch tra tab login e registrazione deve mostrare/nascondere il campo nome
  test('switch tra tab Login e Registrazione funziona', async ({ page }) => {
    await page.goto('/auth');
    // clicco su registrati per passare al form di registrazione
    await page.getByText('Registrati').click();
    // il campo nome deve comparire
    const campoNome = page.locator('input[placeholder*="nome"], input[name="nome"]').first();
    await expect(campoNome).toBeVisible();
    // torno su login
    await page.getByText('Login').click();
    // il campo nome deve sparire
    await expect(campoNome).not.toBeVisible();
  });

  // test 7: con credenziali sbagliate deve apparire il box di errore
  test('login con credenziali errate mostra errore', async ({ page }) => {
    await page.goto('/auth');
    await page.locator('input[type="email"]').fill('test@sbagliato.it');
    await page.locator('input[type="password"]').fill('passworderrata');
    await page.getByText('Accedi').click();
    // aspettiamo che appaia il messaggio di errore
    const errore = page.locator('.errore-box');
    await expect(errore).toBeVisible();
    // l'errore deve contenere del testo
    await expect(errore).not.toBeEmpty();
  });

  // test 8: registrazione con campi vuoti deve mostrare errore
  test('registrazione con campi vuoti mostra errore', async ({ page }) => {
    await page.goto('/auth');
    // vado sul tab registrazione
    await page.getByText('Registrati').click();
    // clicco registrati senza compilare nulla
    // prendo l'ultimo "Registrati" che è il bottone submit, non il tab
    await page.locator('button', { hasText: 'Registrati' }).last().click();
    // deve apparire l'errore
    await expect(page.locator('.errore-box')).toBeVisible();
  });

  // test 9: la pagina aggiungi è protetta, se non sei loggato ti rimanda al login
  test('la pagina aggiungi redirige a auth se non loggato', async ({ page }) => {
    await page.goto('/aggiungi');
    // aspettiamo che il redirect avvenga
    await page.waitForURL(/\/auth/);
    await expect(page).toHaveURL(/\/auth/);
  });

  // test 10: un id gatto che non esiste deve mostrare un errore
  test('dettaglio gatto inesistente mostra errore', async ({ page }) => {
    await page.goto('/dettaglio/99999');
    // aspettiamo che compaia il box errore
    const errore = page.locator('.errore-box');
    await expect(errore).toBeVisible();
    // il testo deve contenere "non trovato" (maiuscolo o minuscolo)
    await expect(errore).toContainText(/non trovato/i);
  });

});
