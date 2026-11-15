// Generates the social card + app icons into src/assets (committed, so the
// main build has no Playwright dependency). Run: node build/og.mjs
import { chromium } from 'playwright';
import path from 'node:path';

const ASSETS = path.resolve(import.meta.dirname, '..', 'src', 'assets');

const knot = `<svg viewBox="0 0 400 400" style="width:100%;height:100%;overflow:visible">
  <path fill="none" stroke="#e8b87d" stroke-width="14" stroke-linecap="round" d="M60 320 C60 215 150 190 205 240 C262 292 345 268 345 185 C345 100 258 78 200 130 C142 182 58 158 58 70"/>
  <path fill="none" stroke="#8fd4c7" stroke-width="9" stroke-linecap="round" opacity=".8" d="M70 350 C150 320 250 362 335 318"/>
  <path fill="none" stroke="#f08f8f" stroke-width="7" stroke-linecap="round" opacity=".7" d="M95 55 C175 98 240 38 330 68"/>
  <circle cx="58" cy="70" r="12" fill="#e8b87d"/><circle cx="60" cy="320" r="12" fill="#e8b87d"/>
</svg>`;

const page1200 = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@500;650&display=swap">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#120f1a;color:#f4f0ea;font-family:Inter,sans-serif;display:flex;align-items:center;padding:72px;gap:40px;position:relative;overflow:hidden}
  .glow{position:absolute;inset:-30%;background:
    radial-gradient(40% 44% at 20% 30%, rgba(232,184,125,.26), transparent 70%),
    radial-gradient(36% 42% at 84% 20%, rgba(185,166,255,.2), transparent 72%),
    radial-gradient(42% 40% at 65% 78%, rgba(143,212,199,.16), transparent 72%)}
  .l{position:relative;flex:1.15}
  .r{position:relative;flex:.85;height:400px}
  .eyebrow{font-size:19px;font-weight:650;letter-spacing:.15em;text-transform:uppercase;color:#e8b87d;margin-bottom:22px}
  h1{font-family:Fraunces,serif;font-weight:600;font-size:76px;line-height:1.04;letter-spacing:-.025em}
  em{font-style:normal;color:#e8b87d}
  p{margin-top:26px;font-size:25px;line-height:1.45;color:#b6adc2;max-width:22ch}
  .brand{position:absolute;left:72px;bottom:52px;display:flex;align-items:center;gap:12px;font-family:Fraunces,serif;font-size:26px;color:#f4f0ea}
  .dot{width:11px;height:11px;border-radius:50%;background:#e8b87d}
</style></head><body>
  <div class="glow"></div>
  <div class="l">
    <div class="eyebrow">Psychology, Simplified</div>
    <h1>Your brain isn't broken.<br>It's just <em>knotted</em>.</h1>
    <p>Overthinking, attachment, breakups, ADHD — decoded.</p>
  </div>
  <div class="r">${knot}</div>
  <div class="brand"><span class="dot"></span>knotalone.net</div>
</body></html>`;

const iconPage = (size) => `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0}
  body{width:${size}px;height:${size}px;background:#120f1a;display:grid;place-items:center}
  svg{width:${Math.round(size * 0.62)}px;height:${Math.round(size * 0.62)}px}
</style></head><body>
<svg viewBox="0 0 32 32" fill="none" stroke="#e8b87d" stroke-width="2.6" stroke-linecap="round">
  <path d="M8 25c0-7 6-7 6-11a4 4 0 1 0-8 0c0 6 8 6 8 12"/>
  <path d="M24 7c0 7-6 7-6 11a4 4 0 1 0 8 0c0-6-8-6-8-12" opacity=".65"/>
</svg></body></html>`;

const browser = await chromium.launch();

async function shoot(html, w, h, file, scale = 1) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ASSETS, file) });
  await ctx.close();
  console.log('✶', file);
}

await shoot(page1200, 1200, 630, 'og-default.png');
await shoot(iconPage(512), 512, 512, 'icon-512.png');
await shoot(iconPage(192), 192, 192, 'icon-192.png');
await shoot(iconPage(180), 180, 180, 'icon-180.png');

await browser.close();
