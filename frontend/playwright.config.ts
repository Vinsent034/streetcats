import { defineConfig } from '@playwright/test';

export default defineConfig({
  // cartella dove stanno i test
  testDir: './e2e',
  // niente retry, se fallisce è fallito
  retries: 0,
  // timeout per ogni singolo test
  timeout: 15000,
  // solo chromium, niente firefox o safari
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  // url base dell'app angular
  use: {
    baseURL: 'http://localhost:4200',
  },
  // non configuriamo webServer: avviamo backend e frontend a mano
});
