const corsAnywhere = require('cors-anywhere');
const express = require('express');
const apicache = require('apicache');
const expressHttpProxy = require('express-http-proxy');
const CORS_PROXY_PORT = 5000;

// Create CORS Anywhere server
corsAnywhere.createServer({}).listen(CORS_PROXY_PORT, () => {
  console.log(
    `Internal CORS Anywhere server started at port ${CORS_PROXY_PORT}`
  );
});

// Create express Cache server
let app = express();
// Register cache middleware for GET and OPTIONS verbs
app.get('/', (req, res) => {
    res.send(`
    <body style='margin: 0'>
    <div style='height: 100vh; width: 100%; background-color: darkgrey; display: flex; justify-content: center; align-items: center; flex-direction: column'>
    <p style='font-size: 1.8rem;'>I tried explaining to my girlfriend what the effects of network packet loss were.</p>
    <p style='font-size: 1.5rem'><em>But I just couldn't get the message across.</em></p>
    </div>
    </body>
    `)
})
app.get('/*', cacheMiddleware());
app.options('/*', cacheMiddleware());
// Proxy to CORS server when request misses cache
app.use(expressHttpProxy(`localhost:${CORS_PROXY_PORT}`));
const APP_PORT = process.env.PORT || 8080;
app.listen(APP_PORT, () => {
  console.log(`External CORS cache server started at port ${APP_PORT}`);
});

function cacheMiddleware() {
  const cacheOptions = {
    statusCodes: { include: [200] },
    defaultDuration: 60000,
    appendKey: (req, res) => req.method
  };
  let cacheMiddleware = apicache.options(cacheOptions).middleware();
  return cacheMiddleware;
}