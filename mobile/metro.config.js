const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.startsWith('/api/')) {
        const http = require('http');

        const BACKEND_HOST = '127.0.0.1';
        const BACKEND_PORT = 5000;

        // ── Collect the full request body first ───────────────────
        // Then forward everything in one shot so Express receives
        // a proper Content-Length and can parse the JSON body.
        const chunks = [];

        req.on('data', (chunk) => chunks.push(chunk));

        req.on('end', () => {
          const bodyBuffer = Buffer.concat(chunks);

          const headers = {
            ...req.headers,
            host:             `${BACKEND_HOST}:${BACKEND_PORT}`,
            'content-length': Buffer.byteLength(bodyBuffer).toString(),
          };

          // Remove transfer-encoding: chunked so backend gets plain body
          delete headers['transfer-encoding'];

          const options = {
            hostname: BACKEND_HOST,
            port:     BACKEND_PORT,
            path:     req.url,
            method:   req.method,
            headers,
          };

          const proxy = http.request(options, (proxyRes) => {
            const responseHeaders = {
              ...proxyRes.headers,
              'Access-Control-Allow-Origin':      req.headers.origin || '*',
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Methods':     'GET,POST,PUT,DELETE,PATCH,OPTIONS',
              'Access-Control-Allow-Headers':     'Content-Type,Authorization',
            };

            // Remove duplicate content-encoding to avoid decompress errors
            delete responseHeaders['content-encoding'];

            res.writeHead(proxyRes.statusCode, responseHeaders);
            proxyRes.pipe(res, { end: true });
          });

          proxy.on('error', (err) => {
            console.error('[Metro proxy] Error:', err.message);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              message: `Proxy error: ${err.message}`,
            }));
          });

          // Write the buffered body and end the proxy request
          if (bodyBuffer.length > 0) {
            proxy.write(bodyBuffer);
          }
          proxy.end();
        });

        req.on('error', (err) => {
          console.error('[Metro proxy] Request error:', err.message);
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