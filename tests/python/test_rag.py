"""Evidence release integrity, lineage and deterministic ingestion."""
import copy
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from pipelines.atlas_pipeline.rag import (
    ROOT,
    build_corpus,
    chunk_document,
    encode,
    main,
    validate_corpus,
    verify_rag,
)


class RagTests(unittest.TestCase):
    def test_reproduce_release_and_public_snapshots(self):
        corpus = build_corpus()
        checked = verify_rag(ROOT / 'data/releases/atlas-evidence/1.0.0',
                             ROOT / 'apps/web/public/data/atlas-evidence/1.0.0')
        self.assertEqual(corpus, checked)
        self.assertEqual(encode(corpus), encode(build_corpus()))

    def test_citation_and_content_tampering(self):
        corpus = build_corpus()
        for field, value in [('text', 'Invented'), ('end_line', 99999), ('document_id', 'absent')]:
            changed = copy.deepcopy(corpus)
            changed['chunks'][0][field] = value
            with self.assertRaises(ValueError):
                validate_corpus(changed)
        corpus['documents'][0]['text'] += 'changed'
        with self.assertRaisesRegex(ValueError, 'version mismatch'):
            validate_corpus(corpus)

    def test_no_paragraph_truncation(self):
        d = {'id': 'synthetic', 'title': 'Synthetic', 'text': '# Heading\n\nA limitation.\nAnother line.\n'}
        chunks = chunk_document(d)
        self.assertEqual(chunks[1]['section'], 'Heading')
        self.assertEqual(chunks[1]['text'], 'A limitation.\nAnother line.')
        self.assertEqual((chunks[1]['start_line'], chunks[1]['end_line']), (3, 4))
        d['text'] = 'x' * 4001
        with self.assertRaisesRegex(ValueError, 'budget'):
            chunk_document(d)

    def test_unapproved_paths_and_changed_source_rejected(self):
        import json

        from pipelines.atlas_pipeline.rag import REGISTRY
        config = json.loads(REGISTRY.read_text())
        with tempfile.TemporaryDirectory() as tmp:
            registry = Path(tmp) / 'corpus.json'
            for field, value in [('path', '../private.md'), ('sha256', '0' * 64)]:
                altered = copy.deepcopy(config)
                altered['documents'][0][field] = value
                registry.write_text(json.dumps(altered))
                with patch('pipelines.atlas_pipeline.rag.REGISTRY', registry):
                    with self.assertRaises(ValueError):
                        build_corpus()

    def test_publication_conflict_preserves_existing_bytes(self):
        corpus = build_corpus()
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            existing = root / 'data/releases/atlas-evidence/1.0.0/manifest.json'
            existing.parent.mkdir(parents=True)
            existing.write_bytes(b'previous immutable publication')
            with patch('pipelines.atlas_pipeline.rag.ROOT', root), \
                    patch('pipelines.atlas_pipeline.rag.build_corpus', return_value=corpus):
                with self.assertRaisesRegex(ValueError, 'immutable'):
                    main()
            self.assertEqual(existing.read_bytes(), b'previous immutable publication')
            self.assertFalse((root / 'apps').exists())
