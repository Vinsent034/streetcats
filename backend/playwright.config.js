// playwright.config.js
// Configurazione per i test E2E di StreetCats

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // Cartella dove si trovano i test
  testDir: './tests/e2e',
  
  // Timeout per ogni test (30 secondi)
  timeout: 30000,
  
  // Configurazione del browser
  use: {
    // URL base del frontend
    baseURL: 'http://localhost:5500',
    
    // Mostra il browser durante i test (false = nascosto)
    headless: false,
    
    // Screenshot solo se il test fallisce
    screenshot: 'only-on-failure',
    
    // Video solo se il test fallisce
    video: 'retain-on-failure',
    
    // Dimensioni finestra browser
    viewport: { width: 1280, height: 720 },
  },
  
  // Esegui i test uno alla volta (più stabile)
  workers: 1,
  
  // Reporter (come mostra i risultati)
  reporter: [
    ['list'],  // Mostra ogni test man mano
    ['html']   // Genera report HTML
  ],
});