import overview from '../generated/nepal-overview.json';
import type { Quake, Rain } from '../lib/gov-digest';

/* Glanceable pictures of the daily official copy. Each one only redraws figures the copy states, labels
 * every mark in text, and sits beside a table or list that carries the same values. */

// The overview is Web Mercator; its graticule gives the exact x for each longitude and y for each latitude.
const lon = overview.longitudeLines, lat = overview.latitudeLines;
const mercator = (degrees: number) => Math.log(Math.tan(Math.PI / 4 + degrees * Math.PI / 360));
const projectX = (value: number) => lon[0].x + (value - lon[0].value) * (lon.at(-1)!.x - lon[0].x) / (lon.at(-1)!.value - lon[0].value);
const projectY = (value: number) => lat[0].y + (mercator(value) - mercator(lat[0].value)) * (lat.at(-1)!.y - lat[0].y) / (mercator(lat.at(-1)!.value) - mercator(lat[0].value));
const magnitudeOf = (text: string | null) => { const value = Number.parseFloat(text ?? ''); return Number.isFinite(value) ? value : null; };

/** Epicentres of the latest recorded earthquakes on Nepal's provinces; the newest is drawn last and marked. */
export function QuakeMap({ quakes, title, newestLabel, note }: { quakes: Quake[]; title: string; newestLabel: string; note: string }) {
  const placed = quakes.map((q, order) => ({ ...q, order, mag: magnitudeOf(q.magnitude) }))
    .filter(q => q.latitude !== null && q.longitude !== null && q.longitude >= 78 && q.longitude <= 90 && q.latitude >= 25 && q.latitude <= 32);
  if (!placed.length) return null;
  const description = placed.map(q => `${q.magnitude ?? 'UNKNOWN'} ${q.epicentre ?? 'UNKNOWN'} ${q.date ?? ''}`.trim()).join('; ');
  return <figure className="tv-quake-map">
    <svg viewBox="95 60 740 380" role="img" aria-label={`${title}: ${description}`}>
      <g className="tv-provinces" aria-hidden="true">{overview.provinces.map(p => <path key={p.pcode} d={p.path} fillRule="evenodd" />)}</g>
      {[...placed].reverse().map(q => {
        const x = projectX(q.longitude!), y = projectY(q.latitude!), r = 6 + Math.max(0, (q.mag ?? 4) - 3) * 9;
        return <g key={q.order} className={q.order === 0 ? 'tv-quake tv-quake-newest' : 'tv-quake'}>
          {q.order === 0 && <circle className="tv-pulse" cx={x} cy={y} r={r} aria-hidden="true" />}
          <circle cx={x} cy={y} r={r} />
          <circle className="tv-dot" cx={x} cy={y} r={2.5} />
          {(q.order === 0 || (q.mag ?? 0) >= 5) && <text x={x + r + 6} y={y + 5}>{q.order === 0 ? `${newestLabel}: ` : ''}{q.magnitude} {q.epicentre}</text>}
        </g>;
      })}
    </svg>
    <figcaption>{title} · {note}</figcaption>
  </figure>;
}

export type StatusPart = { key: 'danger' | 'warning' | 'normal' | 'none'; label: string; count: number | null };

/** One bar split by station status; each part is named with its count, so colour is never the only cue. */
export function StatusBar({ title, parts }: { title: string; parts: StatusPart[] }) {
  const known = parts.filter(p => p.count !== null) as Array<StatusPart & { count: number }>;
  const total = known.reduce((sum, p) => sum + p.count, 0);
  return <figure className="tv-status">
    <figcaption>{title}</figcaption>
    {total > 0 && <div className="tv-status-bar" aria-hidden="true">{known.filter(p => p.count > 0).map(p => <span key={p.key} className={`tv-${p.key}`} style={{ flexGrow: p.count }} />)}</div>}
    <ul className="tv-status-legend">{parts.map(p => <li key={p.key}><span className={`tv-swatch tv-${p.key}`} aria-hidden="true" /><strong>{p.count ?? 'UNKNOWN'}</strong> {p.label}</li>)}</ul>
  </figure>;
}

/** The wettest stations in the last 24 hours as published, longest bar first. */
export function RainBars({ stations, title, format }: { stations: Rain[]; title: string; format: (mm: number) => string }) {
  const rows = stations.filter(s => s.rain_24h_mm !== null).slice(0, 6);
  const max = Math.max(...rows.map(s => s.rain_24h_mm!), 0);
  if (!rows.length || max <= 0) return null;
  return <figure className="tv-rain">
    <figcaption>{title}</figcaption>
    <ol>{rows.map(s => <li key={s.id}>
      <span className="tv-rain-name">{s.name ?? 'UNKNOWN'}{s.basin && <small> · {s.basin}</small>}</span>
      <span className="tv-rain-track" aria-hidden="true"><span style={{ width: `${(s.rain_24h_mm! / max) * 100}%` }} /></span>
      <span className="tv-rain-value">{format(s.rain_24h_mm!)}</span>
    </li>)}</ol>
  </figure>;
}
