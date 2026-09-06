import { afterEach, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkSecurity } from '../../scripts/check-security.mjs';
const folders: string[] = [];
function sandbox() { const path = mkdtempSync(join(tmpdir(), 'atlas-security-')); folders.push(path); return path; }
afterEach(() => { for (const path of folders.splice(0)) rmSync(path, { recursive: true, force: true }); });
it('rejects embedded credentials without echoing their value', () => {
  const root = sandbox();
  const canary = 'sk-proj-' + 'x'.repeat(40);
  writeFileSync(join(root, 'bundle.js'), `const key = '${canary}';`);
  expect(() => checkSecurity(root)).toThrow(/Potential credential detected in bundle.js; value withheld/);
  try { checkSecurity(root); } catch (error) { expect(String(error)).not.toContain(canary); }
});
it('rejects even harmless Next environment files to prevent automatic loading', () => {
  const root = sandbox(); mkdirSync(join(root, 'apps/web'), { recursive: true });
  writeFileSync(join(root, 'apps/web/.env.local'), 'EXAMPLE=value');
  expect(() => checkSecurity(root)).toThrow(/environment files are prohibited/);
});
it('rejects symlinked public input', () => {
  const root = sandbox(); mkdirSync(join(root, 'apps/web/public/data'), { recursive: true });
  writeFileSync(join(root, 'private.txt'), 'placeholder');
  symlinkSync(join(root, 'private.txt'), join(root, 'apps/web/public/data/source.json'));
  expect(() => checkSecurity(root)).toThrow(/Symlinks/);
});
