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
