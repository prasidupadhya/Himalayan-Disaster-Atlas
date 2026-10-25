import { useEffect, useRef } from 'react';
import { useCopy } from '../../lib/i18n';
import { MAP_KEY } from './copy';

// Shapes and colours are the map styles in lib/map-layers.ts; the words live in the copy module.
const ENTRIES: Array<{ id: keyof typeof MAP_KEY.en.entries; shape: 'line' | 'dot' | 'area'; colour: string }> = [
  { id: 'river', shape: 'line', colour: '#3987e5' }, { id: 'lakeFed', shape: 'dot', colour: '#199e70' }, { id: 'lakeOther', shape: 'dot', colour: '#7fd1b5' },
  { id: 'hydropower', shape: 'dot', colour: '#d95926' }, { id: 'infrastructure', shape: 'dot', colour: '#f5f5f0' }, { id: 'boundary', shape: 'area', colour: '#7f9aa6' },
];

export function MapKey() {
  const c = useCopy(MAP_KEY);
  const details = useRef<HTMLDetailsElement>(null);
  // Folded in the HTML and opened on wide screens after load: it floats over the map, so opening it moves nothing,
  // while folding an open key on a phone would shift the page.
  useEffect(() => { if (details.current && window.matchMedia('(min-width: 721px)').matches) details.current.open = true; }, []);
  return <section className="map-key" aria-labelledby="map-key-heading">
    <details ref={details}>
      <summary><h2 id="map-key-heading">{c.title}</h2></summary>
      <p className="muted map-key-intro">{c.intro}</p>
      <ul>{ENTRIES.map(entry => <li key={entry.id} title={c.entries[entry.id][1]}>
        <span className={`map-key-swatch map-key-${entry.shape}`} style={{ '--swatch': entry.colour } as React.CSSProperties} aria-hidden="true" />
        <span><strong>{c.entries[entry.id][0]}</strong> <span className="muted map-key-detail">{c.entries[entry.id][1]}</span></span>
      </li>)}</ul>
    </details>
  </section>;
}
