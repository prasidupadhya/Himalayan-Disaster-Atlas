'use client';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import type { GeoJSONSource, Map } from 'maplibre-gl';
import { formatNumber, useLanguage } from '../../lib/i18n';
import { shortTime } from './copy';
import { circle, floodPlaybackSeconds, haversineKm, headingAt, measure, pointAt, pulseAt, slice, type LonLat } from './scene-3d';
import { markLabels, useLabelCollisions, useMapLabels, type MapLabel } from './map-labels';
import { districtSequence, whereAt, type Route } from './route';
import { PROVINCE_NE, useGazetteer, useRoute, type Gazetteer } from './route-data';
import { contains } from './route';
import type { Corners } from './simulator-map';

/** The declared flood pulse, as the scenario defines it: it moves along the river line at three declared celerities. */
export interface FloodPlay {
  kind: 'flood'; id: string; line: LonLat[]; pathKm: number; celerity: [number, number, number]; duration_s: number;
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
    relief: 'relief ×1.5', view: 'Camera', overview: 'Whole scenario', full: 'Full screen', exitFull: 'Exit full screen',
    hint: 'Pinch, scroll or use + and − to zoom; drag to look around. Follow keeps your zoom.',
    start: 'Start', end: 'Mapped path ends', leaves: 'Nepal border', outside: 'outside Nepal', province: (n: string) => `${n} Province`,
    now: 'Now passing', near: 'near', river: (n: string) => `named stream point ${n}`, route: 'Route through districts', epicentre: 'Epicentre',
    loadingNames: 'Loading place and river names…',
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
    relief: 'उचाइ ×१.५', view: 'क्यामेरा', overview: 'पूरा परिदृश्य', full: 'पूरा स्क्रिन', exitFull: 'पूरा स्क्रिनबाट निस्कनुहोस्',
    hint: 'जुम गर्न चिमोट्नुहोस्, स्क्रोल गर्नुहोस् वा + र − थिच्नुहोस्; वरिपरि हेर्न तान्नुहोस्। पछ्याउँदा तपाईंको जुम रहन्छ।',
    start: 'सुरु', end: 'नक्सांकित मार्गको अन्त्य', leaves: 'नेपालको सिमाना', outside: 'नेपाल बाहिर', province: (n: string) => `${n} प्रदेश`,
    now: 'अहिले', near: 'नजिक', river: (n: string) => `नाम भएको खोला बिन्दु ${n}`, route: 'जिल्लागत मार्ग', epicentre: 'केन्द्रबिन्दु',
    loadingNames: 'ठाउँ र नदीका नाम लोड हुँदैछन्…',
  },
} as const;

/** Plays a scenario on the 3D map. Owns its own sources and layers; the map and its terrain belong to SimulatorMap. */
export function Player({ map, play, threeD, onThreeD, shell, expanded, onExpanded }: {
  map: Map; play: Play; threeD: boolean; onThreeD: (on: boolean) => void; shell: RefObject<HTMLElement | null>; expanded: boolean; onExpanded: (on: boolean) => void;
}) {
  const [lang] = useLanguage();
  const c = COPY[lang];
  const flood = play.kind === 'flood' ? play : null, quake = play.kind === 'quake' ? play : null;
  const measured = useMemo(() => flood ? measure(flood.line) : null, [flood]);
  const { route, gazetteer: floodNames } = useRoute(flood?.id ?? null, flood?.line ?? null, flood?.pathKm ?? null);
  const quakeNames = useGazetteer(!!quake);
  const names = floodNames ?? quakeNames;
  const provinceName = (en: string | null, code: string | null) => en ? c.province(lang === 'ne' && code && PROVINCE_NE[code] ? PROVINCE_NE[code] : en) : c.outside;
  const labels = useMemo(() => buildLabels({ route, names, flood, measured, quake, lang, c, provinceName }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [route, names, flood, measured, quake, lang]);
  useMapLabels(map, labels);
  useLabelCollisions(map, shell);
  const total = flood ? floodPlaybackSeconds(flood.celerity, flood.duration_s, flood.pathKm) : (quake!.reachKm / S_KM_S);
  const [t, setT] = useState(() => reducedMotion() ? total : 0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(SPEEDS[1]);
  const [follow, setFollow] = useState(true);
  // Follow steers only where the camera is and which way it faces. Zoom and tilt ease to a default once when
  // following starts (`zoomTo`, `pitchTo`), then belong to the viewer: pinch, scroll or the buttons are never overridden.
  const clock = useRef({ t, speed: SPEEDS[1] as number, follow: true, heading: 0, zoomTo: null as number | null, pitchTo: null as number | null });
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
        markLabels(shell.current, 'km', mid.head);
        if (camera && clock.current.follow && !done) {
          const target = headingAt(measured, mid.head * scale);
          const delta = ((target - clock.current.heading + 540) % 360) - 180;
          clock.current.heading = (clock.current.heading + delta * 0.06 + 360) % 360;
          map.jumpTo({ center: pointAt(measured, mid.head * scale), bearing: clock.current.heading, ...settle(map, clock.current) });
        }
      } else if (quake) {
        const s = Math.min(quake.reachKm, time * S_KM_S), p = Math.min(quake.reachKm * 1.6, time * P_KM_S);
        set('play-s', line(s > 0.5 ? circle(quake.epicentre, s) : []));
        set('play-p', line(p > 0.5 ? circle(quake.epicentre, p) : []));
        set('play-head', point(quake.epicentre));
        markLabels(shell.current, 'dist', s, 40);
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
        if (camera && clock.current.follow) map.jumpTo({ bearing: (map.getBearing() + 0.18) % 360, ...settle(map, clock.current) });
      }
    };
  }, [map, flood, quake, measured, shell]);

  /** The whole scenario in view: the full river path, or the strongest shaking around the epicentre. */
  const overview = useMemo(() => (duration = reducedMotion() ? 0 : 900) => {
    const ring = flood ? flood.line : circle(quake!.epicentre, Math.min(220, quake!.reachKm * 0.55), 24);
    const lons = ring.map(p => p[0]), lats = ring.map(p => p[1]);
    map.fitBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]],
      { padding: 40, maxZoom: 10, pitch: threeD ? 55 : 0, bearing: flood && measured ? headingAt(measured, 0, 20) : map.getBearing(), duration });
  }, [map, flood, quake, measured, threeD]);
  /** Starts following the front again, easing back to the default zoom and tilt for this screen. */
  const startFollow = () => {
    const narrow = map.getContainer().clientWidth < 640;
    clock.current.zoomTo = flood ? (narrow ? 9.6 : 10.3) : null;
    clock.current.pitchTo = threeD ? (flood ? (narrow ? 52 : 64) : 55) : 0;
    setFollow(true);
    if (!playing) draw(clock.current.t, true);
  };

  // Frames the scene when it first appears.
  useEffect(() => {
    overview(reducedMotion() ? 0 : 1200);
    if (!reducedMotion()) { clock.current.zoomTo = flood ? (map.getContainer().clientWidth < 640 ? 9.6 : 10.3) : null; clock.current.pitchTo = threeD ? 60 : 0; }
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
    return () => cancelAnimationFrame(frame);
  }, [playing, draw, total, map]);

  // The viewer's own gestures always win. Zooming (pinch, scroll, +/−) keeps following at the new zoom; dragging
  // with one finger or the mouse, or rotating, hands the camera over until Follow is pressed again.
  useEffect(() => {
    type Gesture = { originalEvent?: Event };
    const zoomed = (e: Gesture) => { if (e.originalEvent) clock.current.zoomTo = null; };
    const tilted = (e: Gesture) => { if (e.originalEvent) clock.current.pitchTo = null; };
    const took = (e: Gesture) => {
      const touches = (e.originalEvent as TouchEvent | undefined)?.touches;
      if (e.originalEvent && !(touches && touches.length > 1)) setFollow(false);
    };
    map.on('zoomstart', zoomed); map.on('pitchstart', tilted); map.on('dragstart', took); map.on('rotatestart', took);
    return () => { map.off('zoomstart', zoomed); map.off('pitchstart', tilted); map.off('dragstart', took); map.off('rotatestart', took); };
  }, [map]);

  // When a playback finishes, the camera pulls back to show the whole scenario.
  const ended = t >= total;
  useEffect(() => { if (ended && clock.current.follow && !reducedMotion()) { setFollow(false); overview(); } }, [ended, overview]);

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

  const here = flood && route ? whereAt(route, midHead) : null;
  const sequence = route ? districtSequence(route).filter(d => d.inNepal) : [];
  const epicentreUnit = quake && names ? unitAt(names, quake.epicentre) : null;
  return <div className="sim-player" role="group" aria-label={c.label} data-player-state={playing ? 'playing' : t >= total ? 'ended' : 'paused'}>
    <p className="sim-player-badge"><strong>{c.modelled}</strong> <span>{flood ? c.floodNote : c.quakeNote}</span></p>
    <p className="sim-player-status" data-player-time={Math.round(t)}>{status}</p>
    {flood && (here?.stretch ? <p className="sim-player-where" data-where-district={here.stretch.unit.district ?? ''}>
      <strong>{c.now}:</strong> {[here.river ? c.river(here.river.name) : null, here.place ? `${c.near} ${here.place.name}` : null,
        here.stretch.unit.inNepal ? [here.stretch.unit.local, here.stretch.unit.district, provinceName(here.stretch.unit.province, here.stretch.unit.provinceCode)].filter(Boolean).join(', ') : c.outside].filter(Boolean).join(' · ')}
    </p> : <p className="sim-player-where">{c.loadingNames}</p>)}
    {quake && epicentreUnit && <p className="sim-player-where"><strong>{c.epicentre}:</strong> {epicentreUnit}</p>}
    {sequence.length > 1 && <ol className="sim-player-route" aria-label={c.route}>{sequence.map((d, i) => <li key={`${d.district}-${i}`} data-state={midHead >= d.toKm ? 'passed' : midHead >= d.fromKm ? 'current' : 'ahead'}>{d.district ?? '—'}</li>)}</ol>}
    <p className="sr-only" role="status" aria-live="polite">{announce}</p>
    <div className="sim-player-bar">
    <div className="sim-player-controls">
      <button type="button" className="sim-player-play" onClick={() => { if (t >= total) { clock.current.t = 0; setT(0); draw(0, true); } if (!playing) startFollow(); setPlaying(p => !p); }}>
        <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span> {playing ? c.pause : t >= total ? c.replay : c.play}
      </button>
      <label className="sim-player-scrub"><span className="sr-only">{flood ? c.time : c.quakeTime}</span>
        <input type="range" min={0} max={Math.round(total)} step={1} value={Math.round(t)} aria-valuetext={status} onChange={event => scrub(Number(event.target.value))} />
      </label>
      <label className="sim-player-speed"><span className="sr-only">{c.speed}</span>
        <select value={speed} onChange={event => setSpeed(Number(event.target.value) as (typeof SPEEDS)[number])}>{SPEEDS.map(s => <option key={s} value={s}>{c.seconds(s)}</option>)}</select>
      </label>
    </div>
    <div className="sim-player-view" role="group" aria-label={c.view}>
      <button type="button" aria-pressed={follow} onClick={() => follow ? setFollow(false) : startFollow()}><span aria-hidden="true">◎</span> {c.follow}</button>
      <button type="button" onClick={() => { setFollow(false); overview(); }}><span aria-hidden="true">⤢</span> {c.overview}</button>
      <button type="button" aria-pressed={threeD} onClick={() => onThreeD(!threeD)} title={c.relief}>{threeD ? c.threeD : c.flat}</button>
      <button type="button" aria-pressed={expanded} onClick={() => onExpanded(!expanded)}><span aria-hidden="true">{expanded ? '✕' : '⛶'}</span> {expanded ? c.exitFull : c.full}</button>
    </div>
    </div>
    <p className="sim-player-hint">{c.hint}</p>
  </div>;
}

type Copy = (typeof COPY)[keyof typeof COPY];
/** The administrative units at a point, joined for display ("local level, district, province"). */
function unitAt(names: Gazetteer, at: LonLat) {
  const district = names.districts.find(a => contains(a, at)), local = district ? names.locals.find(a => contains(a, at)) : undefined;
  const province = names.provinces.find(a => contains(a, at));
  return [local?.name, district?.name, province?.name].filter(Boolean).join(', ') || null;
}

/** Map labels for a playback: provinces always; for a flood its start, end, districts, candidate river names and
 * nearby places; for an earthquake the epicentre and every district, lit as the front reaches it. */
function buildLabels({ route, names, flood, measured, quake, lang, c, provinceName }: {
  route: Route | null; names: Gazetteer | null; flood: FloodPlay | null; measured: ReturnType<typeof measure> | null; quake: QuakePlay | null;
  lang: 'en' | 'ne'; c: Copy; provinceName: (en: string | null, code: string | null) => string;
}): MapLabel[] {
  if (!names) return [];
  const labels: MapLabel[] = names.provinceLabels.map(p => ({ id: `province-${p.pcode}`, text: provinceName(p.name, p.pcode), at: p.at, className: 'sim-label-province', anchor: 'center' }));
  if (flood && route && measured) {
    const scale = measured.length / flood.pathKm, at = (km: number) => pointAt(measured, km * scale);
    const start = route.start, end = route.end;
    labels.push({ id: 'start', text: `${c.start} · ${[start.local, start.district].filter(Boolean).join(', ') || c.outside}`, at: at(0), className: 'sim-label-start', anchor: 'bottom', km: 0 });
    if (route.leavesNepalKm !== null) labels.push({ id: 'leaves', text: `${c.leaves} · ${formatNumber(route.leavesNepalKm, lang, 0)} km`, at: at(route.leavesNepalKm), className: 'sim-label-end', anchor: 'bottom', km: route.leavesNepalKm });
    else labels.push({ id: 'end', text: `${c.end} · ${[end.district, provinceName(end.province, end.provinceCode)].filter(Boolean).join(', ')}`, at: at(flood.pathKm), className: 'sim-label-end', anchor: 'bottom', km: flood.pathKm });
    for (const d of districtSequence(route)) if (d.inNepal && d.district && d.toKm - d.fromKm >= 2) labels.push({ id: `district-${d.district}-${d.fromKm}`, text: d.district, at: at((d.fromKm + d.toKm) / 2), className: 'sim-label-district', km: d.fromKm });
    for (const r of route.rivers) labels.push({ id: `river-${r.name}-${r.fromKm}`, text: r.name, at: r.at, className: 'sim-label-river', km: r.fromKm, title: 'GeoNames named stream point near the path; orientation only, not the name of the river the path follows' });
    const villages = route.places.filter(p => p.kind === 'village').sort((a, b) => a.offKm - b.offKm).slice(0, 18);
    for (const p of route.places) if (p.kind !== 'village' || villages.includes(p)) labels.push({ id: `place-${p.name}-${p.km}`, text: p.name, at: p.coordinates, className: `sim-label-place sim-label-${p.kind}`, km: p.km, title: 'OpenStreetMap settlement near the path line' });
  }
  if (quake) {
    labels.push({ id: 'epicentre', text: c.epicentre, at: quake.epicentre, className: 'sim-label-start', anchor: 'bottom', dist: 0 });
    // Districts near the epicentre, where the modelled shaking is strongest, each named as the front reaches it.
    for (const d of names.districtLabels) {
      const dist = haversineKm(quake.epicentre, d.at);
      if (dist <= 130) labels.push({ id: `district-${d.name}`, text: d.name, at: d.at, className: 'sim-label-district sim-label-quake', dist });
    }
  }
  return labels;
}

/** One frame of easing towards the follow framing; a target is dropped once reached or when the viewer takes over. */
function settle(map: Map, camera: { zoomTo: number | null; pitchTo: number | null }) {
  const out: { zoom?: number; pitch?: number } = {};
  if (camera.zoomTo !== null) {
    const z = map.getZoom(), next = z + (camera.zoomTo - z) * 0.1;
    out.zoom = Math.abs(camera.zoomTo - next) < 0.01 ? camera.zoomTo : next;
    if (out.zoom === camera.zoomTo) camera.zoomTo = null;
  }
  if (camera.pitchTo !== null) {
    const p = map.getPitch(), next = p + (camera.pitchTo - p) * 0.1;
    out.pitch = Math.abs(camera.pitchTo - next) < 0.2 ? camera.pitchTo : next;
    if (out.pitch === camera.pitchTo) camera.pitchTo = null;
  }
  return out;
}
