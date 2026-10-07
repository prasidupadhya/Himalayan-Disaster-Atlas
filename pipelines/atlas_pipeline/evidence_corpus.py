"""Public scenario evidence corpus (Feature 58).

Exact paragraphs from the public-build feature documents and the method/limitation/uncertainty fields of the
public model releases, each with a stable citation. The browser analyst only retrieves and quotes these passages
(deterministic lexical ranking); it never generates factual text and calls no language model or external service.
"""

import json
import re

from .contracts import ROOT
from .live_contracts import require
from .model_release import (
    digest,
    encode,
    external_input,
    gzip_bytes,
    input_reference,
    publish,
    read_json_artifact,
    semantic,
)

ID, VERSION = "atlas-public-evidence", "1.0.0"
DOCUMENTS = [
    ("hrsl-population", "docs/hrsl-population.md", "HRSL population inputs"),
    ("flood-corridors", "docs/flood-corridors.md", "Flood and GLOF corridor scenarios"),
    ("earthquake-shaking", "docs/earthquake-shaking.md", "Earthquake shaking scenarios"),
    ("scenario-reports", "docs/scenario-reports.md", "Scenario sharing and reports"),
    ("climate-context", "docs/climate-context.md", "Rainfall, snow, drought and heat context"),
    ("terrain-steepness", "docs/terrain-steepness.md", "Terrain steepness for landslide awareness"),
    ("hazards-hub", "docs/hazards-hub.md", "Hazards hub and gated features"),
    ("live-conditions", "docs/live-conditions.md", "Periodically updated conditions"),
]
RELEASES = [
    ("nepal-hrsl-population", "1.0.0"), ("atlas-flood-corridors", "1.0.0"), ("atlas-gmpe-bssa14", "1.0.0"),
    ("nepal-power-gridded-context", "1.0.0"), ("nepal-terrain-steepness", "1.0.0"),
]
MAX_CHUNK = 4000


def chunk_markdown(doc_id, title, text):
    chunks, heading, buffer, start = [], title, [], None
    lines = text.split("\n")

    def flush(end):
        nonlocal buffer, start
        body = "\n".join(buffer).strip()
        if body:
            require(len(body) <= MAX_CHUNK, f"Paragraph too long for {doc_id}:{start}; curate manually")
            chunks.append({"id": f"{doc_id}:L{start}-L{end}", "source": doc_id, "title": title, "section": heading,
                           "start_line": start, "end_line": end, "text": body})
        buffer, start = [], None

    for number, line in enumerate(lines, 1):
        match = re.match(r"^(#{1,4})\s+(.*)$", line)
        if match:
            flush(number - 1)
            heading = match.group(2).strip()
            continue
        if not line.strip():
            flush(number - 1)
            continue
        if start is None:
            start = number
        buffer.append(line)
    flush(len(lines))
    return chunks


def release_chunks(identifier, version):
    manifest = json.loads((ROOT / "data/releases" / identifier / version / "manifest.json").read_bytes())
    meta = manifest["metadata"]
    title = meta["dataset_name"]
    out = [{"id": f"{identifier}@{version}:method", "source": f"{identifier}@{version}", "title": title, "section": "Method", "text": meta["method"]},
           {"id": f"{identifier}@{version}:uncertainty", "source": f"{identifier}@{version}", "title": title, "section": "Uncertainty", "text": meta["uncertainty"]}]
    out += [{"id": f"{identifier}@{version}:limitation-{n + 1}", "source": f"{identifier}@{version}", "title": title, "section": "Limitations", "text": text}
            for n, text in enumerate(meta["limitations"])]
    return out


def build():
    documents, chunks = [], []
    for doc_id, path, title in DOCUMENTS:
        raw = (ROOT / path).read_bytes()
        text = raw.decode("utf-8")
        documents.append({"id": doc_id, "path": path, "title": title, "sha256": digest(raw), "kind": "atlas-document"})
        chunks += chunk_markdown(doc_id, title, text)
    for identifier, version in RELEASES:
        documents.append({"id": f"{identifier}@{version}", "path": f"/data/{identifier}/{version}/manifest.json", "title": identifier,
                          "sha256": digest((ROOT / "data/releases" / identifier / version / "manifest.json").read_bytes()), "kind": "release-metadata"})
        chunks += release_chunks(identifier, version)
    require(len({c["id"] for c in chunks}) == len(chunks), "Duplicate chunk identifiers")
    return {"format": "atlas-public-evidence@1", "documents": documents, "chunks": chunks,
            "retrieval": "Lexical: sum over matched terms of log(1 + N / (1 + df)), +1 per term also in the title/section, times the matched-term fraction."}


def main():
    corpus = build()
    metadata = {
        "dataset_name": "Atlas public scenario evidence corpus",
        "source": "Himalayan Disaster Atlas project documents and public model-release metadata", "source_url": None,
        "license": "MIT (Atlas documentation); upstream data terms stay with each linked release", "license_url": "https://opensource.org/license/mit/",
        "attribution": "Himalayan Disaster Atlas contributors.", "observation_date": None, "publication_date": None,
        "retrieval_date": "2026-10-07T19:00:00Z", "processing_date": "2026-10-07T19:00:00Z", "processing_version": "public-evidence/1.0.0",
        "method": "Markdown paragraphs copied verbatim with heading and 1-based line span; release method, uncertainty and each limitation copied verbatim from pinned manifests.",
        "evidence_type": "derived", "status": "ATLAS_DERIVED", "is_fixture": False,
        "spatial_resolution": {"unit": None, "value": None}, "temporal_resolution": None, "crs": "OGC:CRS84", "update_frequency": "static", "stale_after": None,
        "limitations": [
            "These are project-authored descriptions of Atlas methods, not independent scientific observations or official guidance.",
            "Lexical retrieval matches English words; it can miss synonyms, Nepali morphology and paraphrases. No result does not mean safety or zero impact.",
            "Retrieved passages are quoted, never summarised or extended by a model.",
        ],
        "uncertainty": "Ranking reflects word overlap, not truth, confidence or authority.",
        "spatial_coverage": {"description": "Nepal", "bbox": [80.0, 26.3, 88.3, 30.5]}, "temporal_coverage": {"start": None, "end": None},
    }
    inputs = [input_reference(identifier, version) for identifier, version in RELEASES] + [
        external_input(f"atlas-doc-{d['id']}", "1.0.0", f"Atlas document {d['path']}", d["sha256"], f"https://github.com/prasidupadhya/Himalayan-Disaster-Atlas/blob/main/{d['path']}")
        for d in corpus["documents"] if d["kind"] == "atlas-document"]
    summary = {"documents": len(corpus["documents"]), "chunks": len(corpus["chunks"]), "notice_files": []}
    publish(ID, VERSION, "evidence-corpus", metadata, inputs, {"corpus": ("corpus.json.gz", gzip_bytes(encode(corpus)), "application/json+gzip")}, summary)
    print(f"Published {ID}@{VERSION}: {summary['chunks']} passages")


@semantic("evidence-corpus")
def verify_evidence_corpus(directory, manifest):
    corpus = read_json_artifact(directory, manifest, "corpus")
    require(corpus["format"] == "atlas-public-evidence@1", "Unsupported evidence corpus")
    require(len(corpus["chunks"]) == manifest["summary"]["chunks"] and len(corpus["documents"]) == manifest["summary"]["documents"], "Corpus summary differs")
    pinned = {i["dataset_id"].removeprefix("atlas-doc-"): i["sha256"] for i in manifest["inputs"] if i["dataset_id"].startswith("atlas-doc-")}
    texts = {}
    for doc in corpus["documents"]:
        if doc["kind"] == "atlas-document":
            require(pinned.get(doc["id"]) == doc["sha256"], f"Document hash not pinned: {doc['id']}")
            path = ROOT / doc["path"]
            # The corpus is a frozen snapshot: when the working document changes, a new corpus version is required.
            if path.exists() and digest(path.read_bytes()) == doc["sha256"]:
                texts[doc["id"]] = path.read_text().split("\n")
    for chunk in corpus["chunks"]:
        require(0 < len(chunk["text"]) <= MAX_CHUNK, "Invalid passage length")
        lines = texts.get(chunk["source"])
        if lines is not None and "start_line" in chunk:
            span = "\n".join(lines[chunk["start_line"] - 1: chunk["end_line"]]).strip()
            require(span == chunk["text"], f"Passage is not a verbatim span: {chunk['id']}")


if __name__ == "__main__":
    main()
