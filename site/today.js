import { c, lang, esc, num, when, load, failed } from './app.js';

const box = document.getElementById('today'), ledgerBox = document.getElementById('ledger'), mapBox = document.getElementById('stations');
const STATE = { 'ABOVE DANGER LEVEL': ['bad', 'aboveDanger'], 'ABOVE WARNING LEVEL': ['warn', 'aboveWarning'], 'BELOW WARNING LEVEL': ['ok', 'belowWarning'] };
const chip = s => STATE[s] ? `<span class="chip ${STATE[s][0]}">${esc(c[STATE[s][1]])}</span>` : `<span class="chip">${esc(s)}</span>`;
const table = (caption, head, rows) => `<div class="scroll" tabindex="0"><table><caption>${esc(caption)}</caption><thead><tr>${head.map(h => `<th${h.n ? ' class="n"' : ''}>${esc(h.t ?? h)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
/** First few items, the rest behind a toggle. */
const more = (items, n = 3) => items.length <= n ? items.join('') : `${items.slice(0, n).join('')}<li><details><summary>${esc(c.showAll(num(items.length)))}</summary><ul class="plain">${items.slice(n).join('')}</ul></details></li>`;
const section = (id, title, body) => `<section id="${id}"><h2>${esc(title)}</h2>${body}</section>`;

/** One line under each section saying where it came from and how fresh it is. */
function from(s) {
  if (!s) return '';
  const status = s.status === 'fetched' ? c.srcFetched(when(s.fetched_at)) : s.content ? c.srcLastKnown(when(s.fetched_at)) : c.srcMissing;
  return `<p class="src">${esc(s.agency)}. ${esc(status)}. <a href="${esc(s.url)}" rel="noopener">${esc(c.openSource)}</a></p>`;
}

/** The signature: every river station where it stands, in the status the copy published. A reading not marked current is grey. */
async function drawStations(river) {
  const [country, stations] = await Promise.all([load('/data/nepal-admin-country/2.0.1/features.geojson.gz'), load('/data/nepal-hydrology-stations/1.0.0/features.geojson.gz')]);
  const k = Math.cos(28.3 * Math.PI / 180), x = lon => ((lon - 80) * k * 100).toFixed(1), y = lat => ((30.5 - lat) * 100).toFixed(1);
  const rings = country.features.flatMap(f => f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).flatMap(p => p);
  const outline = rings.map(r => `M${r.map(([lon, lat]) => `${x(lon)} ${y(lat)}`).join('L')}Z`).join('');
  const live = new Map((river?.alert_stations ?? []).map(s => [s.id, s.status]));
  const rank = s => ['BELOW WARNING LEVEL', 'ABOVE WARNING LEVEL', 'ABOVE DANGER LEVEL'].indexOf(s);
  const status = id => live.get(id) ?? (river?.statuses?.[id]?.[2] === true ? river.statuses[id][1] : null);
  const dots = stations.features.map(f => ({ s: status(f.properties.source_id), p: f.geometry.coordinates }))
    // Drawn in order of concern, so a station above warning is never hidden under a calm one.
    .sort((a, b) => rank(a.s) - rank(b.s)).map(({ s, p }) => `<circle cx="${x(p[0])}" cy="${y(p[1])}" r="5.5" class="${STATE[s]?.[0] ?? 'old'}"/>`).join('');
  const counts = river?.current_status_counts ?? {};
  mapBox.innerHTML = `<svg viewBox="-10 -10 ${(8.4 * k * 100 + 20).toFixed(0)} ${(4.4 * 100 + 20).toFixed(0)}" role="img" aria-label="${esc(c.stationMapLabel(num(stations.features.length), num(river?.current_station_count), num(counts['ABOVE DANGER LEVEL'] ?? 0), num(counts['ABOVE WARNING LEVEL'] ?? 0)))}">
    <path d="${outline}" class="land"/>${dots}</svg>
    ${Object.values(river?.statuses ?? {}).some(v => v.length > 2) ? '' : `<p class="src">${esc(c.stationAgeMissing(num(river?.current_station_count)))}</p>`}<figcaption><span class="key ok">${esc(c.belowWarning)}</span><span class="key warn">${esc(c.aboveWarning)}</span><span class="key bad">${esc(c.aboveDanger)}</span><span class="key old">${esc(c.oldReading)}</span></figcaption>`;
}

/**
 * The last 30 days from the daily copies: one small bar chart per count, by Nepal date.
 * A day with no copy, or whose source was not read, is a gap marked UNKNOWN, never a zero bar.
 */
function trends(history) {
  const byDate = new Map(history.days.map(d => [d.date, d])), last = history.days.at(-1)?.date;
  if (!last) return '';
  const dates = Array.from({ length: 30 }, (_, i) => { const t = new Date(`${last}T00:00:00Z`); t.setUTCDate(t.getUTCDate() - 29 + i); return t.toISOString().slice(0, 10); });
  const rows = dates.map(date => byDate.get(date) ?? { date });
  const label = date => when(`${date}T06:00:00Z`, { day: 'numeric', month: 'short' });
  const W = 300, H = 64, bw = W / rows.length;
  /** parts: [[key, css class]] stacked from the bottom. */
  const chart = (title, parts) => {
    const total = r => parts.every(([k]) => r[k] == null) ? null : parts.reduce((t, [k]) => t + (r[k] ?? 0), 0);
    const values = rows.map(total).filter(v => v != null), highest = values.length ? Math.max(...values) : null, top = Math.max(1, highest ?? 0);
    const bars = rows.map((r, i) => {
      const x = (i * bw + 1).toFixed(1), w = (bw - 2).toFixed(1), v = total(r);
      if (v == null) return `<g><title>${esc(`${label(r.date)}: ${c.unknown}`)}</title><rect class="gap" x="${x}" y="0" width="${w}" height="${H}"/></g>`;
      let y = H;
      const segs = parts.map(([k, cls]) => { const h = (r[k] ?? 0) / top * (H - 4); y -= h; return h ? `<rect class="${cls}" x="${x}" y="${y.toFixed(1)}" width="${w}" height="${h.toFixed(1)}"/>` : ''; }).join('');
      return `<g><title>${esc(`${label(r.date)}: ${num(v)}`)}</title><rect class="hit" x="${x}" y="0" width="${w}" height="${H}"/>${segs}</g>`;
    }).join('');
    const now = total(rows.at(-1));
    return `<figure class="trend"><figcaption><span>${esc(title)}</span><b>${now == null ? esc(c.unknown) : num(now)}</b></figcaption>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(c.trendAria(title, label(dates[0]), label(last)))}">${bars}</svg>
      <div class="axis"><span>${esc(label(dates[0]))}</span><span>${esc(highest == null ? '' : c.trendMax(num(highest)))}</span><span>${esc(label(last))}</span></div></figure>`;
  };
  // What changed since the previous daily copy, from these counts only.
  const prev = history.days.at(-2), cur = history.days.at(-1), alerts = r => r?.rivers_above_warning == null ? null : (r.rivers_above_warning ?? 0) + (r.rivers_above_danger ?? 0);
  const change = (name, a, b) => a == null || b == null ? c.changeUnknown(name) : a === b ? c.changeSame(name, num(b)) : c.changeBy(name, num(b), b > a ? c.up : c.down, num(Math.abs(b - a)), label(prev.date));
  const sentence = prev ? `${change(c.riverAlerts, alerts(prev), alerts(cur))} ${change(c.rainAlerts, prev.rain_stations_above_warning, cur.rain_stations_above_warning)}` : '';
  const tableRows = [...history.days].reverse().slice(0, 30).map(r => `<tr><td>${esc(label(r.date))}</td><td class="n">${num(alerts(r))}</td><td class="n">${num(r.rain_stations_above_warning)}</td><td class="n">${num(r.rivers_current)}</td><td class="n">${num(r.rain_current)}</td></tr>`).join('');
  return section('trends', c.trendsTitle, `<p class="lead">${esc(sentence)}</p>
    <div class="trends">${chart(c.riverAlerts, [['rivers_above_danger', 'bad'], ['rivers_above_warning', 'warn']])}${chart(c.rainAlerts, [['rain_stations_above_warning', 'warn']])}${chart(c.riversReporting, [['rivers_current', 'ink']])}</div>
    <div class="legend"><span><i class="key-bad"></i>${esc(c.aboveDanger)}</span><span><i class="key-warn"></i>${esc(c.aboveWarning)}</span><span><i class="key-gap"></i>${esc(c.noCopyDay)}</span></div>
    <details class="card"><summary>${esc(c.trendTable)}</summary><div class="scroll" tabindex="0"><table><thead><tr><th>${esc(c.dateCol)}</th><th class="n">${esc(c.riverAlerts)}</th><th class="n">${esc(c.rainAlerts)}</th><th class="n">${esc(c.riversReporting)}</th><th class="n">${esc(c.rainReporting)}</th></tr></thead><tbody>${tableRows}</tbody></table></div></details>
    <p class="src">${esc(c.trendSource)}</p>`);
}

function render(g, history) {
  const src = Object.fromEntries(g.sources.map(s => [s.id, s]));
  const river = src['bipad-river']?.content, rain = src['bipad-rain']?.content, quake = src['seismo-earthquakes']?.content?.tables?.[0], inc = src['bipad-incidents']?.content;
  // Age comes from when each headline source was last read, not from when the job ran.
  const heads = ['bipad-river', 'bipad-rain', 'seismo-earthquakes', 'bipad-incidents'].map(id => src[id]).filter(s => s?.content);
  const days = Math.floor((Date.now() - Math.min(...heads.map(s => Date.parse(s.fetched_at)))) / 864e5);
  // State tag: teal when read today, an outline with the date when it comes from an older copy.
  // Only an exception carries a tag: a source shown from an older copy, or one never read. Today's time is stated once, in the hero.
  const tag = s => s?.status === 'fetched' ? '' : `<span class="tag out">${esc(s?.content ? c.fromCopy(when(s.fetched_at, { dateStyle: 'medium' })) : c.unknown)}</span>`;
  const reading = (id, name, source, body) => `<a class="reading" href="#${id}"><h3>${esc(name)}</h3>${tag(source)}${body ?? `<p class="say"><b>${esc(c.unknown)}</b></p>`}</a>`;
  const q0 = quake?.rows?.[0], col = name => quake?.header?.findIndex(h => h.startsWith(name));
  const adDate = r => (r?.[col('Date')] ?? '').match(/AD:\s*([\d-]+)/)?.[1];
  const day = t => when(new Date(t).toISOString(), { dateStyle: 'medium' });
  const stations = (source) => {
    const content = source?.content;
    if (!content) return undefined;
    const cnt = content.current_status_counts ?? {}, d = cnt['ABOVE DANGER LEVEL'] ?? 0, n = d + (cnt['ABOVE WARNING LEVEL'] ?? 0), old = source.status !== 'fetched';
    return `<p class="say"><b class="${old ? '' : d ? 'bad' : n ? 'warn' : ''}">${num(n)}</b>${esc(c.ofAbove(num(content.current_station_count)))}</p><p class="muted">${esc(c.reportedIn(num(content.fresh_hours)))}${d ? ` ${esc(c.dangerOf(num(d)))}` : ''}</p>`;
  };
  // Seismic strip: NEMRC's recent events placed by date, spike height by magnitude.
  const events = (quake?.rows ?? []).map(r => ({ t: Date.parse(adDate(r)), m: parseFloat(r[col('Magnitude')]) })).filter(e => e.t && e.m);
  const t0 = Math.min(...events.map(e => e.t)), t1 = Math.max(...events.map(e => e.t));
  const strip = events.length > 1 ? `<div class="strip" role="img" aria-label="${esc(c.stripLabel(num(events.length), day(t0), day(t1)))}">${events.map((e, i) =>
    `<i style="left:${(2 + 96 * (e.t - t0) / (t1 - t0 || 1)).toFixed(1)}%;height:${Math.max(12, Math.min(100, (e.m - 2) / 4 * 100)).toFixed(0)}%;--i:${i * 12}"></i>`).join('')}</div><div class="axis"><span>${esc(day(t0))}</span><span>${esc(day(t1))}</span></div>` : '';
  const first = inc?.records?.[0];

  document.getElementById('stamp').textContent = c.copied(when(g.generated_at));
  ledgerBox.innerHTML = [
    reading('src-bipad-river', c.rivers, src['bipad-river'], stations(src['bipad-river'])),
    reading('src-bipad-rain', c.rain, src['bipad-rain'], stations(src['bipad-rain'])),
    reading('src-seismo-earthquakes', c.quakes, src['seismo-earthquakes'], q0 && `<p class="say"><b>${esc(q0[col('Magnitude')])}</b>${esc(c.latestIn(q0[col('Epicenter')], adDate(q0) ? day(Date.parse(adDate(q0))) : c.unknown))}</p>${strip}`),
    reading('src-bipad-incidents', c.incidents, src['bipad-incidents'], inc && `<p class="say"><b>${num(inc.record_count)}${inc.complete ? '' : '+'}</b>${esc(c.incidentsSay(num(inc.within_days)))}</p>${first ? `<p class="muted">${esc(c.latestIncident)} ${esc(lang === 'ne' && first.titleNe ? first.titleNe : first.title)}</p>` : ''}`),
  ].join('');
  drawStations(river).catch(() => { mapBox.hidden = true; });

  const trend = t => ({ RISING: c.rising, FALLING: c.falling, STEADY: c.steady })[t] ?? '';
  const alertRows = (river?.alert_stations ?? []).map(s => `<tr><td>${esc(s.name)}</td><td>${chip(s.status)} ${esc(trend(s.trend))}</td><td class="n">${num(s.water_level_m, 2)}</td><td class="n">${num(s.warning_level_m, 2)}</td><td class="n">${num(s.danger_level_m, 2)}</td><td>${esc(when(s.observed_at))}</td><td>${esc(s.basin)}</td></tr>`);
  const stale = river?.stale_alert_stations?.length ?? 0;
  const wet = (rain?.wettest_24h ?? []).map(s => `<tr><td>${esc(s.name)}</td><td class="n">${num(s.rain_24h_mm, 1)}</td><td class="n">${num(s.rain_1h_mm, 1)}</td><td>${esc(when(s.observed_at))}</td><td>${esc(s.basin)}</td></tr>`);
  // NEMRC values are kept verbatim; only their layout changes.
  const quakeRows = (quake?.rows ?? []).map(r => `<li><strong>${esc(r[col('Magnitude')])}</strong>, ${esc(r[col('Epicenter')])}<br><small>${esc(adDate(r) ?? r[col('Date')])}, ${esc((r[col('Time')] ?? '').match(/Local:\s*([\d:]+)/)?.[1] ?? r[col('Time')])} ${esc(c.localTime)}, ${esc(r[col('Latitude')])}° N ${esc(r[col('Longitude')])}° E</small></li>`);
  const incRows = (inc?.records ?? []).map(r => `<li>${esc(lang === 'ne' && r.titleNe ? r.titleNe : r.title)}<br><small>${esc(when(r.incidentOn, { dateStyle: 'medium' }))}, ${esc(r.verified ? c.verified : c.unverified)}</small></li>`);
  const alerts = src['bipad-alerts']?.content?.records ?? [];
  const links = ['dhm-forecast', 'dhm-flood-archive'].flatMap(id => src[id]?.content?.links ?? []);
  const nd = src['ndrrma-home'], none = `<p class="muted">${esc(c.noRecords)}</p>`;

  // The copy itself: one ruled row per source, its state, and what was copied when opened.
  const bodies = {
    'bipad-river': (alertRows.length ? table(c.alertCaption, [c.station, c.status, { t: `${c.level}, m`, n: 1 }, { t: c.warning, n: 1 }, { t: c.danger, n: 1 }, c.time, c.basin], alertRows) : `<p class="statement">${esc(river ? c.allBelow : c.unknown)}</p>`)
      + (stale ? `<p class="muted">${esc(c.staleFlags(num(stale)))}</p>` : ''),
    'bipad-rain': (wet.length ? table(c.wettest, [c.station, { t: `${c.h24}, mm`, n: 1 }, { t: `${c.h1}, mm`, n: 1 }, c.time, c.basin], wet) : `<p class="statement">${esc(rain ? c.noRain : c.unknown)}</p>`)
      + (rain?.implausible_24h ? `<p class="muted">${esc(c.implausible(num(rain.implausible_24h)))}</p>` : ''),
    'seismo-earthquakes': quakeRows.length ? `<ul class="plain">${more(quakeRows)}</ul>` : none,
    'bipad-incidents': incRows.length ? `<ul class="plain">${more(incRows)}</ul>` : none,
    'bipad-alerts': alerts.length ? `<ul class="plain">${more(alerts.map(a => `<li>${esc(lang === 'ne' && a.titleNe ? a.titleNe : a.title)}</li>`))}</ul>` : none,
    'dhm-forecast': links.length ? `<ul class="plain">${more(links.map(l => `<li><a href="${esc(l.href)}" rel="noopener">${esc(l.text)}</a></li>`), 2)}</ul>` : none,
    'dhm-flood-archive': (src['dhm-flood-archive']?.content?.links ?? []).length ? '' : none,
    'ndrrma-home': nd?.content?.paragraphs?.length ? `<div lang="ne">${nd.content.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}</div>` : none,
  };
  const rows = Object.keys(bodies).filter(id => src[id]).map(id => `<details class="source" id="src-${id}"${id === 'bipad-river' && alertRows.length ? ' open' : ''}>
    <summary><span class="name">${esc(c.sourceTitles[id] ?? src[id].title)}</span>${tag(src[id])}</summary>
    <div class="body">${bodies[id]}${from(src[id])}</div></details>`).join('');
  box.innerHTML = (days >= 2 ? `<p class="note warn">${esc(c.oldCopy(num(days)))}</p>` : '') + (history ? trends(history) : '') + section('copy', c.copyTitle, `<div class="sources">${rows}</div>`);
}

// A ledger link opens the row it points to.
addEventListener('click', e => { const id = e.target.closest('a[href^="#src-"]')?.hash.slice(1); if (id) document.getElementById(id)?.setAttribute('open', ''); });
// The 30-day history is optional: if it cannot load, Today still shows the morning's copy.
const go = () => Promise.all([load('/data/gov/latest.json'), load('/data/gov/history.json').catch(() => null)]).then(([g, h]) => render(g, h), () => failed(ledgerBox, go));
go();
