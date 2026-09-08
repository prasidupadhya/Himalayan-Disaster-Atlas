import type { Dataset } from '../../../packages/contracts';
import type { CompareEntity, CompareMetric, CompareEntityType } from '../../../packages/contracts/compare';

type Feature = Dataset['collection']['features'][number];

function metric(key: string, label: string, value: number | null | undefined, unit: string, compatibility: string | null, basis: CompareMetric['basis'] = 'source', note?: string): CompareMetric {
  return { key, label, value: value ?? null, unit, compatibility, basis, note };
}

function provenance(dataset: Dataset, featureDate: string | null) {
  const metadata = dataset.metadata;
  return {
    dataset_id: metadata.dataset_id,
    dataset_version: metadata.dataset_version,
    source: metadata.source,
    observation_date: metadata.observation_date,
    temporal_coverage: metadata.temporal_coverage,
    spatial_resolution: metadata.spatial_resolution.value === null ? 'UNKNOWN' : `${metadata.spatial_resolution.value} ${metadata.spatial_resolution.unit}`,
    evidence_type: metadata.evidence_type,
    feature_date: featureDate,
  };
}

export function buildCompareEntity(dataset: Dataset, feature: Feature): CompareEntity | null {
  const p = feature.properties;
  const key = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}:${String(feature.id)}`;
  const sourceId = p.source_id ?? p.pcode ?? String(feature.id);
  let type: CompareEntityType;
  let compatibility: string;
  let metrics: CompareMetric[];
  let featureDate: string | null = null;

  if (p.admin_level !== undefined) {
    if (p.admin_level !== 2) return null;
    type = 'district'; compatibility = 'cod-ab-v02-district'; featureDate = p.valid_from ?? null;
    metrics = [metric('source_area', 'Source area', p.value, 'km²', 'cod-ab-source-area-km2')];
  } else if (p.entity_type === 'mountain') {
    type = 'mountain'; compatibility = 'geonames-mountain'; featureDate = p.source_modified ?? null;
    metrics = [metric('elevation', 'Source summit elevation', p.value, 'm', 'geonames-elevation-m')];
  } else if (p.entity_type === 'river') {
    type = 'river'; compatibility = 'fao-hydrorivers-reach';
    metrics = [
      metric('average_discharge', 'Average discharge', p.average_discharge_m3s, 'm³/s', 'hydrorivers-average-discharge-m3s'),
      metric('reach_length', 'Reach length', p.length_km, 'km', 'hydrorivers-reach-length-km'),
      metric('catchment_area', 'Catchment area', p.catchment_area_km2, 'km²', 'hydrorivers-catchment-area-km2'),
      metric('upstream_area', 'Upstream area', p.upstream_area_km2, 'km²', 'hydrorivers-upstream-area-km2'),
    ];
  } else if (p.entity_type === 'glacier') {
    type = 'glacier'; compatibility = 'rgi7-glacier'; featureDate = p.outline_date ?? null;
    metrics = [
      metric('source_area', 'Source area', p.area_km2, 'km²', 'rgi7-glacier-area-km2'),
      metric('elevation_min', 'Minimum elevation', p.elevation_min_m, 'm', 'rgi7-elevation-m'),
      metric('elevation_mean', 'Mean elevation', p.elevation_mean_m, 'm', 'rgi7-elevation-m'),
      metric('elevation_max', 'Maximum elevation', p.elevation_max_m, 'm', 'rgi7-elevation-m'),
    ];
  } else if (p.entity_type === 'glacial_lake') {
    type = 'glacial_lake'; compatibility = 'glo-v1.02-lake'; featureDate = p.inventory_period ?? null;
    metrics = [
      metric('mapped_extent', 'Dissolved maximum mapped extent', p.area_km2, 'km²', 'glo-max-mapped-extent-2017-2024-km2', 'derived'),
      metric('perimeter', 'Perimeter', p.perimeter_km, 'km', 'glo-perimeter-km', 'derived'),
      metric('elevation_mean', 'Mean elevation', p.elevation_mean_m, 'm', 'glo-elevation-m', 'derived'),
      metric('expansion_rate', 'Expansion rate', p.expansion_rate_km2_per_year, 'km²/year', 'glo-expansion-rate-km2-year', 'derived'),
      metric('expansion_uncertainty', 'Expansion uncertainty', p.expansion_uncertainty_km2_per_year, 'km²/year', 'glo-expansion-uncertainty-km2-year', 'derived'),
    ];
  } else if (p.entity_type === 'disaster_event') {
    type = 'disaster_event'; compatibility = 'bipad-reported-event'; featureDate = p.event_time ?? null;
    metrics = [
      metric('deaths', 'Reported deaths', p.reported_deaths, 'count', 'bipad-reported-deaths-count', 'reported'),
      metric('injured', 'Reported injured', p.reported_injured, 'count', 'bipad-reported-injured-count', 'reported'),
      metric('missing', 'Reported missing', p.reported_missing, 'count', 'bipad-reported-missing-count', 'reported'),
      metric('affected', 'Reported affected', p.reported_affected, 'count', 'bipad-reported-affected-count', 'reported'),
    ];
  } else if (p.entity_type === 'earthquake') {
    type = 'earthquake'; compatibility = 'usgs-earthquake'; featureDate = p.event_time ?? null;
    metrics = [
      metric('magnitude', 'Magnitude', p.magnitude, p.magnitude_type ?? 'UNKNOWN', p.magnitude_type ? `usgs-magnitude-${p.magnitude_type}` : null),
      metric('depth', 'Depth', p.depth_km, 'km', 'usgs-hypocentral-depth-km'),
    ];
  } else return null;

  return { key, label: p.name, source_id: sourceId, type, compatibility, metrics, provenance: provenance(dataset, featureDate) };
}
