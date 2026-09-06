import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals, ...nextTs,
  { settings: { next: { rootDir: 'apps/web/' } } },
  { files: ['apps/web/**/*.{ts,tsx}', 'packages/**/*.ts'], rules: {
    'no-restricted-properties': ['error', { object: 'process', property: 'env', message: 'Browser configuration is explicit and public; secrets belong to acquisition pipelines.' }],
    'no-restricted-imports': ['error', { patterns: ['**/pipelines/**', '**/data/raw/**', '**/data/processed/**', 'node:*'] }]
  } },
  globalIgnores(['apps/web/public/vendor/**', '**/.next/**', '**/out/**', '**/next-env.d.ts', '.venv/**', 'test-results/**', 'playwright-report/**'])
]);
