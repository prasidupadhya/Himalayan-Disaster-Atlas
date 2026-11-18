// Narrow strips follow the verified polyline. Their width and height are drawing
// dimensions only. The middle-speed front and tail supply the distances in km.
import { flatKm } from './places.js';
import { c, num } from './app.js';

const empty = { type: 'FeatureCollection', features: [] };
const ribbon = 'flood-ribbon';
function ribbonSegments(line, totalKm) {
  const segments = [];
  let length = 0;
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i], km = flatKm(a, b);
    if (!km) continue;
    const dx = b[0] - a[0], dy = b[1] - a[1], cos = Math.cos((a[1] + b[1]) * Math.PI / 360);
    // Cartographic stroke perpendicular to the channel, in geographic coordinates.
    const halfWidth = 0.00065, norm = Math.hypot(dx * cos, dy);
    segments.push({ a, dx, dy, nx: -dy / norm * halfWidth / cos, ny: dx * cos / norm * halfWidth, start: length, end: length + km });
    length += km;
  }
  for (const s of segments) { s.start *= totalKm / length; s.end *= totalKm / length; }
  return segments;
}

export function scenarioTerrain(map) {
  const button = document.getElementById('terrain-toggle'), settings = document.getElementById('terrain-settings');
  const scale = document.getElementById('terrain-scale'), note = document.getElementById('terrain-note');
  button.setAttribute('aria-label', c.tilt);
  scale.setAttribute('aria-label', c.terrainScale);
  for (const value of [1, 1.5]) scale.add(new Option(c.scaleFactor(num(value, 1)), value));
  let mode, line, total, segments, pulse, lastPaint = -Infinity;
  const enabled = () => button.getAttribute('aria-pressed') === 'true';
  function removeRibbon() {
    if (map.getLayer(ribbon)) map.removeLayer(ribbon);
    if (map.getSource(ribbon)) map.removeSource(ribbon);
  }
  function paintRibbon() {
    if (!line || !enabled()) return;
    if (!map.getSource(ribbon)) {
      segments ??= ribbonSegments(line, total);
      map.addSource(ribbon, { type: 'geojson', data: empty, tolerance: 0 });
      map.addLayer({ id: ribbon, source: ribbon, type: 'fill-extrusion', paint: {
        'fill-extrusion-color': '#318bd1', 'fill-extrusion-opacity': 0.68,
        'fill-extrusion-height': ['get', 'height'], 'fill-extrusion-vertical-gradient': false,
      } });
    }
    const features = [];
    if (pulse) {
      const { front, tail, span } = pulse;
      for (const { a, dx, dy, nx, ny, start, end } of segments) {
        const lo = Math.max(tail, start), hi = Math.min(front, end);
        if (hi <= lo) continue;
        const edge = (km, side) => {
          const k = (km - start) / (end - start);
          return [a[0] + k * dx + side * nx, a[1] + k * dy + side * ny];
        };
        const p = edge(lo, 1);
        // A rising crest points to the middle front. No depth is calculated.
        const fraction = Math.max(0, 1 - (front - (lo + hi) / 2) / span);
        features.push({ type: 'Feature', properties: { height: 1600 * fraction },
          geometry: { type: 'Polygon', coordinates: [[p, edge(lo, -1), edge(hi, -1), edge(hi, 1), p]] } });
      }
    }
    map.getSource(ribbon).setData({ type: 'FeatureCollection', features });
    lastPaint = performance.now();
  }
  function ruptureCasing() {
    const id = 'rupture-casing';
    if (mode === 'quake' && enabled()) {
      if (!map.getLayer(id)) map.addLayer({ id, type: 'line', source: 'rupture',
        paint: { 'line-color': '#fff', 'line-width': 7, 'line-opacity': 0.9 } }, 'rupture');
    } else if (map.getLayer(id)) map.removeLayer(id);
  }
  button.onclick = () => {
    const on = !enabled();
    button.setAttribute('aria-pressed', String(on));
    settings.hidden = !on;
    if (!on) removeRibbon();
    ruptureCasing();
    map.setTerrain(on ? { source: 'dem', exaggeration: Number(scale.value) } : null);
    map.jumpTo({ pitch: on ? 48 : 0 });
    if (on) paintRibbon();
  };
  scale.onchange = () => map.setTerrain({ source: 'dem', exaggeration: Number(scale.value) });
  button.disabled = false;
  return {
    clear(nextMode) {
      mode = nextMode; ruptureCasing();
      removeRibbon(); line = segments = pulse = null;
      note.textContent = mode === 'quake' ? c.terrainQuake : c.terrainFlood;
    },
    path(coords, km) { line = coords; total = km; paintRibbon(); },
    progress(front, tail, span, playing) {
      pulse = { front, tail, span };
      if (!playing || performance.now() - lastPaint >= 65) paintRibbon();
    },
  };
}
