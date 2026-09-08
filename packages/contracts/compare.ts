export type CompareEntityType = 'district' | 'mountain' | 'river' | 'glacier' | 'glacial_lake' | 'disaster_event' | 'earthquake';

export interface CompareMetric {
  key: string;
  label: string;
  value: number | null;
  unit: string;
  compatibility: string | null;
  basis: 'source' | 'reported' | 'derived' | 'estimated' | 'modelled';
  note?: string;
}

export interface CompareProvenance {
  dataset_id: string;
  dataset_version: string;
  source: string;
  observation_date: string | null;
  temporal_coverage: { start: string | null; end: string | null };
  spatial_resolution: string;
  evidence_type: string;
  feature_date: string | null;
}

export interface CompareEntity {
  key: string;
  label: string;
  source_id: string;
  type: CompareEntityType;
  compatibility: string;
  metrics: CompareMetric[];
  provenance: CompareProvenance;
}

export interface CompareRow {
  key: string;
  label: string;
  unit: string;
  a: number | null;
  b: number | null;
  state: 'comparable' | 'unavailable' | 'blocked';
  reason: string | null;
  basis_a: CompareMetric['basis'] | null;
  basis_b: CompareMetric['basis'] | null;
}

export interface CompareResult {
  state: 'ready' | 'blocked';
  reason: string | null;
  rows: CompareRow[];
}

export function compareEntities(a: CompareEntity, b: CompareEntity): CompareResult {
  if (a.key === b.key) return { state: 'blocked', reason: 'Select two different entities.', rows: [] };
  if (a.type !== b.type) return { state: 'blocked', reason: `Cross-type comparison is unsupported: ${a.type} and ${b.type} use different scientific meanings.`, rows: [] };
  if (a.compatibility !== b.compatibility) return { state: 'blocked', reason: 'These records use incompatible source definitions or comparison families.', rows: [] };

  const keys = Array.from(new Set([...a.metrics.map(metric => metric.key), ...b.metrics.map(metric => metric.key)]));
  const rows = keys.map(key => {
    const left = a.metrics.find(metric => metric.key === key);
    const right = b.metrics.find(metric => metric.key === key);
    const label = left?.label ?? right?.label ?? key;
    const unit = left?.unit ?? right?.unit ?? '';
    if (!left || !right) return { key, label, unit, a: left?.value ?? null, b: right?.value ?? null, state: 'unavailable' as const, reason: 'Metric is not published for both records.', basis_a: left?.basis ?? null, basis_b: right?.basis ?? null };
    if (left.value === null || right.value === null) return { key, label, unit, a: left.value, b: right.value, state: 'unavailable' as const, reason: 'At least one source value is UNKNOWN.', basis_a: left.basis, basis_b: right.basis };
    if (left.unit !== right.unit) return { key, label, unit: `${left.unit} / ${right.unit}`, a: left.value, b: right.value, state: 'blocked' as const, reason: 'Units are incompatible.', basis_a: left.basis, basis_b: right.basis };
    if (!left.compatibility || left.compatibility !== right.compatibility) return { key, label, unit, a: left.value, b: right.value, state: 'blocked' as const, reason: 'Metric meanings are incompatible even though the values may share a unit.', basis_a: left.basis, basis_b: right.basis };
    return { key, label, unit, a: left.value, b: right.value, state: 'comparable' as const, reason: null, basis_a: left.basis, basis_b: right.basis };
  });
  return { state: 'ready', reason: null, rows };
}

export function formatCompareValue(value: number | null, unit: string) {
  return value === null ? 'UNKNOWN' : `${value.toLocaleString('en-US', { maximumFractionDigits: 4 })}${unit ? ` ${unit}` : ''}`;
}
