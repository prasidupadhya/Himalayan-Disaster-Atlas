'use client';
import { nepalTime, useGovDigest, type Digest, type Entry, type ListContent, type Page, type RainContent, type RiverContent, type Scalar, type Table } from '../../lib/gov-digest';

const CATEGORIES: Array<[string, string]> = [['weather', 'Weather'], ['floods', 'Floods'], ['rivers', 'River levels'], ['rainfall', 'Rainfall'], ['disasters', 'Disasters and alerts'], ['earthquakes', 'Earthquakes'], ['air-quality', 'Air quality'], ['roads', 'Roads'], ['notices', 'Notices']];
const UNKNOWN = 'UNKNOWN';
const num = (value: number | null | undefined, unit: string) => value === null || value === undefined ? UNKNOWN : `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${unit}`;
const count = (value: number | null) => value === null ? UNKNOWN : value.toLocaleString('en-US');
const time = (value: string | null | undefined) => nepalTime(value) ?? UNKNOWN;

function statusText(entry: Entry) {
  if (entry.status === 'fetched') return `Copied ${time(entry.fetched_at)}`;
  const reason = entry.status === 'blocked-by-robots' ? 'The site’s robots.txt does not allow this copy' : entry.status === 'unreachable' ? `The site answered HTTP ${entry.http_status ?? UNKNOWN}` : 'The page could not be read';
  return entry.last_known ? `${reason}; showing the last copy from ${time(entry.fetched_at)}` : `${reason} at ${time(entry.checked_at)}`;
}

function TableView({ table }: { table: Table }) {
  return <div className="official-table-wrap"><table>
    {table.caption && <caption>{table.caption}</caption>}
    {table.header.length > 0 && <thead><tr>{table.header.map((cell, i) => <th key={i} scope="col">{cell}</th>)}</tr></thead>}
    <tbody>{table.rows.slice(0, 40).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
  </table>{table.rows.length > 40 && <p className="muted">Showing 40 of {table.rows.length} rows. The full table is on the source page.</p>}</div>;
}

function RiverView({ content, entry }: { content: RiverContent; entry: Entry }) {
  return <>
    <dl className="official-counts">{Object.entries(content.status_counts).map(([status, n]) => <div key={status}><dt>{status.toLowerCase()}</dt><dd>{n}</dd></div>)}</dl>
    {content.alert_stations.length ? <div className="official-table-wrap"><table>
      <caption>Stations above warning or danger level</caption>
      <thead><tr><th scope="col">Station</th><th scope="col">Basin</th><th scope="col">Status</th><th scope="col">Water level</th><th scope="col">Warning</th><th scope="col">Danger</th><th scope="col">Reading time</th></tr></thead>
      <tbody>{content.alert_stations.map(s => <tr key={s.id} data-status={s.status}><th scope="row">{s.name ?? UNKNOWN}</th><td>{s.basin ?? UNKNOWN}</td><td>{s.status.toLowerCase()}</td><td>{num(s.water_level_m, 'm')}</td><td>{num(s.warning_level_m, 'm')}</td><td>{num(s.danger_level_m, 'm')}</td><td>{time(s.observed_at)}</td></tr>)}</tbody>
    </table></div> : <p>No station is above warning level in this copy of {content.station_count} stations.</p>}
    {entry.changes?.status_changes?.length ? <p className="official-change">Changed since the previous copy: {entry.changes.status_changes.map(c => `${c.name ?? c.id} ${c.from?.toLowerCase() ?? UNKNOWN} → ${c.to.toLowerCase()}`).join('; ')}.</p> : null}
  </>;
}

function RainView({ content }: { content: RainContent }) {
  return <>
    <dl className="official-counts">{Object.entries(content.status_counts).map(([status, n]) => <div key={status}><dt>{status.toLowerCase()}</dt><dd>{n}</dd></div>)}</dl>
    {content.wettest_24h.length ? <div className="official-table-wrap"><table>
      <caption>Wettest stations, last 24 hours</caption>
      <thead><tr><th scope="col">Station</th><th scope="col">Basin</th><th scope="col">24 h</th><th scope="col">1 h</th><th scope="col">Status</th><th scope="col">Reading time</th></tr></thead>
      <tbody>{content.wettest_24h.map(s => <tr key={s.id}><th scope="row">{s.name ?? UNKNOWN}</th><td>{s.basin ?? UNKNOWN}</td><td>{num(s.rain_24h_mm, 'mm')}</td><td>{num(s.rain_1h_mm, 'mm')}</td><td>{s.status.toLowerCase()}</td><td>{time(s.observed_at)}</td></tr>)}</tbody>
    </table></div> : <p>No station reported a 24-hour total in this copy.</p>}
  </>;
}

function cell(value: Scalar) { return value === null || value === '' ? UNKNOWN : typeof value === 'boolean' ? (value ? 'yes' : 'no') : String(value); }

function ListView({ content, entry }: { content: ListContent; entry: Entry }) {
  const fresh = new Set((entry.changes?.new_records ?? []).map(r => JSON.stringify(r.id ?? r)));
  if (!content.records.length) return <p>The source returned no records in this copy.</p>;
  return <div className="official-table-wrap"><table>
    <caption>{content.record_count.toLocaleString('en-US')} records; first {Math.min(content.records.length, 25)} shown as published</caption>
    <thead><tr>{content.columns.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead>
    <tbody>{content.records.slice(0, 25).map((r, i) => <tr key={i}>{content.columns.map((c, j) => <td key={c}>{cell(r[c] ?? null)}{j === 0 && fresh.has(JSON.stringify(r.id ?? r)) && <span className="official-new">new</span>}</td>)}</tr>)}</tbody>
  </table></div>;
}

function PageView({ content, entry }: { content: Page; entry: Entry }) {
  const fresh = new Set((entry.changes?.new_links ?? []).map(link => link.href));
  const links = [...content.links].sort((a, b) => Number(fresh.has(b.href)) - Number(fresh.has(a.href)) || Number(b.document) - Number(a.document)).slice(0, 14);
  return <>
    {content.headings.length > 0 && <ul className="official-headings">{content.headings.slice(0, 6).map(h => <li key={h}>{h}</li>)}</ul>}
    {content.paragraphs.slice(0, 4).map(p => <p key={p} className="official-quote">{p}</p>)}
    {content.tables.slice(0, 2).map((table, i) => <TableView key={i} table={table} />)}
    {links.length > 0 && <ul className="official-links">{links.map(link => <li key={link.href}><a href={link.href} rel="noopener noreferrer" target="_blank">{link.text}</a>{fresh.has(link.href) && <span className="official-new">new</span>}{link.document && <span className="muted"> document</span>}</li>)}</ul>}
  </>;
}

function EntryView({ entry }: { entry: Entry }) {
  const content = entry.content;
  return <article className="official-entry" data-source-status={entry.last_known ? 'last-known' : entry.status} aria-labelledby={`official-${entry.id}`}>
    <header>
      <h3 id={`official-${entry.id}`}>{entry.title}</h3>
      <p className="muted">{entry.agency}</p>
      <p className={`official-status official-status-${entry.last_known ? 'last-known' : entry.status}`}>{statusText(entry)}</p>
    </header>
    {!content ? <p>No copy is available yet. Open the agency page for the current information.</p>
      : entry.kind === 'bipad-river' ? <RiverView content={content as RiverContent} entry={entry} />
        : entry.kind === 'bipad-rain' ? <RainView content={content as RainContent} />
          : entry.kind === 'json-list' ? <ListView content={content as ListContent} entry={entry} />
            : <PageView content={content as Page} entry={entry} />}
    <p><a href={entry.url} rel="noopener noreferrer" target="_blank">Open the agency page</a></p>
  </article>;
}

export function OfficialSources() {
  const [state, retry] = useGovDigest();

  return <div className="page official-page" data-official-state={state.status}>
    <h1>Official sources today</h1>
    <p className="intro">A daily, organised copy of public Nepal government pages: weather forecasts, river and rainfall readings, earthquakes and notices. Text is copied as published. The agency websites are authoritative and may have changed since the copy below.</p>
    <aside className="official-authorities" aria-label="Authoritative sources">
      <p><strong>For warnings and decisions, use the agencies directly:</strong> <a href="https://dhm.gov.np/mfd/" rel="noopener noreferrer" target="_blank">DHM forecasts</a>, <a href="https://ndrrma.gov.np/" rel="noopener noreferrer" target="_blank">NDRRMA</a> and <a href="https://bipadportal.gov.np/" rel="noopener noreferrer" target="_blank">BIPAD</a>.</p>
    </aside>
    {state.status === 'loading' && <p role="status">Loading today’s copy…</p>}
    {state.status === 'missing' && <p role="status">The first daily copy has not been published yet. It is made each morning at about 06:00 Nepal time.</p>}
    {state.status === 'error' && <div role="alert"><p>{state.message}</p><button type="button" onClick={retry}>Try again</button></div>}
    {state.status === 'ready' && <Ready digest={state.digest} />}
  </div>;
}

function Ready({ digest }: { digest: Digest }) {
  const s = digest.summary;
  return <>
    <dl className="official-summary" aria-label="Summary of this copy">
      <div><dt>Copied</dt><dd>{digest.generated_at_nepal}</dd></div>
      <div><dt>Rivers above danger level</dt><dd>{count(s.rivers_above_danger)}</dd></div>
      <div><dt>Rivers above warning level</dt><dd>{count(s.rivers_above_warning)}</dd></div>
      <div><dt>Rain stations above warning level</dt><dd>{count(s.rain_stations_above_warning)}</dd></div>
      <div><dt>Sources read today</dt><dd>{s.sources_fetched} of {digest.sources.length}</dd></div>
    </dl>
    {s.sources_last_known > 0 && <p className="official-change">{s.sources_last_known} source{s.sources_last_known === 1 ? ' is' : 's are'} shown from an earlier copy because today’s read failed.</p>}
    <nav className="official-jump" aria-label="Sections">{CATEGORIES.filter(([key]) => digest.sources.some(e => e.category === key)).map(([key, label]) => <a key={key} href={`#official-${key}`}>{label}</a>)}</nav>
    {CATEGORIES.map(([key, label]) => {
      const entries = digest.sources.filter(e => e.category === key);
      return entries.length ? <section key={key} id={`official-${key}`} className="official-section" aria-labelledby={`official-${key}-heading`}>
        <h2 id={`official-${key}-heading`}>{label}</h2>
        {entries.map(entry => <EntryView key={entry.id} entry={entry} />)}
      </section> : null;
    })}
  </>;
}
