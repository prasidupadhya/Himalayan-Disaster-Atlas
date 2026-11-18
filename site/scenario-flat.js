// A north-up 2D overview for browsers without WebGL. Draw the same path or
// shaking canvas in Mercator coordinates so the bands align with the borders.
import { load } from './app.js';

export async function flatOverview(container, label) {
  const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
  container.replaceChildren(canvas);
  canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', label);
  canvas.className = 'scenario-flat';
  const country = await load('/data/nepal-admin-country/2.0.1/features.geojson.gz');
  const project = ([lon, lat]) => [lon, -180 / Math.PI * Math.asinh(Math.tan(lat * Math.PI / 180))];
  const rings = country.features.flatMap(({ geometry: g }) => g.type === 'MultiPolygon' ? g.coordinates.flat() : g.coordinates);
  const border = new Path2D();
  function trace(path, coords) {
    coords.forEach((p, i) => path[i ? 'lineTo' : 'moveTo'](...project(p)));
  }
  for (const ring of rings) { trace(border, ring); border.closePath(); }
  let bounds, path, head, grid, corners, epicentre, rupture;
  function draw() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!bounds || !w || !h) return;
    const dpr = devicePixelRatio;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    }
    ctx.resetTransform(); ctx.clearRect(0, 0, canvas.width, canvas.height);
    const [x, y, right, bottom] = bounds, z = Math.min((w - 48) / (right - x || 1), (h - 48) / (bottom - y || 1));
    ctx.setTransform(dpr * z, 0, 0, dpr * z, dpr * (w / 2 - z * (x + right) / 2), dpr * (h / 2 - z * (y + bottom) / 2));
    ctx.fillStyle = '#e5e6dc'; ctx.fill(border, 'evenodd');
    if (grid) {
      const [nw, se] = corners;
      ctx.globalAlpha = 0.6; ctx.imageSmoothingEnabled = false;
      ctx.drawImage(grid, nw[0], nw[1], se[0] - nw[0], se[1] - nw[1]); ctx.globalAlpha = 1;
    }
    ctx.lineWidth = 1 / z; ctx.strokeStyle = '#57636a'; ctx.stroke(border);
    if (path || rupture) { ctx.strokeStyle = path ? '#1d5fa8' : '#18232a'; ctx.lineWidth = 3 / z; ctx.stroke(path || rupture); }
    if (head || epicentre) {
      ctx.beginPath(); ctx.arc(...project(head || epicentre), 5 / z, 0, 2 * Math.PI);
      ctx.fillStyle = head ? '#ffd400' : '#d93a2b'; ctx.fill(); ctx.lineWidth = 1 / z; ctx.stroke();
    }
  }
  function fit(coords) {
    const points = coords.map(project), xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    bounds = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    draw();
  }
  new ResizeObserver(draw).observe(container);
  return {
    clear() { bounds = path = grid = head = epicentre = rupture = null; ctx.resetTransform(); ctx.clearRect(0, 0, canvas.width, canvas.height); },
    flood(line) { path = new Path2D(); trace(path, line); fit(line); },
    progress(point) { head = point; draw(); },
    quake(image, extent, centre, fault, view) {
      grid = image; corners = [extent[0], extent[2]].map(project); epicentre = centre;
      if (fault) { rupture = new Path2D(); trace(rupture, fault); }
      fit(view);
    },
    draw,
  };
}
