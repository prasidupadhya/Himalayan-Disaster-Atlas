"""Synthetic solver verification only: Ritter dry dam break and lake at rest."""
import argparse
import json
from pathlib import Path


def dam_break(nx):
    import anuga
    import numpy as np
    domain = anuga.rectangular_cross_domain(nx, 4, len1=40, len2=2, origin=(-20, 0))
    domain.set_flow_algorithm('DE0')
    domain.set_store(False)
    domain.set_quantity('elevation', 0)
    domain.set_quantity('friction', 0)
    domain.set_quantity('stage', lambda x, y: np.where(x < 0, 2.0, 0.0))
    domain.set_boundary({tag: anuga.Reflective_boundary(domain) for tag in domain.get_boundary_tags()})
    initial = domain.get_water_volume()
    for _ in domain.evolve(yieldstep=.1, finaltime=1.5):
        pass
    x = domain.centroid_coordinates[:, 0]
    c = np.sqrt(anuga.config.g * 2)
    exact = np.where(x < -c * 1.5, 2, np.where(x > 2*c*1.5, 0, (2*c-x/1.5)**2/(9*anuga.config.g)))
    actual = domain.quantities['stage'].centroid_values
    error = float(np.average(np.abs(actual-exact), weights=domain.areas) / 2)
    mass = float(abs(domain.get_water_volume() - initial) / initial)
    if error > .03 or mass > 1e-6 or actual.min() < -1e-8:
        raise ValueError(f'Dry dam-break verification failed: L1={error}, mass={mass}')
    return {'cells_x': nx, 'normalized_depth_l1': error, 'relative_mass_error': mass}


def lake_at_rest():
    import anuga
    import numpy as np
    domain = anuga.rectangular_cross_domain(40, 8, len1=40, len2=8)
    domain.set_flow_algorithm('DE0')
    domain.set_store(False)
    domain.set_quantity('elevation', lambda x, y: .3 * np.sin(x/8))
    domain.set_quantity('stage', 2)
    domain.set_quantity('friction', 0)
    domain.set_boundary({tag: anuga.Reflective_boundary(domain) for tag in domain.get_boundary_tags()})
    initial = domain.get_water_volume()
    for _ in domain.evolve(yieldstep=.1, finaltime=2):
        pass
    error = float(np.max(np.abs(domain.quantities['stage'].centroid_values-2)))
    mass = float(abs(domain.get_water_volume()-initial)/initial)
    if error > 1e-6 or mass > 1e-6:
        raise ValueError('Lake-at-rest verification failed')
    return {'max_stage_error_m': error, 'relative_mass_error': mass}


def run():
    import anuga
    if anuga.__version__ != '4.0.1':
        raise ValueError('Use pinned ANUGA 4.0.1')
    coarse, fine = dam_break(100), dam_break(200)
    if fine['normalized_depth_l1'] >= coarse['normalized_depth_l1']:
        raise ValueError('Depth error did not improve under mesh refinement')
    return {'model': 'anuga-swe-4.0.1', 'is_fixture': True, 'scope': 'Synthetic solver verification, NOT validation of any Nepal GLOF',
            'dry_dam_break': [coarse, fine], 'lake_at_rest': lake_at_rest(),
            'reference': 'https://anuga.readthedocs.io/en/stable/reference/validation.html'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    result = run()
    if args.output.exists():
        raise ValueError('Do not overwrite benchmark evidence')
    args.output.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))
