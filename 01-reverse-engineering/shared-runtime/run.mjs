#!/usr/bin/env node
// REA M1: isolate one Chromium profile per run; inspect and analyze via real REA CLI.
import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const urlText = process.argv[2];
const outputDir = process.argv[3] || '/output';
const fixture = process.env.REA_ALLOW_LOOPBACK_FIXTURE === '1';
const version = process.argv.includes('--versions');
const port = 19222;
let browser;
let profile;
function run(command, args, timeout = 60000) {
  const r = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 12 * 1024 * 1024, timeout });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(command + ' ' + args[0] + ' failed (' + r.status + '): ' + r.stderr.slice(0, 400));
  return r.stdout;
}
function parseJSON(s, kind) {
  try { return JSON.parse(s); } catch { throw new Error(kind + ' did not return valid JSON'); }
}
async function main() {
  if (version) {
    console.log(JSON.stringify({ node: process.version, chromium: run('chromium', ['--version']).trim(),
      rea: run('rea', ['--version']).trim() }, null, 2));
    return;
  }
  if (!urlText) throw new Error('Usage: run.mjs https://public.example/page /output [or --versions]');
  const url = new URL(urlText);
  const local = url.protocol === 'http:' && ['127.0.0.1','localhost'].includes(url.hostname);
  if (!(url.protocol === 'https:' || (fixture && local))) throw new Error('Only public HTTPS URLs or explicitly opted-in loopback fixtures are allowed');
  if (url.username || url.password || url.hash) throw new Error('URL credentials and fragments are prohibited');
  if (url.hostname === 'localhost' && !fixture) throw new Error('Fixture requires REA_ALLOW_LOOPBACK_FIXTURE=1');
  profile = await mkdtemp(join(tmpdir(), 'rea-profile-'));
  await mkdir(outputDir, { recursive: true });
  const args = ['--headless', '--no-first-run', '--no-default-browser-check',
    '--disable-background-networking', '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=' + port, '--user-data-dir=' + profile, url.href];
  browser = spawn('chromium', args, { stdio: 'ignore' });
  const endpoint = 'http://127.0.0.1:' + port;
  let targets = [];
  for (let i = 0; i < 80; i++) {
    if (browser.exitCode !== null) throw new Error('Chromium exited before CDP readiness');
    try {
      const response = await fetch(endpoint + '/json/list');
      if (response.ok) {
        targets = await response.json();
        if (targets.some(t => t.type === 'page' && t.url?.startsWith(url.origin))) break;
      }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  const target = targets.find(t => t.type === 'page' && t.url?.startsWith(url.origin));
  if (!target) throw new Error('CDP target for requested origin unavailable');
  const discovered = parseJSON(run('rea', ['list-browser-targets', endpoint, '--json']), 'target discovery');
  await writeFile(join(outputDir, 'targets.json'), JSON.stringify(discovered, null, 2));
  const observed = parseJSON(run('rea', ['inspect-web-page', endpoint, target.id, '--observation-ms', '1000', '--json']), 'page inspect');
  await writeFile(join(outputDir, 'inspect.json'), JSON.stringify(observed, null, 2));
  const bundle = parseJSON(run('rea', ['analyze-web-bundle', endpoint, target.id, '--json'], 120000), 'bundle analysis');
  await writeFile(join(outputDir, 'bundle.json'), JSON.stringify(bundle, null, 2));
  // The full REA artifacts may include sensitive page content. Never auto-publish.
  const summary = { url: url.origin + url.pathname, target: 'page', inspected: true,
    analyzed: true, evidenceFiles: ['targets.json','inspect.json','bundle.json'],
    classification: { DIRECT: 'REA raw evidence generated', INFERRED: 'not evaluated', UNKNOWN: 'site-specific conclusions not evaluated' },
    acceptance: 'PENDING_INDEPENDENT_EVIDENCE_REVIEW' };
  await writeFile(join(outputDir, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary));
}
try { await main(); }
catch (error) { console.error('BLOCKED: ' + error.message); process.exitCode = 1; }
finally {
  if (browser) {
    browser.kill('SIGTERM');
    await new Promise(resolve => { if (browser.exitCode !== null) return resolve();
      browser.once('exit', resolve); setTimeout(resolve, 3000); });
    if (browser.exitCode === null) browser.kill('SIGKILL');
  }
  if (profile) await rm(profile, { recursive: true, force: true });
}
