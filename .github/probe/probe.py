# Runs the real digest code for the flood-bulletin source only, and prints what it would publish. Commits nothing.
import json
from pipelines.gov_feeds.digest import build, SOURCES
src = [s for s in json.loads(SOURCES.read_text())["sources"] if s["id"] == "dhm-flood-archive"]
digest, raw = build(src, None)
e = digest["sources"][0]
print(json.dumps({k: e.get(k) for k in ("status", "http_status", "error", "url")}, ensure_ascii=False))
print(json.dumps(e.get("content"), ensure_ascii=False, indent=1)[:4000])
