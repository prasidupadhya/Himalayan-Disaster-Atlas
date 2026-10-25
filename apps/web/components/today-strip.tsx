'use client';
import Link from 'next/link';
import { findEntry, recentQuakes, useGovDigest, type ListContent } from '../lib/gov-digest';
import { formatNumber, useCopy, useLanguage } from '../lib/i18n';
import { TODAY_STRIP } from './copy';


/** Today's headline figures from the daily official copy, as published; the full picture is on /hazards/. */
export function TodayStrip() {
  const [state] = useGovDigest();
  const [lang] = useLanguage();
  const c = useCopy(TODAY_STRIP);
  const count = (value: number | null | undefined) => formatNumber(value ?? null, lang);
  if (state.status !== 'ready') {
    return <aside className="today-strip" aria-label={c.region} data-today-state={state.status}>
      <p className="today-strip-note">{state.status === 'loading' ? c.loading : c.unavailable} <Link href="/hazards/">{c.open}</Link></p>
    </aside>;
  }
  const { digest } = state;
  const s = digest.summary;
  const incidents = findEntry(digest, 'bipad-incidents')?.content as ListContent | undefined;
  const latest = recentQuakes(digest, 1)?.[0];
  const riverAlerts = s.rivers_above_danger === null || s.rivers_above_warning === null ? null : s.rivers_above_danger + s.rivers_above_warning;
  return <aside className="today-strip" aria-label={c.region} data-today-state="ready">
    <dl>
      <div><dt>{c.rivers}</dt><dd>{count(riverAlerts)}</dd><dd className="today-strip-sub">{count(s.rivers_current)} {c.reported}</dd></div>
      <div><dt>{c.rain}</dt><dd>{count(s.rain_stations_above_warning)}</dd><dd className="today-strip-sub">{count(s.rain_current)} {c.reported}</dd></div>
      <div><dt>{c.incidents}</dt><dd>{incidents ? `${count(incidents.record_count)}${incidents.complete === false ? '+' : ''}` : count(null)}</dd><dd className="today-strip-sub">{c.bipad}</dd></div>
      <div><dt>{c.quake}</dt><dd>{latest?.magnitude ?? count(null)}</dd><dd className="today-strip-sub">{latest ? [latest.epicentre ?? 'UNKNOWN', latest.date].filter(Boolean).join(', ') : 'NEMRC'}</dd></div>
    </dl>
    <p className="today-strip-note">{c.note(digest.generated_at_nepal)} <Link href="/hazards/">{c.full}</Link></p>
  </aside>;
}
