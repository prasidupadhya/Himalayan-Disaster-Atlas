'use client';
import { formatNumber, type Lang } from '../../lib/i18n';
import { shortTime, ROUTE } from './copy';
import { districtSequence } from './route';
import { PROVINCE_NE, useRoute } from './route-data';
import type { LonLat } from './scene-3d';


/** The route of a corridor path in words: start, districts in order with arrival times, candidate rivers, nearby towns, and where it leaves Nepal. */
export function RouteList({ id, line, pathKm, centralCelerity, lang }: { id: string; line: LonLat[]; pathKm: number; centralCelerity: number; lang: Lang }) {
  const c = ROUTE[lang];
  const { route, failed } = useRoute(id, line, pathKm);
  if (failed) return <section className="sim-route" aria-labelledby="sim-route-title"><h3 id="sim-route-title">{c.title}</h3><p className="sim-muted">{c.failed}</p></section>;
  if (!route) return <section className="sim-route" aria-labelledby="sim-route-title"><h3 id="sim-route-title">{c.title}</h3><p className="sim-muted" role="status">{c.loading}</p></section>;
  const province = (en: string | null, code: string | null) => en ? c.province(lang === 'ne' && code && PROVINCE_NE[code] ? PROVINCE_NE[code] : en) : c.outside;
  const km = (v: number) => formatNumber(v, lang, 0), at = (v: number) => shortTime(v * 1000 / centralCelerity, lang);
  const unit = (u: typeof route.start) => u.inNepal ? [u.local, u.district, province(u.province, u.provinceCode)].filter(Boolean).join(', ') : c.outside;
  const towns = route.places.filter(p => p.kind !== 'village'), villages = route.places.filter(p => p.kind === 'village');
  return <section className="sim-route" aria-labelledby="sim-route-title" data-route-districts={districtSequence(route).filter(d => d.inNepal).length}>
    <h3 id="sim-route-title">{c.title}</h3>
    <p><strong>{c.starts}:</strong> {unit(route.start)}{c.stop}</p>
    <p className="sim-muted">{c.districts}</p>
    <ol className="sim-route-districts">{districtSequence(route).filter(d => d.inNepal).map((d, i) => <li key={`${d.district}-${i}`}>
      <strong>{d.district ?? 'UNKNOWN'}</strong>, {d.provinces.length > 1 ? d.provinces.map(p => province(p, null)).join(' / ') : province(d.province, d.provinceCode)} <span className="sim-muted">{c.stretch(km(d.fromKm), km(d.toKm), at(d.fromKm))}</span>{d.boundary && <span className="sim-muted"> · {c.boundary}</span>}
    </li>)}</ol>
    <p>{route.leavesNepalKm !== null ? c.leaves(km(route.leavesNepalKm), at(route.leavesNepalKm)) : <><strong>{c.ends}:</strong> {unit(route.end)}{c.stop}</>}</p>
    <h4>{c.rivers}</h4>
    {route.rivers.length ? <ul className="sim-route-rivers">{route.rivers.map(r => <li key={`${r.name}-${r.fromKm}`}>{r.name} <span className="sim-muted">(km {km(r.fromKm)})</span></li>)}</ul> : <p>{c.none}</p>}
    <p className="sim-muted">{c.riversNote}</p>
    <h4>{c.places}</h4>
    {towns.length ? <ul className="sim-route-places">{towns.map(p => <li key={`${p.name}-${p.km}`}>{p.name} <span className="sim-muted">(km {km(p.km)})</span></li>)}</ul> : <p>{c.none}</p>}
    <p className="sim-muted">{c.placesNote(formatNumber(villages.length, lang))}</p>
    <p className="sim-muted sim-route-source">{c.source}</p>
  </section>;
}
