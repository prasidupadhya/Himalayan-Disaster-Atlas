import type { Dataset } from '../../../packages/contracts';

export type LocationCategory = 'river' | 'glacier' | 'glacial_lake' | 'hydropower' | 'infrastructure' | 'event' | 'earthquake' | 'flood' | 'landslide';

export interface LocationCandidate {
  key: string;
  category: LocationCategory;
  label: string;
  dataset_id: string;
  dataset_version: string;
  source_id: string;
  source_date: string | null;
  geometry: Dataset['collection']['features'][number]['geometry'];
  detail_href: string | null;
  context: string;
}

export interface NearbyRule { radius_km: number; limit: number }

export const NEARBY_RULES: Record<LocationCategory, NearbyRule> = {
  river: { radius_km: 10, limit: 3 },
  glacier: { radius_km: 25, limit: 5 },
  glacial_lake: { radius_km: 25, limit: 5 },
  hydropower: { radius_km: 25, limit: 5 },
  infrastructure: { radius_km: 10, limit: 5 },
  event: { radius_km: 25, limit: 10 },
  earthquake: { radius_km: 50, limit: 10 },
  flood: { radius_km: 25, limit: 10 },
  landslide: { radius_km: 25, limit: 10 },
};

export function validLocation(longitude: number, latitude: number) {
  return Number.isFinite(longitude) && Number.isFinite(latitude) && longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;
}

export function haversineKm(a: [number, number], b: [number, number]) {
  const radians = Math.PI / 180;
  const lat1 = a[1] * radians;
  const lat2 = b[1] * radians;
  const dLat = (b[1] - a[1]) * radians;
  const dLon = (b[0] - a[0]) * radians;
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371.0088 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function projected(point: [number, number], origin: [number, number]) {
  const radians = Math.PI / 180;
  const cos = Math.cos(origin[1] * radians);
  return [(point[0] - origin[0]) * 111.320 * cos, (point[1] - origin[1]) * 110.574] as [number, number];
}

function segmentDistanceKm(point: [number, number], start: [number, number], end: [number, number]) {
  const a = projected(start, point);
  const b = projected(end, point);
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length2 = dx * dx + dy * dy;
  if (!length2) return Math.hypot(a[0], a[1]);
  const t = Math.max(0, Math.min(1, -(a[0] * dx + a[1] * dy) / length2));
  return Math.hypot(a[0] + t * dx, a[1] + t * dy);
}

function ringContains(point: [number, number], ring: number[][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function polygonContains(point: [number, number], polygon: number[][][]) {
  if (!polygon.length || !ringContains(point, polygon[0])) return false;
  return !polygon.slice(1).some(ring => ringContains(point, ring));
}

export function pointInGeometry(point: [number, number], geometry: Dataset['collection']['features'][number]['geometry']) {
  if (geometry.type === 'Polygon') return polygonContains(point, geometry.coordinates);
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.some(polygon => polygonContains(point, polygon));
  return false;
}

function lineDistance(point: [number, number], line: number[][]) {
  let best = Number.POSITIVE_INFINITY;
  for (let index = 1; index < line.length; index += 1) best = Math.min(best, segmentDistanceKm(point, line[index - 1] as [number, number], line[index] as [number, number]));
  return best;
}

function polygonDistance(point: [number, number], polygon: number[][][]) {
  if (polygonContains(point, polygon)) return 0;
  return Math.min(...polygon.map(ring => lineDistance(point, ring)));
}

export function distanceToGeometryKm(point: [number, number], geometry: Dataset['collection']['features'][number]['geometry']) {
  if (geometry.type === 'Point') return haversineKm(point, geometry.coordinates as [number, number]);
  if (geometry.type === 'MultiPoint') return Math.min(...geometry.coordinates.map(item => haversineKm(point, item as [number, number])));
  if (geometry.type === 'LineString') return lineDistance(point, geometry.coordinates);
  if (geometry.type === 'MultiLineString') return Math.min(...geometry.coordinates.map(line => lineDistance(point, line)));
  if (geometry.type === 'Polygon') return polygonDistance(point, geometry.coordinates);
  if (geometry.type === 'MultiPolygon') return Math.min(...geometry.coordinates.map(polygon => polygonDistance(point, polygon)));
  return Number.POSITIVE_INFINITY;
}

export function nearbyCandidates(point: [number, number], candidates: LocationCandidate[], category: LocationCategory, rule = NEARBY_RULES[category]) {
  return candidates
    .filter(candidate => candidate.category === category)
    .map(candidate => ({ ...candidate, distance_km: distanceToGeometryKm(point, candidate.geometry) }))
    .filter(candidate => candidate.distance_km <= rule.radius_km)
    .sort((a, b) => a.distance_km - b.distance_km || a.key.localeCompare(b.key))
    .slice(0, rule.limit);
}

export function adminAtPoint(point: [number, number], datasets: Dataset[], level: 1 | 2) {
  const candidates = datasets.flatMap(dataset => dataset.collection.features).filter(feature => feature.properties.admin_level === level && pointInGeometry(point, feature.geometry));
  return candidates.slice().sort((a, b) => String(a.properties.pcode).localeCompare(String(b.properties.pcode)))[0] ?? null;
}

export function candidateFromFeature(dataset: Dataset, feature: Dataset['collection']['features'][number]): LocationCandidate | null {
  const properties = feature.properties;
  const entity = properties.entity_type;
  let category: LocationCategory | null = null;
  if (entity === 'river') category = 'river';
  else if (entity === 'glacier') category = 'glacier';
  else if (entity === 'glacial_lake') category = 'glacial_lake';
  else if (entity === 'hydropower_facility') category = 'hydropower';
  else if (entity === 'infrastructure_asset') category = 'infrastructure';
  else if (entity === 'disaster_event') category = 'event';
  else if (entity === 'earthquake') category = 'earthquake';
  else if (entity === 'flood_event') category = 'flood';
  else if (entity === 'landslide_event') category = 'landslide';
  if (!category || !properties.source_id) return null;

  const label = properties.glacier_name ?? properties.lake_name ?? properties.facility_name ?? properties.asset_name ?? properties.place_name ?? properties.river_name ?? properties.name ?? properties.source_id;
  const sourceDate = properties.outline_date ?? properties.event_time ?? properties.observation_time ?? properties.osm_source_timestamp ?? dataset.metadata.observation_date;
  const detailHref = entity === 'disaster_event' && properties.event_year ? `/events/?year=${properties.event_year}&id=${encodeURIComponent(String(feature.id))}` : null;
  return {
    key: `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}:${String(feature.id)}`,
    category,
    label: label || properties.source_id,
    dataset_id: dataset.metadata.dataset_id,
    dataset_version: dataset.metadata.dataset_version,
    source_id: properties.source_id,
    source_date: sourceDate ?? null,
    geometry: feature.geometry,
    detail_href: detailHref,
    context: category.replaceAll('_', ' '),
  };
}
