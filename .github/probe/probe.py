import json, re, time, urllib.request
UA = {"User-Agent": "HimalayanDisasterAtlas/1.0 (+https://github.com/prasidupadhya/Himalayan-Disaster-Atlas; probe)"}
def get(url, timeout=60):
    t = time.time()
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
            b = r.read(); print(f"OK {r.status} {len(b)}B {time.time()-t:.1f}s {url} -> {r.geturl()} {r.headers.get('content-type')}"); return b
    except Exception as e:
        print(f"FAIL {url}: {type(e).__name__}: {e}"[:300])
print((get("https://dhm.gov.np/robots.txt") or b"")[:800].decode("utf-8", "replace"))
for u in ["https://dhm.gov.np/bulletins", "https://dhm.gov.np/bulletins?type=flood", "https://dhm.gov.np/hydrology/flood-bulletin"]:
    b = get(u)
    if not b: continue
    h = b.decode("utf-8", "replace")
    ls = sorted(set(re.findall(r'href=["\']([^"\']+)', h)))
    print("  doc links:", [l for l in ls if re.search(r"\.pdf|bulletin|flood|बाढी|report", l, re.I)][:80])
    text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", re.sub(r"(?s)<(script|style).*?</\1>", " ", h)))
    i = text.lower().find("bulletin"); print("  text:", text[max(0, i - 200): i + 1800])
