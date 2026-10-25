import type { ReactNode } from 'react';

/** A grouped piece of content. `quiet` sinks it into the page instead of raising it. */
export function Card({ children, quiet, className = '', as: Tag = 'div', ...rest }: { children: ReactNode; quiet?: boolean; className?: string; as?: 'div' | 'section' | 'article' | 'li' } & Record<string, unknown>) {
  return <Tag className={['card', quiet && 'card-quiet', className].filter(Boolean).join(' ')} {...rest}>{children}</Tag>;
}

/** One headline figure with its label and an optional note. Rendered as a <div> holding <dt>/<dd>, inside a <dl class="stats">. */
export function Stat({ label, value, sub }: { label: ReactNode; value: ReactNode; sub?: ReactNode }) {
  return <div className="stat"><dt>{label}</dt><dd className="stat-value">{value}</dd>{sub !== undefined && <dd className="stat-sub">{sub}</dd>}</div>;
}
export function Stats({ label, children }: { label?: string; children: ReactNode }) {
  return <dl className="stats" aria-label={label}>{children}</dl>;
}

export type Tone = 'danger' | 'warning' | 'normal' | 'none' | 'model' | 'info';
const GLYPH: Record<Tone, string> = { danger: '▲', warning: '△', normal: '●', none: '○', model: '◇', info: 'ⓘ' };
/** A status word with its glyph; colour is the third cue, never the only one. */
export function Badge({ tone, children, glyph = GLYPH[tone] }: { tone: Tone; children: ReactNode; glyph?: string | null }) {
  return <span className={`badge badge-${tone}`}>{glyph && <span aria-hidden="true">{glyph}</span>}{children}</span>;
}

/** A boxed message: scenario notice, problem, last-known copy. */
export function Notice({ tone = 'info', glyph, children, role }: { tone?: 'model' | 'danger' | 'warning' | 'info'; glyph?: string; children: ReactNode; role?: 'note' | 'alert' | 'status' }) {
  return <div className={`notice notice-${tone}`} role={role}>{glyph && <span aria-hidden="true">{glyph}</span>}<div>{children}</div></div>;
}

/** A semantic table that becomes one labelled card per row on phones (labels come from components/table-labels). */
export function DataTable({ caption, head, rows, className = '' }: { caption: ReactNode; head: ReactNode[]; rows: Array<{ key: string; cells: ReactNode[]; header?: boolean }>; className?: string }) {
  return <div className={`table-wrap ${className}`.trim()}><table className="stack-mobile">
    <caption>{caption}</caption>
    <thead><tr>{head.map((cell, i) => <th key={i} scope="col">{cell}</th>)}</tr></thead>
    <tbody>{rows.map(row => <tr key={row.key}>{row.cells.map((cell, i) => i === 0 && row.header !== false ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody>
  </table></div>;
}

/** A labelled section that opens on request. */
export function Disclosure({ summary, children, open, className = '', onToggle }: { summary: ReactNode; children: ReactNode; open?: boolean; className?: string; onToggle?: (open: boolean) => void }) {
  return <details className={`disclosure ${className}`.trim()} open={open} onToggle={onToggle ? event => onToggle(event.currentTarget.open) : undefined}><summary>{summary}</summary>{children}</details>;
}

/** Space held for content that is still loading, at its final size, so nothing jumps when it arrives. */
export function Skeleton({ height, width = '100%', className = '' }: { height: string; width?: string; className?: string }) {
  return <div className={`skeleton ${className}`.trim()} style={{ height, width }} aria-hidden="true" />;
}

/** Nothing to show yet, and what to do about it. */
export function EmptyState({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return <div className="empty-state" role="status"><strong>{title}</strong>{children}</div>;
}

/** What went wrong and how to recover. */
export function ErrorState({ title, children, retry, retryLabel }: { title: ReactNode; children?: ReactNode; retry?: () => void; retryLabel?: string }) {
  return <div className="data-state error" role="alert"><p><strong>{title}</strong></p>{children}{retry && retryLabel && <button type="button" onClick={retry}>{retryLabel}</button>}</div>;
}

export type LegendEntry = { key: string; shape: 'dot' | 'line' | 'area' | 'square'; colour: string; label: ReactNode; detail?: ReactNode };
/** Map and chart keys: a shape, a colour and a text label for every entry. */
export function Legend({ entries, label, className = '' }: { entries: LegendEntry[]; label?: string; className?: string }) {
  return <ul className={`legend ${className}`.trim()} aria-label={label}>{entries.map(entry => <li key={entry.key}>
    <span className={`swatch swatch-${entry.shape}`} style={{ '--swatch': entry.colour } as React.CSSProperties} aria-hidden="true" />
    <span><strong>{entry.label}</strong>{entry.detail && <> <span className="muted">{entry.detail}</span></>}</span>
  </li>)}</ul>;
}

/** A real sequence of steps, with the current one marked. */
export function ProgressSteps({ steps, current, label }: { steps: ReactNode[]; current: number; label: string }) {
  return <ol className="steps" aria-label={label}>{steps.map((step, i) => <li key={i} data-state={i < current ? 'done' : undefined} aria-current={i === current ? 'step' : undefined}><span>{step}</span></li>)}</ol>;
}
