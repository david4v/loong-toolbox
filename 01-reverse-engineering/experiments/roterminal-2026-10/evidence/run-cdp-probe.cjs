// Run from an isolated work directory with Node 24.22.1.
// npm install --no-audit --no-fund puppeteer-core@25.16.0 ws@8.22.1 https-proxy-agent@9.1.0
// Dependency versions match cdp-resume-2026-11-06.json.
// Credentials stay in memory; outputs contain no account/session/socket identifiers.
const fs = require('node:fs');
const https = require('node:https');
const crypto = require('node:crypto');
const { HttpsProxyAgent } = require('https-proxy-agent');
const WebSocket = require('ws');
const puppeteer = require('puppeteer-core');
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!token || !account || !process.env.HTTPS_PROXY) {
  throw new Error('Missing configured Cloudflare variables or inherited HTTPS_PROXY');
}
const base = `https://api.cloudflare.com/client/v4/accounts/${account}/browser-run/devtools/browser`;
const headers = { Authorization: `Bearer ${token}` };
const agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
function request(url, method) {
  return new Promise((resolve, reject) => {
    const r = https.request(url, { method, headers, agent, timeout: 20000 }, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: body ? JSON.parse(body) : null }); }
        catch { reject(new Error(`Non-JSON response, HTTP ${res.statusCode}`)); }
      });
    });
    r.on('timeout', () => r.destroy(new Error('HTTP timeout')));
    r.on('error', reject);
    r.end();
  });
}
(async () => {
  let session, socket, browser;
  const result = { started: new Date().toISOString(), network: [] };
  let failed = false;
  try {
    const acquired = await request(`${base}?keep_alive=60000`, 'POST');
    result.acquire_http = acquired.status;
    session = acquired.data?.sessionId;
    if (!session) throw new Error(`Acquire failed, HTTP ${acquired.status}`);
    result.session_hash = crypto.createHash('sha256').update(session).digest('hex').slice(0, 12);
    socket = new WebSocket(acquired.data.webSocketDebuggerUrl, {
      headers, agent, handshakeTimeout: 20000,
    });
    await new Promise((resolve, reject) => {
      socket.once('open', resolve);
      socket.once('error', reject);
    });
    // Puppeteer's documented in-process ConnectionTransport. No local listener.
    const transport = { send: text => socket.send(text), close: () => socket.close() };
    socket.on('message', data => transport.onmessage?.(data.toString()));
    socket.on('close', () => transport.onclose?.());
    browser = await puppeteer.connect({ transport, protocolTimeout: 20000 });
    const page = (await browser.pages())[0] || await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    page.on('response', response => {
      const url = new URL(response.url());
      if (url.hostname === 'example.com') result.network.push({
        path: url.pathname, method: response.request().method(), status: response.status(),
      });
    });
    await page.goto('https://example.com', { waitUntil: 'load', timeout: 30000 });
    result.title = await page.title();
    result.readyState = await page.evaluate(() => document.readyState);
    await page.screenshot({ path: 'example.png' });
  } catch (error) {
    failed = true;
    result.error = String(error).replaceAll(token, '[TOKEN]').replaceAll(account, '[ACCOUNT]');
    if (session) result.error = result.error.replaceAll(session, '[SESSION]');
  } finally {
    try {
      if (browser) await browser.close();
      else if (socket) socket.close();
    } catch { result.browser_close = 'failed; HTTP cleanup attempted below'; }
    if (session) {
      try {
        const closed = await request(`${base}/${session}`, 'DELETE');
        result.cleanup = { http: closed.status, status: closed.data?.status };
        if (closed.status !== 200 || closed.data?.status !== 'closed') failed = true;
      } catch { failed = true; result.cleanup = 'HTTP cleanup failed; 60s keep-alive cap applies'; }
    }
    result.finished = new Date().toISOString();
    fs.writeFileSync('cdp-probe-summary.json', JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
    if (failed) process.exitCode = 1;
  }
})();
