import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';
import { checkSecurity } from '../../scripts/check-security.mjs';
it('rejects committed acquisition environment files even outside the web app', () => {
  const directory = mkdtempSync(join(tmpdir(), 'atlas-security-'));
  try {
    execFileSync('git', ['init', '--quiet', directory]);
    writeFileSync(join(directory, '.env'), 'PLACEHOLDER=example\n');
    expect(() => checkSecurity(directory)).not.toThrow();
    execFileSync('git', ['-C', directory, 'add', '.env']);
    expect(() => checkSecurity(directory)).toThrow('Tracked environment file is prohibited');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
