const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ── Proxy target ──────────────────────────────────────────────────
// For web dev: proxies /api/* to avoid CORS.
// Change BACKEND_HOST/PORT to point to your local backend,
// OR set USE_RENDER=true to proxy directly to Render.
//
// If local backend is running:  USE_RENDER = false  (default)
// If only Render is available:  USE_RENDER = true
const USE_RENDER    = true;  // ← SET TO true SINCE LOCAL BACKEND MAY NOT BE RUNNING
const RENDER_URL = 'endurace.onrender.com';
const BACKEND_HOST  = '127.0.0.1';
const BACKEND_PORT  = 5000;

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.startsWith('/api/')) {

        if (USE_RENDER) {
          // ── Proxy to Render via HTTPS ─────────────────────────
          const https = require('https');
          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            const bodyBuffer = Buffer.concat(chunks);
            const headers = {
              'content-type':   req.headers['content-type'] || 'application/json',
              'authorization':  req.headers['authorization'] || '',
              'content-length': Buffer.byteLength(bodyBuffer).toString(),
              'host':           RENDER_URL,
              'accept':         'application/json',
            };

            const options = {
              hostname: RENDER_URL,
              port:     443,
              path:     req.url,
              method:   req.method,
              headers,
            };

            const proxy = https.request(options, (proxyRes) => {
              const responseHeaders = { ...proxyRes.headers };
              responseHeaders['Access-Control-Allow-Origin']      = req.headers.origin || '*';
              responseHeaders['Access-Control-Allow-Credentials'] = 'true';
              responseHeaders['Access-Control-Allow-Methods']     = 'GET,POST,PUT,DELETE,PATCH,OPTIONS';
              responseHeaders['Access-Control-Allow-Headers']     = 'Content-Type,Authorization';
              delete responseHeaders['content-encoding'];
              res.writeHead(proxyRes.statusCode, responseHeaders);
              proxyRes.pipe(res, { end: true });
            });

            proxy.on('error', (err) => {
              console.error('[Metro proxy → Render] Error:', err.message);
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, message: `Proxy error: ${err.message}` }));
            });

            if (bodyBuffer.length > 0) proxy.write(bodyBuffer);
            proxy.end();
          });

        } else {
          // ── Proxy to local backend via HTTP ───────────────────
          const http = require('http');
          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            const bodyBuffer = Buffer.concat(chunks);
            const headers    = { ...req.headers };
            headers['host']           = `${BACKEND_HOST}:${BACKEND_PORT}`;
            headers['content-length'] = Buffer.byteLength(bodyBuffer).toString();
            delete headers['transfer-encoding'];

            const options = {
              hostname: BACKEND_HOST,
              port:     BACKEND_PORT,
              path:     req.url,
              method:   req.method,
              headers,
            };

            const proxy = http.request(options, (proxyRes) => {
              const responseHeaders = { ...proxyRes.headers };
              responseHeaders['Access-Control-Allow-Origin']      = req.headers.origin || '*';
              responseHeaders['Access-Control-Allow-Credentials'] = 'true';
              responseHeaders['Access-Control-Allow-Methods']     = 'GET,POST,PUT,DELETE,PATCH,OPTIONS';
              responseHeaders['Access-Control-Allow-Headers']     = 'Content-Type,Authorization';
              delete responseHeaders['content-encoding'];
              res.writeHead(proxyRes.statusCode, responseHeaders);
              proxyRes.pipe(res, { end: true });
            });

            proxy.on('error', (err) => {
              console.error('[Metro proxy → local] Error:', err.message);
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, message: `Proxy error: ${err.message}` }));
            });

            if (bodyBuffer.length > 0) proxy.write(bodyBuffer);
            proxy.end();
          });
        }

        req.on('error', (err) => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: err.message }));
        });

        return;
      }
      middleware(req, res, next);
    };
  },
};

module.exports = config;