'use client';
import { useId, useRef, type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'quiet';
/** The one button. Secondary is the default look of a bare <button>; primary is for the single main action on a screen. */
export function Button({ variant = 'secondary', block, size, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; block?: boolean; size?: 'sm' }) {
  const classes = ['btn', variant !== 'secondary' && `btn-${variant}`, block && 'btn-block', size && `btn-${size}`, className].filter(Boolean).join(' ');
  return <button type="button" className={classes} {...rest} />;
}

/** A square button whose only visible content is an icon; the label is required and becomes its accessible name. */
export function IconButton({ label, children, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return <button type="button" className={`btn btn-icon ${className}`.trim()} aria-label={label} title={label} {...rest}>{children}</button>;
}

/** Line icon drawn at 24 × 24; pass path data or shapes as children. Decorative: text always accompanies it. */
export function Icon({ children, className = 'icon' }: { children: ReactNode; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{children}</svg>;
}

/** Mutually exclusive choices shown as pressed buttons (language, theme, 2D/3D). */
export function Segmented<V extends string>({ label, value, options, onChange, className = '' }: {
  label: string; value: V; options: Array<{ value: V; label: ReactNode; lang?: string }>; onChange: (value: V) => void; className?: string;
}) {
  return <div className={`seg ${className}`.trim()} role="group" aria-label={label}>
    {options.map(option => <button key={option.value} type="button" lang={option.lang} aria-pressed={option.value === value} onClick={() => onChange(option.value)}>{option.label}</button>)}
  </div>;
}

/** ARIA tabs with arrow-key, Home and End navigation; the selected tab is the only one in the tab order. */
export function Tabs<V extends string>({ label, value, items, onChange, idPrefix, className = '' }: {
  label: string; value: V; items: Array<{ value: V; label: ReactNode; icon?: ReactNode; hue?: string }>; onChange: (value: V) => void; idPrefix?: string; className?: string;
}) {
  const fallback = useId();
  const prefix = idPrefix ?? fallback;
  const list = useRef<HTMLDivElement>(null);
  const move = (event: KeyboardEvent, index: number) => {
    const last = items.length - 1;
    const next = event.key === 'ArrowRight' ? (index === last ? 0 : index + 1) : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1) : event.key === 'Home' ? 0 : event.key === 'End' ? last : null;
    if (next === null) return;
    event.preventDefault();
    onChange(items[next].value);
    list.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };
  return <div ref={list} className={`tabs ${className}`.trim()} role="tablist" aria-label={label}>
    {items.map((item, index) => <button key={item.value} type="button" role="tab" id={`${prefix}-tab-${item.value}`} aria-controls={`${prefix}-panel-${item.value}`}
      aria-selected={item.value === value} tabIndex={item.value === value ? 0 : -1} onClick={() => onChange(item.value)} onKeyDown={event => move(event, index)}
      style={item.hue ? { '--tab-hue': item.hue } as React.CSSProperties : undefined}>
      {item.icon}{item.label}
    </button>)}
  </div>;
}

/** The panel for one tab; kept mounted (hidden) so form state survives switching. */
export function TabPanel({ idPrefix, value, selected, children, className }: { idPrefix: string; value: string; selected: boolean; children: ReactNode; className?: string }) {
  return <div role="tabpanel" id={`${idPrefix}-panel-${value}`} aria-labelledby={`${idPrefix}-tab-${value}`} hidden={!selected} className={className} tabIndex={0}>{children}</div>;
}

/** A range input with visible start and end labels and a spoken value. */
export function Scrubber({ label, min, max, value, valueText, start, end, onChange }: { label: string; min: number; max: number; value: number; valueText: string; start: ReactNode; end: ReactNode; onChange: (value: number) => void }) {
  return <label className="scrubber">
    <span className="sr-only">{label}</span>
    <input type="range" min={min} max={max} step={1} value={value} aria-valuetext={valueText} onChange={event => onChange(Number(event.target.value))}
      style={{ '--fill': `${max > min ? ((value - min) / (max - min)) * 100 : 0}%` } as React.CSSProperties} />
    <span className="scrubber-ends" aria-hidden="true"><span>{start}</span><span>{end}</span></span>
  </label>;
}
