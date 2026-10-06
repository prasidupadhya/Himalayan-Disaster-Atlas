import generated from './generated/live-air-quality.cjs';
import policyValidator from './generated/openaq-policy.cjs';
import policy from '../../licensing/openaq-providers.json';
import { compiledValidator, validationErrors } from './validation-errors';
import { parseLiveSnapshot, type LiveSnapshot } from './live';
export const AIR_QUALITY_PUBLIC_ENABLED = false;
export const AIR_QUALITY_STATUS = 'DISABLED — provider licence review required';
export interface AirQualityRelease {
  schema_version: '1.0.0'; kind: 'live-air-quality'; profile: 'research'; snapshot: LiveSnapshot;
  station: { location_id: number; sensor_id: number; provider_id: number; provider_name: string; name: string | null; country: 'NP'; coordinates: [number,number]; license_ids: number[]; license_urls: string[]; attribution: string };
  records: Array<{ id: string; original_unit: string; averaging_period_seconds: number | null; period_start: string | null; period_end: string | null; has_flags: boolean | null; reported_value: number | null }>;
  source_responses: Array<{url: string;sha256: string}>;
  aqi: { value: null; standard: null; reason: string };
}
const validate = compiledValidator<AirQualityRelease>(generated);
const validatePolicy = compiledValidator<typeof policy>(policyValidator);
function requireValue(condition: boolean, message: string): asserts condition { if (!condition) throw new Error(message); }
export function parseAirQualityRelease(value: unknown): AirQualityRelease {
  if (!validate(value)) throw new Error(`Invalid air quality release: ${validationErrors(validate.errors)}`);
  const snapshot = parseLiveSnapshot(value.snapshot);
  requireValue(snapshot.feed_id === 'openaq' && !snapshot.is_fixture && snapshot.product_type === 'observation' && snapshot.evidence_type === 'observed' && snapshot.freshness.basis === 'observation', 'Air quality identity/evidence mismatch');
  requireValue(value.records.length === snapshot.records.length && new Set(value.records.map(r=>r.id)).size===value.records.length, 'Air quality record identity mismatch');
  for (const detail of value.records) {
    const record=snapshot.records.find(r=>r.id===detail.id);
    requireValue(!!record && JSON.stringify(record.coordinates)===JSON.stringify(value.station.coordinates), 'Air quality station mismatch');
    requireValue(record.observed_at===detail.period_end, 'Air quality observation time mismatch');
    requireValue((detail.period_start===null)===(detail.period_end===null) && (detail.period_start===null)===(detail.averaging_period_seconds===null), 'Air quality period is incomplete');
    if(detail.period_start!==null) requireValue(Date.parse(detail.period_end!)-Date.parse(detail.period_start)===detail.averaging_period_seconds!*1000 && Date.parse(detail.period_end!)<=Date.parse(snapshot.fetched_at), 'Air quality averaging period mismatch');
    requireValue(detail.reported_value===null || Number.isFinite(detail.reported_value), 'Air quality value must be finite');
    const expected = detail.has_flags===false && detail.averaging_period_seconds!==null ? detail.reported_value : null;
    requireValue(record.measurements.length===1 && record.measurements[0].variable==='pm25' && record.measurements[0].unit==='ug/m3' && record.measurements[0].value===expected, 'Flagged or unknown-period PM2.5 must remain UNKNOWN');
  }
  for(const ref of value.source_responses) { const url=new URL(ref.url); requireValue(url.protocol==='https:' && url.hostname==='api.openaq.org' && !url.username && !url.password, 'Unapproved air quality source'); }
  return value;
}
export function assertAirQualityPublicDisabled() { requireValue(validatePolicy(policy) && AIR_QUALITY_PUBLIC_ENABLED===false && policy.public_enabled===false && policy.enabled_by_default===false && policy.providers.length===0, 'Public air quality must stay disabled pending separate review'); }
