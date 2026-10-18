import { defineConfig } from '/home/user/Himalayan-Disaster-Atlas/node_modules/@playwright/test';
import base from '/home/user/Himalayan-Disaster-Atlas/playwright.config';
const ROOT = '/home/user/Himalayan-Disaster-Atlas';
export default defineConfig({
  ...base,
  testDir: `${ROOT}/tests/e2e`,
  outputDir: `${ROOT}/test-results`,
  use: { ...base.use, launchOptions: { ...base.use?.launchOptions, executablePath: '/opt/pw-browsers/chromium' } },
  webServer: { ...base.webServer, cwd: ROOT } as typeof base.webServer,
});
