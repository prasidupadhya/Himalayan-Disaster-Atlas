import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { CONTENT_SECURITY_POLICY } from '../../scripts/prepare-hosting.mjs';

describe('hosting headers', () => {
  it('serves the same security policy on Vercel previews as on Cloudflare', () => {
    for (const file of ['vercel.json', 'apps/web/vercel.json']) {
      const config = JSON.parse(readFileSync(file, 'utf8')) as { headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }> };
      const all = config.headers.find(h => h.source === '/(.*)')!.headers;
      expect(all.find(h => h.key === 'Content-Security-Policy')!.value).toBe(CONTENT_SECURITY_POLICY);
      expect(config.headers.find(h => h.source === '/sw.js')!.headers[0].value).toContain('no-cache');
    }
  });
  it('lets MapLibre read local blob overlays but no other origin', () => {
    expect(CONTENT_SECURITY_POLICY).toContain("connect-src 'self' blob:;");
    expect(CONTENT_SECURITY_POLICY).not.toMatch(/https?:/);
  });
});
