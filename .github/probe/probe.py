import json, urllib.request, urllib.parse
UA = {"User-Agent": "HimalayanDisasterAtlas/1.0 (+https://github.com/prasidupadhya/Himalayan-Disaster-Atlas; probe)", "X-Requested-With": "XMLHttpRequest",
      "Accept": "application/json, text/javascript, */*; q=0.01", "Referer": "https://dhm.gov.np/bulletins"}
for method, data in [("GET", None), ("POST", b""), ("POST", urllib.parse.urlencode({"type": "flood"}).encode())]:
    try:
        r = urllib.request.urlopen(urllib.request.Request("https://dhm.gov.np/site/getBulletins", data=data, headers=UA, method=method), timeout=60)
        b = r.read(); print(method, data, r.status, r.headers.get("content-type"), len(b)); print(b[:3000].decode("utf-8", "replace"))
    except Exception as e:
        print(method, data, "FAIL", type(e).__name__, e)
