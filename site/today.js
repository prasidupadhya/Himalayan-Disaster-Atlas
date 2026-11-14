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
  return `<p class="src">${esc(s.agency)} · ${esc(status)} · <a href="${esc(s.url)}" rel="noopener">${esc(c.openSource)}</a></p>`;
}

function render(g) {
  const src = Object.fromEntries(g.sources.map(s => [s.id, s]));
  const river = src['bipad-river']?.content, rain = src['bipad-rain']?.content, quake = src['seismo-earthquakes']?.content?.tables?.[0], inc = src['bipad-incidents']?.content;
  const days = Math.floor((Date.now() - Date.parse(g.generated_at)) / 864e5);
  const counts = river?.current_status_counts ?? {}, danger = counts['ABOVE DANGER LEVEL'] ?? 0, warn = counts['ABOVE WARNING LEVEL'] ?? 0;
  const rainWarn = rain?.current_status_counts?.['ABOVE WARNING LEVEL'] ?? 0;
  const q0 = quake?.rows?.[0], col = name => quake?.header?.findIndex(h => h.startsWith(name));
  const adDate = r => (r?.[col('Date')] ?? '').match(/AD:\s*([\d-]+)/)?.[1];

  const tile = (href, state, label, big, text) => `<a class="tile" href="${href}" data-state="${state}"><span class="label">${esc(label)}</span><span class="big">${big}</span><span>${text}</span></a>`;
  const tiles = [
    river ? tile('#rivers', danger ? 'bad' : warn ? 'warn' : 'ok', c.rivers, num(danger + warn), esc(danger ? `${num(danger)} ${c.aboveDanger}, ${num(warn)} ${c.aboveWarning}` : `${c.aboveWarning} ${c.ofStations(num(river.current_station_count), num(river.fresh_hours))}`))
      : tile('#rivers', '', c.rivers, esc(c.unknown), ''),
    rain ? tile('#rain', rainWarn ? 'warn' : 'ok', c.rain, num(rainWarn), esc(`${c.aboveWarning} ${c.ofStations(num(rain.current_station_count), num(rain.fresh_hours))}`)) : tile('#rain', '', c.rain, esc(c.unknown), ''),
    q0 ? tile('#quakes', '', c.quakes, esc(q0[col('Magnitude')]), esc(`${c.latestQuake}: ${q0[col('Epicenter')]}, ${adDate(q0) ? when(adDate(q0), { dateStyle: 'medium' }) : c.unknown}`)) : tile('#quakes', '', c.quakes, esc(c.unknown), ''),
    inc ? tile('#incidents', '', c.incidents, num(inc.record_count) + (inc.complete ? '' : '+'), esc(c.lastDays(num(inc.within_days)))) : tile('#incidents', '', c.incidents, esc(c.unknown), ''),
  ].join('');

  const trend = t => ({ RISING: c.rising, FALLING: c.falling, STEADY: c.steady })[t] ?? '';
  const alertRows = (river?.alert_stations ?? []).map(s => `<tr><td>${esc(s.name)}</td><td class="wide">${esc(s.basin)}</td><td>${chip(s.status)} ${esc(trend(s.trend))}</td><td class="n">${num(s.water_level_m, 2)}</td><td class="n wide">${num(s.warning_level_m, 2)}</td><td class="n wide">${num(s.danger_level_m, 2)}</td><td class="wide">${esc(when(s.observed_at))}</td></tr>`);
  const stale = river?.stale_alert_stations?.length ?? 0;
  const wet = (rain?.wettest_24h ?? []).map(s => `<tr><td>${esc(s.name)}</td><td class="wide">${esc(s.basin)}</td><td class="n">${num(s.rain_24h_mm, 1)}</td><td class="n">${num(s.rain_1h_mm, 1)}</td><td class="wide">${esc(when(s.observed_at))}</td></tr>`);
  // NEMRC values are kept verbatim; only their layout changes.
  const quakeRows = (quake?.rows ?? []).map(r => `<li><strong>${esc(r[col('Magnitude')])}</strong> · ${esc(r[col('Epicenter')])}<br><small>${esc(r[col('Date')])} · ${esc(r[col('Time')])} · ${esc(r[col('Latitude')])}°N ${esc(r[col('Longitude')])}°E</small></li>`);
  const incRows = (inc?.records ?? []).map(r => `<li>${esc(lang === 'ne' && r.titleNe ? r.titleNe : r.title)}<br><small>${esc(when(r.incidentOn, { dateStyle: 'medium' }))} · ${esc(r.verified ? c.verified : c.unverified)}</small></li>`);
  const alerts = src['bipad-alerts']?.content?.records ?? [];
  const links = ['dhm-forecast', 'dhm-flood-archive'].flatMap(id => src[id]?.content?.links ?? []);
  const nd = src['ndrrma-home'];

  box.innerHTML = `<p class="muted">${esc(c.copied(when(g.generated_at)))}</p>
${days >= 2 ? `<p class="note warn">${esc(c.oldCopy(num(days)))}</p>` : ''}
<div class="tiles">${tiles}</div>
<div class="actions"><a class="button primary" href="/map/">${esc(c.exploreMap)}</a><a class="button" href="/scenarios/">${esc(c.runScenario)}</a></div>

<h2 id="rivers">${esc(c.rivers)}</h2>
${alertRows.length ? table(c.alertCaption, [c.station, { t: c.basin, w: 1 }, c.status, { t: `${c.level}, m`, n: 1 }, { t: c.warning, n: 1, w: 1 }, { t: c.danger, n: 1, w: 1 }, { t: c.time, w: 1 }], alertRows) : river ? `<p>${esc(c.allBelow)}</p>` : ''}
${stale ? `<p class="muted">${esc(c.staleFlags(num(stale)))}</p>` : ''}
${src['bipad-river'] ? from(src['bipad-river']) : ''}

<h2 id="rain">${esc(c.rain)}</h2>
${wet.length ? table(c.wettest, [c.station, { t: c.basin, w: 1 }, { t: `${c.h24}, mm`, n: 1 }, { t: `${c.h1}, mm`, n: 1 }, { t: c.time, w: 1 }], wet) : `<p>${esc(c.noRain)}</p>`}
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
