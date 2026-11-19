// This worker owns the WebAssembly instance and transfers the finished route
// to the map. The immutable release length sets the front's distance scale.
self.onmessage = async ({ data: { line, total } }) => {
  try {
    const response = await fetch(new URL('./river-mesh.wasm', import.meta.url));
    if (!response.ok) throw new Error();
    const { instance } = await WebAssembly.instantiate(await response.arrayBuffer());
    const mesh = instance.exports;
    const address = mesh.input(line.length);
    if (!address) throw new RangeError();
    const input = new Float64Array(mesh.memory.buffer, address, line.length * 2);
    line.forEach(([lon, lat], i) => { input[2 * i] = lon; input[2 * i + 1] = lat; });
    const count = mesh.prepare(total);
    if (!count) throw new RangeError();
    const stations = new Float64Array(mesh.memory.buffer, mesh.stations(), count * 3).slice();
    const vertices = new Float32Array(mesh.memory.buffer, mesh.vertices(), count * 10).slice();
    self.postMessage({ stations, vertices }, [stations.buffer, vertices.buffer]);
  } catch {
    self.postMessage(null);
  }
};
