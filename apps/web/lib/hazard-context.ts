import type { ClimateCell, ClimateContext, DistrictSteepness, SpiClassId } from '../../../packages/contracts/model-release';

/**
 * Display scales for /hazards/. Colours were validated for the dark map surface (#14262f): each half of every
 * diverging scale is a single hue with monotone lightness, extremes brightest, and a neutral grey midpoint.
 * Every class also has a text label so identity is never colour-only.
 */
export interface ScaleClass { id: string; label: { en: string; ne: string }; color: string; min: number | null; max: number | null }
export const NEUTRAL = '#4d5d63';
export const UNKNOWN_FILL = '#22343b';

export const SPI_SCALE: ScaleClass[] = [
  { id: 'extremely-dry', label: { en: 'Extremely dry (≤ −2)', ne: 'अत्यन्त सुक्खा (≤ −२)' }, color: '#f0c47a', min: null, max: -2 },
  { id: 'severely-dry', label: { en: 'Severely dry (−2 to −1.5)', ne: 'धेरै सुक्खा (−२ देखि −१.५)' }, color: '#c9923f', min: -2, max: -1.5 },
  { id: 'moderately-dry', label: { en: 'Moderately dry (−1.5 to −1)', ne: 'मध्यम सुक्खा (−१.५ देखि −१)' }, color: '#9a6a2c', min: -1.5, max: -1 },
  { id: 'near-normal', label: { en: 'Near normal (−1 to 1)', ne: 'सामान्य नजिक (−१ देखि १)' }, color: NEUTRAL, min: -1, max: 1 },
  { id: 'moderately-wet', label: { en: 'Moderately wet (1 to 1.5)', ne: 'मध्यम भिजेको (१ देखि १.५)' }, color: '#2b8a80', min: 1, max: 1.5 },
  { id: 'severely-wet', label: { en: 'Severely wet (1.5 to 2)', ne: 'धेरै भिजेको (१.५ देखि २)' }, color: '#47b3a5', min: 1.5, max: 2 },
  { id: 'extremely-wet', label: { en: 'Extremely wet (≥ 2)', ne: 'अत्यन्त भिजेको (≥ २)' }, color: '#8fe0d2', min: 2, max: null },
];
export const PRECIP_SCALE: ScaleClass[] = [
  { id: 'lt50', label: { en: '< 50% of normal', ne: 'सामान्यको ५०% भन्दा कम' }, color: '#f0c47a', min: null, max: 50 },
  { id: '50-75', label: { en: '50–75%', ne: '५०–७५%' }, color: '#c9923f', min: 50, max: 75 },
  { id: '75-90', label: { en: '75–90%', ne: '७५–९०%' }, color: '#9a6a2c', min: 75, max: 90 },
  { id: '90-110', label: { en: '90–110% (near normal)', ne: '९०–११०% (सामान्य नजिक)' }, color: NEUTRAL, min: 90, max: 110 },
  { id: '110-125', label: { en: '110–125%', ne: '११०–१२५%' }, color: '#2b8a80', min: 110, max: 125 },
  { id: '125-150', label: { en: '125–150%', ne: '१२५–१५०%' }, color: '#47b3a5', min: 125, max: 150 },
  { id: 'gt150', label: { en: '> 150% of normal', ne: 'सामान्यको १५०% भन्दा बढी' }, color: '#8fe0d2', min: 150, max: null },
];
export const TMAX_SCALE: ScaleClass[] = [
  { id: 'much-cooler', label: { en: '≤ −1.5 °C', ne: '≤ −१.५ °C' }, color: '#9cc9ff', min: null, max: -1.5 },
  { id: 'cooler', label: { en: '−1.5 to −0.5 °C', ne: '−१.५ देखि −०.५ °C' }, color: '#3f73b0', min: -1.5, max: -0.5 },
  { id: 'near', label: { en: '−0.5 to 0.5 °C (near normal)', ne: '−०.५ देखि ०.५ °C (सामान्य नजिक)' }, color: NEUTRAL, min: -0.5, max: 0.5 },
  { id: 'warmer', label: { en: '0.5 to 1.5 °C', ne: '०.५ देखि १.५ °C' }, color: '#b8692f', min: 0.5, max: 1.5 },
  { id: 'much-warmer', label: { en: '≥ 1.5 °C', ne: '≥ १.५ °C' }, color: '#f5a86b', min: 1.5, max: null },
];
export const SNOW_SCALE: ScaleClass[] = [
  { id: 'much-less', label: { en: '≤ −10 points less cover', ne: '≤ −१० अंक कम हिउँ' }, color: '#f0c47a', min: null, max: -0.1 },
  { id: 'less', label: { en: '−10 to −2 points', ne: '−१० देखि −२ अंक' }, color: '#9a6a2c', min: -0.1, max: -0.02 },
  { id: 'near', label: { en: '±2 points (near normal)', ne: '±२ अंक (सामान्य नजिक)' }, color: NEUTRAL, min: -0.02, max: 0.02 },
  { id: 'more', label: { en: '2 to 10 points more', ne: '२ देखि १० अंक बढी' }, color: '#3f73b0', min: 0.02, max: 0.1 },
  { id: 'much-more', label: { en: '≥ 10 points more cover', ne: '≥ १० अंक बढी हिउँ' }, color: '#9cc9ff', min: 0.1, max: null },
];
export const STEEP_SCALE: ScaleClass[] = [
  { id: 'lt10', label: { en: '< 10% of area steeper than 30°', ne: '३०° भन्दा भिरालो क्षेत्र १०% भन्दा कम' }, color: '#7a4a1c', min: null, max: 0.1 },
  { id: '10-25', label: { en: '10–25%', ne: '१०–२५%' }, color: '#a8642a', min: 0.1, max: 0.25 },
  { id: '25-40', label: { en: '25–40%', ne: '२५–४०%' }, color: '#d08a45', min: 0.25, max: 0.4 },
  { id: '40-55', label: { en: '40–55%', ne: '४०–५५%' }, color: '#eeb978', min: 0.4, max: 0.55 },
  { id: 'ge55', label: { en: '≥ 55%', ne: '≥ ५५%' }, color: '#ffe3bd', min: 0.55, max: null },
];

/** Lower bound inclusive, upper bound exclusive; null is UNKNOWN (never a class). */
export function classify(scale: ScaleClass[], value: number | null): ScaleClass | null {
  if (value === null || !Number.isFinite(value)) return null;
  return scale.find(c => (c.min === null || value >= c.min) && (c.max === null || value < c.max)) ?? null;
}

export type ClimateView = 'spi3' | 'precip' | 'tmax' | 'snow';
export const CLIMATE_VIEWS: Record<ClimateView, { scale: ScaleClass[]; value: (cell: ClimateCell, month: number) => number | null }> = {
  spi3: { scale: SPI_SCALE, value: (c, m) => c.recent[m].spi3 },
  precip: { scale: PRECIP_SCALE, value: (c, m) => c.recent[m].precip_percent_of_normal },
  tmax: { scale: TMAX_SCALE, value: (c, m) => c.recent[m].tmax_anomaly_c },
  snow: { scale: SNOW_SCALE, value: (c, m) => c.recent[m].snow_cover_anomaly },
};

/** Area-weighted (Nepal share of each cell) national mean of a recent-month field; null when no cell has a value. */
export function nationalMean(context: ClimateContext, month: number, pick: (cell: ClimateCell) => number | null) {
  let weighted = 0, area = 0;
  for (const cell of context.cells) { const v = pick(cell); if (v === null || !Number.isFinite(v)) continue; weighted += v * cell.nepal_area_km2; area += cell.nepal_area_km2; }
  return area > 0 ? weighted / area : null;
}
/** National monthly precipitation (mm/day) and its 1991–2020 normal for each of the recent months. */
export function nationalPrecipSeries(context: ClimateContext) {
  return context.recent_months.map((month, m) => {
    const calendar = Number(month.slice(5)) - 1;
    return { month, value: nationalMean(context, m, c => c.recent[m].precip_mm_day)!, normal: nationalMean(context, m, c => c.normals.PRECTOTCORR[calendar])! };
  });
}
export function spiShare(context: ClimateContext, month: number): Array<{ id: SpiClassId; share: number }> {
  return SPI_SCALE.map(c => ({ id: c.id as SpiClassId, share: context.national[month].spi3_area_share[c.id as SpiClassId] ?? 0 }));
}
export function steepestDistricts(rows: DistrictSteepness[], n = 10) {
  return [...rows].sort((a, b) => b.share_steeper_than_30_deg - a.share_steeper_than_30_deg || a.name.localeCompare(b.name)).slice(0, n);
}
/** Cell footprint polygon (lon/lat). */
export function cellPolygon(cell: ClimateCell): GeoJSON.Polygon {
  const [w, s, e, n] = cell.bounds;
  return { type: 'Polygon', coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]] };
}
export function monthLabel(month: string, lang: 'en' | 'ne') {
  const [y, m] = month.split('-').map(Number);
  const en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const ne = ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'];
  return lang === 'en' ? `${en[m - 1]} ${y}` : `${ne[m - 1]} ${String(y).replace(/[0-9]/g, d => '०१२३४५६७८९'[Number(d)])}`;
}
/** A periodic snapshot is STALE once its release stale_after instant has passed (viewer clock). */
export function freshness(staleAfter: string | null, now = Date.now()): 'CURRENT SNAPSHOT' | 'STALE' | 'UNKNOWN' {
  if (!staleAfter) return 'UNKNOWN';
  const t = Date.parse(staleAfter);
  return Number.isFinite(t) ? (now < t ? 'CURRENT SNAPSHOT' : 'STALE') : 'UNKNOWN';
}
