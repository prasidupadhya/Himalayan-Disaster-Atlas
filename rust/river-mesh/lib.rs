// One instance per worker and per route. JS copies the completed arrays before
// the worker exits. Positions are local Mercator units to keep float precision.
use std::cell::RefCell;
use std::f64::consts::PI;

#[derive(Default)]
struct Mesh {
    input: Vec<f64>,
    stations: Vec<f64>, // longitude, latitude, published distance in km
    vertices: Vec<f32>, // local x/y, Mercator units per metre, distance, bank
}

thread_local! { static MESH: RefCell<Mesh> = RefCell::default(); }

#[no_mangle]
pub extern "C" fn input(count: usize) -> *mut f64 {
    if !(2..=250_000).contains(&count) {
        return std::ptr::null_mut();
    }
    MESH.with_borrow_mut(|m| {
        m.input.resize(2 * count, 0.0);
        m.input.as_mut_ptr()
    })
}

fn mercator(lon: f64, lat: f64) -> (f64, f64) {
    let phi = lat.to_radians();
    ((lon + 180.0) / 360.0, 0.5 - phi.tan().asinh() / (2.0 * PI))
}

fn build(mesh: &mut Mesh, total: f64) -> Option<usize> {
    if !(total.is_finite() && total > 0.0) || mesh.input.is_empty() {
        return None;
    }
    let mut length = 0.0;
    mesh.stations.clear();
    mesh.vertices.clear();
    for pair in mesh.input.windows(4).step_by(2) {
        let [x, y, u, v] = [pair[0], pair[1], pair[2], pair[3]];
        if !(x.abs() <= 180.0 && u.abs() <= 180.0 && y.abs() < 85.1 && v.abs() < 85.1) {
            return None;
        }
        let km = ((u - x) * ((y + v) / 2.0).to_radians().cos() * 111.32).hypot((v - y) * 110.57);
        let steps = (km / 0.35).ceil() as usize;
        if mesh.stations.len() / 3 + steps >= 250_000 {
            return None;
        }
        for j in 0..steps {
            let t = j as f64 / steps as f64;
            mesh.stations
                .extend_from_slice(&[x + (u - x) * t, y + (v - y) * t, length + km * t]);
        }
        length += km;
    }
    if length == 0.0 {
        return None;
    }
    mesh.stations
        .extend_from_slice(&mesh.input[mesh.input.len() - 2..]);
    mesh.stations.push(length);
    let n = mesh.stations.len() / 3;
    let projected: Vec<_> = mesh
        .stations
        .chunks_exact(3)
        .map(|s| mercator(s[0], s[1]))
        .collect();
    let origin = projected[0];
    for (i, station) in mesh.stations.chunks_exact_mut(3).enumerate() {
        station[2] *= total / length;
        let before = projected[i.saturating_sub(1)];
        let after = projected[(i + 1).min(n - 1)];
        let (dx, dy) = (after.0 - before.0, after.1 - before.1);
        let m = 1.0 / (2.0 * PI * 6_371_008.8 * station[1].to_radians().cos());
        let norm = dx.hypot(dy);
        for side in [-1.0, 1.0] {
            // Width is illustrative. Both adjacent faces share this join.
            let w = if norm > 0.0 {
                side * 115.0 * m / norm
            } else {
                0.0
            };
            let x = projected[i].0 - origin.0 - dy * w;
            let y = projected[i].1 - origin.1 + dx * w;
            mesh.vertices.extend_from_slice(&[
                x as f32,
                y as f32,
                m as f32,
                station[2] as f32,
                side as f32,
            ]);
        }
    }
    Some(n)
}

#[no_mangle]
pub extern "C" fn prepare(total: f64) -> usize {
    MESH.with_borrow_mut(|m| build(m, total).unwrap_or(0))
}
#[no_mangle]
pub extern "C" fn stations() -> *const f64 {
    MESH.with_borrow(|m| m.stations.as_ptr())
}
#[no_mangle]
pub extern "C" fn vertices() -> *const f32 {
    MESH.with_borrow(|m| m.vertices.as_ptr())
}
