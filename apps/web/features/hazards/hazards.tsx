'use client';
import type { ReactNode } from 'react';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import { findEntry, nepalTime, useGovDigest, type Digest, type Entry, type ListContent, type Page, type RainContent, type RiverContent } from '../../lib/gov-digest';
import { formatNumber, LanguageSwitch, useLanguage, type Lang } from '../../lib/i18n';
import { hz, type HzCopy } from './copy';

const column = (header: string[], pattern: RegExp) => header.findIndex(h => pattern.test(h));

/** "Today": the daily official copy, arranged around floods, glacial lakes and earthquakes. */
export function Hazards() {
  const [lang, setLang] = useLanguage();
  const c = hz(lang);
  const [state, retry] = useGovDigest();
  const digest = state.status === 'ready' ? state.digest : null;
  const sections: Array<[string, string]> = [['floods', c.floods], ['glacial-lakes', c.glof], ['earthquakes', c.quakes], ['incidents', c.incidents]];

  return <div className="hz-page" lang={lang} data-today-state={state.status}>
    <header className="hz-hero">
      <div className="hz-hero-top"><p className="eyebrow">{c.eyebrow}</p><LanguageSwitch lang={lang} onChange={setLang} /></div>
      <h1>{c.title}</h1>
      <p className="intro">{c.intro}</p>
      <p className="hz-authorities">{c.authorities} {LIVE_AUTHORITIES.map((a, i) => <span key={a.name}>{i > 0 && ' · '}<a href={a.url} rel="noopener">{a.name}</a></span>)}</p>
      {digest && <p className="hz-copied">{c.copiedAt} {digest.generated_at_nepal} · <a href="/official/">{c.all}</a></p>}
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
      {digest && <Earthquakes entry={findEntry(digest, 'seismo-earthquakes')} c={c} lang={lang} />}
      <p className="hz-actions"><a href="/atlas/#earthquake-controls">{c.toMapQuakes}</a><a href="/simulate/?tab=earthquake">{c.toQuakeScenario}</a><a href="/live/">{c.toLive}</a></p>
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
  return <ul className="hz-cards hz-today">
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
  </ul>;
}

function Earthquakes({ entry, c, lang }: { entry: Entry | undefined; c: HzCopy; lang: Lang }) {
  const table = (entry?.content as Page | undefined)?.tables.find(t => column(t.header, /magnitude/i) >= 0);
  const cols = table ? [/date/i, /magnitude/i, /epicent/i].map(re => column(table.header, re)) : [];
  return <ul className="hz-cards hz-today">
    <TodayCard entry={entry} title={c.quakeList} anchor="earthquakes" c={c} lang={lang} wide>
      {table ? <ol className="hz-quakes">{table.rows.slice(0, 6).map((row, i) => <li key={i} className="hz-verbatim">{cols.map(index => row[index]).filter(Boolean).join(' · ')}</li>)}</ol> : entry?.content && <p>{c.noQuakes}</p>}
    </TodayCard>
  </ul>;
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
  return <li className={wide ? 'hz-card hz-card-wide' : 'hz-card'} data-source={entry?.id} data-source-status={!entry?.content ? 'unavailable' : entry.last_known ? 'last-known' : 'fetched'}>
    <h3>{title}</h3>
    <p className="hz-today-status">{status}</p>
    {entry?.content ? children : null}
    {entry && <p className="muted">{entry.agency}</p>}
    <p className="hz-card-links"><a href={`/official/#official-${anchor}`}>{c.full}</a>{entry && <a href={entry.url} rel="noopener noreferrer" target="_blank">{c.agency}</a>}</p>
  </li>;
}
