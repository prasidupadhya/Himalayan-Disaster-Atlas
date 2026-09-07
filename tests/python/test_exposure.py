"""Deterministic synthetic exposure fixtures; no synthetic values enter real releases."""
import unittest

import numpy as np
from rasterio.io import MemoryFile
from rasterio.transform import from_origin
from shapely.geometry import LineString, Point, box, mapping
from shapely.ops import unary_union

from processing.exposure.engine import (
    administrative_overlay,
    asset_index,
    assign_assets,
    footprint_geometry,
    population_overlay,
    project,
    vector_overlay,
)


def asset(id, geometry, category='school'):
    return {'type': 'Feature', 'geometry': mapping(geometry), 'properties': {
        'osm_element_type': 'way', 'osm_element_id': str(id), 'infrastructure_class': category,
        'dataset_id': 'synthetic-exposure-fixture', 'asset_name': None, 'position_basis': 'synthetic test geometry',
    }}


def dataset(features):
    return {'collection': {'type': 'FeatureCollection', 'features': features}}


class ExposureTest(unittest.TestCase):
    def raster(self, values=None, crs='EPSG:4326'):
        memory = MemoryFile()
        self.addCleanup(memory.close)
        src = memory.open(driver='GTiff', width=2, height=2, count=1, dtype='float32', crs=crs,
                          transform=from_origin(80, 28.002, 0.001, 0.001), nodata=-99999)
        src.write(np.array(values if values is not None else [[100, 200], [0, -99999]], dtype='float32'), 1)
        self.addCleanup(src.close)
        return src

    def test_partial_cell_weighting_is_exact_not_all_touched(self):
        result = population_overlay(project(box(80, 28.001, 80.0015, 28.002)), self.raster())
        self.assertAlmostEqual(result['known_population'], 200, places=5)
        self.assertAlmostEqual(result['total_population'], 200, places=5)
        self.assertEqual(result['intersected_valid_cells'], 2)

    def test_nodata_is_unknown_and_valid_zero_remains_zero(self):
        src = self.raster()
        whole = population_overlay(project(box(80, 28, 80.002, 28.002)), src)
        self.assertAlmostEqual(whole['known_population'], 300, places=5)
        self.assertIsNone(whole['total_population'])
        self.assertGreater(whole['unknown_area_km2'], 0)
        zero = population_overlay(project(box(80, 28, 80.001, 28.001)), src)
        self.assertEqual(zero['known_population'], 0)
        self.assertEqual(zero['total_population'], 0)

    def test_holes_and_overlapping_areas_do_not_double_count(self):
        src = self.raster([[100, 200], [0, 300]])
        footprint = unary_union([box(80, 28, 80.002, 28.002), box(80, 28, 80.001, 28.002)])
        footprint = footprint.difference(box(80, 28.001, 80.001, 28.002))
        self.assertAlmostEqual(population_overlay(project(footprint), src)['known_population'], 500, places=5)

    def test_outside_grid_and_empty_geometry_are_distinct(self):
        src = self.raster()
        out = population_overlay(project(box(81, 28, 81.001, 28.001)), src)
        self.assertIsNone(out['known_population'])
        self.assertGreater(out['outside_grid_area_km2'], 0)
        self.assertEqual(population_overlay(Point().buffer(0), src)['total_population'], 0)

    def test_crs_mismatch_and_negative_counts_fail(self):
        geom = project(box(80, 28, 80.002, 28.002))
        with self.assertRaisesRegex(ValueError, 'EPSG:4326'):
            population_overlay(geom, self.raster(crs='EPSG:3857'))
        with self.assertRaisesRegex(ValueError, 'nonnegative'):
            population_overlay(geom, self.raster([[100, -1], [0, 300]]))
        with self.assertRaisesRegex(ValueError, 'CRS84'):
            footprint_geometry({'crs': 'EPSG:3857', 'geometry': mapping(box(80, 28, 81, 29))})

    def test_duplicates_and_boundary_contacts_count_unique_assets(self):
        point = asset(1, Point(80, 28))
        line = asset(2, LineString([(79.9, 28), (80, 28)]), 'road')
        polygon = asset(3, box(80.0005, 28.0005, 80.002, 28.002))
        indexed = asset_index([dataset([point, line, polygon]), dataset([point])])
        matched = vector_overlay(project(box(80, 28, 80.001, 28.001)), indexed)
        self.assertEqual(len(matched), 3)
        self.assertEqual(len(vector_overlay(project(box(82, 28, 83, 29)), indexed)), 0)
        with self.assertRaisesRegex(ValueError, 'Conflicting'):
            asset_index([dataset([point, asset(1, Point(81, 28))])])

    def test_administrative_overlap_and_boundary_ties_are_exclusive(self):
        footprint = project(box(80, 28, 80.002, 28.002))
        districts = [
            {'geometry': mapping(box(80.001, 28, 80.002, 28.002)), 'properties': {'pcode': 'B', 'name': 'Synthetic B'}},
            {'geometry': mapping(box(80, 28, 80.0015, 28.002)), 'properties': {'pcode': 'A', 'name': 'Synthetic A'}},
        ]
        pieces = administrative_overlay(footprint, districts)
        self.assertAlmostEqual(sum(p['geometry'].area for p in pieces), footprint.area, places=5)
        items = vector_overlay(footprint, asset_index([dataset([asset(1, Point(80.0015, 28.001))])]))
        assign_assets(items, pieces)
        self.assertEqual(items[0]['admin_pcode'], 'A')

    def test_same_osm_road_and_bridge_keep_separate_intersection_geometries(self):
        road = asset(1, LineString([(80, 28), (80.002, 28)]), 'road')
        bridge = asset(1, Point(80.0015, 28), 'bridge')
        indexed = asset_index([dataset([road, bridge])])
        only_road = vector_overlay(project(box(80, 27.999, 80.001, 28.001)), indexed)
        self.assertEqual(len(only_road), 1)
        self.assertEqual(only_road[0]['categories'], {'road'})
        both = vector_overlay(project(box(80, 27.999, 80.002, 28.001)), indexed)
        self.assertEqual(len(both), 1)
        self.assertEqual(both[0]['categories'], {'road', 'bridge'})

    def test_large_inventory_uses_index_and_keeps_stable_identity(self):
        features = [asset(i, Point(80 + i * 0.00001, 28.001)) for i in range(10000)]
        indexed = asset_index([dataset(features)])
        result = vector_overlay(project(box(80, 28, 80.1, 28.002)), indexed)
        self.assertEqual(len(result), 10000)
        self.assertEqual(len({row['id'] for row in result}), 10000)


if __name__ == '__main__':
    unittest.main()
