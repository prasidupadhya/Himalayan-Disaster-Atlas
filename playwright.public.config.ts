import { defineConfig } from '@playwright/test';
import base from './playwright.cloudflare.config';
export default defineConfig({
  ...base,
  testMatch: [
    'public/**/*.spec.ts', 'hosting/**/*.spec.ts',
    'e2e/performance.spec.ts', 'e2e/admin-boundaries.spec.ts', 'e2e/terrain.spec.ts', 'e2e/mountains.spec.ts',
    'e2e/rivers.spec.ts', 'e2e/downstream-trace.spec.ts', 'e2e/glaciers.spec.ts',
    'e2e/glacial-lakes.spec.ts', 'e2e/earthquakes.spec.ts', 'e2e/hydropower.spec.ts',
    'e2e/infrastructure.spec.ts', 'e2e/satellite.spec.ts', 'e2e/climate.spec.ts',
    'e2e/water-change.spec.ts', 'e2e/scenario-engine.spec.ts', 'e2e/simulation-ui.spec.ts',
  ],
});
