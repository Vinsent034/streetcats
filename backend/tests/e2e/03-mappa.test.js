// test mappa e visualizzazione gatti
const { test, expect } = require('@playwright/test');


// test mappa si carica
test('la mappa si carica', async ({ page }) => {
  
  await page.goto('/index.html');
  
  
  // verifico che la mappa esista
  const mappa = page.locator('#map');
  await expect(mappa).toBeVisible();
  
  
  // controllo che leaflet sia caricato
  await expect(page.locator('.leaflet-container')).toBeVisible();
  
});


// test marker sulla mappa
test('i gatti appaiono sulla mappa', async ({ page }) => {
  
  await page.goto('/index.html');
  
  await page.waitForTimeout(2000);
  
  
  // dovrebbero esserci dei marker
  const markers = page.locator('.leaflet-marker-icon');
  const count = await markers.count();
  
  expect(count).toBeGreaterThan(0);
  
});


// test click su marker
test('click su marker apre popup', async ({ page }) => {
  
  await page.goto('/index.html');
  
  await page.waitForTimeout(2000);
  
  
  // clicco sul primo marker
  const primoMarker = page.locator('.leaflet-marker-icon').first();
  await primoMarker.click();
  
  await page.waitForTimeout(1000);
  
  
  // dovrebbe aprirsi un popup
  const popup = page.locator('.leaflet-popup-content');
  await expect(popup).toBeVisible();
  
  // il popup dovrebbe avere un bottone vedi dettagli
  await expect(popup.locator('button:has-text("Vedi dettagli")')).toBeVisible();
  
});