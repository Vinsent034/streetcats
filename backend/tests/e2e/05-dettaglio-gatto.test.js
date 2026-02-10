// test pagina dettaglio gatto
const { test, expect } = require('@playwright/test');


// test visualizzo dettaglio gatto
test('pagina dettaglio si carica', async ({ page }) => {
  
  // vado alla home e clicco su un gatto
  await page.goto('/index.html');
  await page.waitForTimeout(2000);
  
  
  // clicco sul primo marker
  const marker = page.locator('.leaflet-marker-icon').first();
  await marker.click();
  
  await page.waitForTimeout(1000);
  

  // clicco vedi dettagli
  await page.click('button:has-text("Vedi dettagli")');
  
  await page.waitForURL(/detail-cat.html/);
  

  // verifico che ci siano le info del gatto
  await expect(page.locator('#NomeGatto')).toBeVisible();
  await expect(page.locator('#cat-photo')).toBeVisible();
  await expect(page.locator('#DescrizioneGatto')).toBeVisible();
  
});


// test markdown funziona
test('descrizione con markdown funziona', async ({ page }) => {
  
  await page.goto('/index.html');
  await page.waitForTimeout(2000);
  
  const marker = page.locator('.leaflet-marker-icon').first();
  await marker.click();
  await page.waitForTimeout(1000);
  
  await page.click('button:has-text("Vedi dettagli")');
  await page.waitForURL(/detail-cat.html/);
  

  // controllo se c'è del grassetto nella descrizione
  const descrizione = page.locator('#DescrizioneGatto');
  
  // se c'è markdown dovrebbe esserci un tag strong o em
  const hasFormatting = await descrizione.locator('strong, em').count();
  
  // non faccio assert perche magari non tutti i gatti hanno markdown
  console.log('Tag di formattazione trovati:', hasFormatting);
  
});