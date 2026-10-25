'use client';
import { digits, useCopy, useLanguage, type Lang } from '../../lib/i18n';
import { nepalTime, useGovDigest, type Digest, type Entry, type ListContent, type Page, type RainContent, type River, type RiverContent, type Scalar, type Table } from '../../lib/gov-digest';
import { Badge, type Tone } from '../../components/ui';
import { OFFICIAL } from './copy';

type C = (typeof OFFICIAL)['en'];
const CATEGORIES = ['rivers', 'rainfall', 'floods', 'weather', 'disasters', 'earthquakes'];
/** BIPAD station status codes; English keeps the published wording (lower-cased). */
const STATUS_NE: Record<string, string> = { 'ABOVE DANGER LEVEL': 'खतरा तहभन्दा माथि', 'ABOVE WARNING LEVEL': 'चेतावनी तहभन्दा माथि', 'BELOW WARNING LEVEL': 'चेतावनी तहभन्दा तल' };
/** The same codes as badge tones: the published word is always shown, the glyph and colour only repeat it. */
const STATUS_TONE: Record<string, Tone> = { 'ABOVE DANGER LEVEL': 'danger', 'ABOVE WARNING LEVEL': 'warning', 'BELOW WARNING LEVEL': 'normal' };
const status = (value: string, lang: Lang) => lang === 'ne' ? STATUS_NE[value] ?? value.toLowerCase() : value.toLowerCase();
/** Shown as plain columns; ids and the Nepali title stay in the data but not in the English table. */
const HIDDEN_COLUMNS = new Set(['id', 'titleNe']);
const num = (value: number | null | undefined, unit: string, lang: Lang, c: C) => value === null || value === undefined ? c.unknown : `${digits(value.toLocaleString('en-US', { maximumFractionDigits: 2 }), lang)} ${unit}`;
const time = (value: string | null | undefined, lang: Lang, c: C) => (lang === 'ne' ? nepalTime(value, 'ne-NP') : nepalTime(value)) ?? c.unknown;
const sourceState = (entry: Entry) => entry.last_known ? 'last-known' : entry.status;

function statusText(entry: Entry, lang: Lang, c: C) {
  if (entry.status === 'fetched') return c.copied(time(entry.fetched_at, lang, c));
  const reason = entry.status === 'blocked-by-robots' ? c.reasonRobots : entry.status === 'unreachable' ? c.reasonUnreachable(entry.http_status === null || entry.http_status === undefined ? c.unknown : String(entry.http_status)) : c.reasonUnreadable;
  return entry.last_known ? c.lastKnown(reason, time(entry.fetched_at, lang, c)) : c.checked(reason, time(entry.checked_at, lang, c));
}

function StationStatus({ code }: { code: string }) {
  const [lang] = useLanguage();
  const tone = STATUS_TONE[code];
  return tone ? <Badge tone={tone}>{status(code, lang)}</Badge> : <>{status(code, lang)}</>;
}

function TableView({ table, fallbackCaption }: { table: Table; fallbackCaption: string }) {
  const c = useCopy(OFFICIAL);
  return <div className="official-table-wrap"><table className="stack-mobile">
    <caption>{table.caption ?? c.asPublished(fallbackCaption)}</caption>
    {table.header.length > 0 && <thead><tr>{table.header.map((cell, i) => <th key={i} scope="col">{cell}</th>)}</tr></thead>}
    <tbody>{table.rows.slice(0, 40).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
  </table>{table.rows.length > 40 && <p className="muted">{c.rowsShown(table.rows.length)}</p>}</div>;
}

function Counts({ counts }: { counts: Record<string, number> | undefined }) {
  const [lang] = useLanguage();
  const c = useCopy(OFFICIAL);
  return counts ? <dl className="official-counts">{Object.entries(counts).map(([code, n]) => <div key={code} data-tone={STATUS_TONE[code]}><dt>{status(code, lang)}</dt><dd>{lang === 'ne' ? c.count(n) : n}</dd></div>)}</dl> : null;
}

const freshness = (content: RiverContent | RainContent, c: C) => content.current_station_count === undefined
  ? c.freshnessUnknown(content.station_count)
  : c.freshness(content.current_station_count, content.station_count, content.fresh_hours ?? 24);

function RiverRows({ stations, caption }: { stations: River[]; caption: string }) {
  const [lang] = useLanguage();
  const c = useCopy(OFFICIAL);
  return <div className="official-table-wrap"><table className="stack-mobile">
    <caption>{caption}</caption>
    <thead><tr><th scope="col">{c.station}</th><th scope="col">{c.basin}</th><th scope="col">{c.status}</th><th scope="col">{c.waterLevel}</th><th scope="col">{c.warning}</th><th scope="col">{c.danger}</th><th scope="col">{c.readingTime}</th></tr></thead>
    <tbody>{stations.map(s => <tr key={s.id} data-status={s.status}><th scope="row">{s.name ?? c.unknown}</th><td>{s.basin ?? c.unknown}</td><td><StationStatus code={s.status} /></td><td>{num(s.water_level_m, 'm', lang, c)}</td><td>{num(s.warning_level_m, 'm', lang, c)}</td><td>{num(s.danger_level_m, 'm', lang, c)}</td><td>{time(s.observed_at, lang, c)}</td></tr>)}</tbody>
  </table></div>;
}

function RiverView({ content, entry }: { content: RiverContent; entry: Entry }) {
  const [lang] = useLanguage();
  const c = useCopy(OFFICIAL);
  const stale = content.stale_alert_stations ?? [];
  return <>
    <p className="muted">{freshness(content, c)}</p>
    <Counts counts={content.current_status_counts ?? content.status_counts} />
    {content.alert_stations.length ? <RiverRows stations={content.alert_stations} caption={c.aboveCaption} /> : <p>{c.noneAbove}</p>}
    {stale.length > 0 && <details className="official-stale"><summary>{c.staleFlags(stale.length)}</summary>
      <RiverRows stations={stale} caption={c.staleCaption} /></details>}
    {entry.changes?.status_changes?.length ? <p className="official-change">{c.changed} {entry.changes.status_changes.map(change => `${change.name ?? change.id} ${change.from ? status(change.from, lang) : c.unknown} → ${status(change.to, lang)}`).join('; ')}{c.changedEnd}</p> : null}
  </>;
}

function RainView({ content }: { content: RainContent }) {
  const [lang] = useLanguage();
  const c = useCopy(OFFICIAL);
  return <>
    <p className="muted">{freshness(content, c)}{content.implausible_24h ? c.implausible(content.implausible_24h) : ''}</p>
    <Counts counts={content.current_status_counts ?? content.status_counts} />
    {content.wettest_24h.length ? <div className="official-table-wrap"><table className="stack-mobile">
      <caption>{c.wettestCaption}</caption>
      <thead><tr><th scope="col">{c.station}</th><th scope="col">{c.basin}</th><th scope="col">{c.h24}</th><th scope="col">{c.h1}</th><th scope="col">{c.status}</th><th scope="col">{c.readingTime}</th></tr></thead>
      <tbody>{content.wettest_24h.map(s => <tr key={s.id}><th scope="row">{s.name ?? c.unknown}</th><td>{s.basin ?? c.unknown}</td><td>{num(s.rain_24h_mm, 'mm', lang, c)}</td><td>{num(s.rain_1h_mm, 'mm', lang, c)}</td><td><StationStatus code={s.status} /></td><td>{time(s.observed_at, lang, c)}</td></tr>)}</tbody>
    </table></div> : <p>{c.noWettest}</p>}
  </>;
}

function cell(value: Scalar, column: string, lang: Lang, c: C) {
  if (value === null || value === '') return c.unknown;
  if (typeof value === 'boolean') return value ? c.yes : c.no;
  return /On$/.test(column) ? time(String(value), lang, c) : String(value);
}

function ListView({ content, entry }: { content: ListContent; entry: Entry }) {
  const [lang] = useLanguage();
  const c = useCopy(OFFICIAL);
  const fresh = new Set((entry.changes?.new_records ?? []).map(r => JSON.stringify(r.id ?? r)));
  const columns = content.columns.filter(column => !HIDDEN_COLUMNS.has(column));
  const days = content.within_days ?? null;
  // In Nepali the agency's own Nepali title (titleNe) is shown where it was published; otherwise the published title.
  const value = (r: Record<string, Scalar>, column: string) => lang === 'ne' && column === 'title' && typeof r.titleNe === 'string' && r.titleNe ? r.titleNe : r[column] ?? null;
  if (!content.records.length) return <p>{c.noRecords(days)}</p>;
  return <div className="official-table-wrap"><table className="stack-mobile">
    <caption>{c.recordsCaption(content.record_count, content.complete !== false, days, Math.min(content.records.length, 25))}</caption>
    <thead><tr>{columns.map(column => <th key={column} scope="col">{c.columns[column] ?? column}</th>)}</tr></thead>
    <tbody>{content.records.slice(0, 25).map((r, i) => <tr key={i}>{columns.map((column, j) => <td key={column}>{cell(value(r, column), column, lang, c)}{j === 0 && fresh.has(JSON.stringify(r.id ?? r)) && <span className="official-new">{c.isNew}</span>}</td>)}</tr>)}</tbody>
  </table></div>;
}

function PageView({ content, entry }: { content: Page; entry: Entry }) {
  const c = useCopy(OFFICIAL);
  const fresh = new Set((entry.changes?.new_links ?? []).map(link => link.href));
  const links = [...content.links].sort((a, b) => Number(fresh.has(b.href)) - Number(fresh.has(a.href)) || Number(b.document) - Number(a.document)).slice(0, 14);
  return <>
    {content.headings.length > 0 && <ul className="official-headings">{content.headings.slice(0, 6).map(h => <li key={h}>{h}</li>)}</ul>}
    {content.paragraphs.slice(0, 4).map(p => <p key={p} className="official-quote">{p}</p>)}
    {content.tables.slice(0, 2).map((table, i) => <TableView key={i} table={table} fallbackCaption={c.titles[entry.id] ?? entry.title} />)}
    {links.length > 0 && <ul className="official-links">{links.map(link => <li key={link.href}><a href={link.href} rel="noopener noreferrer" target="_blank">{link.text}</a>{fresh.has(link.href) && <span className="official-new">{c.isNew}</span>}{link.document && <span className="muted">{c.document}</span>}</li>)}</ul>}
  </>;
}

const STATE_TONE: Record<string, Tone> = { fetched: 'info', 'last-known': 'warning' };
function EntryView({ entry }: { entry: Entry }) {
  const [lang] = useLanguage();
  const c = useCopy(OFFICIAL);
  const content = entry.content;
  const state = sourceState(entry);
  return <article className="official-entry" data-source-status={state} aria-labelledby={`official-${entry.id}`}>
    <header>
      <h3 id={`official-${entry.id}`}>{c.titles[entry.id] ?? entry.title}</h3>
      <p className="muted">{entry.agency}</p>
      <p className={`official-status official-status-${state}`}><Badge tone={STATE_TONE[state] ?? 'none'}>{statusText(entry, lang, c)}</Badge></p>
    </header>
    {!content ? <p>{c.noCopy}</p>
      : entry.kind === 'bipad-river' ? <RiverView content={content as RiverContent} entry={entry} />
        : entry.kind === 'bipad-rain' ? <RainView content={content as RainContent} />
          : entry.kind === 'json-list' ? <ListView content={content as ListContent} entry={entry} />
            : <PageView content={content as Page} entry={entry} />}
    <p className="official-agency"><a href={entry.url} rel="noopener noreferrer" target="_blank">{c.openAgency}</a></p>
  </article>;
}

export function OfficialSources() {
  const [state, retry] = useGovDigest();
  const c = useCopy(OFFICIAL);
  return <div className="page official-page" data-official-state={state.status}>
    <header className="official-hero">
      <h1>{c.title}</h1>
      <p className="intro">{c.intro}</p>
      <aside className="official-authorities" aria-label={c.authoritiesLabel}>{c.authorities}</aside>
    </header>
    {state.status === 'loading' && <><p role="status">{c.loading}</p><div className="official-summary-placeholder" aria-hidden="true" /></>}
    {state.status === 'missing' && <p role="status">{c.missing}</p>}
    {state.status === 'error' && <div role="alert"><p>{c.failed(state.message)}</p><button type="button" onClick={retry}>{c.retry}</button></div>}
    {state.status === 'ready' && <Ready digest={state.digest} />}
  </div>;
}

function Ready({ digest }: { digest: Digest }) {
  const [lang] = useLanguage();
  const c = useCopy(OFFICIAL);
  const s = digest.summary;
  const raised = (n: number | null) => n !== null && n > 0;
  return <>
    <dl className="official-summary" aria-label={c.summary}>
      <div><dt>{c.sumCopied}</dt><dd>{digits(digest.generated_at_nepal, lang)}</dd></div>
      <div data-tone={raised(s.rivers_above_danger) ? 'danger' : undefined}><dt>{c.sumDanger}</dt><dd>{c.count(s.rivers_above_danger)}</dd></div>
      <div data-tone={raised(s.rivers_above_warning) ? 'warning' : undefined}><dt>{c.sumWarning}</dt><dd>{c.count(s.rivers_above_warning)}</dd></div>
      <div data-tone={raised(s.rain_stations_above_warning) ? 'warning' : undefined}><dt>{c.sumRain}</dt><dd>{c.count(s.rain_stations_above_warning)}</dd></div>
      <div><dt>{c.sumSources}</dt><dd>{c.sourcesRead(s.sources_fetched, digest.sources.length)}</dd></div>
    </dl>
    {s.sources_last_known > 0 && <p className="official-change">{c.fromEarlier(s.sources_last_known)}</p>}
    <nav className="official-jump" aria-label={c.sections}>{CATEGORIES.filter(key => digest.sources.some(e => e.category === key)).map(key => <a key={key} href={`#official-${key}`}>{c.categories[key]}</a>)}</nav>
    {CATEGORIES.map(key => {
      const entries = digest.sources.filter(e => e.category === key);
      return entries.length ? <section key={key} id={`official-${key}`} className="official-section" aria-labelledby={`official-${key}-heading`}>
        <h2 id={`official-${key}-heading`}>{c.categories[key]}</h2>
        {entries.map(entry => <EntryView key={entry.id} entry={entry} />)}
      </section> : null;
    })}
  </>;
}
