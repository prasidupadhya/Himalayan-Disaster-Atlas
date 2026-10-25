import { useEffect } from 'react';
import type { Map, Marker } from 'maplibre-gl';
import type { LonLat } from './scene-3d';

/** A text label pinned to the 3D map. `km` is model km along a flood path; `dist` is km from an epicentre.
 * The playback marks labels `reached` once the front passes them and `near` while it is close. */
export interface MapLabel { id: string; text: string; at: LonLat; className: string; km?: number; dist?: number; title?: string; anchor?: 'left' | 'center' | 'bottom' }

/** DOM markers follow the terrain and need no font files, which the static site does not ship for map text. */
export function useMapLabels(map: Map, labels: MapLabel[]) {
  useEffect(() => {
    let markers: Marker[] = [], live = true;
    void import('maplibre-gl').then(({ Marker }) => {
      if (!live) return;
      markers = labels.map(label => {
        const el = document.createElement('span');
        el.className = `sim-label ${label.className}`;
        el.textContent = label.text;
        if (label.title) el.title = label.title;
        if (label.km !== undefined) el.dataset.km = String(label.km);
        if (label.dist !== undefined) el.dataset.dist = String(label.dist);
        el.setAttribute('aria-hidden', 'true');
        return new Marker({ element: el, anchor: label.anchor ?? 'left', offset: label.anchor === 'bottom' ? [0, -4] : [6, 0], opacityWhenCovered: '0.15' }).setLngLat(label.at).addTo(map);
      });
    });
    return () => { live = false; markers.forEach(m => m.remove()); };
  }, [map, labels]);
}

/** Marks labels against the current front: `reached` once passed, `near` within `nearKm`. */
export function markLabels(root: ParentNode | null | undefined, attribute: 'km' | 'dist', value: number, nearKm = 25) {
  root?.querySelectorAll<HTMLElement>(`[data-${attribute}]`).forEach(el => {
    const at = Number(el.dataset[attribute]);
    el.classList.toggle('reached', at <= value + 1e-6);
    el.classList.toggle('near', Math.abs(at - value) <= nearKm);
  });
}

// Which label survives when two overlap: start/end pins, then provinces, districts and distance markers, towns,
// stream points, villages.
const PRIORITY: Array<[string, number]> = [['sim-label-start', 0], ['sim-label-end', 0], ['sim-label-province', 1], ['sim-label-district', 2],
  ['sim-checkpoint-label', 2], ['sim-label-city', 3], ['sim-label-town', 3], ['sim-label-river', 4], ['sim-label-village', 5]];
const rank = (el: Element) => PRIORITY.find(([cls]) => el.classList.contains(cls))?.[1] ?? 6;

/** Hides labels that would overlap a more important one, re-checking as the camera moves (at most ~7 times a second). */
export function useLabelCollisions(map: Map, root: { current: HTMLElement | null }) {
  useEffect(() => {
    let queued = 0, last = 0;
    const solve = () => {
      queued = 0; last = performance.now();
      const labels = [...(root.current?.querySelectorAll<HTMLElement>('.sim-label, .sim-checkpoint-label') ?? [])].sort((a, b) => rank(a) - rank(b));
      // Read every box first, then write only the flags that change: one layout pass instead of one per label. The
      // flag sets `visibility`, which never changes a box, so reading before clearing it gives the same answer.
      const boxes = labels.map(el => { const style = getComputedStyle(el); return style.opacity === '0' || style.display === 'none' ? null : el.getBoundingClientRect(); });
      const kept: DOMRect[] = [];
      labels.forEach((el, i) => {
        const box = boxes[i];
        const hit = !!box && box.width > 0 && kept.some(k => box.left < k.right + 4 && box.right > k.left - 4 && box.top < k.bottom + 2 && box.bottom > k.top - 2);
        if (box && box.width > 0 && !hit) kept.push(box);
        if (el.classList.contains('is-colliding') !== hit) el.classList.toggle('is-colliding', hit);
      });
    };
    const schedule = () => { if (queued) return; queued = window.setTimeout(solve, Math.max(0, 140 - (performance.now() - last))); };
    map.on('move', schedule); map.on('moveend', schedule); map.on('idle', schedule);
    // Re-check when labels are added or their state changes, but not for the collision flag this hook sets itself.
    const withoutFlag = (value: string | null) => (value ?? '').split(' ').filter(c => c && c !== 'is-colliding').sort().join(' ');
    const observer = new MutationObserver(records => {
      if (records.some(r => r.type === 'childList' || withoutFlag(r.oldValue) !== withoutFlag((r.target as Element).getAttribute('class')))) schedule();
    });
    if (root.current) observer.observe(root.current, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true, childList: true });
    schedule();
    return () => { map.off('move', schedule); map.off('moveend', schedule); map.off('idle', schedule); observer.disconnect(); window.clearTimeout(queued); };
  }, [map, root]);
}
