import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
export function auditDatasets(reviews, manifests) {
  const keys = new Set();
  for (const [path, bytes] of manifests) {
    const matches = Object.entries(reviews).filter(([, review]) => review.manifest_path === path);
    if (matches.length !== 1) throw new Error(`Exactly one licence review is required for ${path}`);
    const [key, review] = matches[0]; keys.add(key);
    if (createHash('sha256').update(bytes).digest('hex') !== review.manifest_sha256) throw new Error(`Stale licence review: ${key}`);
    if (!['PERMITTED', 'REVIEW_REQUIRED', 'PROHIBITED'].includes(review.status) || !review.reason?.trim() || !review.obligations?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewed_on) || !Array.isArray(review.parents) || !Array.isArray(review.evidence_urls)) throw new Error(`Incomplete licence review: ${key}`);
  }
  if (keys.size !== Object.keys(reviews).length) throw new Error('Licence ledger contains missing release manifests');
  const blocked = new Set(); const visited = new Set();
  function visit(key, chain = new Set()) {
    if (!reviews[key]) throw new Error(`Unreviewed parent: ${key}`);
    if (chain.has(key)) throw new Error(`Licence lineage cycle: ${key}`);
    if (visited.has(key)) return blocked.has(key);
    const review = reviews[key]; const next = new Set([...chain, key]);
    const parentBlocked = review.parents.map(parent => visit(parent, next)).some(Boolean);
    if (review.status !== 'PERMITTED' || parentBlocked) blocked.add(key);
    visited.add(key); return blocked.has(key);
  }
  for (const key of keys) visit(key);
  return [...blocked].sort();
}
export function checkLicenses({ publication = false, excludedReleases = [] } = {}) {
  const { reviews, public_tree_sha256 } = read('licensing/datasets.json');
  const tree = createHash('sha256');
  function hashTree(directory, prefix = '') {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      if (entry.isSymbolicLink()) throw new Error('Data symlink is not publishable');
      const name = `${prefix}${entry.name}`;
      if (entry.isDirectory()) hashTree(resolve(directory, entry.name), `${name}/`);
      else tree.update(`${name}\0${createHash('sha256').update(readFileSync(resolve(directory, entry.name))).digest('hex')}\n`);
    }
  }
  hashTree(resolve(root, 'apps/web/public/data'));
  if (tree.digest('hex') !== public_tree_sha256) throw new Error('Public data tree differs from the licensing review; review additions and changed bytes');
  const manifests = [];
  for (const dataset of readdirSync(resolve(root, 'apps/web/public/data'), { withFileTypes: true })) {
    if (!dataset.isDirectory()) throw new Error(`Unregistered data file: ${dataset.name}`);
    for (const version of readdirSync(resolve(root, 'apps/web/public/data', dataset.name))) {
      const path = `/data/${dataset.name}/${version}/manifest.json`;
      if (existsSync(resolve(root, `apps/web/public${path}`))) manifests.push([path, readFileSync(resolve(root, `apps/web/public${path}`))]);
      else if (`${dataset.name}/${version}` !== 'nepal-osm-infrastructure/1.0.0') throw new Error(`Unregistered release: ${path}`); // Original Atlas QA metadata only; pinned by the complete public tree hash.
    }
  }
  const blocked = auditDatasets(reviews, manifests);
  // Parent declarations must agree with the independently validated provenance catalog.
  const catalog = read('apps/web/public/data/atlas-provenance/1.0.0/manifest.json');
  for (const record of catalog.records) {
    const parents = record.parents.filter(parent => parent.id !== 'external-source').map(parent => `${parent.id}@${parent.version}`).sort();
    if (JSON.stringify(parents) !== JSON.stringify([...reviews[record.key].parents].sort())) throw new Error(`Licence parent coverage differs: ${record.key}`);
  }
  const python = read('licensing/python-inventory.json');
  if (createHash('sha256').update(readFileSync(resolve(root, 'requirements.lock'))).digest('hex') !== python.requirements_sha256) throw new Error('Python dependency licence inventory requires review');
  const policy = read('licensing/software-policy.json');
  for (const [path, entry] of Object.entries(read('package-lock.json').packages)) {
    if (!path.includes('node_modules/') || entry.link) continue;
    if (!policy.allowed_expressions.includes(entry.license)) throw new Error(`Unreviewed software licence: ${path}`);
    if (entry.license.includes('LGPL') && !path.includes('/@img/sharp-')) throw new Error(`Unreviewed LGPL redistribution: ${path}`);
  }
  if (excludedReleases.some(key => !blocked.includes(key))) throw new Error('Only blocked releases may be excluded by the publication gate');
  const unresolved = blocked.filter(key => !excludedReleases.includes(key));
  if (publication && unresolved.length) throw new Error(`Publication blocked by unresolved dataset rights (${unresolved.length} releases): ${unresolved.join(', ')}. See /licenses/ and licensing/datasets.json.`);
  console.log(`Licence ledger verified: ${manifests.length} releases, ${blocked.length} publication blockers; dependency licence expressions reviewed.`);
  return blocked;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) checkLicenses({ publication: process.argv.includes('--publication') });
