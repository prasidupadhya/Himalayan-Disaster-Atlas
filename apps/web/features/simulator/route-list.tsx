'use client';
import { formatNumber, type Lang } from '../../lib/i18n';
import { shortTime } from './copy';
import { districtSequence } from './route';
import { PROVINCE_NE, useRoute } from './route-data';
import type { LonLat } from './scene-3d';

const COPY = {
  en: {
    title: 'Where the path runs', loading: 'Loading boundaries, river and place names…', failed: 'Place names could not be verified; the distances above still hold.',
    starts: 'Starts in', ends: 'The mapped path ends in', leaves: (km: string, t: string) => `Reaches the Nepal border about ${km} km downstream; the central front would get there after ${t}.`,
    districts: 'Districts in order, with the stretch of path in each and when the central front would enter it',
    stretch: (from: string, to: string, t: string) => `km ${from}–${to} · front from ${t}`,
    rivers: 'Named stream points the path passes', riversNote: 'GeoNames points within 1.5 km of the path line, with the km where the path passes them. A point can mark a mouth or another reference location, so this is for orientation only and does not name the river the path follows.',
    places: 'Cities and towns near the path line', placesNote: (n: string) => `OpenStreetMap settlements within 4 km of the line (villages within 1 km: ${n}). Near the line does not mean affected: this scenario has no flood extent.`,
    none: 'None found', province: (n: string) => `${n} Province`, outside: 'outside Nepal', stop: '.', boundary: 'the river forms the district boundary here',
    source: 'Boundaries: COD-AB v02 (Survey Department of Nepal, UN OCHA). Settlements: © OpenStreetMap contributors (ODbL). Stream names: GeoNames (CC BY 4.0).',
  },
  ne: {
    title: 'मार्ग कहाँबाट जान्छ', loading: 'सीमा, नदी र ठाउँका नाम लोड हुँदैछन्…', failed: 'ठाउँका नाम प्रमाणित गर्न सकिएन; माथिका दूरी यथावत् छन्।',
    starts: 'सुरु हुने ठाउँ', ends: 'नक्सांकित मार्ग यहाँ सकिन्छ', leaves: (km: string, t: string) => `करिब ${km} km तल नेपालको सिमानामा पुग्छ; केन्द्रीय अग्रभाग ${t} पछि त्यहाँ पुग्नेछ।`,
    districts: 'क्रमअनुसार जिल्लाहरू, हरेकमा पर्ने मार्गको भाग र केन्द्रीय अग्रभाग प्रवेश गर्ने समय',
    stretch: (from: string, to: string, t: string) => `km ${from}–${to} · अग्रभाग ${t} देखि`,
    rivers: 'मार्गले पार गर्ने नाम भएका खोला बिन्दुहरू', riversNote: 'मार्ग रेखाबाट १.५ km भित्रका GeoNames बिन्दुहरू, मार्गले तिनलाई पार गर्ने km सहित। बिन्दुले दोभान वा अन्य सन्दर्भ स्थान जनाउन सक्छ, त्यसैले यो दिशानिर्देशका लागि मात्र हो; मार्गले पछ्याउने नदीको नाम होइन।',
    places: 'मार्ग रेखा नजिकका सहर र नगर', placesNote: (n: string) => `रेखाबाट ४ km भित्रका OpenStreetMap बस्तीहरू (१ km भित्रका गाउँ: ${n})। रेखा नजिक हुनु प्रभावित हुनु होइन: यस परिदृश्यमा बाढी फैलावट छैन।`,
    none: 'भेटिएन', province: (n: string) => `${n} प्रदेश`, outside: 'नेपाल बाहिर', stop: '।', boundary: 'यहाँ नदीले जिल्ला सिमाना बनाउँछ',
    source: 'सीमा: COD-AB v02 (नापी विभाग, UN OCHA)। बस्ती: © OpenStreetMap योगदानकर्ता (ODbL)। खोला नाम: GeoNames (CC BY 4.0)।',
  },
} as const;

/** The route of a corridor path in words: start, districts in order with arrival times, candidate rivers, nearby towns, and where it leaves Nepal. */
export function RouteList({ id, line, pathKm, centralCelerity, lang }: { id: string; line: LonLat[]; pathKm: number; centralCelerity: number; lang: Lang }) {
  const c = COPY[lang];
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
