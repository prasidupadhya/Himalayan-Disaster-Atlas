import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { expect, it } from 'vitest';
import { parseExposure, parseExposureSpatial } from '../../packages/contracts/exposure';

const base = 'data/releases/exposure-trace-40669746-250m/1.0.0';
const load = () => JSON.parse(readFileSync(`${base}/manifest.json`, 'utf8'));
it('validates the real result and its spatial footprint/unique asset identities', () => {
  const result = parseExposure(load());
  expect(result.unique_assets).toBe(124);
  expect(result.population.known_population).toBeCloseTo(18825.515676, 3);
  expect(result.population.total_population).toBeNull();
  expect(result.categories.find(c => c.category === 'building')?.count).toBeNull();
  const spatial = parseExposureSpatial(JSON.parse(gunzipSync(readFileSync(`${base}/spatial.geojson.gz`)).toString()), result);
  expect(spatial.features.filter(f => f.properties.kind === 'footprint')).toHaveLength(1);
});
it('rejects duplicate assets, false complete population totals, and cross-release artifacts', () => {
  let data = load(); data.assets.push(data.assets[0]);
  expect(() => parseExposure(data)).toThrow(/Duplicate/);
  data = load(); data.population.total_population = data.population.known_population;
  expect(() => parseExposure(data)).toThrow(/Unknown population/);
  data = load(); data.artifacts.spatial.path = '/data/exposure-other/1.0.0/spatial.geojson.gz';
  expect(() => parseExposure(data)).toThrow(/identity/);
});
it('rejects unrepresented assets and invalid coordinate reference ranges', () => {
  const result = parseExposure(load());
  const spatial = JSON.parse(gunzipSync(readFileSync(`${base}/spatial.geojson.gz`)).toString());
  expect(() => parseExposureSpatial({ ...spatial, features: spatial.features.slice(0, 1) }, result)).toThrow(/Incomplete/);
  spatial.features[0].geometry = { type: 'Polygon', coordinates: [[[500000, 3000000], [500001, 3000000], [500001, 3000001], [500000, 3000000]]] };
  expect(() => parseExposureSpatial(spatial, result)).toThrow(/CRS84/);
});
