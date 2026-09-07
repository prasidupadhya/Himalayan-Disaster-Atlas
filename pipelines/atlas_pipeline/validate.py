"""Verify every registered release and its exact public copy."""
import json
from pathlib import Path

from .contracts import ROOT, verify_artifact


def main():
    releases = sorted((ROOT / 'data/releases').glob('*/*/manifest.json'))
    if not releases:
        raise ValueError('No release manifests found')
    for path in releases:
        metadata = json.loads(path.read_text())
        artifact_name = Path(metadata['artifact']['path']).name
        content = path.with_name(artifact_name).read_bytes()
        verify_artifact(metadata, content)
        public = ROOT / 'apps/web/public' / metadata['artifact']['path'].lstrip('/')
        if public.read_bytes() != content or public.with_name('manifest.json').read_bytes() != path.read_bytes():
            raise ValueError('Public artifact differs from validated release')
        print(f"Valid: {metadata['dataset_id']}@{metadata['dataset_version']}")


if __name__ == '__main__':
    main()
