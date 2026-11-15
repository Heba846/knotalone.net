// Visual check + console errors. Usage: node build/shoot.mjs [outdir]
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT = process.argv[2] || '/tmp/claude-0/-home-user-knotalone-net/a416ca2f-e296-5d6a-b72d-cb98aa4f7c83/scratchpad/shots';
fs.mkdirSync(OUT, { recursive: true });

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(DIST, p);
  if (!path.extname(file)) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { file = path.join(DIST, '404.html'); res.statusCode = 404; }
  if (!fs.existsSync(file)) { res.statusCode = 404; return res.end('nope'); }
  res.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

await new Promise((r) => server.listen(4173, r));
const base = 'http://localhost:4173';

const browser = await chromium.launch();
const problems = [];

const shots = [
  ['home', '/', 1440, 1200],
  ['home-mobile', '/', 390, 1400],
  ['article', '/articles/how-to-stop-overthinking-at-night/', 1440, 1100],
  ['articles-index', '/articles/', 1440, 1000],
  ['game', '/games/thought-traps/', 1440, 1000],
  ['workbook', '/workbooks/you-dont-need-the-text-back/', 1440, 1100],
  ['kids', '/kids/', 1440, 1000],
  ['novel', '/novels/marry-to-don/', 1440, 1000],
  ['free', '/free/', 1440, 900],
  ['light', '/', 1440, 1100],
  ['videos', '/videos/', 1440, 1000],
];

for (const [name, url, w, h] of shots) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, colorScheme: name === 'light' ? 'light' : 'dark' });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') problems.push(`${url} console: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`${url} pageerror: ${e.message}`));
  const resp = await page.goto(base + url, { waitUntil: 'networkidle' });
  if (!resp || resp.status() >= 400) problems.push(`${url} status ${resp?.status()}`);
  await page.waitForTimeout(1200);
  // scroll through to trigger reveals
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: name.includes('mobile') ? false : false });
  await page.screenshot({ path: path.join(OUT, `${name}-full.png`), fullPage: true });
  await ctx.close();
}

// interaction smoke test
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', (e) => problems.push(`interaction pageerror: ${e.message}`));
await page.goto(base + '/games/thought-traps/', { waitUntil: 'networkidle' });
await page.click('[data-quiz] button[data-opt="0"]');
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(OUT, 'quiz-feedback.png') });
if (!(await page.locator('[data-next]').count())) problems.push('quiz: no next button after answering');
await page.goto(base + '/games/switch-cost/', { waitUntil: 'networkidle' });
await page.click('[data-sw-start]');
await page.waitForTimeout(300);
if (!(await page.locator('[data-ans]').count())) problems.push('switch-cost: no answer buttons after start');
await page.screenshot({ path: path.join(OUT, 'switch.png') });
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.click('[data-untangle] button[data-loop]');
await page.waitForTimeout(400);
if (await page.locator('[data-untangle-out]').getAttribute('hidden') !== null) problems.push('untangler did not open');
await page.screenshot({ path: path.join(OUT, 'untangler.png') });
await ctx.close();

await browser.close();
server.close();
console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'no console/page errors');
console.log('shots →', OUT);
