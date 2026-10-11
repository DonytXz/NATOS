import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist/proyecto/browser');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.svg': 'image/svg+xml' };
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path === '/') { res.writeHead(302, { Location: '/NATOS/' }); return res.end(); }
    if (!path.startsWith('/NATOS/')) { res.writeHead(404); return res.end('Not found'); }
    const file = resolve(root, path.slice('/NATOS/'.length) || 'index.html');
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); return res.end(); }
    let body; let type = types[extname(file)] || 'application/octet-stream'; let status = 200;
    try { if (!(await stat(file)).isFile()) throw new Error('Not a file'); body = await readFile(file); }
    catch {
      if (extname(file)) { res.writeHead(404); return res.end('Not found'); }
      body = await readFile(resolve(root, '404.html')).catch(() => readFile(resolve(root, 'index.html')));
      type = types['.html']; status = 404;
    }
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(body);
  } catch { res.writeHead(400); res.end('Invalid request'); }
}).listen(4301, '127.0.0.1', () => console.log('NATOS preview: http://127.0.0.1:4301/NATOS/'));
