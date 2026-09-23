"""Account for every source lake; run only supplied, identified physical requests."""
import argparse
import json
from pathlib import Path

from .inventory import inventory


def run_batch(requests, output):
    from .runner import run
    requests, output = Path(requests), Path(output)
    if not requests.is_dir() or output.exists():
        raise ValueError('Provide an existing request directory and a new output directory')
    records = inventory()['lakes']
    known = {item['lake_id'] for item in records}
    supplied = {}
    for path in sorted(requests.glob('*.json')):
        request = json.loads(path.read_text())
        lake_id = request.get('lake_id')
        if request.get('is_fixture') is not False or lake_id not in known or lake_id in supplied:
            raise ValueError('Batch requests need unique, real inventory lake identities')
        supplied[lake_id] = path
    output.mkdir(parents=True)
    for i, record in enumerate(records):
        path = supplied.get(record['lake_id'])
        if path is None:
            continue
        try:
            result = run(path, output / f'run-{i:05d}')
            record.update(state='MODELLED_RESEARCH_ONLY', missing_evidence=[],
                          result=f'run-{i:05d}/result.json', mass_residual_m3=result['mass_residual_m3'])
        except (ValueError, OSError, KeyError, TypeError) as error:
            record.update(state='INPUT_OR_RUN_REJECTED', reason=str(error))
    report = {'scope': 'Nepal/transboundary source inventory', 'publication_status': 'RESEARCH_ONLY',
              'note': 'No confirmed drainage-to-Nepal or destruction claims. Missing requests stay INPUTS_REQUIRED.',
              'lakes': records}
    (output / 'batch.json').write_text(json.dumps(report, indent=2) + '\n')
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--requests', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    run_batch(args.requests, args.output)
