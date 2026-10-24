import { useEffect, useRef, useState } from 'react';
import { ADMIN_MANIFESTS, loadDataset } from '../../lib/datasets';
import { buildRoute, toArea, type Area, type NamedPoint, type Route, type RouteInputs } from './route';
import { measure, type LonLat } from './scene-3d';

const RIVER_NAMES = '/data/nepal-river-names/1.0.0/manifest.json';
const SETTLEMENTS = '/data/nepal-osm-settlements/1.0.0/manifest.json';
// Official Nepali province names, keyed by COD-AB P-code.
export const PROVINCE_NE: Record<string, string> = { NP01: 'कोशी', NP02: 'मधेश', NP03: 'बागमती', NP04: 'गण्डकी', NP05: 'लुम्बिनी', NP06: 'कर्णाली', NP07: 'सुदूरपश्चिम' };

export interface ProvinceLabel { name: string; pcode: string; at: LonLat }
export interface DistrictLabel { name: string; province: string | null; at: LonLat }
export interface Gazetteer extends RouteInputs { provinceLabels: ProvinceLabel[]; districtLabels: DistrictLabel[] }

let cache: Promise<Gazetteer> | null = null;

/** Loads the verified boundaries, stream names and settlements once per page; a failure can be retried. */
export function loadGazetteer(): Promise<Gazetteer> {
  cache ??= (async () => {
    const [country, provinces, districts, locals, rivers, places] = await Promise.all([...ADMIN_MANIFESTS.map(m => loadDataset(m)), loadDataset(RIVER_NAMES), loadDataset(SETTLEMENTS)]);
    const areas = (features: GeoJSON.Feature[]) => features.map(toArea).filter((a): a is Area => a !== null);
    const label = (f: GeoJSON.Feature): LonLat | null => { const p = f.properties as Record<string, unknown>; return typeof p.label_longitude === 'number' && typeof p.label_latitude === 'number' ? [p.label_longitude, p.label_latitude] : null; };
    // GeoNames spellings sometimes carry a combining dot after "i" (U+0307), left over from lowercasing "İ"; it is
    // dropped for display. Places without a real name (OSM's "settlement node/…" fallback) are not labelled.
    const display = (name: string) => name.replace(/i\u0307/g, 'i');
    const points = (features: GeoJSON.Feature[], keep: (p: Record<string, unknown>) => string | null): NamedPoint[] => features.flatMap(f => {
      const kind = keep(f.properties as Record<string, unknown>);
      return f.geometry?.type === 'Point' && kind ? [{ name: display(String((f.properties as Record<string, unknown>).name)), coordinates: f.geometry.coordinates as LonLat, kind }] : [];
    });
    return {
      country: areas(country.collection.features as GeoJSON.Feature[]), provinces: areas(provinces.collection.features as GeoJSON.Feature[]),
      districts: areas(districts.collection.features as GeoJSON.Feature[]), locals: areas(locals.collection.features as GeoJSON.Feature[]),
      rivers: points(rivers.collection.features as GeoJSON.Feature[], p => typeof p.name === 'string' && p.name ? String(p.feature_code ?? 'STM') : null),
      places: points(places.collection.features as GeoJSON.Feature[], p => ['city', 'town', 'village'].includes(String(p.asset_subtype)) && typeof p.name === 'string' && p.name && !/^OSM settlement /.test(p.name) ? String(p.asset_subtype) : null),
      provinceLabels: (provinces.collection.features as GeoJSON.Feature[]).flatMap(f => { const at = label(f); return at ? [{ name: String(f.properties?.name), pcode: String(f.properties?.pcode), at }] : []; }),
      districtLabels: (districts.collection.features as GeoJSON.Feature[]).flatMap(f => { const at = label(f); return at ? [{ name: String(f.properties?.name), province: (f.properties?.parent_name as string | null) ?? null, at }] : []; }),
    };
  })();
  cache.catch(() => { cache = null; });
  return cache;
}

const routes = new Map<string, Route>();
/** The route for a scenario path, computed once per path and shared by the playback and the result list. */
export function useRoute(key: string | null, line: LonLat[] | null, pathKm: number | null) {
  const [state, setState] = useState<{ key: string; route: Route | null; failed: boolean } | null>(null);
  const [gazetteer, setGazetteer] = useState<Gazetteer | null>(null);
  // The path is identified by its key; the coordinates may be a fresh array on every render.
  const path = useRef(line);
  useEffect(() => { path.current = line; });
  useEffect(() => {
    if (!key || !pathKm) return;
    let live = true;
    loadGazetteer().then(g => {
      if (!live || !path.current) return;
      if (!routes.has(key)) routes.set(key, buildRoute(measure(path.current), pathKm, g));
      setGazetteer(g); setState({ key, route: routes.get(key)!, failed: false });
    }, () => { if (live) setState({ key, route: null, failed: true }); });
    return () => { live = false; };
  }, [key, pathKm]);
  return { route: state?.key === key ? state.route : null, failed: state?.key === key && state.failed, gazetteer };
}

/** Same data for the earthquake playback, which needs only labels and the epicentre's units. */
export function useGazetteer(enabled: boolean) {
  const [gazetteer, setGazetteer] = useState<Gazetteer | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    loadGazetteer().then(g => { if (live) setGazetteer(g); }, () => undefined);
    return () => { live = false; };
  }, [enabled]);
  return gazetteer;
}
