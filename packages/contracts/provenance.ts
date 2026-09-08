import Ajv from 'ajv';
import schema from '../../schemas/provenance.schema.json';

export type ProvenanceCategory = 'Administrative' | 'Terrain' | 'Cryosphere' | 'Hydrology & climate' | 'Hazards & events' | 'Infrastructure' | 'Population' | 'Satellite' | 'Analysis & models' | 'Discovery & evidence' | 'Development';
export type ProvenanceEvidence = 'observed' | 'derived' | 'estimated' | 'modelled' | 'simulated' | 'historical' | 'unknown';
export interface ProvenanceParent { id: string; version: string; source: string; manifest_path: string | null; sha256: string | null }
export interface ProvenanceRecord {
  key: string; id: string; version: string; title: string; category: ProvenanceCategory;
  source: string; source_url: string | null; license: string; license_url: string | null; attribution: string;
  access_date: string | null; observation_date: string | null; publication_date: string | null; processing_date: string | null;
  processing_version: string; method: string; spatial_resolution: string; spatial_coverage: string; temporal_coverage: string;
  limitations: string[]; uncertainty: string; evidence_type: ProvenanceEvidence; status: string; is_fixture: boolean;
  state: 'current' | 'superseded' | 'fixture'; manifest_path: string; manifest_sha256: string;
  artifacts: Array<{ path: string; sha256: string; byte_size: number }>; parents: ProvenanceParent[]; transformations: string[];
  methodology_href: string; source_href: string; map_href: string | null;
}
export interface ProvenanceCatalog { schema_version: '1.0.0'; kind: 'provenance-catalog'; version: '1.0.0'; generated_from_count: number; records: ProvenanceRecord[] }

const ajv = new Ajv({ allErrors: true, strict: true });
const validate = ajv.compile<ProvenanceCatalog>(schema);
export function parseProvenanceCatalog(value: unknown): ProvenanceCatalog {
  if (!validate(value)) throw new Error(`Invalid provenance catalog: ${ajv.errorsText(validate.errors)}`);
  const keys = new Set<string>();
  for (const record of value.records) {
    if (keys.has(record.key)) throw new Error('Duplicate provenance record');
    keys.add(record.key);
    if (record.key !== `${record.id}@${record.version}`) throw new Error('Provenance identity mismatch');
    if (record.is_fixture !== (record.state === 'fixture')) throw new Error('Fixture provenance state mismatch');
    if (new Set(record.artifacts.map(item => item.path)).size !== record.artifacts.length) throw new Error('Duplicate provenance artifact');
    if (record.parents.some(parent => parent.manifest_path !== null && !/^\/data\/.+\/manifest\.json$/.test(parent.manifest_path))) throw new Error('Invalid parent manifest path');
  }
  if (keys.size !== value.generated_from_count) throw new Error('Provenance catalog count mismatch');
  return value;
}

export function currentProductionRecords(catalog: ProvenanceCatalog) {
  return catalog.records.filter(record => record.state === 'current' && !record.is_fixture);
}

export interface ProvenanceFilters {
  query?: string;
  category?: ProvenanceCategory | '';
  source?: string;
  includeNonCurrent?: boolean;
}

function normalize(value: string) {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('en-US').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function filterProvenanceRecords(records: ProvenanceRecord[], filters: ProvenanceFilters) {
  const query = normalize(filters.query ?? '');
  return records.filter(record => {
    if (!filters.includeNonCurrent && (record.state !== 'current' || record.is_fixture)) return false;
    if (filters.category && record.category !== filters.category) return false;
    if (filters.source && record.source !== filters.source) return false;
    if (!query) return true;
    const haystack = normalize(`${record.title} ${record.id} ${record.version} ${record.source} ${record.category} ${record.evidence_type} ${record.status}`);
    return haystack.includes(query);
  }).sort((a, b) => a.category.localeCompare(b.category, 'en') || a.title.localeCompare(b.title, 'en') || b.version.localeCompare(a.version, 'en'));
}
