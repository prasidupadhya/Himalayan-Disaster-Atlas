import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const excluded = new Set(['node_modules', '.wrangler', '.git', '.next', '.venv', '__pycache__', 'test-results', 'playwright-report', 'raw', 'processed', '.ruff_cache']);
const credentialPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}/,
  /\b(?:ghp_|github_pat_|sk-proj-)[A-Za-z0-9_\-]{20,}/,
  /(?:client_secret|api_key|access_token|password)\s*[:=]\s*["']?[A-Za-z0-9_\-/+]{20,}/i,
];
const privateValues = Object.entries(process.env)
  .filter(([key, value]) => /SECRET|TOKEN|PASSWORD|PRIVATE_KEY|API_KEY/i.test(key) && value && value.length >= 12)
  .map(([, value]) => value);

export function checkSecurity(scanRoot = root) {
  let count = 0;
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (excluded.has(entry.name)) continue;
      const path = join(directory, entry.name);
      const name = relative(scanRoot, path);
      if (entry.isSymbolicLink()) throw new Error(`Symlinks are not permitted in publishable source: ${name}`);
      if (entry.name.startsWith('.env') && entry.name !== '.env.example') {
        if (name.startsWith('apps/web/')) throw new Error('Next.js environment files are prohibited; use pipeline-only secrets.');
        continue;
      }
      if (entry.isDirectory()) { visit(path); continue; }
      if (/\.(?:pem|key|p12|pfx)$/.test(entry.name)) throw new Error(`Private key container is not permitted: ${name}`);
      const content = readFileSync(path).toString('utf8');
      if (credentialPatterns.some(pattern => pattern.test(content)) || privateValues.some(value => content.includes(value))) {
        throw new Error(`Potential credential detected in ${name}; value withheld.`);
      }
      if (name.startsWith('apps/web/public/') && !name.startsWith('apps/web/public/data/') && !/^apps\/web\/public\/legal\/(LICENSE\.txt|THIRD_PARTY_NOTICES\.txt|software-inventory\.json)$/.test(name) && !/^apps\/web\/public\/vendor\/maplibre-gl\/\d+\.\d+\.\d+\/(maplibre-gl-(worker|shared)\.mjs|LICENSE\.txt)$/.test(name)) throw new Error(`Unregistered public artifact: ${name}`);
      count++;
    }
  }
  visit(scanRoot);
  if (existsSync(join(scanRoot, 'apps/web/out/.env'))) throw new Error('Environment file in static output');
  console.log(`Security checks passed (${count} files; source and available static output).`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) checkSecurity();
