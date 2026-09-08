import copy
import unittest

from processing.hazard_graph.engine import traverse, validate_graph


def fixture():
    return {'inputs': [{}], 'nodes': [{'id': id, 'type': 'river', 'input': 0, 'coordinates': [84, 28]} for id in ['a', 'b', 'c']], 'edges': [{'id': a + b, 'from': a, 'to': b, 'type': 'river_downstream', 'evidence': 'derived', 'assumptions': [], 'input': 0} for a, b in [('a', 'b'), ('b', 'c'), ('c', 'a')]]}


class GraphTest(unittest.TestCase):
    def test_cycle_is_bounded_and_order_independent(self):
        graph = validate_graph(fixture())
        self.assertEqual(traverse(graph, 'a')['nodes'], ['a', 'b', 'c'])
        self.assertFalse(traverse(graph, 'a')['truncated'])
        self.assertTrue(traverse(graph, 'a', 2)['truncated'])
        reordered = copy.deepcopy(graph)
        reordered['edges'].reverse()
        self.assertEqual(traverse(graph, 'a'), traverse(reordered, 'a'))

    def test_invalid_edges_and_evidence(self):
        for change in ['missing', 'duplicate', 'observed', 'source']:
            graph = fixture()
            if change == 'missing':
                graph['edges'][0]['to'] = 'absent'
            if change == 'duplicate':
                graph['edges'].append(graph['edges'][0])
            if change == 'observed':
                graph['edges'][0]['evidence'] = 'observed'
            if change == 'source':
                graph['nodes'][0]['input'] = 9
            with self.assertRaises(ValueError):
                validate_graph(graph)
        with self.assertRaises(ValueError):
            traverse(fixture(), 'absent')
