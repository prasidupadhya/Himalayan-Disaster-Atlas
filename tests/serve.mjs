// Serves site/ the way the static host does: folders resolve to index.html, unknown paths get 404.html.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = new URL('../site/', import.meta.url).pathname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.gz': 'application/gzip', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
export function serve(port = 4173) {
  return new Promise(resolve => {
    const server = createServer(async (req, res) => {
      let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
      if (path.endsWith('/')) path += 'index.html';
      let file = join(ROOT, path), status = 200;
      try { if ((await stat(file)).isDirectory()) { res.writeHead(301, { location: `${path}/` }); return res.end(); } } catch { file = join(ROOT, '404.html'); status = 404; }
      res.writeHead(status, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(await readFile(file));
    }).listen(port, () => resolve(server));
  });
}
if (import.meta.url === `file://${process.argv[1]}`) serve(+process.env.PORT || 4173).then(() => console.log('http://127.0.0.1:4173'));
