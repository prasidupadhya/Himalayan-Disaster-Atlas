"""Input gates for an independently reviewed physical model, not a river buffer."""
import hashlib
import math
from pathlib import Path

REQUIRED_EVIDENCE = ('terrain', 'bathymetry', 'lake_stage', 'breach', 'roughness', 'boundary_conditions')


def validate_request(request, directory):
    if request.get('schema_version') != '1.0.0' or request.get('model') != 'anuga-swe-4.0.1':
        raise ValueError('Unsupported physical model/version')
    if request.get('scenario_type') != 'instantaneous-breach':
        raise ValueError('Only explicitly assumed instantaneous breaches are implemented')
    if not isinstance(request.get('is_fixture'), bool):
        raise ValueError('Explicit fixture status is required')
    if request['is_fixture']:
        if request.get('lake_id') is not None:
            raise ValueError('Synthetic verification must not impersonate a real lake')
    elif not str(request.get('lake_id', '')).startswith('GLO_'):
        raise ValueError('A source GLO lake identity is required')
    if request.get('evidence_type') != 'MODELLED' or request.get('real_event_validated') is not False:
        raise ValueError('This research adapter is modelled and not real-event validated')
    if request.get('vertical_unit') != 'm' or not request.get('vertical_datum'):
        raise ValueError('Metres and a shared vertical datum are required')
    if request.get('boundary') not in ('reflective', 'transmissive'):
        raise ValueError('An explicit exterior boundary condition is required')
    for field, lower, upper in [('duration_s', 1, 86400), ('output_interval_s', .1, 3600), ('wet_threshold_m', .001, 1)]:
        value = request.get(field)
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not lower <= value <= upper:
            raise ValueError(f'Invalid {field}')
    if request['output_interval_s'] > request['duration_s']:
        raise ValueError('Output interval exceeds duration')
    evidence = request.get('evidence', {})
    for name in REQUIRED_EVIDENCE:
        record = evidence.get(name, {})
        if not all(isinstance(record.get(k), str) and record[k].strip() for k in ('source', 'date', 'license', 'limitations')):
            raise ValueError(f'Missing provenance: {name}')
    record = request.get('mesh', {})
    base = Path(directory).resolve()
    path = (base / record.get('path', '')).resolve()
    if not path.is_relative_to(base) or path.suffix != '.npz' or not path.is_file():
        raise ValueError('Mesh must be a local NPZ inside the request directory')
    if path.stat().st_size > 128 * 1024 * 1024:
        raise ValueError('Mesh exceeds the offline pilot budget')
    if hashlib.sha256(path.read_bytes()).hexdigest() != record.get('sha256'):
        raise ValueError('Mesh checksum mismatch')
    return path
