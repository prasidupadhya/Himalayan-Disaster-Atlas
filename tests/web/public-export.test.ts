import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { preparePublicExport, verifyPublicExport } from '../../scripts/public-export.mjs';
import { excludedReleases, releaseDirectory } from '../../scripts/public-release-policy.mjs';
describe('public export isolation', () => {
  it('removes excluded releases, retains allowed bytes and rejects changes or reintroduction', () => {
    const output = mkdtempSync(resolve(tmpdir(), 'atlas-public-'));
    try {
      const key = excludedReleases()[0]; const blocked = resolve(output, `.${releaseDirectory(key)}`);
      mkdirSync(blocked, { recursive: true }); writeFileSync(resolve(blocked, 'manifest.json'), '{}');
      writeFileSync(resolve(output, 'index.html'), '<p>Allowed content</p>');
      expect(() => verifyPublicExport(output)).toThrow('public export is required');
      preparePublicExport(output);
      expect(existsSync(blocked)).toBe(false);
      expect(verifyPublicExport(output)).toEqual(excludedReleases());
      writeFileSync(resolve(output, 'index.html'), 'tampered');
      expect(() => verifyPublicExport(output)).toThrow('bytes changed');
      preparePublicExport(output);
      mkdirSync(blocked, { recursive: true });
      expect(() => verifyPublicExport(output)).toThrow('Excluded release present');
    } finally { rmSync(output, { recursive: true, force: true }); }
  });
});
