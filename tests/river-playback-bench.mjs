// Optional rendering benchmark; run from either revision with the same browser.
// Counts map render events during playback. This is viewport emulation.
import { chromium } from 'playwright';
import { serve } from './serve.mjs';

const server = await serve(0);
const base = 'http://127.0.0.1:' + server.address().port;
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (let trial = 1; trial <= 3; trial++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1,
      isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
    try {
      await context.route('https://fonts.*/**', route => route.abort());
      await context.addInitScript(() => { localStorage.setItem('lang', 'en'); localStorage.setItem('theme', 'dark'); });
      const page = await context.newPage();
      await page.goto(base + '/scenarios/#flood=glof-40746560');
      await page.waitForSelector('#map[data-ready=true]');
      await page.locator('#scrub').fill('165');
      await page.evaluate(async () => {
        const { Map } = await import('/vendor/maplibre-gl/maplibre-gl.mjs');
        const set = Map.prototype.setTerrain;
        Map.prototype.setTerrain = function (...args) {
          Map.prototype.setTerrain = set;
          window.benchmarkMap = this;
          return set.apply(this, args);
        };
      });
      await page.locator('#terrain-toggle').click();
      await page.evaluate(() => document.getElementById('play').click());
      await page.waitForFunction(() => Number(document.getElementById('scrub').value) > 183);
      const result = await page.evaluate(async () => {
        const map = window.benchmarkMap, times = [];
        let reads = 0;
        const proto = WebGL2RenderingContext.prototype, read = proto.readPixels;
        proto.readPixels = function (...args) { reads++; return read.apply(this, args); };
        const start = performance.now(), frame = () => times.push(performance.now());
        map.on('render', frame);
        await new Promise(resolve => setTimeout(resolve, 8000));
        const seconds = (performance.now() - start) / 1000;
        map.off('render', frame); proto.readPixels = read;
        const intervals = times.slice(1).map((t, i) => t - times[i]).sort((a, b) => a - b);
        return { frames: times.length, seconds, fps: times.length / seconds,
          p95FrameMs: intervals[Math.ceil(.95 * intervals.length) - 1] ?? null, pixelReads: reads };
      });
      console.log(JSON.stringify({ trial, ...result }));
    } finally { await context.close(); }
  }
} finally { await browser?.close(); server.close(); }
