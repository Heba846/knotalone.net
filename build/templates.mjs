import { site } from './config.mjs';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const abs = (p = '/') => site.url.replace(/\/$/, '') + (p.startsWith('/') ? p : '/' + p);

/* ---------------- icons ---------------- */
export const icons = {
  knot: `<svg class="brand__mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M7 25c0-7 6-7 6-11a4 4 0 1 0-8 0c0 6 8 6 8 12"/><path d="M25 7c0 7-6 7-6 11a4 4 0 1 0 8 0c0-6-8-6-8-12" opacity=".6"/></svg>`,
  arrow: `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>`,
  chevron: `<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>`,
  download: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"/></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-5-6 5z"/></svg>`,
  sun: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>`,
  moon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>`,
  menu: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
};

/* ---------------- nav ---------------- */
export const NAV = [
  { href: '/articles/', label: 'Articles' },
  { href: '/workbooks/', label: 'Workbooks' },
  { href: '/games/', label: 'Mind Games' },
  { href: '/novels/', label: 'Novels' },
  { href: '/kids/', label: 'Kids' },
  { href: '/readers-line/', label: "Readers' Line" },
];

/* ---------------- head / seo ---------------- */
/* Keep titles and descriptions inside what search results actually show:
   long titles get the " | Knot Alone" suffix dropped, long descriptions are
   trimmed at a word boundary. The <h1> on the page is never touched. */
const SUFFIX = ' | Knot Alone';
export function clampTitle(t, max = 62) {
  if (t.length <= max) return t;
  if (t.endsWith(SUFFIX)) {
    const bare = t.slice(0, -SUFFIX.length);
    if (bare.length <= max) return bare;
    t = bare;
  }
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const i = cut.lastIndexOf(' ');
  return (i > max * 0.6 ? cut.slice(0, i) : cut).replace(/[\s—–,:;.]+$/, '') + '…';
}
export function clampDesc(d, max = 158) {
  d = String(d).replace(/\s+/g, ' ').trim();
  if (d.length <= max) return d;
  const cut = d.slice(0, max - 1);
  const i = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(' '));
  return cut.slice(0, i > max * 0.55 ? i : cut.length).replace(/[\s—–,:;]+$/, '') + '…';
}

function metaBlock({ title, description, path, image, type = 'website', published, modified, noindex }) {
  const url = abs(path);
  const img = abs(image || '/assets/og-default.png');
  title = clampTitle(title);
  description = clampDesc(description);
  return `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  ${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'}
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${img}">
  ${published ? `<meta property="article:published_time" content="${published}">` : ''}
  ${modified ? `<meta property="article:modified_time" content="${modified}">` : ''}
  ${site.gscVerification ? `<meta name="google-site-verification" content="${esc(site.gscVerification)}">` : ''}
  ${site.bingVerification ? `<meta name="msvalidate.01" content="${esc(site.bingVerification)}">` : ''}`;
}

/* ---------------- structured data ---------------- */
export const ORG_ID = abs('/#organization');
export const SITE_ID = abs('/#website');

export function baseGraph() {
  return [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: site.name,
      alternateName: 'Knot Alone | Psychology, Simplified',
      url: abs('/'),
      logo: { '@type': 'ImageObject', url: abs('/assets/logo.svg'), width: 512, height: 512 },
      description: site.description,
      sameAs: Object.values(site.social)
        .filter(Boolean)
        .concat(site.youtube ? [site.youtube] : [])
        .concat(site.gumroad ? [site.gumroad] : []),
    },
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      url: abs('/'),
      name: site.name,
      description: site.description,
      publisher: { '@id': ORG_ID },
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: abs('/articles/?q={search_term_string}') },
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}

export function breadcrumbGraph(trail) {
  return {
    '@type': 'BreadcrumbList',
    '@id': abs(trail[trail.length - 1].href) + '#breadcrumb',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.label,
      item: abs(t.href),
    })),
  };
}

export function faqGraph(faqs, path) {
  if (!faqs || !faqs.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': abs(path) + '#faq',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
    })),
  };
}

/* ---------------- components ---------------- */
export function breadcrumbs(trail) {
  if (!trail || trail.length < 2) return '';
  const items = trail
    .map((t, i) =>
      i === trail.length - 1
        ? `<span aria-current="page">${esc(t.label)}</span>`
        : `<a href="${t.href}">${esc(t.label)}</a>${icons.chevron}`
    )
    .join('');
  return `<nav class="crumbs wrap" aria-label="Breadcrumb">${items}</nav>`;
}

export function faqSection(faqs, heading = 'Quick answers') {
  if (!faqs || !faqs.length) return '';
  return `
  <section class="section section--tight" id="faq">
    <div class="wrap narrow stack-lg">
      <h2>${esc(heading)}</h2>
      <div class="faq">
        ${faqs
          .map(
            (f) => `<details class="qa"><summary>${esc(f.q)}</summary><div class="qa__body">${f.a}</div></details>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

export function saveButton(id, label = 'Save') {
  return `<button class="save-btn" data-save="${esc(id)}" aria-pressed="false">${icons.bookmark}<span>${esc(label)}</span></button>`;
}

export function newsletterCard({ compact = false } = {}) {
  return `
  <div class="line-card stack">
    <span class="eyebrow">Readers' Line</span>
    <h2 style="max-width:22ch">One email. One knot, loosened.</h2>
    <p class="lede" style="max-width:52ch">Every week: one behaviour explained in plain language, one small thing to try, and whatever we just made free. No lectures, no diagnosing, no 40-email funnel.</p>
    <form class="stack" action="/readers-line/?subscribed=1" method="get" data-newsletter>
      <div class="form-row">
        <div class="field">
          <label for="nl-email${compact ? '-c' : ''}">Your email</label>
          <input id="nl-email${compact ? '-c' : ''}" name="email" type="email" required autocomplete="email" placeholder="you@email.com">
        </div>
        <button class="btn" type="submit" style="align-self:end">Join the line ${icons.arrow}</button>
      </div>
      <p class="dim">Free. Unsubscribe in one click. We never sell your email.</p>
    </form>
  </div>`;
}

/* ---------------- analytics ----------------
   Nothing renders unless an id is set in build/config.mjs. GA4 is loaded
   with ad features and ad personalisation off; Plausible is cookieless.
   Both are skipped for visitors who send Do Not Track.                   */
function analyticsTags() {
  const out = [];
  if (site.plausible) {
    out.push(
      `<script defer data-domain="${esc(site.plausible)}" src="https://plausible.io/js/script.outbound-links.js"></script>`
    );
  }
  if (site.ga4Id) {
    out.push(`<script>
    (function(){
      if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
      var s=document.createElement('script');
      s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${esc(site.ga4Id)}';
      document.head.appendChild(s);
      window.dataLayer=window.dataLayer||[];
      function gtag(){dataLayer.push(arguments)}
      window.gtag=gtag;
      gtag('js', new Date());
      gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
      gtag('config','${esc(site.ga4Id)}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});
    })();
    </script>`);
  }
  return out.join('\n  ');
}

/* ---------------- layout ---------------- */
export function layout({
  title,
  description,
  path,
  body,
  graph = [],
  image,
  type,
  published,
  modified,
  noindex,
  bodyClass = '',
  progress = false,
  pageScript = '',
}) {
  const nav = NAV.map(
    (n) =>
      `<a href="${n.href}"${path === n.href || (path.startsWith(n.href) && n.href !== '/') ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
  ).join('');

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [...baseGraph(), ...graph.filter(Boolean)],
  };

  return `<!doctype html>
<html lang="en" class="grain">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#120f1a" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#fbf7f2" media="(prefers-color-scheme: light)">
${metaBlock({ title, description, path, image, type, published, modified, noindex })}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/icon-180.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="${esc(site.name)} — Articles" href="/rss.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Inter:wght@400..700&display=swap">
  <link rel="stylesheet" href="/assets/styles.css">
  <script>
    (function(){try{var t=localStorage.getItem('ka-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}})();
  </script>
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
  ${analyticsTags()}
</head>
<body class="${bodyClass}">
  <a class="skip" href="#main">Skip to content</a>
  ${progress ? '<div class="progress" aria-hidden="true"><div class="progress__bar" data-progress></div></div>' : ''}
  <header class="site-head" data-head>
    <div class="wrap site-head__inner">
      <a class="brand" href="/" aria-label="${esc(site.name)} — home">${icons.knot}<span>Knot&nbsp;Alone</span></a>
      <button class="icon-btn nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="site-nav" aria-label="Menu">${icons.menu}</button>
      <nav class="nav" id="site-nav" data-nav aria-label="Main">${nav}</nav>
      <button class="icon-btn" data-theme-toggle aria-label="Switch theme" title="Switch theme"><span data-theme-icon>${icons.moon}</span></button>
    </div>
  </header>
  <main id="main">
${body}
  </main>
  <footer class="site-foot">
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <a class="brand" href="/">${icons.knot}<span>Knot Alone</span></a>
          <p class="dim" style="margin-top:.7rem;max-width:30ch">Psychology, simplified. Your brain isn't broken — you're knot alone.</p>
        </div>
        <div>
          <h4>Understand</h4>
          <ul>
            <li><a href="/articles/">Articles</a></li>
            <li><a href="/videos/">Videos</a></li>
            <li><a href="/topics/overthinking/">Overthinking</a></li>
            <li><a href="/topics/attachment/">Attachment</a></li>
            <li><a href="/topics/breakups/">Breakups</a></li>
            <li><a href="/topics/adhd/">ADHD</a></li>
          </ul>
        </div>
        <div>
          <h4>Use</h4>
          <ul>
            <li><a href="/workbooks/">Workbooks</a></li>
            <li><a href="/free/">Free printables</a></li>
            <li><a href="/games/">Mind games</a></li>
            <li><a href="/saved/">Your saved knots</a></li>
            ${site.gumroad ? `<li><a href="${site.gumroad}" target="_blank" rel="noopener">Gumroad shop</a></li>` : ''}
          </ul>
        </div>
        <div>
          <h4>Read</h4>
          <ul>
            <li><a href="/novels/">Novels</a></li>
            <li><a href="/kids/">Kids books</a></li>
            <li><a href="/readers-line/">Readers' Line</a></li>
          </ul>
        </div>
        <div>
          <h4>Elsewhere</h4>
          <ul>
            ${Object.entries(site.social)
              .filter(([, v]) => v)
              .map(([k, v]) => `<li><a href="${v}" target="_blank" rel="noopener me">${esc(k)}</a></li>`)
              .join('')}
            ${site.youtube ? `<li><a href="${site.youtube}" target="_blank" rel="noopener me">YouTube</a></li>` : ''}
            <li><a href="/about/">About</a></li>
            <li><a href="/contact/">Contact</a></li>
          </ul>
        </div>
      </div>
      <div class="foot-bottom">
        <p>© ${new Date().getFullYear()} ${esc(site.name)}. Educational content — not therapy, diagnosis or medical advice.</p>
        <p class="row" style="gap:1rem"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/rss.xml">RSS</a></p>
      </div>
    </div>
  </footer>
  <script src="/assets/main.js" defer></script>
  ${pageScript}
</body>
</html>`;
}
