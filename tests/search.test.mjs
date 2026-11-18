import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { buildIndex, search, fold } from '../site/search.js';
import { districtFinder } from '../site/places.js';
import { COPY } from '../site/copy.js';

const gz = p => JSON.parse(gunzipSync(readFileSync(new URL(`../site/data/${p}`, import.meta.url))).toString('utf8'));
const districts = gz('nepal-admin-districts/2.0.1/features.geojson.gz').features, find = districtFinder(districts);
const catalogue = gz('atlas-flood-corridors/1.0.0/catalogue.json.gz');
const index = buildIndex({ districts, settlements: gz('nepal-osm-settlements/1.0.0/features.geojson.gz').features,
  peaks: gz('nepal-mountains/1.0.0/features.geojson.gz').features, streams: gz('nepal-river-names/1.0.0/features.geojson.gz').features,
  origins: catalogue.origins, lakeWords: [COPY.en.searchLakeWord, COPY.ne.searchLakeWord] });
const where = p => find(p);

test('folding drops Latin accents and case but keeps Devanagari', () => {
  assert.equal(fold('  Trishuli̇̄  Nadi̇̄ '), 'trishuli nadi');
  assert.equal(fold('काठमाडौं'), 'काठमाडौं'.normalize('NFD'));
});

test('every district is found by its own name, first', () => {
  for (const d of districts) assert.equal(search(index, d.properties.name, { where })[0].id, d.properties.pcode, d.properties.name);
});

test('towns are found in English or Nepali as OpenStreetMap publishes them', () => {
  const en = search(index, 'Pokhara', { where }).find(r => r.kind === 'city'), ne = search(index, 'पोखरा', { where }).find(r => r.kind === 'city');
  assert.equal(en.name, 'पोखरा'); assert.equal(en.alt, 'Pokhara'); assert.equal(en.id, ne.id);
  assert.equal(en.district.name, 'Kaski');
  assert.ok(index.every(e => e.name === null || !/^OSM settlement/.test(e.name)), 'no placeholder names');
});

test('peaks and streams are found by published names and aliases', () => {
  assert.equal(search(index, 'everest', { where })[0].kind, 'peak');
  assert.equal(search(index, 'Chomolungma', { where })[0].name, 'Mount Everest');
  const t = search(index, 'trisuli', { where });
  assert.ok(t.some(r => r.kind === 'stream'));
});

test('verified lakes are found by basin and by the word for lake, and only verified ones', () => {
  const verified = catalogue.origins.filter(o => o.lake);
  const all = search(index, COPY.en.searchLakeWord, { limit: 100, where });
  assert.equal(all.filter(r => r.kind === 'lake').length, verified.length);
  assert.ok(search(index, COPY.ne.searchLakeWord, { limit: 100 }).filter(r => r.kind === 'lake').length === verified.length);
  const basin = verified[0].lake.basin;
  assert.ok(search(index, basin, { limit: 100 }).some(r => r.kind === 'lake' && r.id === verified[0].id));
});

test('short queries return nothing and results are capped and unique', () => {
  assert.deepEqual(search(index, 'k'), []);
  const r = search(index, 'khola', { where });
  assert.ok(r.length <= 8);
  assert.equal(new Set(r.map(x => `${x.kind}|${x.name}|${x.district?.name}`)).size, r.length);
});
