import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../site/', import.meta.url)));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.woff':'font/woff','.txt':'text/plain; charset=utf-8'};
export function makeServer() {
  return createServer(async (request, response) => {
    if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const requestedPath = resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
      if (!requestedPath.startsWith(root + sep) && requestedPath !== root) { response.writeHead(403); response.end('Forbidden'); return; }
      const path = await realpath(requestedPath);
      if (!path.startsWith(root + sep)) { response.writeHead(403); response.end('Forbidden'); return; }
      const data = await readFile(path);
      response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Content-Length': data.length, 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : data);
    } catch (error) {
      response.writeHead(error instanceof URIError ? 400 : 404);
      response.end(error instanceof URIError ? 'Bad request' : 'Not found');
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  makeServer().listen(port, '0.0.0.0', () => console.log(`Figbridge is running on port ${port}.`));
}
