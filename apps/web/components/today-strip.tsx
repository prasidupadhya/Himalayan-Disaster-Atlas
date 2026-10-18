'use client';
import Link from 'next/link';
import { findEntry, recentQuakes, useGovDigest, type ListContent } from '../lib/gov-digest';

const count = (value: number | null | undefined) => value === null || value === undefined ? 'UNKNOWN' : value.toLocaleString('en-US');

/** Today's headline figures from the daily official copy, as published; the full picture is on /hazards/. */
export function TodayStrip() {
  const [state] = useGovDigest();
  if (state.status !== 'ready') {
    return <aside className="today-strip" aria-label="Today from official sources" data-today-state={state.status}>
      <p className="today-strip-note">{state.status === 'loading' ? 'Loading today’s official figures…' : 'Today’s official figures are not available right now.'} <Link href="/hazards/">Open Today</Link></p>
    </aside>;
  }
  const { digest } = state;
  const s = digest.summary;
  const incidents = findEntry(digest, 'bipad-incidents')?.content as ListContent | undefined;
  const latest = recentQuakes(digest, 1)?.[0];
  const riverAlerts = s.rivers_above_danger === null || s.rivers_above_warning === null ? null : s.rivers_above_danger + s.rivers_above_warning;
  return <aside className="today-strip" aria-label="Today from official sources" data-today-state="ready">
    <dl>
      <div><dt>Rivers above warning or danger</dt><dd>{count(riverAlerts)}</dd><dd className="today-strip-sub">{count(s.rivers_current)} stations reported in 24 h</dd></div>
      <div><dt>Rain stations above warning</dt><dd>{count(s.rain_stations_above_warning)}</dd><dd className="today-strip-sub">{count(s.rain_current)} stations reported in 24 h</dd></div>
      <div><dt>Incidents in the last 7 days</dt><dd>{incidents ? `${count(incidents.record_count)}${incidents.complete === false ? '+' : ''}` : 'UNKNOWN'}</dd><dd className="today-strip-sub">BIPAD, all types</dd></div>
      <div><dt>Latest earthquake</dt><dd>{latest?.magnitude ?? 'UNKNOWN'}</dd><dd className="today-strip-sub">{latest ? [latest.epicentre ?? 'UNKNOWN', latest.date].filter(Boolean).join(', ') : 'NEMRC'}</dd></div>
    </dl>
    <p className="today-strip-note">Official copy of {digest.generated_at_nepal}, as published. Not a warning. <Link href="/hazards/">See today in full</Link></p>
  </aside>;
}
