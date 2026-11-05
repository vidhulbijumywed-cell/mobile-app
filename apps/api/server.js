import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { Failure } from './service.js';
export function createApi(service, { allowedOrigins = [] } = {}) {
  const attempts = new Map();
  const server = createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store');
    try {
      const origin = req.headers.origin;
      if (origin) {
        if (origin !== `http://${req.headers.host}` && !allowedOrigins.includes(origin)) throw new Failure(403, 'Origin not permitted');
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
        if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
      }
      // Local development guard. Production requires distributed rate limiting and a trusted proxy policy.
      const key = req.socket.remoteAddress; const now = Date.now();
      const rate = attempts.get(key) ?? { start: now, count: 0 };
      if (now - rate.start > 60000) { rate.start = now; rate.count = 0; }
      attempts.set(key, rate); if (++rate.count > 100) throw new Failure(429, 'Too many requests');
      for (const [ip, value] of attempts) if (now - value.start > 60000) attempts.delete(ip);
      let size = 0; const chunks = [];
      for await (const chunk of req) { size += chunk.length; if (size > 65536) throw new Failure(413, 'Request too large'); chunks.push(chunk); }
      let body = {}; try { if (size) body = JSON.parse(Buffer.concat(chunks).toString()); } catch { throw new Failure(400, 'Invalid JSON'); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Failure(400, 'Invalid body');
      const path = new URL(req.url, 'http://localhost').pathname;
      const assets = { '/coach': ['index.html', 'text/html; charset=utf-8'], '/coach/app.js': ['app.js', 'text/javascript; charset=utf-8'], '/coach/style.css': ['style.css', 'text/css; charset=utf-8'] };
      if (req.method === 'GET' && Object.hasOwn(assets, path)) {
        const [file, mime] = assets[path];
        res.setHeader('Content-Type', mime);
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
        res.end(await readFile(new URL('../coach/' + file, import.meta.url))); return;
      }
      let result;
      if (req.method === 'POST' && path === '/auth/redeem') result = await service.redeem(body);
      else if (req.method === 'POST' && path === '/auth/login') result = await service.login(body);
      else {
        const actor = await service.authenticate(req.headers.authorization?.match(/^Bearer (\S+)$/)?.[1]);
        if (req.method === 'GET' && path === '/me') result = actor;
        else if (req.method === 'GET' && path === '/directory') result = await service.directory(actor);
        else if (req.method === 'POST' && path === '/invitations') result = await service.invite(actor, body);
        else if (req.method === 'POST' && path === '/assignments') result = await service.assign(actor, body);
        else if (req.method === 'POST' && path === '/auth/logout') {
          const { hash } = await import('./service.js');
          await service.pool.query('DELETE FROM sessions WHERE token_hash=$1', [hash(req.headers.authorization.slice(7))]); result = { loggedOut: true };
        } else {
          const programmeMatch = path.match(/^\/clients\/([0-9a-f-]{36})\/programme$/i);
          if (programmeMatch && ['GET','POST'].includes(req.method)) {
            result = await service.programme(actor, programmeMatch[1], req.method === 'POST' ? body : undefined);
          } else {
          const match = path.match(/^\/clients\/([0-9a-f-]{36})\/assessment$/i);
          if (!match || !['GET', 'PUT'].includes(req.method)) throw new Failure(404, 'Not found');
          result = await service.assessment(actor, match[1], req.method === 'PUT' ? body.answers ?? null : undefined);
          }
        }
      }
      res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = e.status ?? (['22P02','23505','23503'].includes(e.code) ? 400 : 500);
      res.end(JSON.stringify({ error: e.status ? e.message : res.statusCode === 400 ? 'Invalid or conflicting record' : 'Internal error' }));
    }
  });
  server.requestTimeout = 15000; server.headersTimeout = 10000;
  return server;
}
