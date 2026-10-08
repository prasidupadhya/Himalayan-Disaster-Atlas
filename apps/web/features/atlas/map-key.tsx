const ENTRIES: Array<{ shape: 'line' | 'dot' | 'area'; colour: string; label: string; detail: string }> = [
  { shape: 'line', colour: '#3987e5', label: 'River reach', detail: 'Click to select; then trace downstream' },
  { shape: 'dot', colour: '#199e70', label: 'Glacial lake, glacier-fed', detail: 'Click to inspect' },
  { shape: 'dot', colour: '#7fd1b5', label: 'Glacial lake, not glacier-fed', detail: 'Lighter tint of the lake colour' },
  { shape: 'area', colour: '#dcf1f8', label: 'Glacier outline', detail: 'RGI dated inventory' },
  { shape: 'dot', colour: '#d95926', label: 'Hydropower', detail: 'Mapped plants (OpenStreetMap)' },
  { shape: 'dot', colour: '#d55181', label: 'Flood', detail: 'BIPAD historical reported incidents' },
  { shape: 'dot', colour: '#c98500', label: 'Landslide', detail: 'BIPAD historical reported incidents' },
  { shape: 'dot', colour: '#e66767', label: 'Earthquake', detail: 'Catalogue events' },
  { shape: 'dot', colour: '#8fa3ad', label: 'River station', detail: 'Red above danger level, ochre above warning level' },
  { shape: 'dot', colour: '#c9d6de', label: 'Rainfall gauge', detail: 'Red when above warning level' },
  { shape: 'dot', colour: '#f5f5f0', label: 'Infrastructure', detail: 'Roads, bridges, schools, health, emergency, settlements' },
  { shape: 'area', colour: '#7f9aa6', label: 'Administrative boundary', detail: 'Click to inspect' },
];

export function MapKey() {
  return <section className="map-key" aria-labelledby="map-key-heading">
    <h2 id="map-key-heading">Map key</h2>
    <p className="muted">Every layer also has a text description in its panel. Shape and text distinguish layers; colour is a second cue.</p>
    <ul>{ENTRIES.map(entry => <li key={entry.label}>
      <span className={`map-key-swatch map-key-${entry.shape}`} style={{ '--swatch': entry.colour } as React.CSSProperties} aria-hidden="true" />
      <span><strong>{entry.label}</strong> <span className="muted">{entry.detail}</span></span>
    </li>)}</ul>
  </section>;
}
