"""Versioned network adapters; no terrain, hydraulic depth or inundation inference."""
import hashlib
import json
import math
import platform

from jsonschema import Draft7Validator, FormatChecker

from pipelines.atlas_pipeline.contracts import ROOT

REQUEST = Draft7Validator(json.loads((ROOT / 'schemas/scenario-request.schema.json').read_text()), format_checker=FormatChecker())
RESULT = Draft7Validator(json.loads((ROOT / 'schemas/scenario-result.schema.json').read_text()), format_checker=FormatChecker())
REGISTRY = json.loads((ROOT / 'packages/contracts/scenario-registry.json').read_text())
ASSUMPTIONS = REGISTRY['assumptions']
MODEL_ASSUMPTIONS = REGISTRY['models']
LIMITATIONS = [
    'Educational network approximation, not a calibrated Nepal hazard model, forecast or emergency decision tool.',
    'No water depth, hydraulic velocity, inundation footprint, blockage, breach physics, erosion, sediment or damage is calculated.',
    'The network is source-derived cartography; no DEM conditioning, slope, cross-section or roughness is used by these adapters.',
    'Relative signal delays are assumed scenarios, not predicted event arrival times. Celerity is not water velocity.',
    'Source reach geometry is a mapped pathway, not a simulated hazard footprint. Confidence intervals and real-event validation are unavailable.',
    'A release-boundary termination gives partial network coverage; the remaining pathway and consequences are UNKNOWN.',
    'Volume is per cross-section and must never be summed over reaches. Zero hypothetical release is not evidence of zero hazard.',
]


class ScenarioError(ValueError):
    def __init__(self, code, message):
        self.code = code
        super().__init__(message)


def encoded(value):
    return (json.dumps(value, sort_keys=True, separators=(',', ':'), allow_nan=False) + '\n').encode()


def fingerprint(request):
    return hashlib.sha256(encoded(request)).hexdigest()


def validate_definition(request):
    errors = list(REQUEST.iter_errors(request))
    if errors:
        raise ScenarioError('invalid_input', errors[0].message)
    model = request['model']['id']
    if request['simulation_level'] != (1 if model == 'network-path' else 2):
        raise ScenarioError('invalid_model', 'Model and simulation level do not match')
    if request['assumptions'] != MODEL_ASSUMPTIONS[model]:
        raise ScenarioError('invalid_assumptions', 'All versioned assumptions must be recorded in registry order')
    required = set() if model == 'network-path' else {'celerity', 'release_duration', 'release_volume'}
    if set(request['parameters']) != required or any(not math.isfinite(p['value']) for p in request['parameters'].values()):
        raise ScenarioError('invalid_parameter', 'Parameters are missing, unsupported or nonfinite')
    if len({(i['dataset_id'], i['dataset_version']) for i in request['inputs']}) != len(request['inputs']):
        raise ScenarioError('invalid_inputs', 'Duplicate input dataset references')
    return request


def network(datasets, request):
    inputs = []
    reaches = {}
    for dataset in datasets:
        metadata = dataset['metadata']
        inputs.append(reference(metadata))
        if metadata['is_fixture'] != request['is_fixture']:
            raise ScenarioError('fixture_mismatch', 'Synthetic and real inputs cannot be silently mixed')
        for feature in dataset['collection']['features']:
            p = feature['properties']
            id = p['source_id']
            if 'downstream_id' not in p or (p['downstream_id'] is not None and (not isinstance(p['downstream_id'], str) or not p['downstream_id'].isdigit())):
                raise ScenarioError('invalid_network', 'Missing or malformed downstream pointer')
            if id in reaches or p.get('entity_type') != 'river' or not isinstance(p.get('length_km'), (float, int)) or not math.isfinite(p['length_km']) or p['length_km'] < 0:
                raise ScenarioError('invalid_network', 'Duplicate river, invalid type or unavailable reach length')
            reaches[id] = p
    if sorted(inputs, key=lambda i: i['dataset_id']) != request['inputs']:
        raise ScenarioError('input_mismatch', 'Dataset versions, hashes or processing provenance do not match the definition')
    if not request['is_fixture'] and {i['dataset_id'] for i in inputs} != {'nepal-rivers-primary', 'nepal-rivers-headwaters'}:
        raise ScenarioError('missing_partition', 'Both verified Nepal river partitions are required')
    if len(reaches) > 25000:
        raise ScenarioError('resource_limit', 'Network exceeds 25,000 reaches')
    checked = set()
    for id, p in reaches.items():
        if p.get('downstream_in_release') != (p.get('downstream_id') in reaches):
            raise ScenarioError('invalid_network', 'Broken downstream release membership')
        visiting, next = set(), id
        while next in reaches and next not in checked:
            if next in visiting:
                raise ScenarioError('cycle', 'Cyclic drainage network; no scenario output produced')
            visiting.add(next)
            next = reaches[next]['downstream_id']
        checked.update(visiting)
    return reaches


def reference(m):
    return {'dataset_id': m['dataset_id'], 'dataset_version': m['dataset_version'], 'sha256': m['artifact']['sha256'], 'processing_version': m['processing_version'], 'source': m['source'], 'license': m['license'], 'observation_date': m['observation_date']}


def path_adapter(request, reaches):
    next = request['source_reach_id']
    if next not in reaches:
        raise ScenarioError('unknown_source', 'Selected source reach is unavailable; no snapping or substitution')
    rows, length = [], 0.0
    while next in reaches:
        if len(rows) >= 5000:
            raise ScenarioError('resource_limit', 'Scenario exceeds 5,000 reaches; no truncated numeric result produced')
        p = reaches[next]
        length += p['length_km']
        if not math.isfinite(length):
            raise ScenarioError('numerical_failure', 'Nonfinite pathway length')
        rows.append({'reach_id': next, 'length_km': p['length_km'], 'cumulative_length_km': length, 'entry_delay_s': None, 'exit_delay_s': None, 'pulse_end_at_exit_s': None})
        next = p['downstream_id']
    return rows, next, None, None


def pulse_adapter(request, reaches):
    rows, next, _, _ = path_adapter(request, reaches)
    params = request['parameters']
    speed, duration, volume = (params[key]['value'] for key in ['celerity', 'release_duration', 'release_volume'])
    previous = 0.0
    for row in rows:
        row['entry_delay_s'] = previous
        row['exit_delay_s'] = row['cumulative_length_km'] * 1000 / speed
        row['pulse_end_at_exit_s'] = row['exit_delay_s'] + duration
        previous = row['exit_delay_s']
        if not all(math.isfinite(row[key]) for key in ['entry_delay_s', 'exit_delay_s', 'pulse_end_at_exit_s']):
            raise ScenarioError('numerical_failure', 'Nonfinite pulse translation')
    return rows, next, volume / duration, volume


ADAPTERS = {('network-path', '1.0.0'): path_adapter, ('constant-celerity-pulse', '1.0.0'): pulse_adapter}


def run_scenario(request, datasets, calculated_at):
    validate_definition(request)
    reaches = network(datasets, request)
    adapter = ADAPTERS.get((request['model']['id'], request['model']['version']))
    if adapter is None:
        raise ScenarioError('unsupported_model', 'Model adapter/version is not registered')
    rows, next, discharge, volume = adapter(request, reaches)
    result = {'schema_version': '1.0.0', 'kind': 'scenario-result', 'id': request['id'], 'version': request['version'], 'status': 'complete' if next is None else 'partial_coverage',
              'evidence_type': 'modelled', 'label': 'HYPOTHETICAL MODELLED SCENARIO — NOT A FORECAST', 'simulation_level': request['simulation_level'], 'model_class': 'network_approximation', 'model': request['model'], 'is_fixture': request['is_fixture'], 'run_sha256': fingerprint(request), 'calculated_at': calculated_at,
              'processing_version': 'scenario-runner/1.0.0', 'runtime': {'python': platform.python_version()}, 'definition': request, 'assumptions': [{'id': id, 'version': '1.0.0', 'statement': ASSUMPTIONS[id]} for id in request['assumptions']],
              'crs': 'OGC:CRS84', 'vertical_datum': None, 'spatial_resolution': 'source river reaches; no terrain resampling', 'time_basis': 'seconds relative to hypothetical release; not calendar arrival times', 'path': rows, 'termination': 'source_outlet' if next is None else 'coverage_boundary', 'next_reach_id': next,
              'total_length_km': rows[-1]['cumulative_length_km'], 'pulse_discharge_m3_s': discharge, 'volume_per_section_m3': volume, 'footprint': None, 'depth_m': None, 'velocity_m_s': None, 'confidence_interval': None, 'validation': {'status': 'synthetic_analytic_cases_only', 'real_event_validation': False}, 'limitations': LIMITATIONS}
    RESULT.validate(result)
    return result
