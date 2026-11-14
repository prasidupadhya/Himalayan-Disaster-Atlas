// Scenario science. Pure functions, no DOM: tested in tests/models.test.mjs.

// ---------- Flood / GLOF release pulse ----------
// A declared release hydrograph translated down a verified river path at declared celerities.
// No attenuation, no routing, no inundation: arrival times only.
export const FLOOD_LIMITS = { volume_m3: [1e3, 5e8], duration_s: [600, 172800], peak_fraction: [0.05, 0.95], celerity_m_s: [0.1, 10] };

export function validateFlood(s) {
  const e = [], within = (v, [a, b]) => Number.isFinite(v) && v >= a && v <= b, L = FLOOD_LIMITS;
  if (!within(s.volume_m3, L.volume_m3)) e.push('volume');
  if (!within(s.duration_s, L.duration_s)) e.push('duration');
  if (!within(s.peak_fraction, L.peak_fraction)) e.push('peak');
  const [lo, mid, hi] = s.celerity_m_s;
  if (![lo, mid, hi].every(v => within(v, L.celerity_m_s)) || !(lo <= mid && mid <= hi)) e.push('celerity');
  return e;
}

/** Source hydrograph. Both shapes conserve volume exactly. */
export function hydrograph(s) {
  const T = s.duration_s;
  if (s.shape === 'rectangular') { const q = s.volume_m3 / T; return { peak_m3_s: q, time_to_peak_s: 0, points: [[0, 0], [0, q], [T, q], [T, 0]] }; }
  const tp = s.peak_fraction * T, qp = 2 * s.volume_m3 / T;
  return { peak_m3_s: qp, time_to_peak_s: tp, points: [[0, 0], [tp, qp], [T, 0]] };
}
export const volumeOf = p => p.slice(1).reduce((v, [t, q], i) => v + (t - p[i][0]) * (q + p[i][1]) / 2, 0);

/** [earliest, central, latest] times in seconds; earliest uses the fastest celerity. */
export function arrivals(s, km) {
  const t = c => 1000 * km / c, [lo, mid, hi] = s.celerity_m_s;
  const front = [t(hi), t(mid), t(lo)], shift = s.shape === 'triangular' ? s.peak_fraction * s.duration_s : 0;
  return { front, peak: front.map(v => v + shift), end: front.map(v => v + s.duration_s) };
}

/** Sensitivity range across the declared corridor half-widths (not a confidence interval). null stays UNKNOWN. */
export function exposureRange(byWidth) {
  const rows = Object.values(byWidth), pop = rows.map(r => r.population_known).filter(v => v !== null), assets = rows.map(r => r.unique_assets);
  return {
    population: pop.length ? [Math.min(...pop), Math.max(...pop)] : null,
    partial: rows.some(r => r.population_total === null || r.unknown_area_km2 > 0),
    assets: [Math.min(...assets), Math.max(...assets)],
  };
}

// ---------- Earthquake shaking: BSSA14 (Boore, Stewart, Seyhan & Atkinson 2014) ----------
export const MECHANISMS = ['unspecified', 'strike-slip', 'normal', 'reverse'];
export const VS30 = [760, 360, 270, 180];
export const PGA_BANDS = [0, 0.02, 0.05, 0.1, 0.2, 0.4]; // lower edges in g; the last band is open-ended
export const bandOf = g => PGA_BANDS.findLastIndex(min => g >= min);

const R = 6371.0088, RAD = Math.PI / 180;
export function greatCircleKm(lon1, lat1, lon2, lat2) {
  const a = Math.sin((lat2 - lat1) * RAD / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin((lon2 - lon1) * RAD / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
/** Joyner-Boore distance: to the epicentre, or to a declared surface line centred on it. */
export function rjb(s, lon, lat) {
  if (!s.length_km) return greatCircleKm(s.longitude, s.latitude, lon, lat);
  const k = R * Math.cos(s.latitude * RAD), x = (lon - s.longitude) * RAD * k, y = (lat - s.latitude) * RAD * R;
  const ux = Math.sin(s.strike_deg * RAD), uy = Math.cos(s.strike_deg * RAD), h = s.length_km / 2;
  const t = Math.max(-h, Math.min(h, x * ux + y * uy));
  return greatCircleKm(s.longitude + t * ux / k / RAD, s.latitude + t * uy / R / RAD, lon, lat);
}
export function ruptureLine(s) {
  const k = R * Math.cos(s.latitude * RAD), h = s.length_km / 2, ux = Math.sin(s.strike_deg * RAD), uy = Math.cos(s.strike_deg * RAD);
  return [-1, 1].map(d => [s.longitude + d * h * ux / k / RAD, s.latitude + d * h * uy / R / RAD]);
}

export function validateQuake(model, s) {
  const e = [], d = model.domain, top = s.mechanism === 'normal' ? d.normal_magnitude_max : d.magnitude[1];
  if (!(s.magnitude >= d.magnitude[0] && s.magnitude <= top)) e.push('magnitude');
  if (!(s.vs30 >= d.vs30_m_s[0] && s.vs30 <= d.vs30_m_s[1])) e.push('vs30');
  if (!(s.longitude >= 78 && s.longitude <= 90 && s.latitude >= 25 && s.latitude <= 32)) e.push('epicentre');
  if (!MECHANISMS.includes(s.mechanism)) e.push('mechanism');
  if (s.length_km && !(s.length_km >= 1 && s.length_km <= 400 && s.strike_deg >= 0 && s.strike_deg < 360)) e.push('rupture');
  return e;
}

/** ln median and total sigma at one site. */
export function groundMotion(model, imt, M, r, vs30, mechanism) {
  const K = model.constants;
  const base = c => {
    const m = M - c.Mh, fe = c[model.mechanisms[mechanism]] + (M <= c.Mh ? c.e4 * m + c.e5 * m * m : c.e6 * m), d = Math.hypot(r, c.h);
    return fe + (c.c1 + c.c2 * (M - K.Mref)) * Math.log(d / K.Rref) + (c.c3 + c.Dc3) * (d - K.Rref);
  };
  const c = model.coefficients[imt], rock = Math.exp(base(model.coefficients.pga));
  const f2 = c.f4 * (Math.exp(c.f5 * (Math.min(vs30, 760) - 360)) - Math.exp(c.f5 * 400));
  const lnMedian = base(c) + c.c * Math.log(Math.min(vs30, c.Vc) / K.Vref) + K.f1 + f2 * Math.log((rock + K.f3) / K.f3);
  const between = (a, b) => M <= 4.5 ? a : M >= 5.5 ? b : a + (b - a) * (M - 4.5);
  const tau = between(c.tau1, c.tau2);
  let phi = between(c.phi1, c.phi2);
  if (r > c.R2) phi += c.DfR; else if (r > c.R1) phi += c.DfR * Math.log(r / c.R1) / Math.log(c.R2 / c.R1);
  if (vs30 <= K.v1) phi -= c.DfV; else if (vs30 < K.v2) phi -= c.DfV * Math.log(K.v2 / vs30) / Math.log(K.v2 / K.v1);
  return { lnMedian, sigma: Math.sqrt(tau * tau + phi * phi) };
}

/** PGA (g) as [median - 1 sigma, median, median + 1 sigma], or null beyond the model's distance domain. */
export function pgaAt(model, s, lon, lat) {
  const r = rjb(s, lon, lat);
  if (r > model.domain.rjb_km[1]) return null;
  const g = groundMotion(model, 'pga', s.magnitude, r, s.vs30, s.mechanism);
  return [Math.exp(g.lnMedian - g.sigma), Math.exp(g.lnMedian), Math.exp(g.lnMedian + g.sigma)];
}

/** People per PGA band for the -1σ, median and +1σ cases. Cells beyond the domain are counted as UNKNOWN. */
export function peopleByBand(model, s, cells) {
  const out = [[], [], []].map(() => PGA_BANDS.map(() => 0));
  let beyond = 0;
  for (const [lon, lat, people] of cells) {
    const p = pgaAt(model, s, lon, lat);
    if (!p) { beyond += people; continue; }
    p.forEach((g, i) => { out[i][bandOf(g)] += people; });
  }
  return { low: out[0], median: out[1], high: out[2], beyond };
}

/** Sparse row-major population lattice -> [lon, lat, people] cell centres. */
export function populationCells(grid) {
  if (grid.format !== 'atlas-population-grid@1' || grid.unit !== 'people per cell') throw new Error('Unsupported population grid');
  const cells = [];
  for (const [row, segments] of grid.cells) for (const [start, values] of segments) values.forEach((people, i) =>
    cells.push([grid.west + (start + i + 0.5) * grid.cell_degree, grid.north - (row + 0.5) * grid.cell_degree, people]));
  return cells;
}
