import { useEffect, useRef } from 'react';
import { useT } from '../../lib/i18n';

const ENTRIES: Array<{ shape: 'line' | 'dot' | 'area'; colour: string; label: string; detail: string; labelNe: string; detailNe: string }> = [
  { shape: 'line', colour: '#3987e5', label: 'River reach', detail: 'Click to select; then trace downstream', labelNe: 'नदी खण्ड (reach)', detailNe: 'छान्न क्लिक गर्नुहोस्; त्यसपछि तलतिर पछ्याउनुहोस्' },
  { shape: 'dot', colour: '#199e70', label: 'Glacial lake, glacier-fed', detail: 'Click to inspect', labelNe: 'हिमताल, हिमनदीबाट पोषित', detailNe: 'विवरण हेर्न क्लिक गर्नुहोस्' },
  { shape: 'dot', colour: '#7fd1b5', label: 'Glacial lake, not glacier-fed', detail: 'Lighter tint of the lake colour', labelNe: 'हिमताल, हिमनदीबाट पोषित नभएको', detailNe: 'तालको रङको हल्का छाया' },
  { shape: 'dot', colour: '#d95926', label: 'Hydropower', detail: 'Mapped plants (OpenStreetMap), when infrastructure is loaded', labelNe: 'जलविद्युत्', detailNe: 'नक्सांकित आयोजनाहरू (OpenStreetMap), पूर्वाधार लोड गरिएपछि' },
  { shape: 'dot', colour: '#f5f5f0', label: 'Infrastructure', detail: 'Roads, bridges, schools, health, emergency, settlements, when loaded', labelNe: 'पूर्वाधार', detailNe: 'सडक, पुल, विद्यालय, स्वास्थ्य, आपत्कालीन सेवा, बस्ती, लोड गरिएपछि' },
  { shape: 'area', colour: '#7f9aa6', label: 'Administrative boundary', detail: 'Click to inspect', labelNe: 'प्रशासनिक सीमा', detailNe: 'विवरण हेर्न क्लिक गर्नुहोस्' },
];

export function MapKey() {
  const t = useT();
  const details = useRef<HTMLDetailsElement>(null);
  // Open on wide screens; on a phone the key starts closed so the layer controls follow the map directly.
  useEffect(() => { if (details.current && window.matchMedia('(max-width: 720px)').matches) details.current.open = false; }, []);
  return <section className="map-key" aria-labelledby="map-key-heading">
    <details open ref={details}>
      <summary><h2 id="map-key-heading">{t('Map key', 'नक्साको सङ्केत')}</h2></summary>
      <p className="muted map-key-intro">{t('Every layer also has a text description in its panel. Shape and text distinguish layers; colour is a second cue.', 'हरेक तहको प्यानलमा पाठ विवरण पनि छ। आकार र पाठले तहहरू छुट्याउँछन्; रङ दोस्रो सङ्केत मात्र हो।')}</p>
      <ul>{ENTRIES.map(entry => <li key={entry.label} title={t(entry.detail, entry.detailNe)}>
        <span className={`map-key-swatch map-key-${entry.shape}`} style={{ '--swatch': entry.colour } as React.CSSProperties} aria-hidden="true" />
        <span><strong>{t(entry.label, entry.labelNe)}</strong> <span className="muted map-key-detail">{t(entry.detail, entry.detailNe)}</span></span>
      </li>)}</ul>
    </details>
  </section>;
}
