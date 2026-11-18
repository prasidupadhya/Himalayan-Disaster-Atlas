import json, re, socket, ssl, sys, time, urllib.request
UA = {"User-Agent": "HimalayanDisasterAtlas/1.0 (+https://github.com/prasidupadhya/Himalayan-Disaster-Atlas; probe)"}

def get(url, ctx=None, timeout=60):
    t = time.time()
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout, context=ctx) as r:
            body = r.read()
            print(f"OK {r.status} {len(body)}B {time.time()-t:.1f}s {url} -> {r.geturl()} {r.headers.get('content-type')}")
            return body
    except Exception as e:
        print(f"FAIL {time.time()-t:.1f}s {url}: {type(e).__name__}: {e}"[:300])

def links(body, pat):
    html = body.decode("utf-8", "replace")
    return sorted(set(re.findall(r'href=["\']([^"\']+)', html)))

print("=== flood bulletins")
for u in ["https://dms2.dhm.gov.np/", "http://dms2.dhm.gov.np/", "https://www.dhm.gov.np/", "https://dhm.gov.np/", "https://dhm.gov.np/mfd/api/page",
          "https://hydrology.gov.np/", "https://www.hydrology.gov.np/"]:
    b = get(u)
    if b and u.endswith("api/page"):
        d = json.loads(b); print(json.dumps(d, ensure_ascii=False)[:2500])
    elif b:
        ls = links(b, "")
        print("  links:", [l for l in ls if re.search(r"flood|bulletin|bad|hydro|report|pdf|बाढी", l, re.I)][:60])
print("archive:", (get("https://web.archive.org/cdx/search/cdx?url=dms2.dhm.gov.np/&output=json&limit=-3&fl=timestamp,statuscode") or b"")[:400])

print("=== seismonepal certificate")
host = "seismonepal.gov.np"
try:
    raw = ssl.get_server_certificate((host, 443), timeout=30)
    print(raw[:80])
    import subprocess
    print(subprocess.run(["openssl", "x509", "-noout", "-subject", "-issuer", "-dates", "-ext", "subjectAltName"], input=raw, capture_output=True, text=True).stdout)
except Exception as e:
    print("cert fetch failed", e)
ctx = ssl.create_default_context(); ctx.verify_flags |= 0x200000  # X509_V_FLAG_NO_CHECK_TIME: chain and host name checked, expiry not
for u in ["https://seismonepal.gov.np/en/earthquakes", "https://seismonepal.gov.np/earthquakes", "http://seismonepal.gov.np/en/earthquakes"]:
    b = get(u, ctx if u.startswith("https") else None)
    if b:
        h = b.decode("utf-8", "replace"); print("  tables:", h.count("<table"), "magnitude" in h.lower(), [l for l in links(b, "") if re.search(r"api|json|earthquake", l, re.I)][:30])
print("default context (should fail):"); get("https://seismonepal.gov.np/en/earthquakes", ssl.create_default_context(), 30)
