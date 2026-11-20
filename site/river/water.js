import { BufferGeometry, BufferAttribute, InterleavedBuffer, InterleavedBufferAttribute, Camera,
  Matrix4, Mesh, Scene, ShaderMaterial, Vector3, WebGLRenderer, DoubleSide, DynamicDrawUsage } from '../vendor/three/three.module.min.js';

const vertexShader = `
  attribute vec2 bank;
  attribute float ground;
  uniform vec3 pulse;
  varying vec2 water;
  void main() {
    float crest = smoothstep(0., 1., 1. - (pulse.x - bank.x) / pulse.z);
    // position.z is Mercator units per metre. Lift is illustrative.
    float altitude = (ground + 18. + 690. * crest) * position.z;
    gl_Position = projectionMatrix * vec4(position.xy, altitude, 1.);
    water = bank;
  }`;
const fragmentShader = `
  uniform vec3 pulse;
  varying vec2 water;
  void main() {
    if (water.x < pulse.y || water.x > pulse.x) discard;
    float phase = (pulse.x - water.x) / pulse.z;
    float crest = 1. - smoothstep(0., 1., phase);
    float shore = abs(water.y);
    float ripple = .5 + .5 * cos(23. * phase + water.y * water.y * 1.9);
    vec3 color = mix(vec3(.025,.30,.50), vec3(.16,.78,.84), crest);
    color += vec3(.10,.14,.13) * ripple * crest;
    color = mix(color, vec3(.72,.94,.97), .45 * smoothstep(.65,1.,shore));
    float feather = max(.07, fwidth(water.y));
    gl_FragColor = vec4(color, .86 * (1. - smoothstep(1.-feather, 1., shore)));
  }`;

function sectionAt(stations, km) {
  let lo = 0, hi = stations.length / 3 - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (stations[mid * 3 + 2] < km) lo = mid + 1; else hi = mid;
  }
  return lo;
}

export function waterScene(map, gl, { vertices, stations }, origin) {
  const count = stations.length / 3;
  const geometry = new BufferGeometry();
  const surface = new InterleavedBuffer(vertices, 5);
  geometry.setAttribute('position', new InterleavedBufferAttribute(surface, 3, 0));
  geometry.setAttribute('bank', new InterleavedBufferAttribute(surface, 2, 3));
  const ground = new BufferAttribute(new Float32Array(count * 2), 1).setUsage(DynamicDrawUsage);
  geometry.setAttribute('ground', ground);
  const Index = count * 2 > 65535 ? Uint32Array : Uint16Array;
  const indices = new Index((count - 1) * 6);
  for (let i = 0; i < count - 1; i++) {
    const left = 2 * i;
    indices.set([left, left+1, left+2, left+2, left+1, left+3], i * 6);
  }
  geometry.setIndex(new BufferAttribute(indices, 1));
  const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms: { pulse: { value: new Vector3() } },
    transparent: true, side: DoubleSide, depthWrite: false });
  material.forceSinglePass = true;
  const scene = new Scene(), camera = new Camera(), mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);
  const offset = new Matrix4().makeTranslation(origin.x, origin.y, 0);
  const renderer = new WebGLRenderer({ canvas: map.getCanvas(), context: gl });
  renderer.autoClear = false;
  const sampled = new Uint32Array(count);
  let revision = 1;
  const invalidate = e => { if (!e.sourceId || e.sourceId === 'dem') revision++; };
  map.on('sourcedata', invalidate); map.on('terrain', invalidate);
  return {
    draw(args, pulse) {
      if (!pulse || pulse.front <= pulse.tail || pulse.tail >= stations.at(-1)) return;
      const start = Math.max(0, sectionAt(stations, pulse.tail) - 1);
      const end = sectionAt(stations, pulse.front);
      let first = count, last = -1, complete = true;
      for (let i = start; i <= end; i++) {
        if (sampled[i] === revision) continue;
        const height = map.queryTerrainElevation([stations[3*i], stations[3*i+1]]);
        if (!Number.isFinite(height)) { complete = false; continue; }
        ground.setX(2*i, height); ground.setX(2*i+1, height);
        sampled[i] = revision;
        first = Math.min(first, i); last = i;
      }
      if (last >= first) {
        ground.addUpdateRange(first * 2, (last - first + 1) * 2);
        ground.needsUpdate = true;
      }
      if (!complete) return;
      geometry.setDrawRange(6 * start, 6 * (end - start));
      material.uniforms.pulse.value.set(pulse.front, pulse.tail, pulse.span);
      camera.projectionMatrix.fromArray(args.defaultProjectionData.mainMatrix).multiply(offset);
      const framebuffer = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);
      renderer.resetState();
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, framebuffer);
      renderer.render(scene, camera);
    },
    remove() {
      map.off('sourcedata', invalidate); map.off('terrain', invalidate);
      geometry.dispose(); material.dispose(); renderer.dispose();
    },
  };
}
