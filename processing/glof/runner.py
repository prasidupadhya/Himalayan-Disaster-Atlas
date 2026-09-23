"""Run reviewed, premeshed instantaneous-breach hypotheses with ANUGA offline.

The input bed is post-breach and initial stage is pre-release. No breach growth,
volume inference, debris transport, vulnerability or damage model is implemented.
"""
import argparse
import hashlib
import json
from pathlib import Path

from .contracts import validate_request


def run(request_path, output):
    import anuga
    import numpy as np
    from pyproj import CRS

    if anuga.__version__ != '4.0.1':
        raise ValueError('Install the pinned ANUGA environment')
    request_path, output = Path(request_path), Path(output)
    request = json.loads(request_path.read_text())
    mesh_path = validate_request(request, request_path.parent)
    if not request['is_fixture']:
        from .inventory import inventory
        if request['lake_id'] not in {lake['lake_id'] for lake in inventory()['lakes']}:
            raise ValueError('Lake is not in the pinned source inventory')
    crs = CRS.from_user_input(request.get('horizontal_crs'))
    if not crs.is_projected or any(axis.unit_name != 'metre' for axis in crs.axis_info):
        raise ValueError('Physical mesh requires a projected CRS in metres')
    with np.load(mesh_path, allow_pickle=False) as mesh:
        points, triangles = mesh['points'], mesh['triangles']
        bed, stage, roughness = mesh['bed_m'], mesh['initial_stage_m'], mesh['manning_n']
    count = len(triangles)
    if points.ndim != 2 or points.shape[1] != 2 or triangles.shape != (count, 3) or not 1 <= count <= 100000:
        raise ValueError('Invalid or oversized triangular mesh')
    if not np.issubdtype(triangles.dtype, np.integer) or triangles.min() < 0 or triangles.max() >= len(points):
        raise ValueError('Invalid triangle indices')
    if any(a.shape != (count,) for a in (bed, stage, roughness)) or not all(np.isfinite(a).all() for a in (points, bed, stage, roughness)):
        raise ValueError('Finite centroid fields are required; fill no gaps silently')
    if np.any(stage < bed) or np.any(roughness < 0) or np.any(roughness > .3):
        raise ValueError('Stage below bed or unsupported Manning coefficient')
    if not np.any(stage > bed):
        raise ValueError('Initial stored water is required')
    domain = anuga.Domain(points, triangles)
    domain.set_flow_algorithm('DE0')
    domain.set_store(False)
    domain.set_quantity('elevation', bed, location='centroids')
    domain.set_quantity('stage', stage, location='centroids')
    domain.set_quantity('friction', roughness, location='centroids')
    boundary = anuga.Reflective_boundary(domain) if request['boundary'] == 'reflective' else anuga.Transmissive_boundary(domain)
    domain.set_boundary({tag: boundary for tag in domain.get_boundary_tags()})
    initial_volume = float(domain.get_water_volume())
    maximum_depth = np.zeros(count)
    maximum_speed = np.zeros(count)
    first_wet = np.full(count, np.nan)
    for time in domain.evolve(yieldstep=request['output_interval_s'], finaltime=request['duration_s']):
        depth = np.maximum(domain.quantities['stage'].centroid_values - domain.quantities['elevation'].centroid_values, 0)
        wet = depth >= request['wet_threshold_m']
        momentum = np.hypot(domain.quantities['xmomentum'].centroid_values, domain.quantities['ymomentum'].centroid_values)
        speed = np.divide(momentum, depth, out=np.zeros(count), where=wet)
        if not np.isfinite(depth).all() or not np.isfinite(speed).all():
            raise ValueError('Solver produced nonfinite output')
        maximum_depth = np.maximum(maximum_depth, depth)
        maximum_speed = np.maximum(maximum_speed, speed)
        first_wet[wet & np.isnan(first_wet)] = time
    final_volume = float(domain.get_water_volume())
    net_boundary_volume = float(domain.get_boundary_flux_integral())
    residual = final_volume - initial_volume - net_boundary_volume
    if abs(residual) > max(1e-6, initial_volume * .01):
        raise ValueError('Mass balance residual exceeds 1% of initial water volume')
    if output.exists():
        raise ValueError('Output already exists; choose a new immutable run directory')
    output.mkdir(parents=True)
    np.savez_compressed(output / 'fields.npz', points=points, triangles=triangles, max_depth_m=maximum_depth,
                        max_speed_ms=maximum_speed, first_wet_s=first_wet)
    result = {'model': request['model'], 'lake_id': request['lake_id'], 'is_fixture': request['is_fixture'], 'evidence_type': 'MODELLED',
              'publication_status': 'RESEARCH_ONLY', 'real_event_validated': False,
              'damage': None, 'exposure': None, 'horizontal_crs': crs.to_string(),
              'vertical_datum': request['vertical_datum'], 'request': request,
              'request_sha256': hashlib.sha256(request_path.read_bytes()).hexdigest(),
              'fields_sha256': hashlib.sha256((output / 'fields.npz').read_bytes()).hexdigest(),
              'initial_volume_m3': initial_volume, 'final_volume_m3': final_volume,
              'net_boundary_volume_m3': net_boundary_volume, 'mass_residual_m3': residual,
              'limitations': ['Instantaneous post-breach bed assumption; no breach-growth physics or sediment/debris transport.',
                             'Maxima and first-wet times sampled at output interval, not solver-step maxima.',
                             'Requires independent mesh convergence, terrain/bathymetry review, calibration and sensitivity analysis.',
                             'Inundation is modelled. No destruction or affected-asset claim is supported.']}
    (output / 'result.json').write_text(json.dumps(result, indent=2) + '\n')
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('request', type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    run(args.request, args.output)
