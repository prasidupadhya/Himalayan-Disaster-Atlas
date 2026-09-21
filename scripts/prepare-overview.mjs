import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import validate from '../packages/contracts/generated/dataset.cjs';
const root = fileURLToPath(new URL('..', import.meta.url));
export function prepareOverview({ check = false } = {}) {
  const metadata = JSON.parse(readFileSync(resolve(root, 'apps/web/public/data/nepal-admin-provinces/2.0.1/manifest.json'), 'utf8'));
  const bytes = readFileSync(resolve(root, `apps/web/public${metadata.artifact.path}`));
  if (createHash('sha256').update(bytes).digest('hex') !== metadata.artifact.sha256) throw new Error('Overview source checksum mismatch');
  const collection = JSON.parse(gunzipSync(bytes).toString('utf8'));
  if (!validate({ metadata, collection })) throw new Error('Overview source failed the central dataset schema');
  const mercator = latitude => Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360)) * 180 / Math.PI;
  const [west, south, east, north] = metadata.spatial_coverage.bbox;
  const scale = Math.min(800 / (east - west), 410 / (mercator(north) - mercator(south)));
  const project = ([longitude, latitude]) => [450 + (longitude - (west + east) / 2) * scale, 250 - (mercator(latitude) - (mercator(north) + mercator(south)) / 2) * scale];
  const overview = {
    source: `${metadata.dataset_id}@${metadata.dataset_version}`, source_sha256: metadata.artifact.sha256,
    longitudeLines: [81, 83, 85, 87].map(value => ({ value, x: project([value, north])[0] })),
    latitudeLines: [27, 28, 29, 30].map(value => ({ value, y: project([west, value])[1] })),
    provinces: collection.features.map(({ geometry, properties: p }) => {
      if (!['Polygon', 'MultiPolygon'].includes(geometry.type) || !Number.isFinite(p.label_longitude) || !Number.isFinite(p.label_latitude)) throw new Error('Overview needs polygon geometry and source label positions');
      const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
      const path = polygons.map(polygon => polygon.map(ring => ring.map((position, i) => `${i ? 'L' : 'M'}${project(position).map(value => value.toFixed(1)).join(',')}`).join('') + 'Z').join('')).join('');
      const [x, y] = project([p.label_longitude, p.label_latitude]);
      return { pcode: p.pcode, name: p.name, path, x, y };
    }),
  };
  const path = resolve(root, 'apps/web/generated/nepal-overview.json'); const content = JSON.stringify(overview) + '\n';
  if (check) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== content) throw new Error('Overview is stale. Run npm run ui:generate and review the presentation change.');
  } else writeFileSync(path, content);
  console.log(`${check ? 'Verified' : 'Prepared'} source-backed province overview.`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareOverview({ check: process.argv.includes('--check') });
