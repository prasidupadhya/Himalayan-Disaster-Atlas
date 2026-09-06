import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { FeatureCollection, Geometry } from 'geojson';
import schema from '../../schemas/dataset.schema.json';

export type DataStatus = 'VERIFIED_SOURCE' | 'SATELLITE_DERIVED' | 'ATLAS_DERIVED' | 'ESTIMATED' | 'MODELLED' | 'HISTORICAL' | 'UNKNOWN';
export type EvidenceType = 'observed' | 'derived' | 'estimated' | 'modelled' | 'historical' | 'unknown';
export type Unit = 'm' | 'm2' | 'm3' | 'm3/s' | 'mm' | 'degC' | 'person';
export interface Metadata {
  schema_version: '1.0.0'; dataset_id: string; dataset_name: string; dataset_version: string;
  source: string; source_url: string | null; license: string; license_url: string | null; attribution: string;
  observation_date: string | null; publication_date: string | null; retrieval_date: string; processing_date: string;
  processing_version: string; method: string; spatial_resolution: { value: number | null; unit: 'm' | 'degree' | null };
  temporal_resolution: string | null; spatial_coverage: { description: string; bbox: [number, number, number, number] };
  temporal_coverage: { start: string | null; end: string | null }; crs: 'OGC:CRS84'; status: DataStatus;
  evidence_type: EvidenceType; is_fixture: boolean; limitations: string[]; uncertainty: string;
  update_frequency: 'static' | 'periodic' | 'operational'; stale_after: string | null;
  artifact: { path: string; format: 'GeoJSON'; sha256: string; byte_size: number };
}
export interface FeatureProperties {
  dataset_id: string; dataset_version: string; name: string; is_fixture: boolean; value: number | null; unit: Unit | null;
}
export type AtlasCollection = FeatureCollection<Exclude<Geometry, { type: 'GeometryCollection' }>, FeatureProperties>;
export interface Dataset { metadata: Metadata; collection: AtlasCollection }
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile<Dataset>(schema);

function coordinates(value: unknown): number[][] {
  const items = value as unknown[];
  return typeof items[0] === 'number' ? [items as number[]] : items.flatMap(coordinates);
}

/** Browser safety checks complement the full offline Shapely topology gate. */
export function parseDataset(input: unknown): Dataset {
  if (!validate(input)) throw new Error(`Invalid dataset: ${ajv.errorsText(validate.errors)}`);
  const { metadata: m, collection } = input;
  const [west, south, east, north] = m.spatial_coverage.bbox;
  if (!(west >= -180 && west < east && east <= 180 && south >= -90 && south < north && north <= 90)) throw new Error('Invalid coverage bounds');
  if (Date.parse(m.processing_date) < Date.parse(m.retrieval_date)) throw new Error('Processing precedes retrieval');
  const { start, end } = m.temporal_coverage;
  if (Boolean(start) !== Boolean(end) || (start && end && Date.parse(start) > Date.parse(end))) throw new Error('Invalid temporal coverage');
  if ((m.spatial_resolution.value === null) !== (m.spatial_resolution.unit === null)) throw new Error('Resolution needs value and unit');
  if (m.update_frequency !== 'static' && !m.stale_after) throw new Error('Updating datasets need a stale deadline');
  if (m.stale_after && Date.parse(m.stale_after) < Date.parse(m.retrieval_date)) throw new Error('Stale deadline precedes retrieval');
  if (m.artifact.path !== `/data/${m.dataset_id}/${m.dataset_version}/features.geojson`) throw new Error('Artifact identity mismatch');
  const ids = new Set();
  for (const f of collection.features) {
    if (ids.has(f.id)) throw new Error('Duplicate feature identifier');
    ids.add(f.id);
    if (f.properties.dataset_id !== m.dataset_id || f.properties.dataset_version !== m.dataset_version || f.properties.is_fixture !== m.is_fixture) throw new Error('Feature identity mismatch');
    if (f.properties.value !== null && f.properties.unit === null) throw new Error('Measurements require units');
    if (coordinates(f.geometry.coordinates).some(([lon, lat]) => lon < west || lon > east || lat < south || lat > north)) throw new Error('Geometry outside coverage');
    const rings = f.geometry.type === 'Polygon' ? f.geometry.coordinates : f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates.flat() : [];
    if (rings.some(r => r[0][0] !== r.at(-1)![0] || r[0][1] !== r.at(-1)![1])) throw new Error('Unclosed polygon');
    if (f.geometry.type === 'LineString' && new Set(f.geometry.coordinates.map(p => p.join(','))).size < 2) throw new Error('Degenerate line');
  }
  return input;
}

export function isStale(metadata: Metadata, now = Date.now()): boolean {
  return metadata.stale_after !== null && now >= Date.parse(metadata.stale_after);
}
export function formatMeasurement(value: number | null, unit: Unit | null): string {
  return value === null ? 'UNKNOWN' : `${value.toLocaleString('en-US')}${unit ? ` ${unit}` : ''}`;
}
