"""Index observation intervals from immutable releases without filling missing dates."""
import gzip
import hashlib
import json
import shutil
from collections import Counter
from datetime import datetime, timedelta, timezone

from .contracts import ROOT

BASE = '/data/atlas-time-index/1.0.0/'


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def stamp(date):
    return date.isoformat().replace('+00:00', 'Z')


def derive():
    inputs, products, used = [], [], set()

    def read(dataset):
        path = ROOT / f'data/releases/{dataset}/1.0.0/manifest.json'
        raw = path.read_bytes()
        inputs.append({'path': f'/data/{dataset}/1.0.0/manifest.json', 'sha256': digest(raw), 'byte_size': len(raw)})
        used.add(dataset)
        return json.loads(raw)

    def observation(id, start, end, acquired=None, published=None, sensor=None, compatibility=None, count=None):
        return {'id': id, 'start': start, 'end': end, 'acquired_at': acquired, 'published_at': published, 'sensor': sensor, 'compatibility': compatibility, 'count': count}

    def product(id, label, metadata, resolution, observations):
        return {'id': id, 'label': label, 'dataset_id': metadata['dataset_id'], 'version': metadata['dataset_version'], 'source': metadata['source'], 'retrieved_at': metadata['retrieval_date'], 'published_at': metadata['publication_date'], 'resolution': resolution, 'observations': observations}

    for id, dataset, label in [('water', 'phewa-water-change', 'Phewa water observations'), ('satellite', 'nepal-sentinel-observations', 'Satellite context windows')]:
        manifest = read(dataset)
        observations = []
        for item in sorted(manifest['observations'], key=lambda o: o['acquired_at']):
            acquired = item['acquired_at']
            start = datetime.fromisoformat(acquired.replace('Z', '+00:00'))
            observations.append(observation(item['id'], acquired, stamp(start + timedelta(milliseconds=1)), acquired, item.get('published_at'), item.get('platform', item['scene_id'][:3]), 'phewa-20m-ndwi-scl-v1' if id == 'water' else None))
        products.append(product(id, label, manifest['metadata'], 'instant', observations))
    climate = read('nepal-power-climate')
    observations = []
    for record in climate['series']:
        year, month = record['year'], record['month']
        end = datetime(year + (month == 12), month % 12 + 1, 1, tzinfo=timezone.utc)
        observations.append(observation(record['period'], record['period'] + '-01T00:00:00Z', stamp(end), compatibility='power-merra2-nepal-monthly-v1'))
    products.append(product('climate', 'Nepal monthly climate', climate['metadata'], 'month', observations))
    counts = Counter()
    for path in sorted((ROOT / 'data/releases').glob('nepal-disaster-events-*/1.0.0/manifest.json')):
        metadata = read(path.parent.parent.name)
        artifact = metadata['artifact']
        raw = (ROOT / 'apps/web/public' / artifact['path'].lstrip('/')).read_bytes()
        if digest(raw) != artifact['sha256'] or len(raw) != artifact['byte_size']:
            raise ValueError('Event source checksum mismatch')
        features = json.loads(gzip.decompress(raw))['features']
        for feature in features:
            value = feature['properties'].get('event_time')
            if value:
                counts[datetime.fromisoformat(value.replace('Z', '+00:00')).astimezone(timezone.utc).date().isoformat()] += 1
    observations = []
    for date, count in sorted(counts.items()):
        start = datetime.fromisoformat(date).replace(tzinfo=timezone.utc)
        observations.append(observation(date, stamp(start), stamp(start + timedelta(days=1)), count=count))
    products.append(product('events', 'Reported disaster events', {**metadata, 'dataset_id': 'nepal-disaster-events'}, 'day', observations))
    context = []
    for path in sorted((ROOT / 'data/releases').glob('*/*/manifest.json')):
        value = json.loads(path.read_text())
        m = value.get('metadata', value)
        if m.get('dataset_id') in used or 'dataset_id' not in m:
            continue
        context.append({'dataset_id': m['dataset_id'], 'version': m['dataset_version'], 'observation_date': m['observation_date'], 'coverage': m['temporal_coverage'], 'resolution': m['temporal_resolution']})
    return {'schema_version': '1.0.0', 'products': products, 'inputs': inputs, 'context': context}


def verify_time_index(path, public=None):
    from jsonschema import Draft7Validator, FormatChecker
    schema = json.loads((ROOT / 'schemas/temporal.schema.json').read_text())
    raw = (path / 'index.json').read_bytes()
    manifest = json.loads((path / 'manifest.json').read_text())
    index = json.loads(raw)
    Draft7Validator(schema, format_checker=FormatChecker()).validate(index)
    if manifest != {'kind': 'temporal-index', 'version': '1.0.0', 'artifact': {'path': BASE + 'index.json', 'sha256': digest(raw), 'byte_size': len(raw)}} or index != derive():
        raise ValueError('Temporal index or inputs differ from immutable releases')
    if public and any((path / name).read_bytes() != (public / name).read_bytes() for name in ['index.json', 'manifest.json']):
        raise ValueError('Public temporal index differs')
    return index


def build():
    release = ROOT / ('data/releases' + BASE[5:])
    public = ROOT / ('apps/web/public' + BASE)
    if release.exists():
        verify_time_index(release, public)
        return
    index = derive()
    raw = (json.dumps(index, sort_keys=True, separators=(',', ':')) + '\n').encode()
    release.mkdir(parents=True)
    (release / 'index.json').write_bytes(raw)
    (release / 'manifest.json').write_text(json.dumps({'kind': 'temporal-index', 'version': '1.0.0', 'artifact': {'path': BASE + 'index.json', 'sha256': digest(raw), 'byte_size': len(raw)}}, sort_keys=True) + '\n')
    shutil.copytree(release, public)
    verify_time_index(release, public)


if __name__ == '__main__':
    build()
