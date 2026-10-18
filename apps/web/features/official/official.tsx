'use client';
import { digits, formatNumber, useLanguage, type Lang } from '../../lib/i18n';
import { nepalTime, useGovDigest, type Digest, type Entry, type ListContent, type Page, type RainContent, type River, type RiverContent, type Scalar, type Table } from '../../lib/gov-digest';

const CATEGORIES: Array<[string, string, string]> = [['rivers', 'River levels', 'नदीको जलसतह'], ['rainfall', 'Rainfall', 'वर्षा'], ['floods', 'Flood bulletins', 'बाढी बुलेटिन'], ['weather', 'Weather warnings', 'मौसम चेतावनी'], ['disasters', 'Incidents and alerts', 'घटना र अलर्ट'], ['earthquakes', 'Earthquakes', 'भूकम्प']];
/** Project-authored Nepali names for the digest's own (English) source titles; agency names and copied content stay as published. */
const TITLES_NE: Record<string, string> = { 'bipad-river': 'नदीको जलसतह', 'bipad-rain': 'वर्षा मापन स्टेसनहरू', 'dhm-flood-archive': 'बाढी बुलेटिन र स्थिति प्रतिवेदन', 'dhm-forecast': 'मौसम चेतावनी र सूचना', 'seismo-earthquakes': 'हालैका भूकम्प', 'bipad-incidents': 'विपद् घटना, पछिल्लो ७ दिन', 'bipad-alerts': 'सक्रिय र हालैका अलर्ट', 'ndrrma-home': 'NDRRMA को २४ घण्टे सारांश र सूचना' };
/** BIPAD station status codes; English keeps the published wording (lower-cased). */
const STATUS_NE: Record<string, string> = { 'ABOVE DANGER LEVEL': 'खतरा तहभन्दा माथि', 'ABOVE WARNING LEVEL': 'चेतावनी तहभन्दा माथि', 'BELOW WARNING LEVEL': 'चेतावनी तहभन्दा तल' };
const status = (value: string, lang: Lang) => lang === 'ne' ? STATUS_NE[value] ?? value.toLowerCase() : value.toLowerCase();
/** Shown as plain columns; ids and the Nepali title stay in the data but not in the English table. */
const HIDDEN_COLUMNS = new Set(['id', 'titleNe']);
const LABELS: Record<string, string> = { title: 'Title', incidentOn: 'Date', verified: 'Verified', source: 'Source', createdOn: 'Issued', expireOn: 'Expires' };
const LABELS_NE: Record<string, string> = { title: 'शीर्षक', incidentOn: 'मिति', verified: 'प्रमाणित', source: 'स्रोत', createdOn: 'जारी मिति', expireOn: 'समाप्त हुने मिति' };
const UNKNOWN = 'UNKNOWN';
const unknown = (lang: Lang) => lang === 'ne' ? 'अज्ञात (UNKNOWN)' : UNKNOWN;
const num = (value: number | null | undefined, unit: string, lang: Lang = 'en') => value === null || value === undefined ? unknown(lang) : `${digits(value.toLocaleString('en-US', { maximumFractionDigits: 2 }), lang)} ${unit}`;
const count = (value: number | null, lang: Lang = 'en') => lang === 'ne' ? formatNumber(value, lang) : value === null ? UNKNOWN : value.toLocaleString('en-US');
const time = (value: string | null | undefined, lang: Lang = 'en') => (lang === 'ne' ? nepalTime(value, 'ne-NP') : nepalTime(value)) ?? unknown(lang);

function statusText(entry: Entry, lang: Lang) {
  if (lang === 'ne') {
    if (entry.status === 'fetched') return `${time(entry.fetched_at, lang)} मा प्रतिलिपि गरिएको`;
    const reason = entry.status === 'blocked-by-robots' ? 'साइटको robots.txt ले यो प्रतिलिपि गर्न अनुमति दिँदैन' : entry.status === 'unreachable' ? `साइटले HTTP ${entry.http_status ?? unknown(lang)} जवाफ दियो` : 'पृष्ठ पढ्न सकिएन';
    return entry.last_known ? `${reason}; ${time(entry.fetched_at, lang)} को पछिल्लो प्रति देखाइएको छ` : `${reason} (${time(entry.checked_at, lang)} मा जाँच गरिएको)`;
  }
  if (entry.status === 'fetched') return `Copied ${time(entry.fetched_at)}`;
  const reason = entry.status === 'blocked-by-robots' ? 'The site’s robots.txt does not allow this copy' : entry.status === 'unreachable' ? `The site answered HTTP ${entry.http_status ?? UNKNOWN}` : 'The page could not be read';
  return entry.last_known ? `${reason}; showing the last copy from ${time(entry.fetched_at)}` : `${reason} at ${time(entry.checked_at)}`;
}

function TableView({ table, fallbackCaption }: { table: Table; fallbackCaption: string }) {
  const [lang] = useLanguage();
  return <div className="official-table-wrap"><table>
    <caption>{table.caption ?? (lang === 'ne' ? `${fallbackCaption}, प्रकाशित रूपमा` : `${fallbackCaption}, as published`)}</caption>
    {table.header.length > 0 && <thead><tr>{table.header.map((cell, i) => <th key={i} scope="col">{cell}</th>)}</tr></thead>}
    <tbody>{table.rows.slice(0, 40).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
  </table>{table.rows.length > 40 && <p className="muted">{lang === 'ne' ? `${digits(String(table.rows.length), lang)} मध्ये ४० पङ्क्ति देखाइएको। पूरा तालिका स्रोत पृष्ठमा छ।` : <>Showing 40 of {table.rows.length} rows. The full table is on the source page.</>}</p>}</div>;
}

function Counts({ counts }: { counts: Record<string, number> | undefined }) {
  const [lang] = useLanguage();
  return counts ? <dl className="official-counts">{Object.entries(counts).map(([code, n]) => <div key={code}><dt>{status(code, lang)}</dt><dd>{lang === 'ne' ? formatNumber(n, lang) : n}</dd></div>)}</dl> : null;
}

const freshness = (content: RiverContent | RainContent, lang: Lang) => lang === 'ne'
  ? content.current_station_count === undefined
    ? `यस प्रतिमा ${digits(String(content.station_count), lang)} मापनमध्ये कुन हालसालैका हुन् भन्ने उल्लेख छैन।`
    : `यो प्रति बनाउनुअघिको ${digits(String(content.fresh_hours ?? 24), lang)} घण्टाभित्र ${digits(String(content.station_count), lang)} मध्ये ${digits(String(content.current_station_count), lang)} स्टेसनले मापन पठाएका छन्। पुराना मापन गणना गरिएका छैनन्।`
  : content.current_station_count === undefined
    ? `This copy does not record which of the ${content.station_count} readings are recent.`
    : `${content.current_station_count} of ${content.station_count} stations reported in the ${content.fresh_hours ?? 24} hours before this copy. Older readings are not counted.`;

function RiverRows({ stations, caption }: { stations: River[]; caption: string }) {
  const [lang] = useLanguage();
  const ne = lang === 'ne';
  return <div className="official-table-wrap"><table>
    <caption>{caption}</caption>
    <thead><tr><th scope="col">{ne ? 'स्टेसन' : 'Station'}</th><th scope="col">{ne ? 'नदी बेसिन' : 'Basin'}</th><th scope="col">{ne ? 'अवस्था' : 'Status'}</th><th scope="col">{ne ? 'जलसतह' : 'Water level'}</th><th scope="col">{ne ? 'चेतावनी तह' : 'Warning'}</th><th scope="col">{ne ? 'खतरा तह' : 'Danger'}</th><th scope="col">{ne ? 'मापन समय' : 'Reading time'}</th></tr></thead>
    <tbody>{stations.map(s => <tr key={s.id} data-status={s.status}><th scope="row">{s.name ?? unknown(lang)}</th><td>{s.basin ?? unknown(lang)}</td><td>{status(s.status, lang)}</td><td>{num(s.water_level_m, 'm', lang)}</td><td>{num(s.warning_level_m, 'm', lang)}</td><td>{num(s.danger_level_m, 'm', lang)}</td><td>{time(s.observed_at, lang)}</td></tr>)}</tbody>
  </table></div>;
}

function RiverView({ content, entry }: { content: RiverContent; entry: Entry }) {
  const [lang] = useLanguage();
  const ne = lang === 'ne';
  const stale = content.stale_alert_stations ?? [];
  return <>
    <p className="muted">{freshness(content, lang)}</p>
    <Counts counts={content.current_status_counts ?? content.status_counts} />
    {content.alert_stations.length ? <RiverRows stations={content.alert_stations} caption={ne ? 'चेतावनी वा खतरा तहभन्दा माथि रहेका स्टेसनहरू' : 'Stations above warning or danger level'} />
      : <p>{ne ? 'हालसालैको कुनै पनि मापन चेतावनी तहभन्दा माथि छैन।' : 'No recent reading is above warning level.'}</p>}
    {stale.length > 0 && <details className="official-stale"><summary>{ne ? `${digits(String(stale.length), lang)} स्टेसनमा पुरानो मापनको चेतावनी वा खतरा संकेत अझै देखिन्छ` : <>{stale.length} station{stale.length === 1 ? ' still shows' : 's still show'} a warning or danger flag from an older reading</>}</summary>
      <RiverRows stations={stale} caption={ne ? 'ताजापन अवधिभन्दा पुराना मापनका संकेतहरू, प्रकाशित रूपमा' : 'Flags from readings older than the freshness window, as published'} /></details>}
    {entry.changes?.status_changes?.length ? <p className="official-change">{ne ? 'अघिल्लो प्रतियता परिवर्तन:' : 'Changed since the previous copy:'} {entry.changes.status_changes.map(c => `${c.name ?? c.id} ${c.from ? status(c.from, lang) : unknown(lang)} → ${status(c.to, lang)}`).join('; ')}{ne ? '।' : '.'}</p> : null}
  </>;
}

function RainView({ content }: { content: RainContent }) {
  const [lang] = useLanguage();
  const ne = lang === 'ne';
  const implausible = content.implausible_24h
    ? ne ? ` हालसालैका ${digits(String(content.implausible_24h), lang)} वटा २४ घण्टे कुल विश्व कीर्तिमानभन्दा ठूला भएकाले क्रमबाट हटाइएका छन्।` : ` ${content.implausible_24h} recent 24-hour total${content.implausible_24h === 1 ? ' is' : 's are'} larger than the world record and left out of the ranking.`
    : '';
  return <>
    <p className="muted">{freshness(content, lang)}{implausible}</p>
    <Counts counts={content.current_status_counts ?? content.status_counts} />
    {content.wettest_24h.length ? <div className="official-table-wrap"><table>
      <caption>{ne ? 'पछिल्लो २४ घण्टामा सबैभन्दा बढी वर्षा भएका स्टेसनहरू' : 'Wettest stations, last 24 hours'}</caption>
      <thead><tr><th scope="col">{ne ? 'स्टेसन' : 'Station'}</th><th scope="col">{ne ? 'नदी बेसिन' : 'Basin'}</th><th scope="col">{ne ? '२४ घण्टा' : '24 h'}</th><th scope="col">{ne ? '१ घण्टा' : '1 h'}</th><th scope="col">{ne ? 'अवस्था' : 'Status'}</th><th scope="col">{ne ? 'मापन समय' : 'Reading time'}</th></tr></thead>
      <tbody>{content.wettest_24h.map(s => <tr key={s.id}><th scope="row">{s.name ?? unknown(lang)}</th><td>{s.basin ?? unknown(lang)}</td><td>{num(s.rain_24h_mm, 'mm', lang)}</td><td>{num(s.rain_1h_mm, 'mm', lang)}</td><td>{status(s.status, lang)}</td><td>{time(s.observed_at, lang)}</td></tr>)}</tbody>
    </table></div> : <p>{ne ? 'यस प्रतिमा हालसालैको कुनै पनि स्टेसनले २४ घण्टे कुल पठाएको छैन।' : 'No recent station reported a 24-hour total in this copy.'}</p>}
  </>;
}

function cell(value: Scalar, column = '', lang: Lang = 'en') {
  if (value === null || value === '') return unknown(lang);
  if (typeof value === 'boolean') return lang === 'ne' ? (value ? 'हो' : 'होइन') : value ? 'yes' : 'no';
  return /On$/.test(column) ? time(String(value), lang) : String(value);
}

function ListView({ content, entry }: { content: ListContent; entry: Entry }) {
  const [lang] = useLanguage();
  const ne = lang === 'ne';
  const fresh = new Set((entry.changes?.new_records ?? []).map(r => JSON.stringify(r.id ?? r)));
  const columns = content.columns.filter(c => !HIDDEN_COLUMNS.has(c));
  const span = content.within_days ? ` in the last ${content.within_days} days` : '';
  const spanNe = content.within_days ? `पछिल्लो ${digits(String(content.within_days), lang)} दिनमा ` : '';
  // In Nepali the agency's own Nepali title (titleNe) is shown where it was published; otherwise the published title.
  const value = (r: Record<string, Scalar>, c: string) => ne && c === 'title' && typeof r.titleNe === 'string' && r.titleNe ? r.titleNe : r[c] ?? null;
  if (!content.records.length) return <p>{ne ? `यस प्रतिमा ${spanNe}कुनै अभिलेख छैन।` : <>No records{span} in this copy.</>}</p>;
  return <div className="official-table-wrap"><table>
    <caption>{ne ? `${spanNe}${formatNumber(content.record_count, lang)}${content.complete === false ? ' वा बढी' : ''} अभिलेख; नयाँ ${digits(String(Math.min(content.records.length, 25)), lang)} वटा प्रकाशित रूपमा देखाइएका` : <>{content.record_count.toLocaleString('en-US')}{content.complete === false ? ' or more' : ''} records{span}; newest {Math.min(content.records.length, 25)} shown as published</>}</caption>
    <thead><tr>{columns.map(c => <th key={c} scope="col">{(ne ? LABELS_NE[c] : LABELS[c]) ?? c}</th>)}</tr></thead>
    <tbody>{content.records.slice(0, 25).map((r, i) => <tr key={i}>{columns.map((c, j) => <td key={c}>{cell(value(r, c), c, lang)}{j === 0 && fresh.has(JSON.stringify(r.id ?? r)) && <span className="official-new">{ne ? 'नयाँ' : 'new'}</span>}</td>)}</tr>)}</tbody>
  </table></div>;
}

function PageView({ content, entry }: { content: Page; entry: Entry }) {
  const [lang] = useLanguage();
  const fresh = new Set((entry.changes?.new_links ?? []).map(link => link.href));
  const links = [...content.links].sort((a, b) => Number(fresh.has(b.href)) - Number(fresh.has(a.href)) || Number(b.document) - Number(a.document)).slice(0, 14);
  return <>
    {content.headings.length > 0 && <ul className="official-headings">{content.headings.slice(0, 6).map(h => <li key={h}>{h}</li>)}</ul>}
    {content.paragraphs.slice(0, 4).map(p => <p key={p} className="official-quote">{p}</p>)}
    {content.tables.slice(0, 2).map((table, i) => <TableView key={i} table={table} fallbackCaption={lang === 'ne' ? TITLES_NE[entry.id] ?? entry.title : entry.title} />)}
    {links.length > 0 && <ul className="official-links">{links.map(link => <li key={link.href}><a href={link.href} rel="noopener noreferrer" target="_blank">{link.text}</a>{fresh.has(link.href) && <span className="official-new">{lang === 'ne' ? 'नयाँ' : 'new'}</span>}{link.document && <span className="muted">{lang === 'ne' ? ' कागजात' : ' document'}</span>}</li>)}</ul>}
  </>;
}

function EntryView({ entry }: { entry: Entry }) {
  const [lang] = useLanguage();
  const ne = lang === 'ne';
  const content = entry.content;
  return <article className="official-entry" data-source-status={entry.last_known ? 'last-known' : entry.status} aria-labelledby={`official-${entry.id}`}>
    <header>
      <h3 id={`official-${entry.id}`}>{ne ? TITLES_NE[entry.id] ?? entry.title : entry.title}</h3>
      <p className="muted">{entry.agency}</p>
      <p className={`official-status official-status-${entry.last_known ? 'last-known' : entry.status}`}>{statusText(entry, lang)}</p>
    </header>
    {!content ? <p>{ne ? 'अहिलेसम्म कुनै प्रति उपलब्ध छैन। हालको जानकारीका लागि निकायको पृष्ठ खोल्नुहोस्।' : 'No copy is available yet. Open the agency page for the current information.'}</p>
      : entry.kind === 'bipad-river' ? <RiverView content={content as RiverContent} entry={entry} />
        : entry.kind === 'bipad-rain' ? <RainView content={content as RainContent} />
          : entry.kind === 'json-list' ? <ListView content={content as ListContent} entry={entry} />
            : <PageView content={content as Page} entry={entry} />}
    <p><a href={entry.url} rel="noopener noreferrer" target="_blank">{ne ? 'निकायको पृष्ठ खोल्नुहोस्' : 'Open the agency page'}</a></p>
  </article>;
}

export function OfficialSources() {
  const [state, retry] = useGovDigest();
  const [lang] = useLanguage();
  const ne = lang === 'ne';

  return <div className="page official-page" data-official-state={state.status}>
    <h1>{ne ? 'आजका आधिकारिक स्रोत' : 'Official sources today'}</h1>
    {ne ? <p className="intro">जोखिमसम्बन्धी प्रश्नको जवाफ दिने आधिकारिक स्रोतहरूको दैनिक एक प्रति: नदीको जलसतह, वर्षा, बाढी बुलेटिन, मौसम चेतावनी, घटना र अलर्ट, तथा भूकम्प। महत्त्वपूर्ण भाग मात्र राखिएका छन्, प्रकाशित रूपमै प्रतिलिपि गरिएका। निकायका वेबसाइट नै आधिकारिक हुन्, र यो प्रतिपछि तिनमा परिवर्तन भएको हुन सक्छ।</p>
    : <p className="intro">One daily copy of the official sources that answer a hazard question: river levels, rainfall, flood bulletins, weather warnings, incidents and alerts, and earthquakes. Only the parts that matter are kept, copied as published. The agency websites are authoritative and may have changed since this copy.</p>}
    <aside className="official-authorities" aria-label={ne ? 'आधिकारिक स्रोतहरू' : 'Authoritative sources'}>
      {ne ? <p><strong>चेतावनी र निर्णयका लागि सिधै निकायहरूलाई हेर्नुहोस्:</strong> <a href="https://dhm.gov.np/mfd/" rel="noopener noreferrer" target="_blank">DHM पूर्वानुमान</a>, <a href="https://ndrrma.gov.np/" rel="noopener noreferrer" target="_blank">NDRRMA</a> र <a href="https://bipadportal.gov.np/" rel="noopener noreferrer" target="_blank">BIPAD</a>।</p>
      : <p><strong>For warnings and decisions, use the agencies directly:</strong> <a href="https://dhm.gov.np/mfd/" rel="noopener noreferrer" target="_blank">DHM forecasts</a>, <a href="https://ndrrma.gov.np/" rel="noopener noreferrer" target="_blank">NDRRMA</a> and <a href="https://bipadportal.gov.np/" rel="noopener noreferrer" target="_blank">BIPAD</a>.</p>}
    </aside>
    {state.status === 'loading' && <p role="status">{ne ? 'आजको प्रति लोड गर्दै…' : 'Loading today’s copy…'}</p>}
    {state.status === 'missing' && <p role="status">{ne ? 'पहिलो दैनिक प्रति अझै प्रकाशित भएको छैन। यो हरेक बिहान नेपाल समय अनुसार करिब ०६:०० बजे तयार गरिन्छ।' : 'The first daily copy has not been published yet. It is made each morning at about 06:00 Nepal time.'}</p>}
    {state.status === 'error' && <div role="alert"><p>{ne ? `आजको प्रति पढ्न सकिएन (${state.message})` : state.message}</p><button type="button" onClick={retry}>{ne ? 'फेरि प्रयास गर्नुहोस्' : 'Try again'}</button></div>}
    {state.status === 'ready' && <Ready digest={state.digest} />}
  </div>;
}

function Ready({ digest }: { digest: Digest }) {
  const [lang] = useLanguage();
  const ne = lang === 'ne';
  const s = digest.summary;
  return <>
    <dl className="official-summary" aria-label={ne ? 'यस प्रतिको सारांश' : 'Summary of this copy'}>
      <div><dt>{ne ? 'प्रतिलिपि गरिएको' : 'Copied'}</dt><dd>{digits(digest.generated_at_nepal, lang)}</dd></div>
      <div><dt>{ne ? 'खतरा तहभन्दा माथिका नदी (पछिल्लो २४ घण्टा)' : 'Rivers above danger level (last 24 h)'}</dt><dd>{count(s.rivers_above_danger, lang)}</dd></div>
      <div><dt>{ne ? 'चेतावनी तहभन्दा माथिका नदी (पछिल्लो २४ घण्टा)' : 'Rivers above warning level (last 24 h)'}</dt><dd>{count(s.rivers_above_warning, lang)}</dd></div>
      <div><dt>{ne ? 'चेतावनी तहभन्दा माथिका वर्षा स्टेसन (पछिल्लो २४ घण्टा)' : 'Rain stations above warning level (last 24 h)'}</dt><dd>{count(s.rain_stations_above_warning, lang)}</dd></div>
      <div><dt>{ne ? 'आज पढिएका स्रोत' : 'Sources read today'}</dt><dd>{ne ? `${digits(String(digest.sources.length), lang)} मध्ये ${digits(String(s.sources_fetched), lang)}` : <>{s.sources_fetched} of {digest.sources.length}</>}</dd></div>
    </dl>
    {s.sources_last_known > 0 && <p className="official-change">{ne ? `आजको पढाइ असफल भएकाले ${digits(String(s.sources_last_known), lang)} स्रोत अघिल्लो प्रतिबाट देखाइएका छन्।` : <>{s.sources_last_known} source{s.sources_last_known === 1 ? ' is' : 's are'} shown from an earlier copy because today’s read failed.</>}</p>}
    <nav className="official-jump" aria-label={ne ? 'खण्डहरू' : 'Sections'}>{CATEGORIES.filter(([key]) => digest.sources.some(e => e.category === key)).map(([key, en, neLabel]) => <a key={key} href={`#official-${key}`}>{ne ? neLabel : en}</a>)}</nav>
    {CATEGORIES.map(([key, en, neLabel]) => {
      const entries = digest.sources.filter(e => e.category === key);
      return entries.length ? <section key={key} id={`official-${key}`} className="official-section" aria-labelledby={`official-${key}-heading`}>
        <h2 id={`official-${key}-heading`}>{ne ? neLabel : en}</h2>
        {entries.map(entry => <EntryView key={entry.id} entry={entry} />)}
      </section> : null;
    })}
  </>;
}
