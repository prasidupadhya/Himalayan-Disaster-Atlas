'use client';

import { useEffect, useMemo, useState } from 'react';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { UnavailableError } from '../../lib/datasets';
import { loadClimate, type ClimateDataset } from '../../lib/climate';
import type { Resource } from '../../lib/resource';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
type Variable = 'temperature' | 'precipitation';

function Chart({ values, unit, variable, focus }: { focus: number; values: number[]; unit: string; variable: Variable }) {
  const width = 280;
  const height = 120;
  const padding = 16;
  const min = variable === 'temperature' ? Math.min(...values) - 1 : 0;
  const max = Math.max(...values) + (variable === 'temperature' ? 1 : Math.max(...values) * .08 || 1);
  const scaleX = (index: number) => padding + index * ((width - padding * 2) / 11);
  const scaleY = (value: number) => height - padding - ((value - min) / Math.max(max - min, .001)) * (height - padding * 2);
  const points = values.map((value, index) => `${scaleX(index)},${scaleY(value)}`).join(' ');
  return <svg className="climate-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Monthly ${variable} chart in ${unit}`}>
    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
    <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />
    {values.map((value, index) => <circle key={index} cx={scaleX(index)} cy={scaleY(value)} r={index + 1 === focus ? 5 : 2.5}><title>{MONTHS[index]}: {value.toFixed(variable === 'temperature' ? 1 : 2)} {unit}</title></circle>)}
  </svg>;
}

export function Climate({ temporal }: { temporal?: { date: string } | null }) {
  const [resource, setResource] = useState<Resource<ClimateDataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [variable, setVariable] = useState<Variable>('temperature');
  const [localPeriod, setPeriod] = useState('normal');
  const [localMonth, setMonth] = useState(7);

  const period = temporal ? temporal.date.slice(0, 4) : localPeriod;
  const month = temporal ? Number(temporal.date.slice(5, 7)) : localMonth;

  useEffect(() => {
    const controller = new AbortController();
    void loadClimate(controller.signal).then(data => setResource({ status: 'ready', data })).catch(error => {
      if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Climate data unavailable' });
    });
    return () => controller.abort();
  }, [attempt]);

  const dataset = 'data' in resource ? resource.data : null;
  const manifest = dataset?.manifest;
  const records = useMemo(() => {
    if (!manifest) return [];
    if (period === 'normal') return manifest.normals;
    return manifest.series.filter(item => item.year === Number(period));
  }, [manifest, period]);
  const values = records.map(item => variable === 'temperature' ? item.temperature_c : item.precipitation_mm_day);
  const selected = records.find(item => item.month === month);
  const unit = variable === 'temperature' ? '°C' : 'mm/day';

  return <section className="thematic-controls" aria-label="Climate" data-climate-state={resource.status}>
    <h2>Climate</h2>
    <p>NASA POWER · MERRA-2 reanalysis-derived · monthly 1991–2020</p>
    <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(value => value + 1); }} />
    <label className="thematic-picker">Variable<select value={variable} disabled={!manifest} onChange={event => setVariable(event.target.value as Variable)}><option value="temperature">2 m air temperature (°C)</option><option value="precipitation">Corrected precipitation rate (mm/day)</option></select></label>
    <label className="thematic-picker">Period<select value={period} disabled={!manifest || Boolean(temporal)} onChange={event => setPeriod(event.target.value)}>{temporal && !selected && <option value={period}>{period} · unavailable</option>}<option value="normal">1991–2020 monthly normal</option>{Array.from({ length: 30 }, (_, index) => 1991 + index).map(year => <option key={year} value={year}>{year}</option>)}</select></label>
    <label className="thematic-picker">Focus month<select value={month} disabled={!manifest || Boolean(temporal)} onChange={event => setMonth(Number(event.target.value))}>{MONTHS.map((label, index) => <option key={label} value={index + 1}>{label}</option>)}</select></label>
    {manifest && values.length === 12 && <div className="climate-figure"><Chart focus={month} values={values} unit={unit} variable={variable} /><div className="climate-months" aria-hidden="true"><span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span></div></div>}
    {temporal && manifest && !selected && <p role="status">UNAVAILABLE — no climate month for {temporal.date.slice(0, 7)}. No daily estimate or nearest-month substitution.</p>}
    {temporal && selected && <p>Time Machine selects the whole month {temporal.date.slice(0, 7)}; this is not a daily measurement.</p>}
    {selected && <div className="selection" aria-live="polite"><dl>
      <dt>Period</dt><dd>{period === 'normal' ? '1991–2020 normal' : `${period}-${String(month).padStart(2, '0')}`}</dd>
      <dt>{variable === 'temperature' ? 'Temperature' : 'Precipitation'}</dt><dd>{(variable === 'temperature' ? selected.temperature_c : selected.precipitation_mm_day).toFixed(variable === 'temperature' ? 1 : 2)} {unit}</dd>
      {'years' in selected && <><dt>30-year range</dt><dd>{variable === 'temperature' ? `${selected.temperature_min_c.toFixed(1)}–${selected.temperature_max_c.toFixed(1)} °C` : `${selected.precipitation_min_mm_day.toFixed(2)}–${selected.precipitation_max_mm_day.toFixed(2)} mm/day`}</dd></>}
      <dt>Spatial basis</dt><dd>66 Nepal-intersecting cells · 0.5° × 0.625° native grid</dd>
    </dl></div>}
    <p className="muted"><strong>Reanalysis-derived, not station observations.</strong> Values are Nepal-wide area-weighted grid summaries. They do not resolve valleys or settlements, and the 1991–2020 normal is not a forecast or current-condition estimate.</p>
    {manifest && <details><summary>Climate source & limitations</summary><Evidence metadata={manifest.metadata} /></details>}
  </section>;
}
