'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { formatNumber, type Lang } from '../../lib/i18n';
import { duration, simCopy } from './copy';

/** Release hydrograph at the source (not routed). Single series: the title names it, no legend needed. */
export function HydrographChart({ points, title, lang }: { points: [number, number][]; title: string; lang: Lang }) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(560);
  // Draw at the real pixel width so axis text stays legible on phones instead of shrinking with a fixed viewBox.
  useEffect(() => {
    const el = frame.current; if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setW(Math.max(260, Math.round(entry.contentRect.width))));
    observer.observe(el); return () => observer.disconnect();
  }, []);
  const H = W < 420 ? 200 : 230, L = 56, R = 18, T = 18, B = 36;
  const tMax = Math.max(...points.map(p => p[0])) || 1;
  const qMax = Math.max(...points.map(p => p[1])) || 1;
  const x = (t: number) => L + (t / tMax) * (W - L - R);
  const y = (q: number) => T + (1 - q / (qMax * 1.12)) * (H - T - B);
  const line = points.map(([t, q], i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)},${y(q).toFixed(1)}`).join(' ');
  const area = `${line} L${x(tMax).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;
  const valueAt = (t: number) => {
    for (let i = 1; i < points.length; i++) {
      const [t0, q0] = points[i - 1], [t1, q1] = points[i];
      if (t >= t0 && t <= t1) return t1 === t0 ? Math.max(q0, q1) : q0 + (q1 - q0) * (t - t0) / (t1 - t0);
    }
    return 0;
  };
  const ticks = (W < 420 ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1]).map(f => f * tMax);
  const peakAt = points.reduce((best, p) => p[1] > best[1] ? p : best, points[0]);
  const c = simCopy(lang);
  const summary = c.chartSummary(formatNumber(peakAt[1], lang, 1), duration(peakAt[0], lang), duration(tMax, lang));
  const qTicks = [0, 0.5, 1].map(f => f * qMax);
  // Enough decimals that the ticks of a very small release stay distinct (and never all read 0.0).
  const qDigits = qMax >= 10 ? 0 : Math.min(4, Math.max(1, Math.ceil(-Math.log10(qMax / 2)) + 1));
  return <figure className="sim-chart" aria-labelledby={`${id}-title`}>
    <figcaption id={`${id}-title`}>{title}</figcaption>
    <div ref={frame} className="sim-chart-frame">
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={c.chartAria(title, formatNumber(qMax, lang, 1), duration(tMax, lang))}
      onPointerMove={event => { const box = event.currentTarget.getBoundingClientRect(); const px = (event.clientX - box.left) / box.width * W; setHover(Math.max(0, Math.min(tMax, (px - L) / (W - L - R) * tMax))); }}
      onPointerLeave={() => setHover(null)}>
      {qTicks.map(q => <g key={q}><line x1={L} x2={W - R} y1={y(q)} y2={y(q)} className="sim-grid" /><text x={L - 8} y={y(q) + 4} textAnchor="end" className="sim-axis">{formatNumber(q, lang, qDigits)}</text></g>)}
      {ticks.map((t, i) => <text key={t} x={x(t)} y={H - 14} textAnchor={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'} className="sim-axis">{duration(t, lang)}</text>)}
      <text x={12} y={T + 4} className="sim-axis-title">m³/s</text>
      <path d={area} className="sim-area" />
      <path d={line} className="sim-line" />
      {hover !== null && <g>
        <line x1={x(hover)} x2={x(hover)} y1={T} y2={y(0)} className="sim-crosshair" />
        <circle cx={x(hover)} cy={y(valueAt(hover))} r={5} className="sim-dot" />
        <g transform={`translate(${x(hover) + 170 > W - R ? x(hover) - 170 : x(hover) + 10},${T + 6})`}>
          <rect width={160} height={40} rx={6} className="sim-tooltip" />
          <text x={10} y={17} className="sim-tooltip-text">{duration(hover, lang)}</text>
          <text x={10} y={32} className="sim-tooltip-text strong">{formatNumber(valueAt(hover), lang, 1)} m³/s</text>
        </g>
      </g>}
    </svg>
    </div>
    <p className="sim-chart-summary">{summary[0]}<strong>{summary[1]}</strong>{summary[2]}</p>
  </figure>;
}

export interface Band { label: string; color: string }
/** Population per band: central bar, with the ±1σ counts as text so identity is never colour-only. */
export function BandBars({ bands, central, low, high, caption, lang }: { bands: readonly Band[]; central: number[]; low: number[]; high: number[]; caption: string; lang: Lang }) {
  const max = Math.max(1, ...central, ...low, ...high);
  return <figure className="sim-bands">
    <figcaption>{caption}</figcaption>
    <ol>
      {bands.map((band, i) => <li key={band.label}>
        <span className="sim-band-label"><span className="sim-swatch" style={{ background: band.color }} aria-hidden="true" />{band.label}</span>
        <span className="sim-band-track" aria-hidden="true"><span className="sim-band-fill" style={{ width: `${(central[i] / max) * 100}%`, background: band.color }} /></span>
        <span className="sim-band-value"><strong>{formatNumber(central[i], lang)}</strong><span className="sim-muted sim-sub">−1σ {formatNumber(low[i], lang)} · +1σ {formatNumber(high[i], lang)}</span></span>
      </li>)}
    </ol>
  </figure>;
}
