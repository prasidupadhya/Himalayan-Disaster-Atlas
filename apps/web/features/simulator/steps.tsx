import type { ReactNode } from 'react';
import { digits, type Lang } from '../../lib/i18n';

/** One numbered step of a scenario (choose, declare, results). The number is real: the steps are a sequence. */
export function Step({ n, id, title, lang, className = '', children, ...rest }: { n: number; id: string; title: ReactNode; lang: Lang; className?: string; children: ReactNode } & Record<string, unknown>) {
  return <section className={`sim-step ${className}`.trim()} aria-labelledby={id} {...rest}>
    <h2 id={id}><span className="sim-step-number" aria-hidden="true">{digits(String(n), lang)}</span> {title}</h2>
    {children}
  </section>;
}

/** The assumptions box every scenario shows before it can run, with the release's own limitations folded underneath. */
export function Assumptions({ title, items, limitationsTitle, limitations }: { title: string; items: string[]; limitationsTitle: string; limitations: string[] }) {
  return <div className="sim-assumptions">
    <h3>{title}</h3>
    <ul>{items.map(text => <li key={text}>{text}</li>)}</ul>
    <details><summary>{limitationsTitle}</summary><ul lang="en">{limitations.map(l => <li key={l}>{l}</li>)}</ul></details>
  </div>;
}

/** The acknowledgement and the run button: nothing runs until the reader confirms it is a hypothetical scenario. */
export function RunControls({ acknowledged, onAcknowledge, acknowledgement, label, busy, busyLabel, disabled, onRun }: {
  acknowledged: boolean; onAcknowledge: (value: boolean) => void; acknowledgement: string; label: string; busy?: boolean; busyLabel?: string; disabled: boolean; onRun: () => void;
}) {
  return <div className="sim-run-row">
    <label className="sim-ack"><input type="checkbox" checked={acknowledged} onChange={event => onAcknowledge(event.target.checked)} /> <span>{acknowledgement}</span></label>
    <button type="button" className="sim-run btn-primary" disabled={!acknowledged || disabled || busy} onClick={onRun}>{busy ? busyLabel : label}</button>
  </div>;
}
