// Place search for the Map and Scenarios pages: districts, cities, towns, villages, peaks, stream names and the verified
// glacial-lake release points, matched in English or Nepali as each source publishes them. No names are translated here.
// The index and ranking are plain functions (tested in Node); `searchBox` adds the combobox to a page.

import { districtFinder } from './places.js';

/** Lower case, Latin accents removed, so "Trishuli̇̄" matches "trishuli". Devanagari is kept as written. */
export const fold = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const latin = s => /^[\p{Script=Latin}\d\s'’().,-]+$/u.test(s);
const bboxOf = g => {
  const pts = g.type === 'Polygon' ? g.coordinates.flat() : g.coordinates.flat(2), xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return [[Math.min(...xs), Math.min(...ys)], [Math.max(...xs), Math.max(...ys)]];
};
/** Loads every source once and builds the index. `load` fetches a release file; `where(p)` names a point's district. */
export async function placeIndex(load, lakeWords) {
  const f = d => load(`/data/${d}/features.geojson.gz`).then(fc => fc.features);
  const [districts, settlements, peaks, streams, cat] = await Promise.all([f('nepal-admin-districts/2.0.1'), f('nepal-osm-settlements/1.0.0'),
    f('nepal-mountains/1.0.0'), f('nepal-river-names/1.0.0'), load('/data/atlas-flood-corridors/1.0.0/catalogue.json.gz')]);
  return { index: buildIndex({ districts, settlements, peaks, streams, origins: cat.origins, lakeWords }), where: districtFinder(districts) };
}

// Ties in score are broken by kind: a district before a city before a peak, and a stream point last.
export const KINDS = ['district', 'lake', 'city', 'peak', 'town', 'village', 'stream'];

/**
 * One searchable entry per place: { kind, name, alt, terms, p, bbox?, id?, data }.
 * `lakeWords` are extra words that find every verified lake, such as "lake" in each language.
 */
export function buildIndex({ districts = [], settlements = [], peaks = [], streams = [], origins = [], lakeWords = [] }) {
  const out = [], add = (e, terms, names = 1) => out.push({ ...e, names, terms: [...new Set(terms.filter(Boolean).map(fold))].filter(t => t.length) });
  for (const f of districts) {
    const p = f.properties;
    add({ kind: 'district', name: p.name, id: p.pcode, p: [p.label_longitude, p.label_latitude], bbox: bboxOf(f.geometry), data: { province: p.parent_name } }, [p.name, ...(p.aliases ?? [])]);
  }
  for (const f of settlements) {
    const p = f.properties;
    // Only names OpenStreetMap publishes: the release fills `name` with a placeholder where `asset_name` is empty.
    if (!['city', 'town', 'village'].includes(p.asset_subtype) || !p.asset_name) continue;
    const skip = new Set([p.source_id, p.osm_element_id, p.asset_subtype, 'settlement']);
    const terms = (p.search_terms ?? []).filter(t => !skip.has(t));
    const alt = terms.find(t => t !== p.asset_name && latin(t)) ?? null;
    // The English form OpenStreetMap publishes counts as a name, not an alias.
    add({ kind: p.asset_subtype, name: p.asset_name, alt, id: p.source_id, p: f.geometry.coordinates }, [p.asset_name, alt, ...terms], alt ? 2 : 1);
  }
  for (const f of peaks) {
    const p = f.properties;
    if (p.name) add({ kind: 'peak', name: p.name, id: p.source_id, p: f.geometry.coordinates, data: { elevation: p.value } }, [p.name, ...(p.aliases ?? [])]);
  }
  for (const f of streams) {
    const p = f.properties;
    if (p.name) add({ kind: 'stream', name: p.name, id: p.source_id, p: f.geometry.coordinates }, [p.name, ...(p.aliases ?? [])]);
  }
  for (const o of origins) {
    if (!o.lake) continue;
    // The lakes have no published names; they are found by basin, the nearest stream name and the word for a lake.
    add({ kind: 'lake', name: null, id: o.id, p: [o.lake.longitude, o.lake.latitude], data: o },
      [o.lake.basin, o.gazetteer_hint?.name, o.lake.glo_id, ...lakeWords]);
  }
  return out;
}

/** 0 exact, 1 start of the name, 2 start of a later word, 3 anywhere; half a point more for an alias; null when nothing matches. */
function score({ terms, names }, q) {
  let best = null;
  terms.forEach((t, i) => {
    const s = t === q ? 0 : t.startsWith(q) ? 1 : t.includes(` ${q}`) || t.includes(`-${q}`) ? 2 : t.includes(q) ? 3 : null;
    const v = s === null ? null : s + (i < names ? 0 : 0.5);
    if (v !== null && (best === null || v < best)) best = v;
  });
  return best;
}

/**
 * The best matches for a query, best first. `where(p)` may name the district of a point, so that two places
 * with the same name in different districts both show, and the same stream name in one district shows once.
 */
export function search(index, query, { limit = 8, where = () => null } = {}) {
  const q = fold(query);
  if (q.length < 2) return [];
  const hits = [];
  for (const e of index) { const s = score(e, q); if (s !== null) hits.push({ e, s }); }
  hits.sort((a, b) => a.s - b.s || KINDS.indexOf(a.e.kind) - KINDS.indexOf(b.e.kind) || (a.e.name ?? '').length - (b.e.name ?? '').length);
  const seen = new Set(), out = [];
  for (const { e } of hits) {
    const district = e.kind === 'district' ? null : where(e.p);
    const key = `${e.kind}|${fold(e.name ?? e.id)}|${district?.name ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key); out.push({ ...e, district });
    if (out.length === limit) break;
  }
  return out;
}

/**
 * The combobox (WAI-ARIA 1.2 pattern): a text input that opens a list of results; arrow keys move, Enter picks,
 * Escape closes and then clears. `index()` returns a promise of the index, loaded on first focus.
 * `pick(result)` acts on the chosen place.
 */
export function searchBox(box, { c, esc, num, lang, index, pick }) {
  const id = box.id || 'search';
  box.classList.add('search');
  box.innerHTML = `<label class="field" for="${id}-q"><span>${esc(c.searchLabel)}</span>
    <input id="${id}-q" type="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-list" autocomplete="off" spellcheck="false" placeholder="${esc(c.searchPlaceholder)}"></label>
    <div class="drop" hidden><ul id="${id}-list" role="listbox" aria-label="${esc(c.searchLabel)}"></ul><p class="src">${esc(c.searchSource)}</p></div><p class="sr-only" aria-live="polite"></p>`;
  const input = box.querySelector('input'), drop = box.querySelector('.drop'), list = box.querySelector('ul'), live = box.querySelector('.sr-only');
  let items = [], active = -1, data = null, failed = false, seq = 0;
  const load = () => data ??= index().catch(e => { data = null; failed = true; throw e; });
  input.addEventListener('focus', () => { load().catch(() => {}); }, { once: true });

  const open = on => { drop.hidden = !on; input.setAttribute('aria-expanded', String(on)); if (!on) setActive(-1); };
  function setActive(i) {
    active = i;
    list.querySelectorAll('[role=option]').forEach((li, j) => li.setAttribute('aria-selected', String(j === i)));
    if (i < 0) input.removeAttribute('aria-activedescendant');
    else { input.setAttribute('aria-activedescendant', `${id}-o${i}`); list.children[i]?.scrollIntoView({ block: 'nearest' }); }
  }
  async function update() {
    const run = ++seq, q = input.value;
    if (fold(q).length < 2) { items = []; list.innerHTML = ''; live.textContent = ''; open(false); return; }
    let idx;
    try { idx = await load(); } catch { if (run === seq) { list.innerHTML = `<li class="none">${esc(c.failed)}</li>`; open(true); } return; }
    if (run !== seq) return;
    items = search(idx.index, q, { where: idx.where });
    list.innerHTML = items.length ? items.map((r, i) => { const [name, detail] = describe(r, { c, num, lang });
      return `<li role="option" id="${id}-o${i}" aria-selected="false" data-i="${i}"><span class="k k-${r.kind}" aria-hidden="true"></span><b>${esc(name)}</b><small>${esc(detail)}</small></li>`; }).join('')
      : `<li class="none">${esc(c.searchNone)}</li>`;
    live.textContent = items.length ? c.searchCount(num(items.length)) : c.searchNone;
    const was = drop.hidden;
    open(true);
    setActive(-1);
    // On a phone the list can open below the screen edge: when it first opens, bring the field to the top of the free space.
    // The field's scroll margin (CSS) keeps it clear of the header and of a pinned map.
    if (was && matchMedia('(max-width: 47.5rem)').matches) box.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function choose(i) {
    const r = items[i];
    if (!r) return;
    input.value = describe(r, { c, num, lang })[0];
    open(false);
    pick(r);
  }
  input.addEventListener('input', update);
  input.addEventListener('keydown', e => {
    const n = items.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (drop.hidden) { if (input.value) update(); return; }
      if (n) setActive(e.key === 'ArrowDown' ? (active + 1) % n : (active - 1 + n) % n);
    } else if (e.key === 'Enter') {
      if (!drop.hidden && n) { e.preventDefault(); choose(active < 0 ? 0 : active); }
    } else if (e.key === 'Escape') {
      if (!drop.hidden) { e.preventDefault(); open(false); } else if (input.value) { e.preventDefault(); input.value = ''; update(); }
    }
  });
  // Mouse and touch: pick without taking focus from the input first.
  drop.addEventListener('pointerdown', e => e.preventDefault());
  list.addEventListener('click', e => { const li = e.target.closest('[data-i]'); if (li) choose(+li.dataset.i); });
  input.addEventListener('blur', () => setTimeout(() => open(false), 0));
  return { input, get failed() { return failed; } };
}

/** [name, detail] for a result, in the page language. Names stay as published; the other script is shown beside them. */
export function describe(r, { c, num, lang }) {
  const kind = c.placeKinds[r.kind], where = r.district ? c.inDistrict(r.district.name) : r.kind === 'district' ? null : c.outsideNepal;
  if (r.kind === 'district') return [r.name, [kind, c.provinces[r.data.province] ?? r.data.province].filter(Boolean).join(', ')];
  if (r.kind === 'lake') {
    const o = r.data, near = o.gazetteer_hint?.name ? c.near(o.gazetteer_hint.name) : null;
    return [`${c.lake}, ${o.lake.basin}`, [`${num(o.lake.area_km2, 2)} km²`, `${num(o.lake.elevation_mean_m)} m`, near, where].filter(Boolean).join(', ')];
  }
  // Settlements: OpenStreetMap publishes most names in Nepali with an English form; lead with the page's language.
  const [main, other] = lang === 'en' && r.alt ? [r.alt, r.name] : [r.name, r.alt];
  return [main, [kind, other, r.kind === 'peak' && r.data.elevation != null ? `${num(r.data.elevation)} m` : null, where].filter(Boolean).join(', ')];
}

/** The details shown on the map for a chosen place. */
export function placeHtml(r, { c, esc, num, lang }, extra = '') {
  const [name, detail] = describe(r, { c, num, lang });
  const note = r.kind === 'stream' ? `<p class="muted">${esc(c.streamPoint)}</p>` : '';
  return `<h3>${esc(name)}</h3><p>${esc(detail)}</p>${note}${extra}`;
}

/** Moves the camera to a result: a district to its bounds, a point to a zoom that suits its kind. */
export function flyTo(map, r, reduced) {
  const duration = reduced ? 0 : 900;
  if (r.bbox) map.fitBounds(r.bbox, { padding: 40, duration });
  else map.flyTo({ center: r.p, zoom: { city: 11, town: 12, village: 13, peak: 11, stream: 12, lake: 11 }[r.kind] ?? 11, duration });
}
