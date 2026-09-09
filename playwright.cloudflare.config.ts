import { defineConfig } from '@playwright/test';
import base from './playwright.config';
export default defineConfig({
  ...base,
  testDir: './tests',
  testMatch: ['e2e/**/*.spec.ts', 'hosting/**/*.spec.ts'],
  use: { ...base.use, baseURL: 'http://127.0.0.1:4174' },
  webServer: { command: 'npm run preview:cloudflare', url: 'http://127.0.0.1:4174', reuseExistingServer: false, timeout: 60000 },
});
