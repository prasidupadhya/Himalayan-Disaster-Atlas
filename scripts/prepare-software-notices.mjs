import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
export function prepareSoftwareNotices() {
  const lock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'));
  const notices = ['Himalayan Disaster Atlas — third-party software notices', 'Original Atlas software: MIT. Upstream licences remain separate. Build/test-only native binaries are not part of the static website.'];
  const inventory = [];
  for (const [path, pkg] of Object.entries(lock.packages).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) {
    if (!path.includes('node_modules/') || pkg.link) continue;
    inventory.push({ package: path, version: pkg.version, license: pkg.license, build_or_test_only: !!pkg.dev, optional: !!pkg.optional });
    const directory = resolve(root, path);
    if (!existsSync(directory)) {
      if (!pkg.optional) throw new Error(`Install locked dependencies before building notices: ${path}`);
      continue;
    }
    const files = readdirSync(directory).sort().filter(name => /^(licen[sc]e|copying|notice)(\.|$|-)/i.test(name));
    const knownBuildOnly = /node_modules\/(?:@img\/sharp-|@next\/(?:env$|swc-))/.test(path);
    if (!pkg.dev && !files.length && !knownBuildOnly && !['node_modules/client-only', 'node_modules/murmurhash-js'].includes(path)) throw new Error(`Missing runtime licence notice: ${path}`);
    for (const name of files) {
      const full = resolve(directory, name);
      // Some packages store licences in a directory; enumerate below as needed.
      const entry = readdirSync(directory, { withFileTypes: true }).find(entry => entry.name === name);
      if (entry?.isFile()) notices.push(`\n--- ${path}@${pkg.version} / ${name} (${pkg.license}) ---\n${readFileSync(full, 'utf8')}`);
    }
  }
  for (const [name, source] of [['murmurhash-js', 'node_modules/murmurhash-js/README.md'], ['client-only (React MIT notice)', 'node_modules/react/LICENSE'], ['@next/env and @next/swc (Next MIT notice)', 'node_modules/next/license.md']]) {
    notices.push(`\n--- ${name} ---\n${readFileSync(resolve(root, source), 'utf8')}`);
  }
  // Next bundles dependencies internally, outside npm's dependency inventory.
  const compiled = resolve(root, 'node_modules/next/dist/compiled');
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (/^(licen[sc]e|copying|notice)(\.|$|-)/i.test(entry.name)) notices.push(`\n--- ${path.slice(root.length)} ---\n${readFileSync(path, 'utf8')}`);
    }
  }
  visit(compiled);
  const output = resolve(root, 'apps/web/public/legal'); mkdirSync(output, { recursive: true });
  writeFileSync(resolve(output, 'THIRD_PARTY_NOTICES.txt'), `${notices.join('\n\n')}\n`);
  writeFileSync(resolve(output, 'software-inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`);
  writeFileSync(resolve(output, 'LICENSE.txt'), readFileSync(resolve(root, 'LICENSE')));
  console.log(`Prepared software notices and ${inventory.length} locked dependency records.`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareSoftwareNotices();
