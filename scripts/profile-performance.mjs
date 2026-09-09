// Repeatable production-browser profile. Start a static server for apps/web/out first.
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import os from 'node:os';
const base = process.argv[2] ?? 'http://127.0.0.1:3000';
const output = process.argv[3] ?? '/tmp/atlas-performance.json';
const browser = await chromium.launch({ args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const results = [];
try {
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const session = await context.newCDPSession(page); await session.send('Performance.enable');
    await page.addInitScript(() => {
      performance.setResourceTimingBufferSize(20000);
      window.__profileLongTasks = [];
      new PerformanceObserver(list => window.__profileLongTasks.push(...list.getEntries().map(e => e.duration))).observe({ type: 'longtask', buffered: true });
    });
    for (const cache of ['cold', 'warm']) {
      await page.goto(`${base}/atlas/`);
      await page.locator('[data-map-ready="true"]').waitFor({ timeout: 60000 });
      const ready = await page.evaluate(() => performance.now());
      let settled = true;
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { settled = false; });
      const start = await page.evaluate(() => performance.now());
      await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await page.getByRole('button', { name: 'Reset view', exact: true }).click();
      const interaction = await page.evaluate(() => performance.now()) - start;
      const sampleFrames = () => page.evaluate(() => new Promise(resolve => {
        const gaps = []; let previous = performance.now();
        function frame(now) { gaps.push(now - previous); previous = now; if (gaps.length < 45) requestAnimationFrame(frame); else resolve(gaps); }
        requestAnimationFrame(frame);
      }));
      const frames2d = await sampleFrames();
      await page.getByLabel('3D terrain', { exact: true }).check();
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      const frames3d = await sampleFrames();
      const metrics = await session.send('Performance.getMetrics');
      const data = await page.evaluate(() => ({
        navigation: performance.getEntriesByType('navigation')[0].toJSON(),
        resources: performance.getEntriesByType('resource').map(e => ({ name: new URL(e.name).pathname, bytes: e.encodedBodySize, transfer: e.transferSize, duration: e.duration })),
        longTasks: window.__profileLongTasks,
      }));
      await page.getByLabel('3D terrain', { exact: true }).uncheck();
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await sampleFrames();
      const settledStart = await page.evaluate(() => performance.now());
      await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await page.getByRole('button', { name: 'Reset view', exact: true }).click();
      const settledInteraction = await page.evaluate(() => performance.now()) - settledStart;
      const percentile = a => [...a].sort((x, y) => x - y)[Math.floor(a.length * .95)] ?? 0;
      results.push({ viewport, cache, ready_ms: ready, network_settled: settled, controls_roundtrip_ms: interaction, settled_controls_roundtrip_ms: settledInteraction,
        frame_gap_p95_2d_ms: percentile(frames2d), frame_gap_p95_3d_ms: percentile(frames3d),
        heap_used_bytes: metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value,
        dom_content_loaded_ms: data.navigation.domContentLoadedEventEnd,
        resource_body_bytes: data.resources.reduce((n, r) => n + r.bytes, 0),
        network_transfer_bytes: data.resources.reduce((n, r) => n + r.transfer, 0),
        largest_long_task_ms: Math.max(0, ...data.longTasks), long_task_count: data.longTasks.length,
        resources: data.resources });
    }
    await context.close();
  }
} finally { await browser.close(); }
writeFileSync(output, JSON.stringify({ measured_at: new Date().toISOString(), hardware: { platform: os.platform(), arch: os.arch(), cpu: os.cpus()[0]?.model, memory: os.totalmem() }, renderer: 'Chromium SwiftShader, local static server; control roundtrip includes Playwright overhead; heap excludes GPU and worker processes', results }, null, 2));
console.log(`Profile written to ${output}`);
