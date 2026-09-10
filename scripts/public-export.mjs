import { readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { excludedReleases, releaseDirectory } from './public-release-policy.mjs';
const root = fileURLToPath(new URL('..', import.meta.url));
export const publicOutput = resolve(root, 'apps/web/out');
const reportName = 'release-inventory.json';
export function exportHashes(output) {
  const files = {};
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      const path = resolve(directory, entry.name); const name = relative(output, path);
      if (entry.isSymbolicLink()) throw new Error(`Export symlink: ${name}`);
      if (entry.isDirectory()) walk(path);
      else if (name !== reportName) files[name] = createHash('sha256').update(readFileSync(path)).digest('hex');
    }
  }
  walk(output); return files;
}
export function preparePublicExport(output = publicOutput) {
  const excluded = excludedReleases();
  for (const key of excluded) rmSync(resolve(output, `.${releaseDirectory(key)}`), { recursive: true, force: true });
  writeFileSync(resolve(output, reportName), JSON.stringify({ schema_version: 1, profile: 'public', excluded, files: exportHashes(output) }, null, 2) + '\n');
  return excluded;
}
export function verifyPublicExport(output = publicOutput) {
  const path = resolve(output, reportName);
  if (!existsSync(path)) throw new Error('A reviewed public export is required. Run npm run build; research exports cannot deploy.');
  const report = JSON.parse(readFileSync(path, 'utf8')); const excluded = excludedReleases();
  if (report.schema_version !== 1 || report.profile !== 'public' || JSON.stringify(report.excluded) !== JSON.stringify(excluded)) throw new Error('Public release selection is stale or invalid. Rebuild the export.');
  for (const key of excluded) if (existsSync(resolve(output, `.${releaseDirectory(key)}`))) throw new Error(`Excluded release present: ${key}`);
  if (JSON.stringify(report.files) !== JSON.stringify(exportHashes(output))) throw new Error('Public export bytes changed after validation. Rebuild the export.');
  return excluded;
}
