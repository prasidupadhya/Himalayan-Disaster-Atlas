'use client';
import type { ReactNode } from 'react';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import { findEntry, nepalTime, recentQuakes, useGovDigest, type Digest, type Entry, type ListContent, type Page, type RainContent, type RiverContent } from '../../lib/gov-digest';
import { formatNumber, useLanguage, type Lang } from '../../lib/i18n';
import { QuakeMap, RainBars, StatusBar, type StatusPart } from '../../components/today-visuals';
import { Badge } from '../../components/ui';
import { hz, type HzCopy } from './copy';

/** "Today": the daily official copy, arranged around floods, glacial lakes and earthquakes. */
export function Hazards() {
  const [lang] = useLanguage();
  const c = hz(lang);
  const [state, retry] = useGovDigest();
  const digest = state.status === 'ready' ? state.digest : null;
  const sections: Array<[string, string]> = [['floods', c.floods], ['glacial-lakes', c.glof], ['earthquakes', c.quakes], ['incidents', c.incidents]];

  return <div className="hz-page" lang={lang} data-today-state={state.status}>
    <header className="hz-hero">
      <div className="hz-hero-top"><p className="eyebrow">{c.eyebrow}</p></div>
      <h1>{c.title}</h1>
      <p className="intro">{c.intro}</p>
      <p className="hz-authorities">{c.authorities} {LIVE_AUTHORITIES.map((a, i) => <span key={a.name}>{i > 0 && ' · '}<a href={a.url} rel="noopener">{a.name}</a></span>)}</p>
      {digest && <p className="hz-copied">{c.copiedAt} {digest.generated_at_nepal} · <a href="/official/">{c.all}</a></p>}
      {digest && <StaleNote digest={digest} c={c} lang={lang} />}
      {digest && <Glance digest={digest} c={c} lang={lang} />}
      {state.status === 'loading' && <div className="hz-glance-placeholder" aria-hidden="true" />}
      <nav className="hz-jump" aria-label={c.jump}>{sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
    </header>
    {state.status === 'loading' && <p role="status" className="hz-loading">{c.loading}</p>}
    {state.status === 'missing' && <p role="status">{c.missing}</p>}
    {state.status === 'error' && <div className="hz-problem" role="alert"><p><strong>{c.failed}</strong> {state.message}</p><button type="button" onClick={retry}>{c.retry}</button></div>}

    <Section id="floods" title={c.floods} lead={c.floodsLead}>
      {digest && <Floods digest={digest} c={c} lang={lang} />}
      <p className="hz-actions"><a href="/atlas/#river-controls">{c.toMapRivers}</a><a href="/simulate/">{c.toFloodScenario}</a></p>
    </Section>
    <Section id="glacial-lakes" title={c.glof} lead={c.glofLead}>
      <p className="hz-actions"><a className="primary-action" href="/atlas/#lake-controls">{c.toMapLakes}</a><a href="/simulate/">{c.toFloodScenario}</a></p>
    </Section>
    <Section id="earthquakes" title={c.quakes} lead={c.quakesLead}>
      {digest && <Earthquakes digest={digest} c={c} lang={lang} />}
      <p className="hz-actions"><a href="/simulate/?tab=earthquake">{c.toQuakeScenario}</a><a href="/live/">{c.toLive}</a></p>
    </Section>
    <Section id="incidents" title={c.incidents} lead={c.incidentsLead}>
      {digest && <Incidents entry={findEntry(digest, 'bipad-incidents')} c={c} lang={lang} />}
    </Section>
  </div>;
}

function Section({ id, title, lead, children }: { id: string; title: string; lead: string; children: ReactNode }) {
  return <section id={id} className="hz-section" aria-labelledby={`${id}-title`}>
    <div className="hz-section-head"><h2 id={`${id}-title`}>{title}</h2></div>
    <p className="hz-lead">{lead}</p>
    {children}
  </section>;
}

function useFormat(lang: Lang) {
  const n = (v: number | null | undefined) => v === null || v === undefined ? 'UNKNOWN' : formatNumber(v, lang);
  const counted = (content: ListContent) => `${n(content.record_count)}${content.complete === false ? '+' : ''}`;
  const titleOf = (record: Record<string, unknown>) => String((lang === 'ne' && record.titleNe) || record.title || 'UNKNOWN');
  return { n, counted, titleOf };
}

function Floods({ digest, c, lang }: { digest: Digest; c: HzCopy; lang: Lang }) {
  const { n, counted, titleOf } = useFormat(lang);
  const s = digest.summary;
  const river = findEntry(digest, 'bipad-river'), rain = findEntry(digest, 'bipad-rain'), alerts = findEntry(digest, 'bipad-alerts');
  const bulletins = findEntry(digest, 'dhm-flood-archive'), warnings = findEntry(digest, 'dhm-forecast');
  const riverContent = river?.content as RiverContent | undefined, rainContent = rain?.content as RainContent | undefined;
  const alertList = alerts?.content as ListContent | undefined;
  const wettest = rainContent?.wettest_24h[0];
  const reported = (content: RiverContent | RainContent) => `${n(content.current_station_count)} / ${n(content.station_count)}`;
  const documents = [...((warnings?.content as Page | undefined)?.links ?? []).slice(0, 1), ...((bulletins?.content as Page | undefined)?.links ?? []).slice(0, 2)];
  // Only readings from the last 24 h are split by status; the rest of the network is "no reading", never "normal".
  const parts = (content: RiverContent | RainContent | undefined, danger: boolean): StatusPart[] => {
    const counts = content?.current_status_counts;
    const get = (status: string) => counts ? counts[status] ?? 0 : null;
    const none = content?.current_station_count === undefined ? null : content.station_count - content.current_station_count;
    return [...(danger ? [{ key: 'danger' as const, label: c.partDanger, count: get('ABOVE DANGER LEVEL') }] : []),
      { key: 'warning', label: c.partWarning, count: get('ABOVE WARNING LEVEL') }, { key: 'normal', label: c.partNormal, count: get('BELOW WARNING LEVEL') }, { key: 'none', label: c.partNone, count: none }];
  };
  return <>
  {(riverContent || rainContent) && <div className="hz-visuals">
    {riverContent && <StatusBar title={c.statusRivers} parts={parts(riverContent, true)} />}
    {rainContent && <StatusBar title={c.statusRain} parts={parts(rainContent, false)} />}
    {rainContent && <RainBars stations={rainContent.wettest_24h} title={c.wettestTitle} format={mm => `${formatNumber(mm, lang, 1)} mm`} />}
  </div>}
  <ul className="hz-cards hz-today">
    <TodayCard entry={river} title={c.rivers} anchor="rivers" c={c} lang={lang}>
      {riverContent && <p className="hz-figure"><strong>{n(s.rivers_above_danger)}</strong> {c.aboveDanger} · <strong>{n(s.rivers_above_warning)}</strong> {c.aboveWarning}</p>}
      {riverContent && <p>{reported(riverContent)} {c.reported}</p>}
      {riverContent?.alert_stations.slice(0, 3).map(st => <p key={st.id}>{st.name ?? 'UNKNOWN'}{st.basin ? ` (${st.basin})` : ''}: {st.status.toLowerCase()}</p>)}
    </TodayCard>
    <TodayCard entry={rain} title={c.rain} anchor="rainfall" c={c} lang={lang}>
      {rainContent && <p className="hz-figure"><strong>{n(s.rain_stations_above_warning)}</strong> {c.rainAbove}</p>}
      {rainContent && <p>{reported(rainContent)} {c.reported}</p>}
      {wettest && <p>{c.wettest} {wettest.name ?? 'UNKNOWN'}, {wettest.rain_24h_mm === null ? 'UNKNOWN' : `${formatNumber(wettest.rain_24h_mm, lang, 1)} mm`}</p>}
    </TodayCard>
    <TodayCard entry={bulletins} title={c.bulletins} anchor="floods" c={c} lang={lang}>
      {documents.length ? <ul className="hz-documents">{documents.map(doc => <li key={doc.href}><a href={doc.href} rel="noopener noreferrer" target="_blank">{doc.text}</a></li>)}</ul> : bulletins?.content && <p>{c.noText}</p>}
      {documents.length > 0 && <p className="hz-today-status">{c.asListed}</p>}
    </TodayCard>
    <TodayCard entry={alerts} title={c.alerts} anchor="disasters" c={c} lang={lang}>
      {alertList && <p className="hz-figure"><strong>{counted(alertList)}</strong> {c.activeAlerts}</p>}
      {alertList?.records.slice(0, 3).map(record => <p key={String(record.id)} className="hz-verbatim">{titleOf(record)}</p>)}
    </TodayCard>
  </ul>
  </>;
}

/** Whole days between an AD date and the copy's Nepal date; null when either is unreadable. */
function daysBefore(date: string | null, digest: Digest) {
  const copy = digest.generated_at_nepal.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!date || !copy) return null;
  const days = Math.round((Date.parse(copy) - Date.parse(date)) / 86_400_000);
  return Number.isFinite(days) && days >= 0 ? days : null;
}

function Earthquakes({ digest, c, lang }: { digest: Digest; c: HzCopy; lang: Lang }) {
  const entry = findEntry(digest, 'seismo-earthquakes');
  const quakes = recentQuakes(digest);
  return <ul className="hz-cards hz-today">
    <TodayCard entry={entry} title={c.quakeList} anchor="earthquakes" c={c} lang={lang} wide>
      {quakes?.length ? <div className="hz-quake-layout"><QuakeMap quakes={quakes} title={c.quakeMapTitle} newestLabel={c.newest} note={c.quakeMapNote} /><div className="hz-table-wrap"><table className="hz-quakes stack-mobile">
        <caption className="sr-only">{c.quakeList}</caption>
        <thead><tr><th scope="col">{c.quakeDate}</th><th scope="col">{c.quakeMagnitude}</th><th scope="col">{c.quakeEpicentre}</th></tr></thead>
        <tbody>{quakes.map((q, i) => {
          const days = daysBefore(q.date, digest);
          return <tr key={i} title={q.raw}>
            <td><span>{q.date ?? q.raw}{q.time && <span className="hz-sub"> {q.time} {c.localTime}</span>}{days !== null && <span className="hz-sub hz-age">{c.daysBefore(formatNumber(days, lang), days)}</span>}</span></td>
            <td className="hz-mag">{q.magnitude ?? 'UNKNOWN'}</td>
            <td className="hz-verbatim">{q.epicentre ?? 'UNKNOWN'}</td>
          </tr>;
        })}</tbody>
      </table></div></div> : entry?.content && <p>{c.noQuakes}</p>}
    </TodayCard>
  </ul>;
}

/** One line per hazard, figures exactly as the copy states them; each links to its section. */
function Glance({ digest, c, lang }: { digest: Digest; c: HzCopy; lang: Lang }) {
  const { n, counted } = useFormat(lang);
  const s = digest.summary;
  const incidents = findEntry(digest, 'bipad-incidents')?.content as ListContent | undefined;
  const latest = recentQuakes(digest, 1)?.[0];
  const raised = (value: number | null) => value !== null && value > 0;
  const items: Array<{ id: string; label: string; text: string; raised?: boolean }> = [
    { id: 'floods', label: c.floods, text: c.glanceRivers(n(s.rivers_above_danger), n(s.rivers_above_warning), n(s.rain_stations_above_warning)), raised: raised(s.rivers_above_danger) || raised(s.rivers_above_warning) || raised(s.rain_stations_above_warning) },
    { id: 'glacial-lakes', label: c.glof, text: c.glanceLakes },
    { id: 'earthquakes', label: c.quakes, text: latest ? c.glanceQuake(latest.magnitude ?? 'UNKNOWN', latest.epicentre ?? 'UNKNOWN', latest.date ?? 'UNKNOWN') : 'UNKNOWN' },
    { id: 'incidents', label: c.incidents, text: incidents ? c.glanceIncidents(counted(incidents)) : 'UNKNOWN' },
  ];
  return <ul className="hz-glance" aria-label={c.glance}>{items.map(item => <li key={item.id} data-hazard={item.id} data-raised={item.raised ? 'true' : undefined}>
    <a href={`#${item.id}`}><strong>{item.raised && <span aria-hidden="true">▲ </span>}{item.label}</strong><span>{item.text}</span></a>
  </li>)}</ul>;
}

function Incidents({ entry, c, lang }: { entry: Entry | undefined; c: HzCopy; lang: Lang }) {
  const { counted, titleOf } = useFormat(lang);
  const list = entry?.content as ListContent | undefined;
  return <ul className="hz-cards hz-today">
    <TodayCard entry={entry} title={c.incidentList} anchor="disasters" c={c} lang={lang} wide>
      {list && <p className="hz-figure"><strong>{counted(list)}</strong> {c.records}</p>}
      {list && <ul className="hz-incidents">{list.records.slice(0, 8).map(record => <li key={String(record.id)} className="hz-verbatim">{titleOf(record)}</li>)}</ul>}
    </TodayCard>
  </ul>;
}

function TodayCard({ entry, title, anchor, c, lang, wide, children }: { entry: Entry | undefined; title: string; anchor: string; c: HzCopy; lang: Lang; wide?: boolean; children: ReactNode }) {
  const when = nepalTime(entry?.fetched_at, lang === 'ne' ? 'ne-NP' : 'en-GB');
  const status = !entry?.content ? c.unavailable : entry.last_known ? `${c.lastKnown} ${when ?? 'UNKNOWN'}` : `${c.copied} ${when ?? 'UNKNOWN'}`;
  // The copy's state as a badge: copied today, an older (last known) copy, or nothing available.
  const tone = !entry?.content ? 'none' : entry.last_known ? 'warning' : 'info';
  return <li className={wide ? 'hz-card hz-card-wide' : 'hz-card'} data-source={entry?.id} data-source-status={!entry?.content ? 'unavailable' : entry.last_known ? 'last-known' : 'fetched'}>
    <h3>{title}</h3>
    <p className="hz-today-status"><Badge tone={tone}>{status}</Badge></p>
    {entry?.content ? children : null}
    {entry && <p className="muted">{entry.agency}</p>}
    <p className="hz-card-links"><a href={`/official/#official-${anchor}`}>{c.full}</a>{entry && <a href={entry.url} rel="noopener noreferrer" target="_blank">{c.agency}</a>}</p>
  </li>;
}

/** Says plainly when today's copy could not reach some agencies, and how old the oldest copy shown is. */
function StaleNote({ digest, c, lang }: { digest: Digest; c: HzCopy; lang: Lang }) {
  const old = digest.sources.filter(e => e.last_known);
  if (!old.length) return null;
  const oldest = old.map(e => e.fetched_at).filter((v): v is string => !!v).sort()[0];
  const since = nepalTime(oldest, lang === 'ne' ? 'ne-NP' : 'en-GB') ?? 'UNKNOWN';
  return <p className="hz-stale" role="note"><span aria-hidden="true">⚠ </span>{c.staleNote(formatNumber(old.length, lang), formatNumber(digest.sources.length, lang), since)}</p>;
}
