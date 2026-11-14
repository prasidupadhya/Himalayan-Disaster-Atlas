import { c, lang, esc, num, when, load, failed } from './app.js';

const box = document.getElementById('today');
const STATE = { 'ABOVE DANGER LEVEL': ['bad', 'aboveDanger'], 'ABOVE WARNING LEVEL': ['warn', 'aboveWarning'] };
const chip = s => STATE[s] ? `<span class="chip ${STATE[s][0]}">${esc(c[STATE[s][1]])}</span>` : `<span class="chip">${esc(s)}</span>`;
const table = (caption, head, rows) => `<div class="scroll" tabindex="0"><table><caption>${esc(caption)}</caption><thead><tr>${head.map(h => `<th class="${h.n ? 'n' : ''} ${h.w ? 'wide' : ''}">${esc(h.t ?? h)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
/** First few items, the rest behind a toggle. */
const more = (items, n = 6) => items.length <= n ? items.join('') : `${items.slice(0, n).join('')}<li><details><summary>${esc(c.showAll(num(items.length)))}</summary><ul class="plain">${items.slice(n).join('')}</ul></details></li>`;

/** One line under each section saying where it came from and how fresh it is. */
function from(s) {
  const status = s.status === 'fetched' ? c.srcFetched(when(s.fetched_at)) : s.content ? c.srcLastKnown(when(s.fetched_at)) : c.srcMissing;
  return `<p class="src">${esc(s.agency)}. ${esc(status)}. <a href="${esc(s.url)}" rel="noopener">${esc(c.openSource)}</a></p>`;
}

function render(g) {
  const src = Object.fromEntries(g.sources.map(s => [s.id, s]));
  const river = src['bipad-river']?.content, rain = src['bipad-rain']?.content, quake = src['seismo-earthquakes']?.content?.tables?.[0], inc = src['bipad-incidents']?.content;
  // Age comes from when each headline source was last read, not from when the job ran.
  const heads = ['bipad-river', 'bipad-rain', 'seismo-earthquakes', 'bipad-incidents'].map(id => src[id]).filter(s => s?.content);
  const oldest = Math.min(...heads.map(s => Date.parse(s.fetched_at)));
  const days = Math.floor((Date.now() - oldest) / 864e5);
  const asOf = s => s && s.status !== 'fetched' ? ` ${c.asOf(when(s.fetched_at, { dateStyle: 'medium' }))}` : '';
    const q0 = quake?.rows?.[0], col = name => quake?.header?.findIndex(h => h.startsWith(name));
  const adDate = r => (r?.[col('Date')] ?? '').match(/AD:\s*([\d-]+)/)?.[1];

  // Gauge: one tick per reporting station, worst first, coloured by the status the agency published.
  const gauge = (cnt, total) => {
    const d = cnt['ABOVE DANGER LEVEL'] ?? 0, w = cnt['ABOVE WARNING LEVEL'] ?? 0;
    const ticks = Array.from({ length: total }, (_, i) => `<i${i < d ? ' class="d"' : i < d + w ? ' class="w"' : ''} style="--i:${i}"></i>`).join('');
    return `<div class="gauge" role="img" aria-label="${esc(c.gaugeLabel(num(total), num(d), num(w)))}">${ticks}</div>`;
  };
  const stationReading = (id, name, source) => {
    const content = source?.content, old = source && source.status !== 'fetched';
    if (!content) return `<a class="reading" href="#${id}"><h3>${esc(name)}</h3><p class="say"><b>${esc(c.unknown)}</b></p></a>`;
    const cnt = content.current_status_counts ?? {}, d = cnt['ABOVE DANGER LEVEL'] ?? 0, n = d + (cnt['ABOVE WARNING LEVEL'] ?? 0);
    return `<a class="reading" href="#${id}"><h3>${esc(name)}</h3><p class="say"><b class="${old ? '' : d ? 'bad' : n ? 'warn' : ''}">${num(n)}</b>${esc(c.ofAbove(num(content.current_station_count)))}</p>
      ${gauge(cnt, content.current_station_count)}<p class="muted">${esc(c.reportedIn(num(content.fresh_hours)))}${d ? ` ${esc(c.dangerOf(num(d)))}` : ''}${esc(asOf(source))}</p></a>`;
  };
  // Seismic strip: NEMRC's recent events placed by date, spike height by magnitude.
  const events = (quake?.rows ?? []).map(r => ({ t: Date.parse(adDate(r)), m: parseFloat(r[col('Magnitude')]) })).filter(e => e.t && e.m);
  const t0 = Math.min(...events.map(e => e.t)), t1 = Math.max(...events.map(e => e.t)), day = t => when(new Date(t).toISOString(), { dateStyle: 'medium' });
  const strip = events.length > 1 ? `<div class="strip" role="img" aria-label="${esc(c.stripLabel(num(events.length), day(t0), day(t1)))}">${events.map((e, i) =>
    `<i style="left:${(2 + 96 * (e.t - t0) / (t1 - t0 || 1)).toFixed(1)}%;height:${Math.max(12, Math.min(100, (e.m - 2) / 4 * 100)).toFixed(0)}%;--i:${i * 12}"></i>`).join('')}</div><div class="axis"><span>${esc(day(t0))}</span><span>${esc(day(t1))}</span></div>` : '';
  const newest = (inc?.records ?? []).slice(0, 3).map(r => `<li>${esc(lang === 'ne' && r.titleNe ? r.titleNe : r.title)}</li>`).join('');
  const ledger = [
    stationReading('rivers', c.rivers, src['bipad-river']),
    stationReading('rain', c.rain, src['bipad-rain']),
    q0 ? `<a class="reading" href="#quakes"><h3>${esc(c.quakes)}</h3><p class="say"><b>${esc(q0[col('Magnitude')])}</b>${esc(c.latestIn(q0[col('Epicenter')], adDate(q0) ? day(Date.parse(adDate(q0))) : c.unknown))}</p>${strip}${asOf(src['seismo-earthquakes']) ? `<p class="muted">${esc(asOf(src['seismo-earthquakes']))}</p>` : ''}</a>`
      : `<a class="reading" href="#quakes"><h3>${esc(c.quakes)}</h3><p class="say"><b>${esc(c.unknown)}</b></p></a>`,
    inc ? `<a class="reading" href="#incidents"><h3>${esc(c.incidents)}</h3><p class="say"><b>${num(inc.record_count)}${inc.complete ? '' : '+'}</b>${esc(c.incidentsSay(num(inc.within_days)))}${esc(asOf(src['bipad-incidents']))}</p>${newest ? `<ul class="muted" style="margin:0;padding-left:18px">${newest}</ul>` : ''}</a>`
      : `<a class="reading" href="#incidents"><h3>${esc(c.incidents)}</h3><p class="say"><b>${esc(c.unknown)}</b></p></a>`,
  ].join('');

  const trend = t => ({ RISING: c.rising, FALLING: c.falling, STEADY: c.steady })[t] ?? '';
  const alertRows = (river?.alert_stations ?? []).map(s => `<tr><td>${esc(s.name)}</td><td class="wide">${esc(s.basin)}</td><td>${chip(s.status)} ${esc(trend(s.trend))}</td><td class="n">${num(s.water_level_m, 2)}</td><td class="n wide">${num(s.warning_level_m, 2)}</td><td class="n wide">${num(s.danger_level_m, 2)}</td><td class="wide">${esc(when(s.observed_at))}</td></tr>`);
  const stale = river?.stale_alert_stations?.length ?? 0;
  const wet = (rain?.wettest_24h ?? []).map(s => `<tr><td>${esc(s.name)}</td><td class="wide">${esc(s.basin)}</td><td class="n">${num(s.rain_24h_mm, 1)}</td><td class="n">${num(s.rain_1h_mm, 1)}</td><td class="wide">${esc(when(s.observed_at))}</td></tr>`);
  // NEMRC values are kept verbatim; only their layout changes.
  const quakeRows = (quake?.rows ?? []).map(r => `<li><strong>${esc(r[col('Magnitude')])}</strong>, ${esc(r[col('Epicenter')])}<br><small>${esc(r[col('Date')])}, ${esc(r[col('Time')])}, ${esc(r[col('Latitude')])}° N ${esc(r[col('Longitude')])}° E</small></li>`);
  const incRows = (inc?.records ?? []).map(r => `<li>${esc(lang === 'ne' && r.titleNe ? r.titleNe : r.title)}<br><small>${esc(when(r.incidentOn, { dateStyle: 'medium' }))}, ${esc(r.verified ? c.verified : c.unverified)}</small></li>`);
  const alerts = src['bipad-alerts']?.content?.records ?? [];
  const links = ['dhm-forecast', 'dhm-flood-archive'].flatMap(id => src[id]?.content?.links ?? []);
  const nd = src['ndrrma-home'];

  box.innerHTML = `<p class="stamp">${esc(c.copied(when(g.generated_at)))}</p>
${days >= 2 ? `<p class="note warn">${esc(c.oldCopy(num(days)))}</p>` : ''}
<div class="ledger">${ledger}</div>
<div class="actions"><a class="button primary" href="/map/">${esc(c.exploreMap)}</a><a class="button" href="/scenarios/">${esc(c.runScenario)}</a></div>

<h2 id="rivers">${esc(c.rivers)}</h2>
${alertRows.length ? table(c.alertCaption, [c.station, { t: c.basin, w: 1 }, c.status, { t: `${c.level}, m`, n: 1 }, { t: c.warning, n: 1, w: 1 }, { t: c.danger, n: 1, w: 1 }, { t: c.time, w: 1 }], alertRows) : river ? `<p>${esc(c.allBelow)}</p>` : ''}
${stale ? `<p class="muted">${esc(c.staleFlags(num(stale)))}</p>` : ''}
${src['bipad-river'] ? from(src['bipad-river']) : ''}

<h2 id="rain">${esc(c.rain)}</h2>
${wet.length ? table(c.wettest, [c.station, { t: c.basin, w: 1 }, { t: `${c.h24}, mm`, n: 1 }, { t: `${c.h1}, mm`, n: 1 }, { t: c.time, w: 1 }], wet) : `<p>${esc(rain ? c.noRain : c.unknown)}</p>`}
${rain?.implausible_24h ? `<p class="muted">${esc(c.implausible(num(rain.implausible_24h)))}</p>` : ''}
${src['bipad-rain'] ? from(src['bipad-rain']) : ''}

<h2 id="quakes">${esc(c.quakes)}</h2>
${quakeRows.length ? `<p class="muted">${esc(c.quakeTable)}</p><ul class="plain">${more(quakeRows)}</ul>` : `<p>${esc(c.noRecords)}</p>`}
${src['seismo-earthquakes'] ? from(src['seismo-earthquakes']) : ''}

<div class="grid2">
<section><h2 id="incidents">${esc(c.incidentList)}</h2>${incRows.length ? `<ul class="plain">${more(incRows)}</ul>` : `<p>${esc(c.noRecords)}</p>`}${src['bipad-incidents'] ? from(src['bipad-incidents']) : ''}</section>
<section><h2>${esc(c.alerts)}</h2>${alerts.length ? `<ul class="plain">${alerts.map(a => `<li>${esc(lang === 'ne' && a.titleNe ? a.titleNe : a.title)}</li>`).join('')}</ul>` : `<p>${esc(c.noRecords)}</p>`}${src['bipad-alerts'] ? from(src['bipad-alerts']) : ''}
<h2>${esc(c.bulletins)}</h2>${links.length ? `<ul class="plain">${more(links.map(l => `<li><a href="${esc(l.href)}" rel="noopener">${esc(l.text)}</a></li>`), 4)}</ul>` : `<p>${esc(c.noRecords)}</p>`}${['dhm-forecast', 'dhm-flood-archive'].filter(id => src[id]).map(id => from(src[id])).join('')}</section>
</div>
${nd?.content?.paragraphs?.length ? `<h2>${esc(c.ndrrma)}</h2><div class="card" lang="ne">${nd.content.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}</div>${from(nd)}` : ''}`;
}

const go = () => load('/data/gov/latest.json').then(render, () => failed(box, go));
go();
