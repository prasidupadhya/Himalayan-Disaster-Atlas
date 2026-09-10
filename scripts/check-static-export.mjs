import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { releaseDirectory } from './public-release-policy.mjs';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('..', import.meta.url));
export function checkStaticExport(output = resolve(root, 'apps/web/out'), { excludedReleases = [] } = {}) {
  const excluded = excludedReleases.map(key => releaseDirectory(key).slice(1));
  const isExcluded = name => excluded.some(prefix => name.startsWith(prefix));
  let count = 0; let bytes = 0;
  const hash = value => createHash('sha256').update(value).digest('hex');
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name); const name = relative(output, path);
      if (isExcluded(name + (entry.isDirectory() ? "/" : ""))) throw new Error(`Excluded public artifact: ${name}`);
      if (entry.isSymbolicLink()) throw new Error(`Static symlink: ${name}`);
      if (entry.isDirectory()) { visit(path); continue; }
      if (/(?:^|\/)(?:node_modules|raw|processed|\.env|\.git)(?:\/|$)|\.(?:node|so|dylib|dll|py|pyc|map)$/.test(name)) throw new Error(`Non-public build artifact: ${name}`);
      const size = statSync(path).size;
      if (size > 25 * 1024 * 1024) throw new Error(`Cloudflare file exceeds 25 MiB: ${name}`);
      count++; bytes += size;
      if (name.startsWith('data/') || name.startsWith('vendor/') || name.startsWith('legal/')) {
        const source = resolve(root, 'apps/web/public', name);
        if (!existsSync(source) || hash(readFileSync(source)) !== hash(readFileSync(path))) throw new Error(`Static artifact differs from reviewed source: ${name}`);
      }
    }
  }
  visit(output);
  if (count > 20000) throw new Error('Cloudflare free static-asset count exceeds 20,000');
  // Ensure an old/incomplete export cannot pass simply by omitting public files.
  function requirePublic(directory, prefix = '') {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (isExcluded(`${prefix}${entry.name}/`)) continue;
      if (entry.isDirectory()) requirePublic(resolve(directory, entry.name), `${prefix}${entry.name}/`);
      else if (!existsSync(resolve(output, prefix, entry.name))) throw new Error(`Missing public output: ${prefix}${entry.name}`);
    }
  }
  requirePublic(resolve(root, 'apps/web/public'));
  for (const page of ['index.html', '404.html', 'atlas/index.html', 'events/index.html', 'analyst/index.html', 'evidence/index.html', 'sources/index.html', 'methodology/index.html', 'data-catalog/index.html', 'licenses/index.html', '_headers']) {
    if (!existsSync(resolve(output, page))) throw new Error(`Missing static route/configuration: ${page}`);
  }
  console.log(`Static deployment verified: ${count} files, ${(bytes / 1048576).toFixed(1)} MiB; each below 25 MiB.`);
  return { count, bytes };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) checkStaticExport();
