import re, asyncio
from playwright.async_api import async_playwright
URL = "https://dhm.gov.np/bulletins"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); page = await b.new_page()
        calls = []
        page.on("request", lambda r: calls.append(r.url) if r.resource_type in ("xhr", "fetch") else None)
        await page.goto(URL, wait_until="networkidle", timeout=90000)
        for label in ["Flood Forecasting Bulletin", "बाढी"]:
            loc = page.get_by_text(label, exact=False)
            n = await loc.count(); print("tab", label, n)
            if n:
                await loc.first.click(); await page.wait_for_timeout(4000); break
        links = await page.eval_on_selector_all("a[href]", "els => els.map(e => [e.textContent.trim().slice(0,90), e.href])")
        for t, h in links:
            if re.search(r"\.pdf|bulletin|flood|बाढी|download|storage|upload", h + t, re.I): print("LINK", t, "|", h)
        print("XHR:", sorted(set(calls))[:40])
        text = re.sub(r"\s+", " ", await page.inner_text("body")); i = text.find("Flood Forecasting Bulletin")
        print("TEXT:", text[i: i + 2500])
        await b.close()
asyncio.run(main())
