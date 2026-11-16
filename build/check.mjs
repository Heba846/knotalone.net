// Pre-deploy sanity check: broken internal links, missing meta, duplicate
// titles/descriptions, oversized meta, missing JSON-LD. Run: npm run check
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '..', 'dist');
const problems = [];
const warnings = [];
const titles = new Map();
const descs = new Map();

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error('dist/ not built — run npm run build first');
  process.exit(1);
}

const files = walk(DIST);
const routes = new Set(
  files.map((f) => {
    const r = '/' + path.relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');
    return r;
  })
);
// every real file in dist is a valid target (assets, PDFs, feeds, …)
function walkAll(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkAll(p));
    else out.push(p);
  }
  return out;
}
for (const f of walkAll(DIST)) routes.add('/' + path.relative(DIST, f).replace(/\\/g, '/'));
for (const extra of ['/sitemap.xml', '/rss.xml', '/robots.txt', '/llms.txt', '/favicon.svg', '/manifest.webmanifest'])
  if (fs.existsSync(path.join(DIST, extra.slice(1)))) routes.add(extra);

for (const file of files) {
  const rel = '/' + path.relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');

  const decode = (s) =>
    s && s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1]);
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]);
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];

  if (!title) problems.push(`${rel} — no <title>`);
  if (!desc) problems.push(`${rel} — no meta description`);
  if (!canon) problems.push(`${rel} — no canonical`);
  if (!/application\/ld\+json/.test(html)) warnings.push(`${rel} — no JSON-LD`);
  if (title && title.length > 65) warnings.push(`${rel} — title ${title.length} chars (>65 may truncate)`);
  if (desc && (desc.length < 70 || desc.length > 165))
    warnings.push(`${rel} — description ${desc.length} chars (aim 120–160)`);
  if (!/<h1[ >]/.test(html)) warnings.push(`${rel} — no <h1>`);
  if ((html.match(/<h1[ >]/g) || []).length > 1) warnings.push(`${rel} — more than one <h1>`);

  const noindex = /content="noindex/.test(html);
  if (title && !noindex) {
    if (titles.has(title)) problems.push(`duplicate title: ${rel} and ${titles.get(title)}`);
    else titles.set(title, rel);
  }
  if (desc && !noindex) {
    if (descs.has(desc)) warnings.push(`duplicate description: ${rel} and ${descs.get(desc)}`);
    else descs.set(desc, rel);
  }

  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1];
    if (routes.has(href) || routes.has(href + '/') || routes.has(href.replace(/\/$/, ''))) continue;
    problems.push(`${rel} — broken internal link: ${href}`);
  }
  for (const m of html.matchAll(/src="(\/[^"?]*)"/g)) {
    if (!routes.has(m[1])) problems.push(`${rel} — missing asset: ${m[1]}`);
  }
  for (const m of html.matchAll(/<img (?![^>]*alt=)[^>]*>/g)) warnings.push(`${rel} — img without alt: ${m[0].slice(0, 60)}`);
}

// JSON-LD validity + the Product rule that cost us a Search Console error
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(m[1]); } catch (e) {
      problems.push(`${path.relative(DIST, file)} — invalid JSON-LD: ${e.message}`);
      continue;
    }
    const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    for (const n of nodes) {
      if (n && n['@type'] === 'Product' && !n.offers && !n.review && !n.aggregateRating) {
        problems.push(
          `${path.relative(DIST, file)} — Product schema without offers/review/aggregateRating ` +
            `(Google rejects it; use Book or add a real offer)`
        );
      }
      if (n && n.offers && n.offers.price === undefined && n.offers['@type'] === 'Offer') {
        warnings.push(`${path.relative(DIST, file)} — Offer with no price`);
      }
    }
  }
}

console.log(`checked ${files.length} pages`);
if (warnings.length) console.log('\n⚠ warnings:\n' + [...new Set(warnings)].map((w) => '  ' + w).join('\n'));
if (problems.length) {
  console.log('\n✗ problems:\n' + [...new Set(problems)].map((p) => '  ' + p).join('\n'));
  process.exit(1);
}
console.log('\n✓ no blocking problems');
