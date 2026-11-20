// Narrow strips follow the verified polyline. Their width and height are drawing
// dimensions only. The middle-speed front and tail supply the distances in km.
import { flatKm } from './places.js';
import { maplibregl } from './basemap.js';
import { c, num } from './app.js';

const ribbon = 'flood-ribbon';
const climate = matchMedia('(prefers-color-scheme: dark)');

// Each pair of vertices spans the channel at one distance. Adjacent faces
// share that pair, including at sharp bends and the ends of source segments.
function ribbonStations(line, total) {
  const stations = [];
  let distance = 0;
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i], km = flatKm(a, b);
    if (!km) continue;
    const count = Math.ceil(km / 0.35);
    for (let j = 0; j < count; j++) {
      const p = a.map((v, k) => v + (b[k] - v) * j / count);
      stations.push({ p, km: distance + km * j / count });
    }
    distance += km;
  }
  stations.push({ p: line.at(-1), km: distance });
  for (const s of stations) {
    s.km *= total / distance;
    s.coord = maplibregl.MercatorCoordinate.fromLngLat(s.p);
    s.unit = s.coord.meterInMercatorCoordinateUnits();
  }
  return stations;
}

function sectionAt(stations, km) {
  let lo = 0, hi = stations.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (stations[mid].km < km) lo = mid + 1; else hi = mid;
  }
  return lo;
}

function waterLayer(map, stations, getPulse) {
  // Positions are local to the route origin to retain precision when zoomed in.
  // Width and lift are illustrative drawing dimensions, independent of discharge.
  const origin = stations[0].coord;
  const data = new Float32Array(stations.length * 2 * 6);
  for (const [i, s] of stations.entries()) {
    const before = stations[Math.max(0, i - 1)].coord, after = stations[Math.min(i + 1, stations.length - 1)].coord;
    const dx = after.x - before.x, dy = after.y - before.y, norm = Math.hypot(dx, dy) || 1;
    for (const [j, side] of [-1, 1].entries()) {
      const offset = side * 115 * s.unit / norm;
      data.set([s.coord.x - origin.x - dy * offset, s.coord.y - origin.y + dx * offset, 0, s.unit, s.km, side], (2 * i + j) * 6);
    }
  }
  let program, buffer, vao, matrix, pulseUniform, revision = 0;
  const invalidate = e => { if (!e.sourceId || e.sourceId === 'dem') revision++; };
  const vertex = `#version 300 es
    layout(location=0) in vec4 pos;
    layout(location=1) in vec2 station;
    uniform mat4 matrix;
    uniform vec3 pulse;
    out vec2 strip;
    void main() {
      float crest = smoothstep(0., 1., 1. - (pulse.x - station.x) / pulse.z);
      gl_Position = matrix * vec4(pos.xy, pos.z + pos.w * (18. + 690. * crest), 1.);
      strip = station;
    }`;
  const fragment = `#version 300 es
    precision highp float;
    uniform vec3 pulse;
    in vec2 strip;
    out vec4 pixel;
    void main() {
      if (strip.x < pulse.y || strip.x > pulse.x) discard;
      float crest = smoothstep(0., 1., 1. - (pulse.x - strip.x) / pulse.z);
      float edge = smoothstep(.76, 1., abs(strip.y));
      vec3 water = mix(vec3(.035,.35,.54), vec3(.32,.86,.90), crest);
      float alpha = .85 * (1. - .72 * edge);
      pixel = vec4(mix(water, vec3(.75,.96,.98), .35 * edge) * alpha, alpha);
    }`;
  return {
    id: ribbon, type: 'custom', renderingMode: '3d',
    onAdd(_, gl) {
      program = gl.createProgram();
      for (const [type, text] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, text); gl.compileShader(shader);
        gl.attachShader(program, shader); gl.deleteShader(shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
      matrix = gl.getUniformLocation(program, 'matrix'); pulseUniform = gl.getUniformLocation(program, 'pulse');
      vao = gl.createVertexArray(); gl.bindVertexArray(vao);
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 24, 16);
      gl.bindVertexArray(null);
      map.on('sourcedata', invalidate); map.on('terrain', invalidate);
    },
    render(gl, args) {
      const pulse = getPulse();
      if (!pulse || pulse.front <= pulse.tail || pulse.tail >= stations.at(-1).km) return;
      const start = Math.max(0, sectionAt(stations, pulse.tail) - 1), end = sectionAt(stations, pulse.front);
      let changed = false;
      for (let i = start; i <= end; i++) {
        const s = stations[i];
        if (s.revision === revision) continue;
        const metres = map.queryTerrainElevation(s.p);
        if (!Number.isFinite(metres)) {
          // Retry this span together when its remaining DEM tiles arrive.
          for (let j = start; j < i; j++) stations[j].revision = undefined;
          return;
        }
        data[i * 12 + 2] = data[i * 12 + 8] = metres * s.unit;
        s.revision = revision; changed = true;
      }
      gl.bindVertexArray(vao); gl.useProgram(program);
      if (changed) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, start * 48, data.subarray(start * 12, (end + 1) * 12));
      }
      const m = Array.from(args.defaultProjectionData.mainMatrix);
      for (let i = 0; i < 4; i++) m[12 + i] += m[i] * origin.x + m[i + 4] * origin.y;
      gl.uniformMatrix4fv(matrix, false, m);
      gl.uniform3f(pulseUniform, pulse.front, pulse.tail, pulse.span);
      gl.disable(gl.CULL_FACE);
      gl.drawArrays(gl.TRIANGLE_STRIP, start * 2, (end - start + 1) * 2);
      gl.bindVertexArray(null);
    },
    onRemove(_, gl) {
      map.off('sourcedata', invalidate); map.off('terrain', invalidate);
      gl.deleteVertexArray(vao); gl.deleteBuffer(buffer); gl.deleteProgram(program);
    },
  };
}

// Load the optional renderer only on entering flood 3D. An in-flight worker
// belongs to this layer, so changing route or tab cannot install stale data.
function riverLayer(map, line, total, getPulse) {
  let worker, removed = false, makeScene, shape, scene, fallback, failed = false;
  function useFallback() {
    worker?.terminate();
    worker = null;
    failed = true;
    if (!removed) map.triggerRepaint();
  }
  return {
    id: ribbon, type: 'custom', renderingMode: '3d',
    onAdd() {
      try {
        worker = new Worker(new URL('./river/mesh-worker.js', import.meta.url), { type: 'module' });
        worker.onerror = useFallback;
        worker.onmessage = ({ data }) => {
          worker?.terminate(); worker = null;
          if (!data) { useFallback(); return; }
          shape = data;
          if (!removed) map.triggerRepaint();
        };
        worker.postMessage({ line, total });
        import('./river/water.js').then(module => {
          makeScene = module.waterScene;
          if (!removed) map.triggerRepaint();
        }, useFallback);
      } catch { useFallback(); }
    },
    render(gl, args) {
      if (!failed && !scene && shape && makeScene) {
        try {
          scene = makeScene(map, gl, shape, maplibregl.MercatorCoordinate.fromLngLat(line[0]));
          shape = null;
        } catch { useFallback(); }
      }
      if (scene) scene.draw(args, getPulse());
      else if (failed) {
        if (!fallback) {
          fallback = waterLayer(map, ribbonStations(line, total), getPulse);
          fallback.onAdd(map, gl);
        }
        fallback.render(gl, args);
      }
    },
    onRemove(_, gl) {
      removed = true; worker?.terminate(); scene?.remove(); fallback?.onRemove(map, gl);
    },
  };
}

export function scenarioTerrain(map) {
  const button = document.getElementById('terrain-toggle'), settings = document.getElementById('terrain-settings');
  const scale = document.getElementById('terrain-scale'), note = document.getElementById('terrain-note');
  button.setAttribute('aria-label', c.tilt);
  scale.setAttribute('aria-label', c.terrainScale);
  for (const value of [1, 1.5]) scale.add(new Option(c.scaleFactor(num(value, 1)), value));
  const nativePixelRatio = map.getPixelRatio();
  let mode, line, total, pulse;
  const enabled = () => button.getAttribute('aria-pressed') === 'true';
  function removeRibbon() { if (map.getLayer(ribbon)) map.removeLayer(ribbon); }
  function addRibbon() {
    if (line && enabled() && !map.getLayer(ribbon)) map.addLayer(riverLayer(map, line, total, () => pulse));
  }
  function setTerrain(on) {
    map.setTerrain(on ? { source: 'dem', exaggeration: Number(scale.value) } : null);
    if (!on) return;
    // The pinned 6.7.0 renderer caches one grid per terrain instance.
    // Set its drawing resolution before the first frame. Elevation queries
    // still use the full DEM. Leave other renderer implementations alone.
    const surface = map.terrain, tiles = map.painter?.renderToTexture;
    if (map.version === '6.7.0' && surface?.meshSize === 128 && tiles?.rttSize) {
      const small = map.getCanvas().clientWidth <= 600;
      surface.meshSize = small ? 24 : 64;
      if (small) tiles.rttSize = Math.min(tiles.rttSize, 192);
    }
  }
  function atmosphere() {
    const fly = enabled() && mode === 'flood';
    const theme = document.documentElement.dataset.theme, dark = theme === 'dark' || (!theme && climate.matches);
    const ratio = fly && map.getCanvas().clientWidth <= 600 ? Math.min(nativePixelRatio, 1.25) : nativePixelRatio;
    if (map.getPixelRatio() !== ratio) map.setPixelRatio(ratio);
    map.setSky(fly ? { 'sky-color': dark ? '#172c44' : '#6fadc9', 'horizon-color': dark ? '#50657a' : '#dfedf0',
      'fog-color': dark ? '#576b7c' : '#d8e6e9', 'fog-ground-blend': 0.48, 'sky-horizon-blend': 0.65,
      'horizon-fog-blend': 0.7, 'atmosphere-blend': 0 } : undefined);
    map.setLight(fly ? { anchor: 'map', position: [1.4, 315, 42], intensity: 0.38 } : { anchor: 'viewport', position: [1.15, 210, 30], intensity: 0.5 });
    map.setPaintProperty('hillshade', 'hillshade-illumination-anchor', fly ? 'map' : 'viewport');
    map.setPaintProperty('hillshade', 'hillshade-shadow-color', fly ? (dark ? '#152330' : '#304956') : '#0b1a22');
    map.setPaintProperty('hillshade', 'hillshade-exaggeration', fly ? 0.44 : 0.6);
    map.getContainer().classList.toggle('river-flight', fly);
  }
  addEventListener('themechange', atmosphere); climate.addEventListener('change', atmosphere);
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
    setTerrain(on);
    atmosphere();
    map.jumpTo({ pitch: on ? (mode === 'flood' ? 60 : 48) : 0, bearing: 0 });
    if (on) addRibbon();
  };
  scale.onchange = () => setTerrain(true);
  button.disabled = false;
  return {
    clear(nextMode) {
      if (nextMode !== mode) {
        mode = nextMode; atmosphere();
        if (enabled()) map.jumpTo({ pitch: mode === 'flood' ? 60 : 48, bearing: 0 });
      }
      ruptureCasing();
      removeRibbon(); line = pulse = null;
      note.textContent = mode === 'quake' ? c.terrainQuake : c.terrainFlood;
    },
    path(coords, km) { line = coords; total = km; addRibbon(); },
    progress(front, tail, span) {
      pulse = { front, tail, span };
      if (line && enabled()) map.triggerRepaint();
    },
  };
}
