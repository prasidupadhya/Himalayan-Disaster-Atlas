import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, workers: 1,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', launchOptions: { args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'python3 -m http.server 4173 --bind 127.0.0.1 --directory apps/web/out', url: 'http://127.0.0.1:4173', reuseExistingServer: false, stderr: 'ignore' },
});
