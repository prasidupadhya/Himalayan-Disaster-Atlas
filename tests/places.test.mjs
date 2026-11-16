import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import * as P from '../site/places.js';

const gz = p => JSON.parse(gunzipSync(readFileSync(new URL(`../site/data/${p}`, import.meta.url))).toString('utf8'));
const districts = gz('nepal-admin-districts/2.0.1/features.geojson.gz').features, find = P.districtFinder(districts);
const catalogue = gz('atlas-flood-corridors/1.0.0/catalogue.json.gz');
const places = P.settlements(gz('nepal-osm-settlements/1.0.0/features.geojson.gz')), streamPoints = P.streams(gz('nepal-river-names/1.0.0/features.geojson.gz'));

test('district lookup places known points and returns null outside Nepal', () => {
  assert.equal(find([85.324, 27.7172]).name, 'Kathmandu');
  assert.equal(find([83.9856, 28.2096]).name, 'Kaski');
  assert.equal(find([84.731, 28.231]).name, 'Gorkha');
  assert.equal(find([77.2, 28.6]), null);
  assert.equal(find([86.713, 27.805]).province, 'Koshi');
  for (const d of districts) assert.equal(find([d.properties.label_longitude, d.properties.label_latitude])?.name, d.properties.name, `label point of ${d.properties.name}`);
});

test('samples run the whole published length and stay on the line', () => {
  for (const o of catalogue.origins) {
    const s = P.sample(o.line.coordinates, o.path_length_km);
    assert.equal(s[0].km, 0); assert.equal(s.at(-1).km, o.path_length_km);
    assert.deepEqual(s[0].p, o.line.coordinates[0]);
    assert.ok(P.flatKm(s.at(-1).p, o.line.coordinates.at(-1)) < 0.01);
    for (let i = 1; i < s.length; i++) assert.ok(s[i].km > s[i - 1].km && P.flatKm(s[i].p, s[i - 1].p) < 1.5);
    assert.ok(P.flatKm(P.pointAt(s, o.path_length_km / 2), s[Math.round(s.length / 2)].p) < 1);
  }
});

test('every corridor is described by contiguous district stretches, with towns and streams in path order', () => {
  for (const o of catalogue.origins) {
    const r = P.describePath(o.line.coordinates, o.path_length_km, find, places, streamPoints);
    assert.ok(r.parts.length >= 1);
    assert.equal(r.parts[0].fromKm, 0); assert.equal(r.parts.at(-1).toKm, o.path_length_km);
    for (let i = 1; i < r.parts.length; i++) { assert.equal(r.parts[i].fromKm, r.parts[i - 1].toKm); assert.notDeepEqual(r.parts[i].names, r.parts[i - 1].names); }
    assert.ok(r.parts.length <= 30, `${o.id}: ${r.parts.length} stretches`);
    for (const part of r.parts) assert.ok(part.names.length >= 1 && part.toKm > part.fromKm);
    for (const list of [r.towns, r.rivers]) for (let i = 1; i < list.length; i++) assert.ok(list[i].km >= list[i - 1].km);
    for (const t of r.towns) assert.ok(t.offKm <= 5 && t.km >= 0 && t.km <= o.path_length_km && t.kind !== 'village');
    assert.equal(new Set(r.rivers.map(x => x.name)).size, r.rivers.length);
    if (r.leavesNepalKm !== null) assert.ok(r.leavesNepalKm > 0 && r.leavesNepalKm <= o.path_length_km);
  }
});

test('the first lake corridor starts in Manang, runs through Lamjung, and follows district borders lower down', () => {
  const o = catalogue.origins.find(x => x.id === 'glof-40746560'), r = P.describePath(o.line.coordinates, o.path_length_km, find, places, streamPoints);
  assert.deepEqual(r.parts[0].names, ['Manang']);
  assert.ok(r.parts.some(p => p.names.length === 1 && p.names[0] === 'Lamjung'));
  assert.ok(r.parts.some(p => p.names.includes('Chitwan') && p.names.includes('Nawalpur')), r.parts.map(p => p.names.join('+')).join(' > '));
});

test('place names are real names, the start is the release point itself, and exits from Nepal are reported', () => {
  assert.ok(places.every(p => !/^OSM settlement/.test(p.name)));
  const describe = id => { const o = catalogue.origins.find(x => x.id === id); return P.describePath(o.line.coordinates, o.path_length_km, find, places, streamPoints); };
  assert.equal(describe('glof-40746560').start.name, 'Manang');
  assert.equal(describe('river-40679245').start, null, 'this river point lies outside Nepal');
  for (const o of catalogue.origins) {
    const r = P.describePath(o.line.coordinates, o.path_length_km, find, places, streamPoints), endsOutside = find(o.line.coordinates.at(-1)) === null;
    assert.equal(r.leavesNepalKm !== null, endsOutside && r.samples.some(sm => find(sm.p)), o.id);
  }
});

test('nearPath keeps a point once, at its nearest distance, and ignores far points', () => {
  const s = P.sample([[84, 28], [84.5, 28]], 49);
  const hit = P.nearPath(s, [{ name: 'on', p: [84.25, 28.01] }, { name: 'far', p: [84.25, 28.5] }], 5);
  assert.equal(hit.length, 1); assert.equal(hit[0].name, 'on');
  assert.ok(Math.abs(hit[0].km - 24.5) < 0.3, String(hit[0].km));
  assert.ok(Math.abs(hit[0].offKm - 1.106) < 0.02, String(hit[0].offKm));   // 0.01 degree of latitude, measured to the line
});
