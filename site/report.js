// A printable record of one scenario run: the same link, the same models and data releases, laid out for A4.
// It recomputes the run from the link; nothing is stored. The map is a static drawing on the outline of Nepal.
import { c, esc, num, duration, load, failed, when } from './app.js';
import * as M from './models.js';
import * as P from './places.js';
import { routeData, routeHtml, province } from './route.js';
import { flatOverview } from './scenario-flat.js';
import { floodInputs, loadQuakeData, quakeInputs, BAND_COLORS, BEYOND, bandLabel, hydrographChart, shakeGrid, pack, originLabel, presetLabel } from './scenario-common.js';

const box = document.getElementById('report'), hash = location.hash, q = new URLSearchParams(hash.slice(1)), mode = hash.startsWith('#quake') ? 'quake' : 'flood';
const link = `${location.origin}/scenarios/${hash}`;
document.title = `${c.reportTitle}, ${c.site}`;
document.getElementById('link').href = link; document.getElementById('link').textContent = link;
document.getElementById('back').href = `/scenarios/${hash}`;
document.getElementById('made').textContent = c.reportMade(when(new Date().toISOString()));
document.getElementById('print').onclick = () => print();
// Paper is light: print with the light theme whatever the screen uses. Folded lists stay folded.
let theme;
addEventListener('beforeprint', () => { theme = document.documentElement.dataset.theme; document.documentElement.dataset.theme = 'light'; });
addEventListener('afterprint', () => { document.documentElement.dataset.theme = theme ?? ''; });

const range = (a, b, f = num) => a === b ? f(a) : `${f(a)}–${f(b)}`;
const figure = (label, value, note = '') => `<div class="fig"><span>${esc(label)}</span><strong>${value}</strong>${note ? `<small>${esc(note)}</small>` : ''}</div>`;
const inputs = rows => `<section><h2>${esc(c.reportInputs)}</h2><dl class="report-inputs">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></section>`;
const mapSection = label => `<section class="report-map-section"><h2>${esc(c.reportMap)}</h2><figure class="report-map"><div id="report-map"></div><figcaption class="src">${esc(label)}</figcaption></figure></section>`;
const dataUsed = ids => `<p class="src">${esc(c.reportData)}: ${ids.map(esc).join(', ')}.</p>`;
const errorsNote = errors => `<p class="note bad" role="alert">${errors.map(e => esc(c.errors[e])).join('<br>')}</p>`;

async function flood() {
  const [cat, places] = await Promise.all([load('/data/atlas-flood-corridors/1.0.0/catalogue.json.gz'), routeData()]);
  const { o, s } = floodInputs(q, cat.origins);
  document.getElementById('kind').textContent = c.reportKinds[o.lake ? 'glof' : 'flood'];
  const shown = [[c.origin, originLabel(o)], [`${c.volume}, m³`, num(s.volume_m3)], [`${c.duration}, h`, num(s.duration_s / 3600, 2)],
    [c.shape, s.shape === 'rectangular' ? c.rectangular : c.triangular], ...(s.shape === 'rectangular' ? [] : [[`${c.peakAt}, %`, num(s.peak_fraction * 100)]]),
    [`${c.speed}, m/s`, s.celerity_m_s.map(v => num(v, 1)).join(', ')]];
  const errors = M.validateFlood(s);
  if (errors.length) { box.innerHTML = inputs(shown) + errorsNote(errors); return; }

  const hg = M.hydrograph(s), t = ([a, , b]) => range(a, b, duration);
  const rows = o.checkpoints.map(cp => ({ cp, a: M.arrivals(s, cp.prefix_km), x: M.exposureRange(cp.by_width) }));
  const r = P.describePath(o.line.coordinates, o.path_length_km, places.find, places.places, places.streams);
  const first = rows[0], last = rows.at(-1), people = last.x.population ? range(Math.round(last.x.population[0]), Math.round(last.x.population[1])) : c.unknown;
  box.innerHTML = inputs(shown) + mapSection(c.reportMapFlood) + `<section><h2>${esc(c.results)}</h2>
    <p class="summary">${esc(c.floodSummary(r.start ? c.startIn(r.start.name) : c.startOutside, num(last.cp.prefix_km), t(last.a.front), people))}</p>
    <div class="figs">${figure(c.frontAt(num(first.cp.prefix_km)), esc(t(first.a.front)))}${figure(c.frontAt(num(last.cp.prefix_km)), esc(t(last.a.front)))}
      ${figure(c.popCorridors, esc(people), last.x.partial ? c.partial : '')}${figure(c.assetsFull, esc(range(...last.x.assets)))}</div>
    <table><thead><tr><th class="n">${esc(c.checkpoint)}</th><th>${esc(c.arrives)}</th><th>${esc(c.peaks)}</th><th>${esc(c.ends)}</th><th class="n">${esc(c.people)}</th><th class="n">${esc(c.assets)}</th></tr></thead><tbody>
    ${rows.map(({ cp, a, x }) => `<tr><td class="n">${num(cp.prefix_km)} km</td><td>${t(a.front)}</td><td>${t(a.peak)}</td><td>${t(a.end)}</td><td class="n">${x.population ? range(Math.round(x.population[0]), Math.round(x.population[1])) : esc(c.unknown)}${x.partial ? '*' : ''}</td><td class="n">${range(...x.assets)}</td></tr>`).join('')}</tbody></table>
    <p class="src">${esc(c.range)}</p>
    ${routeHtml(r, o.path_length_km, km => km <= 0 ? c.atRelease : c.frontAfter(t(M.arrivals(s, km).front)))}
    ${hydrographChart(hg.points, hg.peak_m3_s, c.hydroTitle(num(s.volume_m3), num(hg.peak_m3_s)))}</section>
    <section><h2>${esc(c.reportMethod)}</h2><p>${esc(c.floodLimits)} ${esc(c.damageNotModelled)}</p>
    ${dataUsed(['atlas-flood-corridors 1.0.0', 'nepal-admin-districts 2.0.1', 'nepal-osm-settlements 1.0.0', 'nepal-river-names 1.0.0'])}</section>`;
  const flat = await flatOverview(document.getElementById('report-map'), c.reportMapFlood);
  flat.flood(o.line.coordinates); flat.progress(o.line.coordinates[0]);
}

async function quake() {
  const [{ model, cells, presets }, places] = await Promise.all([loadQuakeData(), routeData()]);
  const { pick, s } = quakeInputs(q, presets);
  document.getElementById('kind').textContent = c.reportKinds.quake;
  const shown = [[c.reportEvent, q.has('lon') ? c.custom : presetLabel(pick)], [c.epicentre, `${num(s.longitude, 3)}°E, ${num(s.latitude, 3)}°N`], [c.magnitude, num(s.magnitude, 1)],
    [c.vs30, c.soils[s.vs30] ?? num(s.vs30)], [c.mech, c.mechs[s.mechanism] ?? c.unknown],
    [c.rupture, Number.isFinite(s.length_km) ? num(s.length_km) : c.unknown], ...(s.length_km ? [[c.strike, num(s.strike_deg)]] : [])];
  const errors = M.validateQuake(model, s);
  if (Number.isNaN(s.length_km)) errors.push('rupture');
  if (errors.length) { box.innerHTML = inputs(shown) + errorsNote(errors); return; }

  const r = M.peopleByBand(model, s, cells), strong = k => r[k].slice(3).reduce((a, b) => a + b, 0);
  const g = v => num(v, v < 0.1 ? 3 : 2), pga = x => `<strong>${g(x.p[1])}</strong> <small>(${g(x.p[0])}–${g(x.p[2])})</small>`, bands = M.PGA_BANDS.map((_, i) => i).reverse();
  const sites = places.districts.map(f => ({ name: f.properties.name, province: f.properties.parent_name, p: M.pgaAt(model, s, f.properties.label_longitude, f.properties.label_latitude) })).filter(x => x.p).sort((a, b) => b.p[1] - a.p[1]).slice(0, 10);
  const towns = places.places.filter(x => x.kind !== 'village').map(x => ({ ...x, p: M.pgaAt(model, s, ...x.p), district: places.find(x.p)?.name ?? null })).filter(x => x.p).sort((a, b) => b.p[1] - a.p[1]);
  const home = places.find([s.longitude, s.latitude]), where = home ? c.epicentreIn(home.name, province(home.province)) : c.epicentreOutside;
  box.innerHTML = inputs(shown) + mapSection(c.reportMapQuake) + `<section><h2>${esc(c.results)}</h2>
    <p class="summary">${esc(c.quakeSummary(num(s.magnitude, 1), where, num(strong('median')), num(strong('low')), num(strong('high'))))}</p>
    <div class="figs">${figure(c.peopleStrong, num(strong('median')), `${num(strong('low'))}–${num(strong('high'))}`)}${sites[0] ? figure(c.strongestAt(sites[0].name), `${g(sites[0].p[1])} g`, `${g(sites[0].p[0])}–${g(sites[0].p[2])} g`) : ''}</div>
    <div class="legend">${bands.filter(i => i > 0).map(i => `<span><i style="background:${BAND_COLORS[i]}"></i>${bandLabel(i)}</span>`).join('')}<span><i style="background:${BEYOND}"></i>${esc(c.beyondShade)}</span></div>
    <table><caption>${esc(c.citiesTitle)}</caption><thead><tr><th>${esc(c.place)}</th><th>${esc(c.district)}</th><th class="n">${esc(c.pga)}</th></tr></thead><tbody>
    ${towns.slice(0, 10).map(x => `<tr><td>${esc(x.name)} <small>${esc(c.kinds[x.kind])}</small></td><td>${esc(x.district ?? c.outsideNepal)}</td><td class="n">${pga(x)}</td></tr>`).join('') || `<tr><td colspan="3">${esc(c.noTownsShaking)}</td></tr>`}</tbody></table>
    <table><caption>${esc(c.strongest)}</caption><thead><tr><th>${esc(c.district)}</th><th>${esc(c.provinceCol)}</th><th class="n">${esc(c.pga)}</th></tr></thead><tbody>
    ${sites.map(x => `<tr><td>${esc(x.name)}</td><td>${esc(province(x.province))}</td><td class="n">${pga(x)}</td></tr>`).join('')}</tbody></table>
    <table><caption>${esc(c.peopleBand)}</caption><thead><tr><th>${esc(c.band)}</th><th class="n">${esc(c.pLow)}</th><th class="n">${esc(c.pMid)}</th><th class="n">${esc(c.pHigh)}</th></tr></thead><tbody>
    ${bands.map(i => `<tr><td>${bandLabel(i)}</td><td class="n">${num(r.low[i])}</td><td class="n"><strong>${num(r.median[i])}</strong></td><td class="n">${num(r.high[i])}</td></tr>`).join('')}
    ${r.beyond ? `<tr><td>${esc(c.beyond)}</td><td class="n" colspan="3">${num(r.beyond)}</td></tr>` : ''}</tbody></table>
    <p class="src">${esc(c.peopleOutside)} ${esc(c.placesSource)}</p></section>
    <section><h2>${esc(c.reportMethod)}</h2><p>${esc(c.quakeLimits)}</p>
    ${dataUsed(['atlas-gmpe-bssa14 1.0.0', 'nepal-hrsl-population 1.0.0', 'nepal-region-earthquakes 1.0.0', 'nepal-admin-districts 2.0.1', 'nepal-osm-settlements 1.0.0'])}</section>`;

  // The middle case, fully drawn: the same grid and colours as the Scenarios map at the end of its sweep.
  const canvas = Object.assign(document.createElement('canvas'), { width: 448, height: 420 }), W = canvas.width, H = canvas.height;
  const { band, extent } = shakeGrid(model, s, W, H), ctx = canvas.getContext('2d'), image = ctx.createImageData(W, H), px = new Uint32Array(image.data.buffer);
  const fills = BAND_COLORS.map(h => h ? pack(h) : 0), grey = pack(BEYOND);
  for (let k = 0; k < band.length; k++) px[k] = band[k] === 255 ? grey : fills[band[k]];
  ctx.putImageData(image, 0, 0);
  const flat = await flatOverview(document.getElementById('report-map'), c.reportMapQuake);
  flat.quake(canvas, extent, [s.longitude, s.latitude], s.length_km ? M.ruptureLine(s) : null, [[s.longitude - 2.5, s.latitude - 2], [s.longitude + 2.5, s.latitude + 2]]);
}

const run = () => (mode === 'quake' ? quake() : flood()).then(() => { box.dataset.ready = 'true'; }, e => { console.error(e); failed(box, run); });
run();
