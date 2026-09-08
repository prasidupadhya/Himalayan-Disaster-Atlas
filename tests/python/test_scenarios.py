import copy
import unittest

from processing.scenario.engine import (
    MODEL_ASSUMPTIONS,
    ScenarioError,
    fingerprint,
    reference,
    run_scenario,
)

STAMP = '2026-09-08T00:00:00Z'


def fixture(lengths=(1.0, 2.0)):
    dataset = {'metadata': {'dataset_id': 'synthetic-network', 'dataset_version': '1.0.0', 'artifact': {'sha256': 'a' * 64}, 'processing_version': 'synthetic-test/1.0.0', 'source': 'Explicit synthetic analytical fixture', 'license': 'CC0', 'observation_date': None, 'is_fixture': True},
               'collection': {'features': [{'properties': {'source_id': str(i + 1), 'entity_type': 'river', 'length_km': length, 'downstream_id': str(i + 2) if i < len(lengths) - 1 else None, 'downstream_in_release': i < len(lengths) - 1}} for i, length in enumerate(lengths)]}}
    request = {'schema_version': '1.0.0', 'kind': 'scenario-definition', 'id': 'scenario-synthetic-test', 'version': '1.0.0', 'is_fixture': True, 'model': {'id': 'constant-celerity-pulse', 'version': '1.0.0'}, 'simulation_level': 2, 'source_reach_id': '1', 'inputs': [reference(dataset['metadata'])], 'assumptions': MODEL_ASSUMPTIONS['constant-celerity-pulse'],
               'parameters': {'celerity': {'value': 2, 'unit': 'm/s'}, 'release_volume': {'value': 1200, 'unit': 'm3'}, 'release_duration': {'value': 600, 'unit': 's'}}}
    return request, [dataset]


class ScenarioTest(unittest.TestCase):
    def test_known_constant_translation_and_mass_per_section(self):
        request, data = fixture()
        result = run_scenario(request, data, STAMP)
        self.assertEqual([r['entry_delay_s'] for r in result['path']], [0, 500])
        self.assertEqual([r['exit_delay_s'] for r in result['path']], [500, 1500])
        self.assertEqual(result['path'][-1]['pulse_end_at_exit_s'], 2100)
        self.assertEqual(result['pulse_discharge_m3_s'] * 600, 1200)
        self.assertEqual(result['volume_per_section_m3'], 1200)
        self.assertIsNone(result['footprint'])
        self.assertIsNone(result['velocity_m_s'])
        self.assertEqual(result, run_scenario(request, data, STAMP))
        self.assertEqual(result['run_sha256'], fingerprint(request))

    def test_level_one_has_no_physical_outputs_and_preserves_coverage_exit(self):
        request, data = fixture()
        request.update(model={'id': 'network-path', 'version': '1.0.0'}, simulation_level=1, parameters={}, assumptions=MODEL_ASSUMPTIONS['network-path'])
        data[0]['collection']['features'][-1]['properties']['downstream_id'] = '99'
        result = run_scenario(request, data, STAMP)
        self.assertEqual(result['status'], 'partial_coverage')
        self.assertEqual(result['next_reach_id'], '99')
        self.assertIsNone(result['path'][0]['entry_delay_s'])
        self.assertIsNone(result['pulse_discharge_m3_s'])

    def test_zero_release_zero_length_and_parameter_boundaries(self):
        request, data = fixture((0, 1))
        request['parameters']['release_volume']['value'] = 0
        request['parameters']['celerity']['value'] = .1
        request['parameters']['release_duration']['value'] = 86400
        result = run_scenario(request, data, STAMP)
        self.assertEqual(result['path'][0]['exit_delay_s'], 0)
        self.assertEqual(result['pulse_discharge_m3_s'], 0)
        request['parameters']['celerity']['value'] = 10
        request['parameters']['release_volume']['value'] = 10000000
        request['parameters']['release_duration']['value'] = 60
        self.assertEqual(run_scenario(request, data, STAMP)['path'][-1]['exit_delay_s'], 100)

    def test_invalid_parameters_never_create_outputs(self):
        request, data = fixture()
        for field, value in [('celerity', 0), ('celerity', 11), ('release_volume', -1), ('release_duration', 0), ('celerity', float('nan')), ('release_volume', float('inf'))]:
            bad = copy.deepcopy(request)
            bad['parameters'][field]['value'] = value
            with self.assertRaises(ScenarioError):
                run_scenario(bad, data, STAMP)
        for mutate in [lambda r: r['parameters']['celerity'].update(unit='km/h'), lambda r: r['model'].update(version='2.0.0'), lambda r: r.update(assumptions=[]), lambda r: r.update(source_reach_id='999'), lambda r: r.update(is_fixture=False)]:
            bad = copy.deepcopy(request)
            mutate(bad)
            with self.assertRaises(ScenarioError):
                run_scenario(bad, data, STAMP)

    def test_cycles_missing_links_and_unknown_lengths_fail(self):
        for failure in ['cycle', 'missing_length', 'nan_length', 'broken_link', 'provenance', 'missing_pointer']:
            request, data = fixture()
            last = data[0]['collection']['features'][-1]['properties']
            if failure == 'cycle':
                last.update(downstream_id='1', downstream_in_release=True)
            elif failure == 'missing_length':
                last['length_km'] = None
            elif failure == 'nan_length':
                last['length_km'] = float('nan')
            elif failure == 'broken_link':
                last.update(downstream_id='99', downstream_in_release=True)
            elif failure == 'missing_pointer':
                del last['downstream_id']
            else:
                request['inputs'][0]['sha256'] = 'b' * 64
            with self.assertRaises(ScenarioError):
                run_scenario(request, data, STAMP)

    def test_hard_computational_limit_is_not_a_partial_zero_result(self):
        request, data = fixture([1] * 5001)
        with self.assertRaisesRegex(ScenarioError, '5,000'):
            run_scenario(request, data, STAMP)
