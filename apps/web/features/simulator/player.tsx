'use client';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import type { GeoJSONSource, Map } from 'maplibre-gl';
import { formatNumber, useLanguage } from '../../lib/i18n';
import { shortTime } from './copy';
import { circle, floodPlaybackSeconds, headingAt, measure, pointAt, pulseAt, slice, type LonLat } from './scene-3d';
import type { Corners } from './simulator-map';

/** The declared flood pulse, as the scenario defines it: it moves along the river line at three declared celerities. */
export interface FloodPlay {
  kind: 'flood'; line: LonLat[]; pathKm: number; celerity: [number, number, number]; duration_s: number;
  checkpoints: Array<{ km: number }>;
}
/** An earthquake scenario: modelled shaking (BSSA14) revealed behind an illustrative S-wave front. */
export interface QuakePlay { kind: 'quake'; epicentre: LonLat; reachKm: number; shaking: { canvas: HTMLCanvasElement; coordinates: Corners } | null }
export type Play = FloodPlay | QuakePlay;

// Standard illustrative crustal wave speeds; they only pace the picture, not the modelled shaking.
const P_KM_S = 6, S_KM_S = 3.5;
const SPEEDS = [20, 40, 80] as const;
const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
const line = (coords: LonLat[]): GeoJSON.FeatureCollection => ({ type: 'FeatureCollection', features: coords.length > 1 ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } }] : [] });
const point = (p: LonLat | null): GeoJSON.FeatureCollection => ({ type: 'FeatureCollection', features: p ? [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: p } }] : [] });
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COPY = {
  en: {
    label: '3D scenario playback', play: 'Play', pause: 'Pause', replay: 'Replay', time: 'Time after release', quakeTime: 'Time after rupture',
    speed: 'Playback length', seconds: (s: number) => `${s} s`, follow: 'Follow', threeD: '3D', flat: '2D',
    modelled: 'MODELLED · HYPOTHETICAL',
    floodNote: 'The declared pulse moving along the river line. It does not show where water would spread.',
    quakeNote: 'Modelled shaking revealed behind an illustrative wave front. Wave timing is approximate.',
    floodStatus: (t: string, km: string, lo: string, hi: string) => `${t} after release: front about ${km} km downstream at the central speed (range ${lo}–${hi} km).`,
    floodDone: (t: string) => `${t}: the declared pulse has passed the end of the mapped path.`,
    quakeStatus: (t: string, s: string, p: string) => `${t} after rupture: strong-shaking front (S wave, ~3.5 km/s) about ${s} km out; first tremor (P wave, ~6 km/s) about ${p} km.`,
    reached: (km: string, t: string) => `Front reaches ${km} km at ${t}`,
    relief: 'relief ×1.5',
  },
  ne: {
    label: '३D परिदृश्य प्रदर्शन', play: 'चलाउनुहोस्', pause: 'रोक्नुहोस्', replay: 'फेरि चलाउनुहोस्', time: 'बहावपछिको समय', quakeTime: 'फुटानपछिको समय',
    speed: 'प्रदर्शन अवधि', seconds: (s: number) => `${formatNumber(s, 'ne')} सेकेन्ड`, follow: 'पछ्याउनुहोस्', threeD: '३D', flat: '२D',
    modelled: 'मोडेल गरिएको · काल्पनिक',
    floodNote: 'घोषित बहाव नदी रेखामा अघि बढ्दै। पानी कहाँ फैलिन्छ भन्ने यसले देखाउँदैन।',
    quakeNote: 'उदाहरणात्मक तरङ्ग अग्रभागपछि मोडेल गरिएको कम्पन देखाइएको। तरङ्गको समय अनुमानित हो।',
    floodStatus: (t: string, km: string, lo: string, hi: string) => `बहावपछि ${t}: केन्द्रीय गतिमा अग्रभाग करिब ${km} km तल (दायरा ${lo}–${hi} km)।`,
    floodDone: (t: string) => `${t}: घोषित बहाव नक्सांकित मार्गको अन्त्यबाट पार भयो।`,
    quakeStatus: (t: string, s: string, p: string) => `फुटानपछि ${t}: बलियो कम्पनको अग्रभाग (S तरङ्ग, ~३.५ km/s) करिब ${s} km; पहिलो कम्पन (P तरङ्ग, ~६ km/s) करिब ${p} km।`,
    reached: (km: string, t: string) => `अग्रभाग ${km} km मा ${t} मा पुग्छ`,
    relief: 'उचाइ ×१.५',
  },
} as const;

/** Plays a scenario on the 3D map. Owns its own sources and layers; the map and its terrain belong to SimulatorMap. */
export function Player({ map, play, threeD, onThreeD, shell }: { map: Map; play: Play; threeD: boolean; onThreeD: (on: boolean) => void; shell: RefObject<HTMLElement | null> }) {
  const [lang] = useLanguage();
  const c = COPY[lang];
  const flood = play.kind === 'flood' ? play : null, quake = play.kind === 'quake' ? play : null;
  const measured = useMemo(() => flood ? measure(flood.line) : null, [flood]);
  const total = flood ? floodPlaybackSeconds(flood.celerity, flood.duration_s, flood.pathKm) : (quake!.reachKm / S_KM_S);
  const [t, setT] = useState(() => reducedMotion() ? total : 0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(SPEEDS[1]);
  const [follow, setFollow] = useState(true);
  const clock = useRef({ t, speed: SPEEDS[1] as number, follow: true, heading: 0 });
  useEffect(() => { clock.current.speed = speed; clock.current.follow = follow; }, [speed, follow]);
  const reveal = useRef<HTMLCanvasElement | null>(null);

  // Sources and layers for this play; removed when the scenario changes.
  useEffect(() => {
    const before = map.getLayer('sim-origins') ? 'sim-origins' : undefined;
    const ids: string[] = [];
    const add = (id: string, layer: Parameters<Map['addLayer']>[0]) => { map.addLayer(layer, before); ids.push(id); };
    for (const id of ['play-range', 'play-pulse', 'play-head', 'play-p', 'play-s']) map.addSource(id, { type: 'geojson', data: EMPTY, lineMetrics: true });
    if (flood) {
      add('play-range', { id: 'play-range', type: 'line', source: 'play-range', layout: { 'line-cap': 'round' }, paint: { 'line-color': '#bfe6ff', 'line-width': 9, 'line-opacity': 0.35, 'line-blur': 3 } });
      add('play-pulse-glow', { id: 'play-pulse-glow', type: 'line', source: 'play-pulse', layout: { 'line-cap': 'round' }, paint: { 'line-color': '#4cc3ff', 'line-width': 22, 'line-opacity': 0.35, 'line-blur': 12 } });
      add('play-pulse', { id: 'play-pulse', type: 'line', source: 'play-pulse', layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-width': 7, 'line-gradient': ['interpolate', ['linear'], ['line-progress'], 0, '#1d6fa5', 0.75, '#3fb6ff', 1, '#e6f7ff'] } });
      add('play-head-halo', { id: 'play-head-halo', type: 'circle', source: 'play-head', paint: { 'circle-radius': 18, 'circle-color': '#7fd3ff', 'circle-opacity': 0.25, 'circle-blur': 0.6, 'circle-pitch-alignment': 'map' } });
      add('play-head', { id: 'play-head', type: 'circle', source: 'play-head', paint: { 'circle-radius': 6, 'circle-color': '#ffffff', 'circle-stroke-color': '#1d6fa5', 'circle-stroke-width': 3, 'circle-pitch-alignment': 'map' } });
    } else {
      add('play-p', { id: 'play-p', type: 'line', source: 'play-p', paint: { 'line-color': '#f4f1e8', 'line-width': 1.5, 'line-opacity': 0.8, 'line-dasharray': [3, 3] } });
      add('play-s-glow', { id: 'play-s-glow', type: 'line', source: 'play-s', paint: { 'line-color': '#ffb347', 'line-width': 16, 'line-opacity': 0.3, 'line-blur': 10 } });
      add('play-s', { id: 'play-s', type: 'line', source: 'play-s', paint: { 'line-color': '#ffcf7a', 'line-width': 3 } });
      add('play-head', { id: 'play-head', type: 'circle', source: 'play-head', paint: { 'circle-radius': 7, 'circle-color': '#ffffff', 'circle-stroke-color': '#a8440f', 'circle-stroke-width': 4, 'circle-pitch-alignment': 'map' } });
    }
    // The modelled shaking is drawn into a second canvas, clipped to the S-wave front, so it appears as the front passes.
    if (quake?.shaking) {
      const canvas = document.createElement('canvas');
      canvas.width = quake.shaking.canvas.width; canvas.height = quake.shaking.canvas.height;
      reveal.current = canvas;
      map.addSource('play-shaking', { type: 'canvas', canvas, coordinates: quake.shaking.coordinates, animate: true });
      map.addLayer({ id: 'play-shaking', type: 'raster', source: 'play-shaking', paint: { 'raster-opacity': 0.72, 'raster-fade-duration': 0, 'raster-resampling': 'nearest' } }, 'play-p');
      ids.unshift('play-shaking');
    }
    return () => {
      if (!map.getStyle()) return;
      for (const id of [...ids].reverse()) if (map.getLayer(id)) map.removeLayer(id);
      for (const id of ['play-range', 'play-pulse', 'play-head', 'play-p', 'play-s', 'play-shaking']) if (map.getSource(id)) map.removeSource(id);
      reveal.current = null;
    };
  }, [map, flood, quake]);

  // Draws the scene at time `t`; called every frame while playing and whenever `t` is set by hand.
  const draw = useMemo(() => {
    const set = (id: string, data: GeoJSON.FeatureCollection) => (map.getSource(id) as GeoJSONSource | undefined)?.setData(data);
    return (time: number, camera: boolean) => {
      if (flood && measured) {
        // Model km are mapped onto the drawn line in proportion, so checkpoints and the pulse agree with the tables.
        const scale = measured.length / flood.pathKm;
        const [slow, mid, fast] = flood.celerity.map(v => pulseAt(time, v, flood.duration_s, flood.pathKm));
        set('play-pulse', line(slice(measured, mid.tail * scale, mid.head * scale)));
        set('play-range', line(slice(measured, Math.min(fast.tail, slow.tail) * scale, fast.head * scale)));
        const done = mid.tail >= flood.pathKm;
        set('play-head', point(done ? null : pointAt(measured, mid.head * scale)));
        shell.current?.querySelectorAll<HTMLElement>('.sim-checkpoint-label').forEach(el => el.classList.toggle('reached', Number(el.dataset.km) <= mid.head + 1e-6));
        if (camera && clock.current.follow && !done) {
          const target = headingAt(measured, mid.head * scale);
          const delta = ((target - clock.current.heading + 540) % 360) - 180;
          clock.current.heading = (clock.current.heading + delta * 0.06 + 360) % 360;
          // A narrow screen sees less of the valley floor, so it looks down more steeply from a little higher.
          const narrow = map.getContainer().clientWidth < 640;
          map.jumpTo({ center: pointAt(measured, mid.head * scale), bearing: clock.current.heading, pitch: threeD ? (narrow ? 52 : 66) : 0, zoom: narrow ? 9.6 : 10.3 });
        }
      } else if (quake) {
        const s = Math.min(quake.reachKm, time * S_KM_S), p = Math.min(quake.reachKm * 1.6, time * P_KM_S);
        set('play-s', line(s > 0.5 ? circle(quake.epicentre, s) : []));
        set('play-p', line(p > 0.5 ? circle(quake.epicentre, p) : []));
        set('play-head', point(quake.epicentre));
        const canvas = reveal.current;
        if (canvas && quake.shaking) {
          const ctx = canvas.getContext('2d')!;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (s > 0.5) {
            const [[west, north], [east], , [, south]] = [quake.shaking.coordinates[0], quake.shaking.coordinates[1], quake.shaking.coordinates[2], quake.shaking.coordinates[3]];
            const mx = (lon: number) => (lon + 180) / 360, my = (lat: number) => (1 - Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) / Math.PI) / 2;
            const x = (lon: number) => (mx(lon) - mx(west)) / (mx(east) - mx(west)) * canvas.width;
            const y = (lat: number) => (my(lat) - my(north)) / (my(south) - my(north)) * canvas.height;
            ctx.save(); ctx.beginPath();
            circle(quake.epicentre, s, 72).forEach(([lon, lat], i) => i ? ctx.lineTo(x(lon), y(lat)) : ctx.moveTo(x(lon), y(lat)));
            ctx.closePath(); ctx.clip(); ctx.drawImage(quake.shaking.canvas, 0, 0); ctx.restore();
          }
        }
        if (camera && clock.current.follow) map.jumpTo({ bearing: (map.getBearing() + 0.18) % 360 });
      }
    };
  }, [map, flood, quake, measured, shell, threeD]);

  // Frames the scene when it first appears.
  useEffect(() => {
    const ring = flood ? flood.line : circle(quake!.epicentre, Math.min(220, quake!.reachKm * 0.55), 24);
    const lons = ring.map(p => p[0]), lats = ring.map(p => p[1]);
    map.fitBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]], { padding: 50, maxZoom: 10, pitch: threeD ? 62 : 0, bearing: flood && measured ? headingAt(measured, 0, 20) : 0, duration: reducedMotion() ? 0 : 1200 });
    if (flood && measured) clock.current.heading = headingAt(measured, 0, 20);
    clock.current.t = reducedMotion() ? total : 0;
    setT(clock.current.t); draw(clock.current.t, false);
    if (!reducedMotion()) {
      // Starts on its own once the map is on screen; nobody needs to press anything to see it.
      const seen = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { setPlaying(true); seen.disconnect(); } }, { threshold: 0.5 });
      if (shell.current) seen.observe(shell.current);
      return () => seen.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, play]);

  // The animation loop; the HUD is refreshed a few times a second, the map every frame.
  useEffect(() => {
    if (!playing) return;
    let frame = 0, last = performance.now(), shown = 0, drawn = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      clock.current.t = Math.min(total, clock.current.t + dt * total / clock.current.speed);
      // About 30 redraws a second is smooth on terrain and halves the work for low-end phones.
      if (now - drawn >= 32 || clock.current.t >= total) { drawn = now; draw(clock.current.t, true); }
      if (now - shown > 120 || clock.current.t >= total) { shown = now; setT(clock.current.t); }
      if (clock.current.t >= total) { setPlaying(false); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const stopFollow = () => setFollow(false);
    map.on('dragstart', stopFollow);
    return () => { cancelAnimationFrame(frame); map.off('dragstart', stopFollow); };
  }, [playing, draw, total, map]);

  // A short spoken summary when a checkpoint is reached, not every frame.
  const midHead = flood ? pulseAt(t, flood.celerity[1], flood.duration_s, flood.pathKm).head : 0;
  const reachedCount = flood ? flood.checkpoints.filter(k => k.km <= midHead + 1e-6).length : 0;
  const lastReached = flood && reachedCount ? flood.checkpoints[reachedCount - 1] : null;
  const announce = flood && lastReached ? c.reached(formatNumber(lastReached.km, lang, 0), shortTime(lastReached.km * 1000 / flood.celerity[1], lang)) : '';

  const scrub = (value: number) => { setPlaying(false); clock.current.t = value; setT(value); draw(value, true); };
  const status = flood ? (() => {
    const [slow, mid, fast] = flood.celerity.map(v => pulseAt(t, v, flood.duration_s, flood.pathKm));
    return mid.tail >= flood.pathKm ? c.floodDone(shortTime(t, lang)) : c.floodStatus(shortTime(t, lang), formatNumber(mid.head, lang, 0), formatNumber(slow.head, lang, 0), formatNumber(fast.head, lang, 0));
  })() : c.quakeStatus(`${formatNumber(Math.round(t), lang)} s`, formatNumber(Math.min(quake!.reachKm, t * S_KM_S), lang, 0), formatNumber(Math.min(quake!.reachKm * 1.6, t * P_KM_S), lang, 0));

  return <div className="sim-player" role="group" aria-label={c.label} data-player-state={playing ? 'playing' : t >= total ? 'ended' : 'paused'}>
    <p className="sim-player-badge"><strong>{c.modelled}</strong> <span>{flood ? c.floodNote : c.quakeNote}</span></p>
    <p className="sim-player-status" data-player-time={Math.round(t)}>{status}</p>
    <p className="sr-only" role="status" aria-live="polite">{announce}</p>
    <div className="sim-player-controls">
      <button type="button" className="sim-player-play" onClick={() => { if (t >= total) { clock.current.t = 0; setT(0); draw(0, true); } setFollow(true); setPlaying(p => !p); }}>
        <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span> {playing ? c.pause : t >= total ? c.replay : c.play}
      </button>
      <label className="sim-player-scrub"><span className="sr-only">{flood ? c.time : c.quakeTime}</span>
        <input type="range" min={0} max={Math.round(total)} step={1} value={Math.round(t)} aria-valuetext={status} onChange={event => scrub(Number(event.target.value))} />
      </label>
      <label className="sim-player-speed"><span className="sr-only">{c.speed}</span>
        <select value={speed} onChange={event => setSpeed(Number(event.target.value) as (typeof SPEEDS)[number])}>{SPEEDS.map(s => <option key={s} value={s}>{c.seconds(s)}</option>)}</select>
      </label>
      <button type="button" aria-pressed={follow} onClick={() => setFollow(f => !f)}>{c.follow}</button>
      <button type="button" aria-pressed={threeD} onClick={() => onThreeD(!threeD)} title={c.relief}>{threeD ? c.threeD : c.flat}</button>
    </div>
  </div>;
}
