import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';
it('deployment credential validation fails without exposing supplied values', () => {
  const value = ['synthetic', 'never-a-real-credential'].join('-');
  const missing = spawnSync(process.execPath, ['scripts/check-deploy-env.mjs'], { env: { NODE_ENV: 'test' }, encoding: 'utf8' });
  expect(missing.status).not.toBe(0);
  expect(missing.stderr).toContain('Missing deployment environment variables');
  const invalid = spawnSync(process.execPath, ['scripts/check-deploy-env.mjs'], { env: { NODE_ENV: 'test', CLOUDFLARE_API_TOKEN: value, CLOUDFLARE_ACCOUNT_ID: value }, encoding: 'utf8' });
  expect(invalid.status).not.toBe(0);
  expect(invalid.stderr).toContain('value withheld');
  expect(invalid.stdout + invalid.stderr).not.toContain(value);
});
