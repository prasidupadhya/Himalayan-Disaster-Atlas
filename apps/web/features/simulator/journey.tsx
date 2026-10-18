import type { Arrival } from '../../lib/flood-scenario';
import { formatNumber, type Lang } from '../../lib/i18n';
import { shortTime, simCopy } from './copy';

/** When the declared pulse passes each checkpoint: a shared clock from release, one row per distance.
 * The light bar spans the slowest-to-fastest celerity window, the dark bar the central celerity, the tick the
 * central peak. It redraws the table's values only; the sweeping line is decoration and stops for reduced motion. */
export function FloodJourney({ rows, lang }: { rows: Arrival[]; lang: Lang }) {
  const c = simCopy(lang);
  const max = Math.max(...rows.map(r => r.end_s[2]));
  if (!rows.length || !(max > 0)) return null;
  const at = (seconds: number) => `${(seconds / max) * 100}%`;
  const step = [1, 2, 3, 6, 12, 24, 48].map(h => h * 3600).find(s => max / s <= 6) ?? 86_400 * 3;
  const ticks = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);
  return <figure className="sim-journey">
    <figcaption><strong>{c.journeyTitle}</strong> <span className="sim-muted">{c.journeyNote}</span></figcaption>
    <div className="sim-journey-plot">
      <span className="sim-journey-sweep" aria-hidden="true" />
      <ol>{rows.map(r => <li key={r.distance_km}>
        <span className="sim-journey-km">{formatNumber(r.distance_km, lang, 0)} km</span>
        <span className="sim-journey-track" aria-label={c.journeyRow(formatNumber(r.distance_km, lang, 0), shortTime(r.front_s[1], lang), shortTime(r.front_s[0], lang), shortTime(r.front_s[2], lang), shortTime(r.end_s[1], lang))}>
          <span className="sim-journey-range" style={{ left: at(r.front_s[0]), width: `calc(${at(r.end_s[2] - r.front_s[0])})` }} />
          <span className="sim-journey-central" style={{ left: at(r.front_s[1]), width: `calc(${at(r.end_s[1] - r.front_s[1])})` }} />
          <span className="sim-journey-peak" style={{ left: at(r.peak_s[1]) }} />
        </span>
        <span className="sim-journey-time">{shortTime(r.front_s[1], lang)}</span>
      </li>)}</ol>
      <div className="sim-journey-axis" aria-hidden="true">{ticks.map(t => <span key={t} style={{ left: at(t) }}>{shortTime(t, lang)}</span>)}</div>
    </div>
    <p className="sim-journey-key sim-muted">
      <span><span className="sim-journey-swatch sim-journey-central" aria-hidden="true" /> {c.journeyCentral}</span>
      <span><span className="sim-journey-swatch sim-journey-range" aria-hidden="true" /> {c.journeyRange}</span>
      <span><span className="sim-journey-swatch sim-journey-peak-key" aria-hidden="true" /> {c.journeyPeak}</span>
    </p>
  </figure>;
}
