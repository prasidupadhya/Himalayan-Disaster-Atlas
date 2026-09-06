import { defineConfig, devices } from '@playwright/test';

// Hydration diagnostics exist in development builds, not the static production export.
export default defineConfig({
  testDir: './tests/hydration',
  workers: 1,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:3000',
    launchOptions: { args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
  },
});
