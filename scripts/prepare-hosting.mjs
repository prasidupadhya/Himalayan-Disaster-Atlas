import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export function prepareHosting() {
  // .gz artifacts are hashed compressed payloads, not HTTP content encodings.
  // Next static hydration uses inline scripts; no eval, remote scripts or API origins.
  writeFileSync(fileURLToPath(new URL('../apps/web/out/_headers', import.meta.url)), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'
/data/*
  Cache-Control: public, max-age=31536000, immutable, no-transform
/data/:dataset/:version/*.gz
  Content-Type: application/gzip
  ! Content-Encoding
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
/vendor/*
  Cache-Control: public, max-age=31536000, immutable
/legal/*
  Cache-Control: no-cache
`);
}
