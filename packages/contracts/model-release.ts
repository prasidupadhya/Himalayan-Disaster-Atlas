import generated from './generated/model-release.cjs';
import { compiledValidator, validationErrors } from './validation-errors';

/** Model/context releases introduced from Feature 48. Semantics mirror pipelines/atlas_pipeline/model_release.py. */
export type ModelReleaseType = 'population-grid' | 'corridor-catalogue' | 'gmpe-model' | 'climate-context' | 'terrain-context' | 'evidence-corpus' | 'gated-policy';
export interface ModelArtifact { path: string; sha256: string; byte_size: number; media_type: 'application/json' | 'application/json+gzip' | 'text/plain' }
export interface ModelInput { dataset_id: string; dataset_version: string; source: string; manifest_path: string | null; sha256: string | null; source_url?: string }
export interface ModelRelease {
  schema_version: '1.0.0'; kind: 'model-release'; release_type: ModelReleaseType;
  metadata: {
    dataset_id: string; dataset_name: string; dataset_version: string; source: string; source_url: string | null; license: string; license_url: string | null;
    attribution: string; observation_date: string | null; publication_date: string | null; retrieval_date: string; processing_date: string; processing_version: string;
    method: string; evidence_type: 'observed' | 'derived' | 'estimated' | 'modelled' | 'historical' | 'unknown'; status: string; is_fixture: boolean;
    limitations: string[]; uncertainty: string; spatial_coverage: { description: string; bbox: number[] }; temporal_coverage: { start: string | null; end: string | null };
    update_frequency?: 'static' | 'periodic' | 'operational'; stale_after?: string | null;
  };
  inputs: ModelInput[]; artifacts: Record<string, ModelArtifact>; summary: Record<string, unknown>;
}
const validate = compiledValidator<ModelRelease>(generated);
function require(condition: boolean, message: string): asserts condition { if (!condition) throw new Error(message); }

export function parseModelRelease(value: unknown, expected?: { id: string; version: string; type: ModelReleaseType }): ModelRelease {
  if (!validate(value)) throw new Error(`Invalid model release: ${validationErrors(validate.errors)}`);
  if (expected) require(value.metadata.dataset_id === expected.id && value.metadata.dataset_version === expected.version && value.release_type === expected.type, 'Model release identity mismatch');
  for (const [name, artifact] of Object.entries(value.artifacts)) require(artifact.path.startsWith(`/data/${value.metadata.dataset_id}/${value.metadata.dataset_version}/`), `Artifact outside release: ${name}`);
  return value;
}

// ---------- Population grid (Feature 48) ----------
export interface PopulationGrid {
  format: 'atlas-population-grid@1'; unit: 'people per cell'; west: number; north: number; cell_degree: number; columns: number; rows: number;
  outside_meaning: string; cells: Array<[number, Array<[number, number[]]>]>;
}
export interface PopulationCells { grid: PopulationGrid; count: number; total: number; index: Map<number, number> }
/** Row-major sparse index row*columns+col -> people. Absent cells are UNKNOWN (outside Nepal), never zero. */
export function parsePopulationGrid(value: unknown, summary: { browser_grid_total: number; browser_grid: { nepal_cells: number } }): PopulationCells {
  const grid = value as PopulationGrid;
  require(!!grid && grid.format === 'atlas-population-grid@1' && grid.unit === 'people per cell', 'Unsupported population grid');
  require(Number.isInteger(grid.columns) && Number.isInteger(grid.rows) && grid.columns > 0 && grid.rows > 0 && grid.cell_degree > 0, 'Invalid population lattice');
  const index = new Map<number, number>();
  let total = 0, previous = -1;
  for (const [row, segments] of grid.cells) {
    require(Number.isInteger(row) && row > previous && row < grid.rows, 'Population rows must increase');
    previous = row; let end = -1;
    for (const [start, values] of segments) {
      require(Number.isInteger(start) && start > end && start + values.length <= grid.columns && values.length > 0, 'Invalid population segment');
      values.forEach((v, i) => { require(Number.isFinite(v) && v >= 0, 'Population cells must be finite and nonnegative'); index.set(row * grid.columns + start + i, v); total += v; });
      end = start + values.length;
    }
  }
  require(index.size === summary.browser_grid.nepal_cells, 'Population cell count differs from release summary');
  require(Math.abs(Math.round(total * 100) / 100 - summary.browser_grid_total) < 0.011, 'Population total differs from release summary');
  return { grid, count: index.size, total, index };
}
export function cellCentre(grid: PopulationGrid, key: number): [number, number] {
  const row = Math.floor(key / grid.columns), col = key % grid.columns;
  return [grid.west + (col + 0.5) * grid.cell_degree, grid.north - (row + 0.5) * grid.cell_degree];
}

// ---------- Corridor catalogue (Feature 49) ----------
export interface CorridorExposure { area_km2: number; population_known: number | null; population_total: number | null; unknown_area_km2: number; unique_assets: number; categories: Record<string, number> }
export interface CorridorCheckpoint { requested_km: number | null; prefix_km: number; reach_count: number; end_coordinates: [number, number]; by_width: Record<string, CorridorExposure> }
export interface CorridorOrigin {
  id: string; kind: 'glof-release-point' | 'river-entry-point'; start_reach: string; start_coordinates: [number, number];
  path_reaches: string[]; path_lengths_km: number[]; path_length_km: number; termination: 'source_outlet' | 'coverage_exit'; next_unavailable_reach: string | null;
  link_distance_m?: number; lake?: { glo_id: string; area_km2: number; basin: string; connectivity: string; elevation_mean_m: number | null; longitude: number; latitude: number; dataset: string };
  outlet?: string; outlet_upstream_area_km2?: number;
  gazetteer_hint: { name: string; geonames_id: string; distance_m: number; meaning: string } | null;
  line: GeoJSON.Geometry; checkpoints: CorridorCheckpoint[];
}
export interface CorridorCatalogue { format: 'atlas-flood-corridors@1'; method: string; widths_m: number[]; checkpoints_km: number[]; categories: string[]; origins: CorridorOrigin[]; meaning: string }
export function parseCorridorCatalogue(value: unknown, originCount: number): CorridorCatalogue {
  const c = value as CorridorCatalogue;
  require(!!c && c.format === 'atlas-flood-corridors@1' && Array.isArray(c.origins) && c.origins.length === originCount, 'Unsupported corridor catalogue');
  require(c.widths_m.length > 0 && c.widths_m.every((w, i) => w > 0 && (i === 0 || w > c.widths_m[i - 1])), 'Corridor widths must increase');
  const ids = new Set<string>();
  for (const o of c.origins) {
    require(!ids.has(o.id), 'Duplicate corridor origin'); ids.add(o.id);
    require(o.path_reaches.length === o.path_lengths_km.length && o.path_reaches.length > 0, 'Corridor path arrays differ');
    require(o.path_lengths_km.every(l => Number.isFinite(l) && l >= 0), 'Invalid reach length');
    require(Math.abs(o.path_lengths_km.reduce((a, b) => a + b, 0) - o.path_length_km) < 0.01, 'Corridor path length differs from reach sum');
    let previous = -1;
    for (const row of o.checkpoints) {
      require(row.reach_count >= 1 && row.reach_count <= o.path_reaches.length && row.prefix_km >= previous, 'Invalid corridor checkpoint');
      require(Array.isArray(row.end_coordinates) && row.end_coordinates.length === 2 && row.end_coordinates.every(Number.isFinite), 'Checkpoint end coordinate missing');
      previous = row.prefix_km;
      for (const w of c.widths_m) {
        const e = row.by_width[String(w)];
        require(!!e && e.area_km2 > 0 && e.unknown_area_km2 >= 0 && e.unique_assets >= 0, 'Invalid corridor exposure');
        require(e.population_total === null || e.unknown_area_km2 === 0, 'A total population requires zero unknown area');
      }
    }
  }
  return c;
}

// ---------- Gridded climate context (Features 54-55) ----------
export type SpiClassId = 'extremely-dry' | 'severely-dry' | 'moderately-dry' | 'near-normal' | 'moderately-wet' | 'severely-wet' | 'extremely-wet';
export interface ClimateRecent {
  precip_mm_day: number; precip_anomaly_mm_day: number; precip_percent_of_normal: number | null;
  snowfall_mm_day: number; snow_depth_cm: number; snow_depth_anomaly_cm: number; snow_cover_fraction: number; snow_cover_anomaly: number;
  tmax_c: number; tmax_anomaly_c: number; tmax_z: number | null; precip_3mo_mm: number; spi3: number; spi3_class: SpiClassId;
}
export interface ClimateCell {
  id: string; lat: number; lon: number; bounds: [number, number, number, number]; nepal_area_km2: number; cell_area_km2: number;
  normals: Record<'PRECTOTCORR' | 'PRECSNOLAND' | 'SNODP' | 'FRSNO' | 'T2M_MAX', number[]>; tmax_baseline_std_c: Array<number | null>;
  spi3_fit: Array<{ alpha: number; beta: number; q: number; n: number }>; recent: ClimateRecent[];
}
export interface ClimateContext {
  format: 'atlas-power-context@1'; baseline: [number, number]; recent_months: string[]; latest_month: string;
  spi_classes: Array<{ id: SpiClassId; min: number | null; max: number | null; label: string }>;
  variables: Record<string, { unit: string; label: string }>; cells: ClimateCell[];
  national: Array<{ month: string; precip_anomaly_mm_day: number; tmax_anomaly_c: number; spi3_area_share: Record<SpiClassId, number> }>;
}
export function parseClimateContext(value: unknown, summary: { cells: number; latest_month: string }): ClimateContext {
  const c = value as ClimateContext;
  require(!!c && c.format === 'atlas-power-context@1' && Array.isArray(c.cells) && c.cells.length === summary.cells && c.latest_month === summary.latest_month, 'Unsupported climate context');
  require(c.recent_months.length === 12 && c.recent_months[11] === c.latest_month && c.national.length === 12, 'Climate months differ');
  const ids = new Set<string>();
  for (const cell of c.cells) {
    require(!ids.has(cell.id) && cell.nepal_area_km2 > 0 && cell.recent.length === 12, 'Invalid climate cell'); ids.add(cell.id);
    for (const row of cell.recent) require(row.precip_mm_day >= 0 && row.snow_cover_fraction >= 0 && row.snow_cover_fraction <= 1 && Number.isFinite(row.spi3), 'Climate value outside physical bounds');
  }
  for (const row of c.national) require(Math.abs(Object.values(row.spi3_area_share).reduce((a, b) => a + b, 0) - 1) < 1e-3, 'SPI shares must sum to 1');
  return c;
}

// ---------- District terrain steepness (Feature 53) ----------
export interface DistrictSteepness {
  district_id: string; name: string; province: string; province_pcode: string; area_km2: number; boundary_area_km2: number | null;
  slope_class_share: Record<'0-5' | '5-15' | '15-30' | '30-45' | '45+', number>; slope_mean_deg: number; slope_median_deg: number;
  share_steeper_than_30_deg: number; elevation_mean_m: number; elevation_min_m: number; elevation_max_m: number;
}
export interface TerrainSteepness { format: 'atlas-terrain-steepness@1'; slope_classes: Array<{ id: string; min: number; max: number }>; districts: DistrictSteepness[]; national_slope_class_share: Record<string, number>; method: string }
export function parseTerrainSteepness(value: unknown, summary: { districts: number }): TerrainSteepness {
  const t = value as TerrainSteepness;
  require(!!t && t.format === 'atlas-terrain-steepness@1' && t.districts.length === summary.districts, 'Unsupported terrain context');
  for (const d of t.districts) require(Math.abs(Object.values(d.slope_class_share).reduce((a, b) => a + b, 0) - 1) < 1e-3 && d.share_steeper_than_30_deg >= 0 && d.share_steeper_than_30_deg <= 1, 'Invalid district steepness');
  return t;
}
