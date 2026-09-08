"""Allowlisted project-document ingestion; no network, model or credential access."""
import gzip
import hashlib
import json
from pathlib import Path

from jsonschema import Draft7Validator, FormatChecker

from .contracts import ROOT

REGISTRY = ROOT / 'processing/rag/corpus.json'
SCHEMA = json.loads((ROOT / 'schemas/rag.schema.json').read_text())


def digest(data):
    return hashlib.sha256(data).hexdigest()


def encode(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')) + '\n').encode()


def chunk_document(document):
    """Whole Markdown paragraphs, with exact 1-based source line spans; never truncate."""
    chunks, section, start, block = [], document['title'], 0, []
    for number, line in enumerate(document['text'].split('\n') + [''], 1):
        if line.startswith('#') and not block:
            section = line.lstrip('# ').strip()
        if line.strip():
            if not block:
                start = number
            block.append(line)
        elif block:
            text = '\n'.join(block)
            if len(text) > 4000:
                raise ValueError('Paragraph exceeds evidence budget; curate a smaller source section')
            chunks.append({'id': f"{document['id']}:{start}-{number - 1}",
                           'document_id': document['id'], 'section': section,
                           'start_line': start, 'end_line': number - 1,
                           'text': text, 'assertions': []})
            block = []
    return chunks


def validate_corpus(corpus):
    Draft7Validator(SCHEMA, format_checker=FormatChecker()).validate(corpus)
    docs = {d['id']: d for d in corpus['documents']}
    if len(docs) != len(corpus['documents']):
        raise ValueError('Duplicate evidence document')
    ids = set()
    for doc in docs.values():
        if digest(doc['text'].encode()) != doc['version']:
            raise ValueError('Evidence source version mismatch')
        expected = f"/data/atlas-evidence/{corpus['version']}/documents/{doc['id']}.txt"
        if doc['snapshot_path'] != expected:
            raise ValueError('Evidence snapshot identity mismatch')
    for chunk in corpus['chunks']:
        doc = docs.get(chunk['document_id'])
        if not doc or chunk['id'] in ids:
            raise ValueError('Unknown document or duplicate chunk')
        ids.add(chunk['id'])
        lines = doc['text'].split('\n')
        start, end = chunk['start_line'], chunk['end_line']
        if end < start or end > len(lines) or '\n'.join(lines[start - 1:end]) != chunk['text']:
            raise ValueError('Citation does not reproduce source lines')
    return corpus


def build_corpus():
    config = json.loads(REGISTRY.read_text())
    corpus = {'schema_version': '1.0.0', 'kind': 'evidence-corpus',
              'version': config['version'], 'documents': [], 'chunks': []}
    for entry in config['documents']:
        path = Path(entry['path'])
        if path.is_absolute() or '..' in path.parts or path.parts[0] != 'docs':
            raise ValueError('Only explicitly approved project documentation may be ingested')
        raw = (ROOT / path).read_bytes()
        if digest(raw) != entry['sha256']:
            raise ValueError(f'{path} changed: review and publish a NEW corpus version')
        for source in entry['inputs']:
            if digest((ROOT / 'apps/web/public' / source['manifest_path'].lstrip('/')).read_bytes()) != source['sha256']:
                raise ValueError('Pinned dataset manifest changed')
        document = {k: v for k, v in entry.items() if k not in ('path', 'sha256', 'assertions')}
        document.update(version=entry['sha256'], accessed_at=config['accessed_at'],
                        snapshot_path=f"/data/atlas-evidence/{config['version']}/documents/{entry['id']}.txt",
                        text=raw.decode('utf-8'))
        corpus['documents'].append(document)
        chunks = chunk_document(document)
        by_id = {c['id']: c for c in chunks}
        for annotation in entry.get('assertions', []):
            if annotation['chunk_id'] not in by_id:
                raise ValueError('Reviewed assertion points to an unknown source span')
            by_id[annotation['chunk_id']]['assertions'].append(annotation['assertion'])
        corpus['chunks'].extend(chunks)
    return validate_corpus(corpus)


def verify_rag(release, public):
    manifest = json.loads((release / 'manifest.json').read_text())
    raw = (release / 'corpus.json.gz').read_bytes()
    if manifest['kind'] != 'evidence-release' or manifest['artifact'] != {
        'path': f"/data/atlas-evidence/{manifest['version']}/corpus.json.gz",
        'sha256': digest(raw), 'byte_size': len(raw),
    } or len(raw) > 524288:
        raise ValueError('Evidence artifact identity/checksum/budget mismatch')
    # A bounded read rejects decompression bombs before allocating the full result.
    with gzip.open(release / 'corpus.json.gz', 'rb') as stream:
        decoded = stream.read(2097153)
    if len(decoded) > 2097152:
        raise ValueError('Evidence decoded budget exceeded')
    corpus = validate_corpus(json.loads(decoded))
    if corpus['version'] != manifest['version']:
        raise ValueError('Evidence release version mismatch')
    registry = json.loads(REGISTRY.read_text())
    if registry['version'] == corpus['version']:
        if manifest['registry_sha256'] != digest(REGISTRY.read_bytes()) or corpus != build_corpus():
            raise ValueError('Evidence corpus differs from approved ingestion registry')
    for name in ['manifest.json', 'corpus.json.gz']:
        if (release / name).read_bytes() != (public / name).read_bytes():
            raise ValueError('Public evidence differs from release')
    for doc in corpus['documents']:
        name = f"documents/{doc['id']}.txt"
        if (release / name).read_bytes() != doc['text'].encode() or (public / name).read_bytes() != doc['text'].encode():
            raise ValueError('Citation snapshot differs from indexed document')
        for source in doc['inputs']:
            if digest((ROOT / 'apps/web/public' / source['manifest_path'].lstrip('/')).read_bytes()) != source['sha256']:
                raise ValueError('Evidence dataset provenance mismatch')
    return corpus


def main():
    corpus = build_corpus()
    decoded = encode(corpus)
    raw = gzip.compress(decoded, mtime=0)
    if len(decoded) > 2097152 or len(raw) > 524288:
        raise ValueError('Evidence corpus delivery budget exceeded')
    manifest = {'kind': 'evidence-release', 'version': corpus['version'],
                'processing_version': 'atlas-evidence/1.0.0', 'registry_sha256': digest(REGISTRY.read_bytes()),
                'artifact': {'path': f"/data/atlas-evidence/{corpus['version']}/corpus.json.gz",
                             'sha256': digest(raw), 'byte_size': len(raw)}}
    files = {'manifest.json': encode(manifest), 'corpus.json.gz': raw}
    files.update({f"documents/{d['id']}.txt": d['text'].encode() for d in corpus['documents']})
    release = ROOT / 'data/releases/atlas-evidence' / corpus['version']
    public = ROOT / 'apps/web/public/data/atlas-evidence' / corpus['version']
    # Preflight both destinations before any write; published bytes are immutable.
    for directory in (release, public):
        for name, content in files.items():
            path = directory / name
            if path.exists() and path.read_bytes() != content:
                raise ValueError('Published evidence is immutable; create a new version')
    for directory in (release, public):
        for name, content in files.items():
            path = directory / name
            path.parent.mkdir(parents=True, exist_ok=True)
            if not path.exists():
                path.write_bytes(content)
    verify_rag(release, public)
    print(f"Evidence: {len(corpus['documents'])} documents, {len(corpus['chunks'])} chunks, {len(raw)} bytes")


if __name__ == '__main__':
    main()
