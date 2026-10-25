import type { Map } from 'maplibre-gl';
import type { DownstreamResult, RiverNetwork } from '../../../packages/contracts/downstream';

/** An ephemeral derived overlay, independent of source river visibility/selection. */
export function mountDownstreamTrace(map: Map, network: RiverNetwork, result: DownstreamResult) {
  const source = `downstream-trace@${result.method.split('/')[1]}`;
  const halo = `${source}-halo`, line = `${source}-line`, front = `${source}-front`;
  let removed = false;
  const onRemove = () => { removed = true; };
  map.on('remove', onRemove);
  map.addSource(source, { type: 'geojson', data: {
    type: 'FeatureCollection', features: result.reach_ids.map((id, order) => ({
      type: 'Feature' as const, geometry: network.reaches.get(id)!.geometry, properties: { order },
    })),
  } });
  const round = { 'line-cap': 'round', 'line-join': 'round' } as const;
  map.addLayer({ id: halo, source, type: 'line', layout: round, paint: { 'line-color': '#10212b', 'line-width': 8 } });
  map.addLayer({ id: line, source, type: 'line', layout: round, paint: { 'line-color': '#f9d66c', 'line-width': 4 } });
  // Display only: a soft glow on the last few reaches drawn, so the eye follows the trace as it advances downstream.
  map.addLayer({ id: front, source, type: 'line', layout: round, paint: { 'line-color': '#fff1b8', 'line-width': 12, 'line-blur': 6, 'line-opacity': 0.6 } }, line);
  return {
    show(count: number) {
      if (removed) return;
      for (const id of [halo, line]) map.setFilter(id, ['<', ['get', 'order'], count]);
      map.setFilter(front, ['all', ['<', ['get', 'order'], count], ['>=', ['get', 'order'], count - 6]]);
    },
    dispose() {
      if (!removed) {
        for (const id of [front, line, halo]) if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(source)) map.removeSource(source);
        map.off('remove', onRemove);
      }
    },
  };
}

export function fitTrace(map: Map, network: RiverNetwork, ids: string[]) {
  const bounds: [number, number, number, number] = [180, 90, -180, -90];
  for (const id of ids) {
    const geometry = network.reaches.get(id)!.geometry;
    const points = geometry.type === 'LineString' ? geometry.coordinates : geometry.type === 'MultiLineString' ? geometry.coordinates.flat() : [];
    for (const [x, y] of points) {
      bounds[0] = Math.min(bounds[0], x); bounds[1] = Math.min(bounds[1], y);
      bounds[2] = Math.max(bounds[2], x); bounds[3] = Math.max(bounds[3], y);
    }
  }
  if (bounds[0] <= bounds[2]) map.fitBounds(bounds, { padding: 65, maxZoom: 10, pitch: 0, bearing: 0, duration: 0 });
}
