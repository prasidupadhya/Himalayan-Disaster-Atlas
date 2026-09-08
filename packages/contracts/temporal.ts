import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../schemas/temporal.schema.json';
/** UTC, half-open observation intervals. Publication/retrieval never drive selection. */
export type TemporalProductId = 'water' | 'satellite' | 'climate' | 'events';
export interface TemporalObservation { id: string; start: string; end: string; acquired_at: string | null; published_at: string | null; sensor: string | null; compatibility: string | null; count: number | null }
export interface TemporalProduct { id: TemporalProductId; label: string; dataset_id: string; version: string; source: string; retrieved_at: string; published_at: string | null; resolution: 'instant' | 'day' | 'month'; observations: TemporalObservation[] }
export interface TemporalIndex { schema_version: '1.0.0'; products: TemporalProduct[]; inputs: Array<{ path: string; sha256: string; byte_size: number }>; context: Array<{ dataset_id: string; version: string; observation_date: string | null; coverage: { start: string | null; end: string | null }; resolution: string | null }> }
export interface TemporalSelection { date: string; before: string }
export function utcDay(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(`${value}T00:00:00Z`)) || new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value) throw new Error('Invalid UTC calendar date');
  return value;
}
export function dayInterval(value: string): [string, string] {
  const start = `${utcDay(value)}T00:00:00.000Z`;
  return [start, new Date(Date.parse(start) + 86_400_000).toISOString()];
}
export function observationOnDay(product: TemporalProduct, value: string): TemporalObservation | null {
  const [start, end] = dayInterval(value);
  const matches = product.observations.filter(o => Date.parse(o.start) < Date.parse(end) && Date.parse(o.end) > Date.parse(start));
  if (matches.length > 1) throw new Error('Ambiguous temporal observations; select an explicit product window');
  return matches[0] ?? null;
}
export function canCompare(before: TemporalObservation, after: TemporalObservation): boolean {
  return before.compatibility !== null && before.compatibility === after.compatibility && Date.parse(before.end) <= Date.parse(after.start);
}
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile<TemporalIndex>(schema);
export function validateTemporalIndex(input: unknown): TemporalIndex {
  if (!validate(input)) throw new Error(`Invalid temporal index: ${ajv.errorsText(validate.errors)}`);
  const index = input;
  if (index.schema_version !== '1.0.0' || !Array.isArray(index.products) || index.products.length !== 4 || new Set(index.products.map(p => p.id)).size !== 4) throw new Error('Invalid temporal product inventory');
  const validTimestamp = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?Z$/.test(value) || !Number.isFinite(Date.parse(value))) throw new Error('Temporal timestamps must be UTC');
    utcDay(value.slice(0, 10));
    if (Number(value.slice(11, 13)) > 23 || Number(value.slice(14, 16)) > 59 || Number(value.slice(17, 19)) > 59) throw new Error('Invalid UTC clock time');
  };
  for (const product of index.products) {
    if (!['water', 'satellite', 'climate', 'events'].includes(product.id) || !['instant', 'day', 'month'].includes(product.resolution)) throw new Error('Unsupported temporal resolution/product');
    validTimestamp(product.retrieved_at);
    if (product.published_at !== null) validTimestamp(product.published_at);
    const ids = new Set<string>();
    let previousEnd = -Infinity;
    for (const o of product.observations) {
      validTimestamp(o.start); validTimestamp(o.end);
      if (o.acquired_at !== null) validTimestamp(o.acquired_at);
      if (o.published_at !== null) validTimestamp(o.published_at);
      if (ids.has(o.id) || Date.parse(o.start) < previousEnd || Date.parse(o.start) >= Date.parse(o.end)) throw new Error('Duplicate, overlapping or unordered observation intervals');
      if (o.acquired_at !== null && (Date.parse(o.acquired_at) < Date.parse(o.start) || Date.parse(o.acquired_at) >= Date.parse(o.end))) throw new Error('Acquisition outside observation interval');
      if (product.resolution === 'month' && (o.start.slice(8) !== '01T00:00:00Z' || o.end.slice(8) !== '01T00:00:00Z' || new Date(Date.UTC(Number(o.start.slice(0, 4)), Number(o.start.slice(5, 7)), 1)).getTime() !== Date.parse(o.end))) throw new Error('Monthly interval must represent exactly one whole month');
      if (product.resolution === 'day' && (Date.parse(o.end) - Date.parse(o.start) !== 86_400_000 || !o.start.endsWith('T00:00:00Z'))) throw new Error('Day interval must represent a UTC day');
      ids.add(o.id); previousEnd = Date.parse(o.end);
    }
  }
  return index;
}
