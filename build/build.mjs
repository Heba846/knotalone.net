import { readFile, readdir, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { site } from './config.mjs';
import { parseFrontmatter, renderMarkdown, stripHtml, readingTime } from './markdown.mjs';
import {
  layout, abs, icons, breadcrumbs, faqSection, saveButton, newsletterCard,
  breadcrumbGraph, faqGraph, ORG_ID, SITE_ID,
} from './templates.mjs';
import { topics, workbooks, freebies, games, novels, kidsBooks, homeFaqs } from '../content/data.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'dist');
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const topicOf = (slug) => topics.find((t) => t.slug === slug);
const pages = [];

async function emit(route, html, { priority = 0.6, changefreq = 'monthly', lastmod = site.updated, index = true } = {}) {
  const file = route.endsWith('.html') ? path.join(OUT, route) : path.join(OUT, route, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  if (index) pages.push({ route: route.endsWith('.html') ? '/' + route : route, priority, changefreq, lastmod });
}

/* ============================ shared blocks ============================ */

const knotArt = `
<svg class="knot-art" viewBox="0 0 400 400" role="img" aria-label="A tangled thread loosening into a single line">
  <g class="pulse">
    <path class="thread thread--main" d="M60 320 C60 215 150 190 205 240 C262 292 345 268 345 185 C345 100 258 78 200 130 C142 182 58 158 58 70"/>
    <path class="thread thread--calm" d="M70 350 C150 320 250 362 335 318"/>
    <path class="thread thread--ache" d="M95 55 C175 98 240 38 330 68"/>
    <circle cx="58" cy="70" r="7" fill="var(--accent)"/>
    <circle cx="60" cy="320" r="7" fill="var(--accent)"/>
  </g>
</svg>`;

function topicTile(t) {
  return `<a class="tile" href="/topics/${t.slug}/" style="--tile-tint:${t.tint}">
    <span class="chip" style="margin-bottom:.7rem">${esc(t.name)}</span>
    <p class="tile__q">${esc(t.question)}</p>
    <p class="tile__a">${esc(t.answer)}</p>
    <span class="tile__go">Read the mechanism ${icons.arrow}</span>
  </a>`;
}

function articleCard(a) {
  return `<article class="card" data-tags="${esc(a.tags.join('|'))}" data-index="${esc(a.title + ' ' + a.summary + ' ' + a.tags.join(' '))}">
    <div class="row" style="gap:.4rem">${a.tags.slice(0, 2).map((t) => `<span class="chip">${esc(topicOf(t)?.name || t)}</span>`).join('')}</div>
    <h3><a href="${a.url}">${esc(a.title)}</a></h3>
    <p class="muted" style="font-size:.95rem">${esc(a.summary)}</p>
    <div class="card__meta"><span>${a.readingTime} min read</span><span>·</span><span>${esc(a.dateLabel)}</span></div>
  </article>`;
}

function gameCard(g) {
  return `<article class="card" data-tags="${esc(g.topic)}" data-index="${esc(g.title + ' ' + g.tagline)}">
    <div class="row" style="gap:.4rem"><span class="chip chip--calm">${esc(g.kind)}</span><span class="chip">${g.minutes} min</span></div>
    <h3><a href="/games/${g.slug}/">${esc(g.title)}</a></h3>
    <p class="muted" style="font-size:.95rem">${esc(g.tagline)}</p>
    <div class="card__meta"><span class="tile__go" style="color:var(--accent)">Play ${icons.arrow}</span></div>
  </article>`;
}

function workbookCard(w) {
  const t = topicOf(w.topic);
  return `<article class="card" data-tags="${esc(w.topic)}" data-index="${esc(w.title + ' ' + w.sub)}">
    <div class="row" style="gap:.4rem"><span class="chip chip--accent">${esc(t?.name || '')}</span>${w.format ? `<span class="chip">${esc(w.format.split(' on ')[0])}</span>` : ''}</div>
    <h3><a href="/workbooks/${w.slug}/">${esc(w.title)}</a></h3>
    <p class="muted" style="font-size:.95rem">${esc(w.hook)}</p>
    <div class="card__meta"><span class="tile__go" style="color:var(--accent)">See inside ${icons.arrow}</span></div>
  </article>`;
}

function freebieRow(f) {
  const ready = Boolean(f.file);
  return `<div class="res">
    <span class="res__icon">${icons.download}</span>
    <div>
      <h3><a href="/free/${f.slug}/">${esc(f.title)}</a></h3>
      <p>${esc(f.desc)}</p>
    </div>
    ${ready
      ? `<a class="btn btn--sm" href="${f.file}" download>Download free</a>`
      : f.gumroad
        ? `<a class="btn btn--sm" href="${f.gumroad}" target="_blank" rel="noopener">Get it free</a>`
        : `<a class="btn btn--ghost btn--sm" href="/free/${f.slug}/">Get notified</a>`}
  </div>`;
}

function bookCover(title, by, tint = 'var(--rope)', cover = '') {
  if (cover) {
    return `<div class="book__cover book__cover--art">
      <img src="${cover}" alt="Cover of ${esc(title)} by ${esc(by)}" width="800" height="1200" loading="lazy" decoding="async">
    </div>`;
  }
  return `<div class="book__cover" style="--tile-tint:${tint}">
    <div><p class="t">${esc(title)}</p><p class="by">${esc(by)}</p></div>
  </div>`;
}

/* ---- video pairing ----------------------------------------------------
   An article gets its episode by adding `video:` to the frontmatter — a
   YouTube id or any YouTube URL. Nothing renders until it is set.        */
function videoId(v) {
  if (!v) return '';
  const m = String(v).trim().match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{6,})/);
  return m ? m[1] : String(v).trim();
}

function videoEmbed(a, { label = 'Watch the episode' } = {}) {
  const id = videoId(a.video);
  if (!id) return '';
  return `<div class="video" data-video="${esc(id)}" role="button" tabindex="0" aria-label="Play: ${esc(a.title)}">
    <img src="https://i.ytimg.com/vi/${esc(id)}/maxresdefault.jpg" alt="Video thumbnail: ${esc(a.title)}" loading="lazy" decoding="async" width="1280" height="720">
    <span class="video__play"><span><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span></span>
    <span class="video__label">${esc(label)}${a.videoDuration ? ` · ${esc(a.videoDuration)}` : ''}</span>
  </div>`;
}

function videoGraph(a) {
  const id = videoId(a.video);
  if (!id) return null;
  return {
    '@type': 'VideoObject',
    '@id': abs(a.url) + '#video',
    name: a.videoTitle || a.title,
    description: a.summary,
    thumbnailUrl: [`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`],
    uploadDate: a.videoDate || a.date,
    contentUrl: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
    isFamilyFriendly: true,
    ...(a.videoISO ? { duration: a.videoISO } : {}),
  };
}

function freeRelated(f) {
  const t = topicOf(f.topic);
  if (!t) return '';
  const game = games.find((g) => g.topic === t.slug);
  return `<div class="card card--feature">
    <span class="eyebrow">Where this came from</span>
    <h3>The thinking behind the page</h3>
    <p class="muted">This sheet is one page of a longer idea. If you want the mechanism underneath it, start on the <a href="/topics/${t.slug}/" style="color:var(--accent)">${esc(t.name.toLowerCase())} hub</a>${game ? `, or feel it happen in <a href="/games/${game.slug}/" style="color:var(--accent)">${esc(game.title)}</a>` : ''}.</p>
  </div>`;
}

function nextSteps(a) {
  const t = topicOf(a.tags[0]);
  if (!t) return '';
  const game = games.find((g) => g.topic === t.slug) || games[0];
  const sheet = freebies.find((f) => f.topic === t.slug) || freebies[0];
  const book = workbooks.find((w) => w.topic === t.slug);
  const cards = [
    game && {
      kind: 'Play it', title: game.title, desc: game.tagline,
      href: `/games/${game.slug}/`, cta: `${game.minutes} min, free`,
    },
    sheet && {
      kind: 'Print it', title: sheet.title, desc: sheet.desc,
      href: `/free/${sheet.slug}/`, cta: sheet.file ? 'Free PDF' : 'Coming soon',
    },
    book && {
      kind: 'Work through it', title: book.title, desc: book.sub,
      href: `/workbooks/${book.slug}/`, cta: `${book.pages} pages`,
    },
  ].filter(Boolean);

  return `
  <section class="section section--tight" style="background:var(--bg-soft);border-block:1px solid var(--line)">
    <div class="wrap stack-lg">
      <div class="stack" style="max-width:48ch">
        <span class="eyebrow">Don't just read it</span>
        <h2>What to do with this tonight</h2>
        <p class="muted">Understanding changes very little on its own. These three take between two minutes and a week, and they all work on the same mechanism this article describes.</p>
      </div>
      <div class="grid grid--3">
        ${cards.map((c) => `<article class="card">
          <span class="chip chip--calm">${esc(c.kind)}</span>
          <h3><a href="${c.href}">${esc(c.title)}</a></h3>
          <p class="muted" style="font-size:.95rem">${esc(c.desc)}</p>
          <div class="card__meta"><span>${esc(c.cta)}</span></div>
        </article>`).join('')}
      </div>
      <p><a class="btn btn--ghost btn--sm" href="/topics/${t.slug}/">Everything on ${esc(t.name.toLowerCase())} ${icons.arrow}</a></p>
    </div>
  </section>`;
}

const untangler = `
<section class="section untangle" id="untangle" data-untangle>
  <div class="wrap">
    <div class="untangle__box stack">
      <span class="eyebrow">The 2-minute untangler</span>
      <h2>Which loop is running right now?</h2>
      <p class="muted">Pick the one that is closest. You get the mechanism in plain language, and one thing to do in the next two minutes. No email, no sign-up.</p>
      <ul class="loop-list">
        ${[
          {
            label: 'This is rumination',
            name: 'The replay loop',
            what: 'Your brain reopens an unfinished conversation looking for an ending it never got. Each replay feels like progress because it feels like effort — but analysis is not the missing piece, and the loop can run for days on nothing.',
            try: 'Write the scene in one sentence. Then write the verdict you think it proves about you. Then one fact from this month that argues against the verdict. Three lines, on paper or in a note. Stop there.',
            links: [{ href: '/games/replay-room/', label: 'Open The Replay Room' }, { href: '/topics/overthinking/', label: 'More on overthinking' }],
            text: 'I keep replaying a conversation.',
          },
          {
            label: 'This is a reassurance loop',
            name: 'Checking whether they still want you',
            what: 'Reassurance soothes the feeling but never touches the prediction underneath, so the need returns in about twenty minutes. The checking is not weakness; it is a nervous system trying to convert uncertainty into safety by the fastest route available.',
            try: 'Swap one check for one statement: "I noticed you went quiet and it made me nervous." Statements get real answers. Tests get defensiveness.',
            links: [{ href: '/games/dinner-party/', label: 'Play The Dinner Party' }, { href: '/topics/attachment/', label: 'More on attachment' }],
            text: 'I need reassurance I already got.',
          },
          {
            label: 'This is withdrawal',
            name: 'Missing someone who is gone',
            what: 'The reward system that tracked one specific person is still firing, and the reward stopped arriving. That is why it has a physical texture — restlessness, checking, appetite gone strange. Grief and withdrawal are two different pains running at once.',
            try: 'Do not check their profile for the next hour, and write what you would have hoped to see there. You are usually hunting for a feeling, not information. Name the feeling instead.',
            links: [{ href: '/topics/breakups/', label: 'More on breakups' }, { href: '/free/do-i-text-them/', label: 'The "Do I Text Them" flowchart' }],
            text: 'I miss someone I should not text.',
          },
          {
            label: 'This is an open-loop pile-up',
            name: 'Too many tabs, no source',
            what: 'Unfinished tasks keep a small claim on attention until they are closed or written down. Twenty of them feels like noise with no cause — and then the tiredness gets read as laziness, which it is not.',
            try: 'Two minutes, one list, everything open in your head — no order, no priorities. Then circle exactly one to be tomorrow\'s anchor. The list is the relief; the circle is the plan.',
            links: [{ href: '/games/switch-cost/', label: 'Feel your switch cost' }, { href: '/topics/adhd/', label: 'More on ADHD' }],
            text: 'Everything is open and nothing is done.',
          },
          {
            label: 'This is a spiral about progress',
            name: 'Feeling like you are going backwards',
            what: 'Healing shows up as a shorter spiral, not as no spiral. The return of an old feeling is not the undoing of the work — but it is read that way, which adds a second layer of distress on top of the first.',
            try: 'Answer one question: how long did this feeling last the last time it visited, and how long has it lasted now? Measure the length, not the presence.',
            links: [{ href: '/topics/healing/', label: 'More on healing' }, { href: '/workbooks/closure-letters/', label: 'The Closure Letters' }],
            text: 'I thought I was past this.',
          },
        ]
          .map(
            (o) =>
              `<li><button data-loop aria-pressed="false" data-payload='${JSON.stringify(o).replace(/'/g, '&#39;')}'><span class="num">✶</span><span>${esc(o.text)}</span></button></li>`
          )
          .join('')}
      </ul>
      <div class="untangle__out" data-untangle-out hidden></div>
    </div>
  </div>
</section>`;

/* ============================ home ============================ */

async function buildHome(articles) {
  const latest = articles.slice(0, 3);
  const body = `
  <section class="hero">
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="wrap hero__grid">
      <div class="stack">
        <span class="eyebrow">Psychology, simplified</span>
        <h1>Your brain isn't broken.<br>It's just <em>knotted</em>.</h1>
        <p class="lede" style="max-width:48ch">Why we overthink, cling, shut down, or replay one sentence for three days — decoded in plain language, with the science underneath and something you can actually do tonight.</p>
        <div class="row">
          <a class="btn" href="/games/whats-knotting-you/">Find your knot — 2 min ${icons.arrow}</a>
          <a class="btn btn--ghost" href="/free/">Free printables</a>
        </div>
        <p class="dim">No diagnosing. No shaming. New videos every week.</p>
      </div>
      <div class="hero__art">${knotArt}</div>
    </div>
  </section>

  <div class="marquee" aria-hidden="true">
    <div class="marquee__track">
      ${Array(2)
        .fill(
          `<span>Why do I replay it 20 times?</span><span>Why does missing them feel physical?</span><span>Why can I do the hard thing but not the easy one?</span><span>Why do I need reassurance I already got?</span><span>Why does healing feel like going backwards?</span>`
        )
        .join('')}
    </div>
  </div>

  <section class="section">
    <div class="wrap stack-lg">
      <div class="between">
        <div class="stack" style="max-width:46ch">
          <span class="eyebrow">Start where it hurts</span>
          <h2>What's knotting you tonight?</h2>
        </div>
        <a class="btn btn--ghost btn--sm" href="/articles/">All articles ${icons.arrow}</a>
      </div>
      <div class="grid grid--3 reveal">${topics.map(topicTile).join('')}</div>
    </div>
  </section>

  ${untangler}

  <section class="section">
    <div class="wrap stack-lg">
      <div class="between">
        <div class="stack" style="max-width:52ch">
          <span class="eyebrow">Mind games</span>
          <h2>Learn it by playing it</h2>
          <p class="muted">Psychology sticks when you feel it happen, not when you read about it. Five short games — a thought-trap card game, a two-minute tool for replay loops, and a real task-switching experiment you can fail in public.</p>
        </div>
        <a class="btn btn--ghost btn--sm" href="/games/">All games ${icons.arrow}</a>
      </div>
      <div class="grid grid--3 reveal">${games.slice(0, 3).map(gameCard).join('')}</div>
    </div>
  </section>

  <section class="section" style="background:var(--bg-soft);border-block:1px solid var(--line)">
    <div class="wrap stack-lg">
      <div class="between">
        <div class="stack" style="max-width:46ch">
          <span class="eyebrow">Latest</span>
          <h2>Read the mechanism</h2>
        </div>
        <a class="btn btn--ghost btn--sm" href="/articles/">All articles ${icons.arrow}</a>
      </div>
      <div class="grid grid--3 reveal">${latest.map(articleCard).join('')}</div>
    </div>
  </section>

  <section class="section">
    <div class="wrap stack-lg">
      <div class="between">
        <div class="stack" style="max-width:50ch">
          <span class="eyebrow">Free, actually free</span>
          <h2>One-page tools you can print tonight</h2>
          <p class="muted">The knowledge is free. These are the pages people print and keep by the bed.</p>
        </div>
        <a class="btn btn--ghost btn--sm" href="/free/">All printables ${icons.arrow}</a>
      </div>
      <div class="grid reveal" style="gap:.8rem">${freebies.slice(0, 3).map(freebieRow).join('')}</div>
    </div>
  </section>

  <section class="section" style="background:var(--bg-soft);border-block:1px solid var(--line)">
    <div class="wrap stack-lg">
      <div class="between">
        <div class="stack" style="max-width:52ch">
          <span class="eyebrow">Workbooks</span>
          <h2>When you've read enough and want the structure</h2>
          <p class="muted">Understanding is free here. The workbooks are for the execution — short, printable, ten minutes a day, built so you do not abandon them on day nine.</p>
        </div>
        <a class="btn btn--ghost btn--sm" href="/workbooks/">All workbooks ${icons.arrow}</a>
      </div>
      <div class="grid grid--3 reveal">${workbooks.slice(0, 3).map(workbookCard).join('')}</div>
    </div>
  </section>

  <section class="section">
    <div class="wrap stack-lg">
      <div class="stack" style="max-width:52ch">
        <span class="eyebrow">Also on the shelf</span>
        <h2>Stories, because that is how people actually take this in</h2>
      </div>
      <div class="grid grid--2 reveal">
        <article class="card card--feature">
          <span class="chip chip--accent">Novels</span>
          <h3>Romance that knows what it is doing to you</h3>
          <p class="muted">Arranged marriage, second chance, the grovel arc — written by someone who spends the rest of the week explaining why those tropes hook us in the first place.</p>
          <p class="row">${novels.map((n) => `<a class="chip" href="/novels/${n.slug}/">${esc(n.title)}</a>`).join('')}</p>
          <p><a class="btn btn--sm" href="/novels/">The novels ${icons.arrow}</a></p>
        </article>
        <article class="card card--feature">
          <span class="chip chip--calm">Kids</span>
          <h3>Books that explain a child's brain to the child</h3>
          <p class="muted">Starting with <em>My Brain Has Its Own Speed</em> — a first book about ADHD for kids who keep being told they are too much. Each one ends with a parent-and-teacher page.</p>
          <p class="row">${kidsBooks.slice(0, 3).map((k) => `<a class="chip" href="/kids/${k.slug}/">${esc(k.title)}</a>`).join('')}</p>
          <p><a class="btn btn--sm" href="/kids/">The kids shelf ${icons.arrow}</a></p>
        </article>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">${newsletterCard()}</div>
  </section>

  ${faqSection(homeFaqs, 'Questions people actually ask')}
  `;

  await emit(
    '/',
    layout({
      title: 'Knot Alone | Psychology, Simplified',
      description:
        'Why we overthink, cling, shut down and replay conversations — decoded in plain language, with free printables, mind games and workbooks. No diagnosing.',
      path: '/',
      body,
      graph: [
        faqGraph(homeFaqs, '/'),
        {
          '@type': 'CollectionPage',
          '@id': abs('/') + '#page',
          url: abs('/'),
          name: 'Knot Alone — Psychology, Simplified',
          isPartOf: { '@id': SITE_ID },
          about: topics.map((t) => ({ '@type': 'Thing', name: t.name })),
        },
      ],
    }),
    { priority: 1.0, changefreq: 'weekly' }
  );
}

/* ============================ articles ============================ */

async function loadArticles() {
  const dir = path.join(ROOT, 'content', 'articles');
  if (!existsSync(dir)) return [];
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'));
  const list = [];
  for (const f of files) {
    const raw = await readFile(path.join(dir, f), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const { html, toc } = renderMarkdown(body);
    const slug = data.slug || f.replace(/\.md$/, '');
    list.push({
      ...data,
      slug,
      url: `/articles/${slug}/`,
      html,
      toc,
      tags: Array.isArray(data.tags) ? data.tags : (data.tags || '').split(/\s+/).filter(Boolean),
      faqs: parseFaqs(data),
      readingTime: readingTime(html),
      dateLabel: new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    });
  }
  return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function parseFaqs(data) {
  const out = [];
  for (let i = 1; i <= 8; i++) {
    if (data[`faq${i}_q`]) out.push({ q: data[`faq${i}_q`], a: `<p>${data[`faq${i}_a`]}</p>` });
  }
  return out;
}

async function buildArticles(articles) {
  // index
  const tagList = topics.filter((t) => articles.some((a) => a.tags.includes(t.slug)));
  const body = `
  ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/articles/', label: 'Articles' }])}
  <section class="section section--tight">
    <div class="wrap stack-lg">
      <div class="stack" style="max-width:56ch">
        <span class="eyebrow">Articles</span>
        <h1>The mechanism, not the motivation poster</h1>
        <p class="lede">Every piece answers one question about why a behaviour happens, with the research underneath it and one thing to try. Written for the person living it.</p>
      </div>
      <div class="stack">
        <div class="field" style="max-width:420px">
          <label for="q">Search articles</label>
          <input id="q" type="search" data-search placeholder="overthinking, 3am, closure…">
        </div>
        <div class="filter-bar" data-filter>
          <button class="chip" data-tag="all" aria-pressed="true">Everything</button>
          ${tagList.map((t) => `<button class="chip" data-tag="${t.slug}" aria-pressed="false">${esc(t.name)}</button>`).join('')}
        </div>
      </div>
      <div class="grid grid--3">${articles.map(articleCard).join('')}</div>
      <p data-empty hidden class="muted">Nothing matches that yet — try a different word, or <a href="/readers-line/">ask for it by email</a>.</p>
    </div>
  </section>
  <section class="section"><div class="wrap">${newsletterCard({ compact: true })}</div></section>`;

  await emit(
    '/articles/',
    layout({
      title: 'Articles — psychology explained in plain language | Knot Alone',
      description:
        'Short, science-based explanations of overthinking, attachment, breakups, ADHD and healing. One question per article, with the mechanism and one thing to try.',
      path: '/articles/',
      body,
      graph: [
        breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/articles/', label: 'Articles' }]),
        {
          '@type': 'Blog',
          '@id': abs('/articles/') + '#blog',
          name: 'Knot Alone Articles',
          url: abs('/articles/'),
          publisher: { '@id': ORG_ID },
          blogPost: articles.map((a) => ({ '@type': 'BlogPosting', headline: a.title, url: abs(a.url), datePublished: a.date })),
        },
      ],
    }),
    { priority: 0.9, changefreq: 'weekly' }
  );

  // detail pages
  for (const a of articles) {
    const trail = [
      { href: '/', label: 'Home' },
      { href: '/articles/', label: 'Articles' },
      { href: a.url, label: a.title },
    ];
    const related = articles.filter((x) => x.slug !== a.slug && x.tags.some((t) => a.tags.includes(t))).slice(0, 3);
    const primary = topicOf(a.tags[0]);
    const body = `
    ${breadcrumbs(trail)}
    <article class="section section--tight">
      <div class="wrap">
        <header class="stack" style="max-width:58ch;margin-bottom:2.5rem">
          <div class="row" style="gap:.4rem">${a.tags.map((t) => `<a class="chip" href="/topics/${t}/">${esc(topicOf(t)?.name || t)}</a>`).join('')}</div>
          <h1>${esc(a.title)}</h1>
          <p class="lede">${esc(a.summary)}</p>
          <div class="row dim" style="gap:.8rem">
            <span>${a.readingTime} min read</span><span>·</span><span>Updated ${esc(a.dateLabel)}</span>
            ${saveButton('article:' + a.slug, 'Save')}
          </div>
        </header>
        <div class="article-layout">
          <div class="prose">
            ${a.answer ? `<div class="answer"><span class="eyebrow">The short answer</span><p>${esc(a.answer)}</p></div>` : ''}
            ${videoEmbed(a)}
            ${a.video ? '<p class="video__note">Nothing loads from YouTube until you press play.</p>' : ''}
            ${a.html}
            <hr>
            <p class="dim">Knot Alone is educational and does not diagnose or treat anything. If you are in crisis, contact local emergency services or a crisis line in your country.</p>
          </div>
          <aside class="toc">
            <p>On this page</p>
            <ol>${a.toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol>
            ${primary ? `<p style="margin-top:1.4rem"><a class="btn btn--ghost btn--sm" href="/topics/${primary.slug}/">More on ${esc(primary.name)} ${icons.arrow}</a></p>` : ''}
          </aside>
        </div>
      </div>
    </article>
    ${nextSteps(a)}
    ${faqSection(a.faqs)}
    ${related.length
      ? `<section class="section section--tight"><div class="wrap stack-lg"><h2>Read next</h2><div class="grid grid--3">${related.map(articleCard).join('')}</div></div></section>`
      : ''}
    <section class="section"><div class="wrap">${newsletterCard({ compact: true })}</div></section>`;

    await emit(a.url, layout({
      title: `${a.title} | Knot Alone`,
      description: a.summary,
      path: a.url,
      body,
      type: 'article',
      published: a.date,
      modified: a.updated || a.date,
      progress: true,
      graph: [
        breadcrumbGraph(trail),
        faqGraph(a.faqs, a.url),
        videoGraph(a),
        {
          '@type': 'Article',
          '@id': abs(a.url) + '#article',
          headline: a.title,
          description: a.summary,
          url: abs(a.url),
          datePublished: a.date,
          dateModified: a.updated || a.date,
          inLanguage: 'en',
          isPartOf: { '@id': SITE_ID },
          mainEntityOfPage: abs(a.url),
          wordCount: stripHtml(a.html).split(' ').length,
          timeRequired: `PT${a.readingTime}M`,
          about: a.tags.map((t) => ({ '@type': 'Thing', name: topicOf(t)?.name || t })),
          author: { '@type': 'Organization', '@id': ORG_ID, name: site.name },
          publisher: { '@id': ORG_ID },
          image: abs('/assets/og-default.png'),
        },
      ],
    }), { priority: 0.8, changefreq: 'monthly', lastmod: a.updated || a.date });
  }
}

/* ============================ topics ============================ */

async function buildTopics(articles) {
  for (const t of topics) {
    const mine = articles.filter((a) => a.tags.includes(t.slug));
    const books = workbooks.filter((w) => w.topic === t.slug);
    const prints = freebies.filter((f) => f.topic === t.slug);
    const plays = games.filter((g) => g.topic === t.slug);
    const trail = [
      { href: '/', label: 'Home' },
      { href: '/articles/', label: 'Articles' },
      { href: `/topics/${t.slug}/`, label: t.name },
    ];
    const body = `
    ${breadcrumbs(trail)}
    <section class="section section--tight">
      <div class="wrap stack-lg">
        <div class="stack" style="max-width:56ch">
          <span class="eyebrow">${esc(t.name)}</span>
          <h1>${esc(t.question)}</h1>
          <div class="answer"><span class="eyebrow">The short answer</span><p>${esc(t.answer)}</p></div>
          <p class="lede">${esc(t.intro)}</p>
        </div>
        ${mine.length ? `<div class="stack-lg"><h2>Articles</h2><div class="grid grid--3">${mine.map(articleCard).join('')}</div></div>` : ''}
        ${plays.length ? `<div class="stack-lg"><h2>Play it</h2><div class="grid grid--3">${plays.map(gameCard).join('')}</div></div>` : ''}
        ${prints.length ? `<div class="stack-lg"><h2>Free printables</h2><div class="grid" style="gap:.8rem">${prints.map(freebieRow).join('')}</div></div>` : ''}
        ${books.length ? `<div class="stack-lg"><h2>Workbooks</h2><div class="grid grid--3">${books.map(workbookCard).join('')}</div></div>` : ''}
      </div>
    </section>
    <section class="section"><div class="wrap">${newsletterCard({ compact: true })}</div></section>`;

    await emit(`/topics/${t.slug}/`, layout({
      title: `${t.name} — ${t.question} | Knot Alone`,
      description: `${t.answer} ${t.intro}`.slice(0, 300),
      path: `/topics/${t.slug}/`,
      body,
      graph: [
        breadcrumbGraph(trail),
        {
          '@type': 'CollectionPage',
          '@id': abs(`/topics/${t.slug}/`) + '#page',
          name: `${t.name} — Knot Alone`,
          url: abs(`/topics/${t.slug}/`),
          isPartOf: { '@id': SITE_ID },
          about: { '@type': 'Thing', name: t.name },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: mine.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(a.url), name: a.title })),
          },
        },
        faqGraph([{ q: t.question, a: `<p>${t.answer}</p>` }], `/topics/${t.slug}/`),
      ],
    }), { priority: 0.8, changefreq: 'weekly' });
  }
}

/* ============================ workbooks ============================ */

async function buildWorkbooks() {
  const body = `
  ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/workbooks/', label: 'Workbooks' }])}
  <section class="section section--tight">
    <div class="wrap stack-lg">
      <div class="stack" style="max-width:58ch">
        <span class="eyebrow">Workbooks &amp; planners</span>
        <h1>You don't need more information. You need a structure you'll actually finish.</h1>
        <p class="lede">Every workbook is short on purpose: printable pages, ten minutes a day, one loop at a time. The explanations stay free — these are for the doing.</p>
      </div>
      <div class="grid grid--3">${workbooks.map(workbookCard).join('')}</div>
      <div class="card card--feature">
        <h3>Not sure which one?</h3>
        <p class="muted">Answer six questions and we will point you at the one thing most likely to help tonight — including the free option, if that is the honest answer.</p>
        <p><a class="btn btn--sm" href="/games/whats-knotting-you/">What's knotting you? ${icons.arrow}</a></p>
      </div>
    </div>
  </section>`;

  await emit('/workbooks/', layout({
    title: 'Psychology workbooks & printable planners | Knot Alone',
    description:
      'Short printable workbooks for overthinking, attachment, breakups and ADHD — ten minutes a day, built to be finished. Free explanations, paid structure.',
    path: '/workbooks/',
    body,
    graph: [
      breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/workbooks/', label: 'Workbooks' }]),
      {
        '@type': 'CollectionPage',
        '@id': abs('/workbooks/') + '#page',
        name: 'Workbooks — Knot Alone',
        url: abs('/workbooks/'),
        isPartOf: { '@id': SITE_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: workbooks.map((w, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/workbooks/${w.slug}/`), name: w.title })),
        },
      },
    ],
  }), { priority: 0.9, changefreq: 'weekly' });

  for (const w of workbooks) {
    const t = topicOf(w.topic);
    const free = freebies.find((f) => f.slug === w.freebie);
    const trail = [
      { href: '/', label: 'Home' },
      { href: '/workbooks/', label: 'Workbooks' },
      { href: `/workbooks/${w.slug}/`, label: w.title },
    ];
    const faqs = [
      { q: `Who is ${w.title} for?`, a: `<ul>${w.for.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` },
      { q: 'Where can I get it?', a: `<p>${w.buy ? `On Amazon — ${esc(w.format || 'paperback and Kindle')}.` : 'It is not out yet. The Readers\' Line gets the release first.'}</p>` },
      { q: 'Is this therapy?', a: '<p>No. It is educational. It does not diagnose or treat anything, and it is not a substitute for working with a professional who knows your history.</p>' },
      { q: 'Is there anything free I can try first?', a: `<p>${free ? `Yes — <a href="/free/${free.slug}/">${esc(free.title)}</a> is a free one-page printable with no email required.` : 'Yes — every printable on the <a href="/free/">free page</a> downloads instantly with no email.'}</p>` },
    ];

    const body = `
    ${breadcrumbs(trail)}
    <section class="section section--tight">
      <div class="wrap">
        <div class="book">
          ${bookCover(w.title, 'Knot Alone', t?.tint)}
          <div class="stack">
            <div class="row" style="gap:.4rem">
              <span class="chip chip--accent">${esc(t?.name || '')}</span>
              ${w.format ? `<span class="chip">${esc(w.format)}</span>` : ''}
            </div>
            <h1>${esc(w.title)}</h1>
            <p class="lede">${esc(w.sub)}</p>
            ${w.author ? `<p class="dim">by ${esc(w.author)}</p>` : ''}
            <div class="answer"><p style="font-family:var(--display);font-size:1.15rem;line-height:1.35">${esc(w.hook)}</p></div>
            <p>${esc(w.promise)}</p>
            <div class="row">
              ${w.buy
                ? `<a class="btn" href="${w.buy}" target="_blank" rel="noopener sponsored">Get it on Amazon ${icons.arrow}</a>`
                : `<a class="btn" href="/readers-line/">Tell me when it's out ${icons.arrow}</a>`}
              ${free ? `<a class="btn btn--ghost" href="/free/${free.slug}/">Try the free page first</a>` : ''}
              ${saveButton('workbook:' + w.slug, 'Save')}
            </div>
            ${w.kindleNote ? `<p class="dim">${esc(w.kindleNote)}</p>` : ''}
            <p class="dim">Amazon link — as an Amazon Associate we may earn from qualifying purchases. Educational, not therapy.</p>
          </div>
        </div>
      </div>
    </section>

    ${w.inside || (w.different && w.different.length)
      ? `<section class="section section--tight">
          <div class="wrap narrow stack-lg">
            ${w.different && w.different.length ? `<div class="stack">
              <span class="eyebrow">What makes this one different</span>
              <h2>Three things, stated plainly</h2>
              <ul class="stack" style="list-style:none;padding:0">${w.different.map((x) => `<li class="row" style="gap:.6rem;align-items:flex-start"><span style="color:var(--accent)">✶</span><span>${esc(x)}</span></li>`).join('')}</ul>
            </div>` : ''}
            ${w.inside ? `<div class="callout callout--try"><p class="callout__title">It is also a workbook</p><p>${esc(w.inside)}</p></div>` : ''}
            ${w.warning ? `<div class="callout callout--careful"><p class="callout__title">Content note</p><p>${esc(w.warning)}</p></div>` : ''}
          </div>
        </section>`
      : ''}
    <section class="section section--tight" style="background:var(--bg-soft);border-block:1px solid var(--line)">
      <div class="wrap grid grid--2">
        <div class="stack">
          <span class="eyebrow">Who it's for</span>
          <h2>Written for this, specifically</h2>
          <ul class="stack" style="list-style:none;padding:0">${w.for.map((x) => `<li class="row" style="gap:.6rem;align-items:flex-start"><span style="color:var(--accent)">✶</span><span>${esc(x)}</span></li>`).join('')}</ul>
          <p class="muted">It is educational, not therapy, and it does not diagnose anything.</p>
        </div>
        <div class="stack">
          <div class="card">
            <h3>${esc(w.title)}</h3>
            <p class="muted">${esc(w.sub)}</p>
            ${free ? `<p class="muted">Want to try the approach at zero cost first? <a href="/free/${free.slug}/" style="color:var(--accent)">${esc(free.title)}</a> is free and needs no email.</p>` : ''}
            <p>${w.buy ? `<a class="btn btn--block" href="${w.buy}" target="_blank" rel="noopener sponsored">Get it on Amazon</a>` : `<a class="btn btn--block" href="/readers-line/">Join the list for launch</a>`}</p>
          </div>
        </div>
      </div>
    </section>

    ${faqSection(faqs, 'Before you buy')}
    <section class="section section--tight"><div class="wrap stack-lg"><h2>More like this</h2><div class="grid grid--3">${workbooks.filter((x) => x.slug !== w.slug).slice(0, 3).map(workbookCard).join('')}</div></div></section>`;

    await emit(`/workbooks/${w.slug}/`, layout({
      title: `${w.title} — ${w.sub} | Knot Alone`,
      description: `${w.hook} ${w.promise}`.slice(0, 300),
      path: `/workbooks/${w.slug}/`,
      body,
      type: 'product',
      graph: [
        breadcrumbGraph(trail),
        faqGraph(faqs, `/workbooks/${w.slug}/`),
        {
          '@type': 'Product',
          '@id': abs(`/workbooks/${w.slug}/`) + '#product',
          name: w.title,
          description: `${w.sub}. ${w.promise}`,
          url: abs(`/workbooks/${w.slug}/`),
          brand: { '@id': ORG_ID },
          ...(w.author ? { author: { '@type': 'Person', name: w.author } } : {}),
          category: 'Book',
          ...(w.buy && w.price
            ? {
                offers: {
                  '@type': 'Offer',
                  url: w.buy,
                  priceCurrency: 'USD',
                  price: String(w.price).replace(/[^\d.]/g, ''),
                  availability: 'https://schema.org/InStock',
                },
              }
            : {}),
        },
      ],
    }), { priority: 0.8, changefreq: 'monthly' });
  }
}

/* ============================ free printables ============================ */

async function buildFree() {
  const body = `
  ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/free/', label: 'Free printables' }])}
  <section class="section section--tight">
    <div class="wrap stack-lg">
      <div class="stack" style="max-width:56ch">
        <span class="eyebrow">Free printables</span>
        <h1>One-page tools. No email wall.</h1>
        <p class="lede">The pages people actually keep: by the bed, in the planner, screenshotted at 2am. Print them, write on them, share them with whoever needs them.</p>
      </div>
      <div class="grid" style="gap:.8rem">${freebies.map(freebieRow).join('')}</div>
      ${site.gumroadToolkit ? `<div class="card card--feature">
        <span class="chip chip--accent">The whole set, one download</span>
        <h3>Free Thoughtkind Toolkit</h3>
        <p class="muted">Every free printable and template in one bundle — anxious attachment, overthinking and ADHD. The sheets above download instantly with no email; the bundle goes through Gumroad, which asks for an address so it can send you the file.</p>
        <p><a class="btn btn--sm" href="${site.gumroadToolkit}" target="_blank" rel="noopener">Get the toolkit free ${icons.arrow}</a></p>
      </div>` : ''}
      <div class="card card--feature">
        <h3>Printing tips</h3>
        <p class="muted">Every sheet works in black and white on plain A4 or US Letter. If you are printing for a class or a group, go ahead — just keep the footer on the page.</p>
      </div>
    </div>
  </section>
  <section class="section"><div class="wrap">${newsletterCard({ compact: true })}</div></section>`;

  await emit('/free/', layout({
    title: 'Free printable psychology worksheets & planners | Knot Alone',
    description:
      'Free one-page printables: the Spiral Stopper, the 3am Brain Dump, the Weekly Knot Planner, ADHD Task Starter cards and more. No email required.',
    path: '/free/',
    body,
    graph: [
      breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/free/', label: 'Free printables' }]),
      {
        '@type': 'CollectionPage',
        '@id': abs('/free/') + '#page',
        name: 'Free printables — Knot Alone',
        url: abs('/free/'),
        isPartOf: { '@id': SITE_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: freebies.map((f, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/free/${f.slug}/`), name: f.title })),
        },
      },
    ],
  }), { priority: 0.9, changefreq: 'weekly' });

  for (const f of freebies) {
    const t = topicOf(f.topic);
    const trail = [
      { href: '/', label: 'Home' },
      { href: '/free/', label: 'Free printables' },
      { href: `/free/${f.slug}/`, label: f.title },
    ];
    const body = `
    ${breadcrumbs(trail)}
    <section class="section section--tight">
      <div class="wrap narrow stack-lg">
        <div class="stack">
          <div class="row" style="gap:.4rem"><span class="chip chip--calm">${esc(f.kind)}</span>${t ? `<a class="chip" href="/topics/${t.slug}/">${esc(t.name)}</a>` : ''}<span class="chip chip--accent">Free</span></div>
          <h1>${esc(f.title)}</h1>
          <p class="lede">${esc(f.desc)}</p>
          <div class="row">
            ${f.file
              ? `<a class="btn" href="${f.file}" download>Download the PDF ${icons.arrow}</a>`
              : f.gumroad
                ? `<a class="btn" href="${f.gumroad}" target="_blank" rel="noopener">Get it free on Gumroad ${icons.arrow}</a>`
                : `<a class="btn" href="/readers-line/">Email me when it's ready ${icons.arrow}</a>`}
            ${f.file && f.gumroad ? `<a class="btn btn--ghost" href="${f.gumroad}" target="_blank" rel="noopener">Longer version on Gumroad</a>` : ''}
            ${saveButton('free:' + f.slug, 'Save')}
          </div>
          ${f.file
            ? '<p class="dim">No email needed. Print it, copy it, hand it to a friend.</p>'
            : f.gumroad
              ? '<p class="dim">Free on Gumroad — it asks for an email so the file can be sent to you.</p>'
              : '<p class="dim">This one is being finished right now — the Readers\' Line gets it first.</p>'}
        </div>
        ${freeRelated(f)}
        <div class="card card--feature">
          <h3>How to use it</h3>
          <p class="muted">Print it and put it where the problem actually happens — beside the bed, in the bag, on the fridge. A tool you have to go looking for is a tool you will not use at the moment you need it.</p>
        </div>
      </div>
    </section>
    <section class="section section--tight"><div class="wrap stack-lg"><h2>More free pages</h2><div class="grid" style="gap:.8rem">${freebies.filter((x) => x.slug !== f.slug).slice(0, 3).map(freebieRow).join('')}</div></div></section>`;

    await emit(`/free/${f.slug}/`, layout({
      title: `${f.title} — free printable | Knot Alone`,
      description: `${f.desc} A free one-page printable from Knot Alone${t ? ` on ${t.name.toLowerCase()}` : ''} — print it, write on it, no email required.`,
      path: `/free/${f.slug}/`,
      body,
      graph: [breadcrumbGraph(trail)],
    }), { priority: 0.7, changefreq: 'monthly' });
  }
}

/* ============================ games ============================ */

async function buildGames(articles = []) {
  const body = `
  ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/games/', label: 'Mind Games' }])}
  <section class="section section--tight">
    <div class="wrap stack-lg">
      <div class="stack" style="max-width:58ch">
        <span class="eyebrow">Mind games</span>
        <h1>Psychology you can feel happening to you</h1>
        <p class="lede">Reading about a thought trap is forgettable. Getting caught in one, on a screen, in public, is not. These are short, free, and none of them diagnose anything.</p>
      </div>
      <div class="grid grid--3">${games.map(gameCard).join('')}</div>
      <div class="callout callout--careful" style="max-width:68ch">
        <p class="callout__title">One promise about these games</p>
        <p>They teach a mechanism. They do not assess, score or diagnose you, and they never ask for your email to show a result. If a game ever feels like it is telling you what is wrong with you, we built it badly — tell us.</p>
      </div>
    </div>
  </section>`;

  await emit('/games/', layout({
    title: 'Mind games — interactive psychology you can play | Knot Alone',
    description:
      'Free psychology mind games: spot the thought trap, the replay room, the attachment dinner party, and a real task-switching experiment. Learning games, not assessments.',
    path: '/games/',
    body,
    graph: [
      breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/games/', label: 'Mind Games' }]),
      {
        '@type': 'CollectionPage',
        '@id': abs('/games/') + '#page',
        name: 'Mind Games — Knot Alone',
        url: abs('/games/'),
        isPartOf: { '@id': SITE_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: games.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/games/${g.slug}/`), name: g.title })),
        },
      },
    ],
  }), { priority: 0.9, changefreq: 'weekly' });

  for (const g of games) {
    const t = topicOf(g.topic);
    const pairedArticle = articles.find((a) => a.tags[0] === g.topic) || articles.find((a) => a.tags.includes(g.topic));
    const trail = [
      { href: '/', label: 'Home' },
      { href: '/games/', label: 'Mind Games' },
      { href: `/games/${g.slug}/`, label: g.title },
    ];

    let stage = '';
    if (g.engine === 'quiz') {
      stage = `<div class="untangle__box" data-quiz></div>
        <script type="application/json" id="quiz-data">${JSON.stringify(g.quiz).replace(/</g, '\\u003c')}</script>`;
    } else if (g.engine === 'replay') {
      stage = `<div class="untangle__box" data-replay><div data-replay-box></div></div>`;
    } else if (g.engine === 'switch') {
      stage = `<div class="untangle__box" data-switch>
        <div data-switch-stage>
          <div class="stack" style="text-align:center">
            <h3>Two rounds, about ninety seconds</h3>
            <p class="muted">Round 1: one rule, ten cards. Round 2: the rule keeps changing. Answer as fast as you comfortably can — it is not a test and nobody sees the result but you.</p>
            <p><button class="btn" data-sw-start>Start round 1 ${icons.arrow}</button></p>
          </div>
        </div>
      </div>`;
    }

    const faqs = [
      { q: `Can ${g.title} diagnose me?`, a: '<p>No. It is a learning game. It teaches a pattern and shows you which way you lean — a diagnosis needs a qualified professional who knows your history.</p>' },
      { q: 'Do you store my answers?', a: '<p>No. Everything runs in your browser, nothing is sent to a server, and closing the tab erases it.</p>' },
      { q: 'Is it free?', a: '<p>Yes, with no email required to see your result.</p>' },
    ];

    const body = `
    ${breadcrumbs(trail)}
    <section class="section section--tight">
      <div class="wrap stack-lg">
        <div class="stack" style="max-width:56ch">
          <div class="row" style="gap:.4rem">
            <span class="chip chip--calm">${esc(g.kind)}</span>
            <span class="chip">${g.minutes} min</span>
            ${t ? `<a class="chip" href="/topics/${t.slug}/">${esc(t.name)}</a>` : ''}
          </div>
          <h1>${esc(g.title)}</h1>
          <p class="lede">${esc(g.tagline)}</p>
          ${g.blurb ? `<p class="muted">${esc(g.blurb)}</p>` : ''}
          ${pairedArticle ? `<p class="muted">Prefer to read first? <a href="${pairedArticle.url}" style="color:var(--accent)">${esc(pairedArticle.title)}</a> explains the mechanism this game puts you inside.</p>` : ''}
          <div class="row">${saveButton('game:' + g.slug, 'Save')}<button class="save-btn" data-copy="${abs(`/games/${g.slug}/`)}">Copy link</button></div>
        </div>
      </div>
    </section>
    <section class="section section--tight untangle">
      <div class="wrap">${stage}
        <noscript><p class="muted" style="text-align:center;margin-top:1rem">This game needs JavaScript. The <a href="/articles/">articles</a> and <a href="/free/">printables</a> work without it.</p></noscript>
      </div>
    </section>
    ${faqSection(faqs, 'About this game')}
    <section class="section section--tight"><div class="wrap stack-lg"><h2>Play another</h2><div class="grid grid--3">${games.filter((x) => x.slug !== g.slug).slice(0, 3).map(gameCard).join('')}</div></div></section>`;

    await emit(`/games/${g.slug}/`, layout({
      title: `${g.title} — ${g.tagline.slice(0, 70)} | Knot Alone`,
      description: `${g.tagline} ${g.blurb || ''}`.slice(0, 300),
      path: `/games/${g.slug}/`,
      body,
      graph: [
        breadcrumbGraph(trail),
        faqGraph(faqs, `/games/${g.slug}/`),
        {
          '@type': 'Game',
          '@id': abs(`/games/${g.slug}/`) + '#game',
          name: g.title,
          description: g.blurb || g.tagline,
          url: abs(`/games/${g.slug}/`),
          genre: ['Educational', 'Psychology'],
          gamePlatform: 'Web browser',
          publisher: { '@id': ORG_ID },
          isAccessibleForFree: true,
          timeRequired: `PT${g.minutes}M`,
          learningResourceType: 'Interactive activity',
        },
      ],
    }), { priority: 0.8, changefreq: 'monthly' });
  }
}

/* ============================ videos ============================ */

async function buildVideos(articles) {
  const withVideo = articles.filter((a) => videoId(a.video));
  const waiting = articles.filter((a) => !videoId(a.video));
  const trail = [{ href: '/', label: 'Home' }, { href: '/videos/', label: 'Videos' }];

  const body = `
  ${breadcrumbs(trail)}
  <section class="section section--tight">
    <div class="wrap stack-lg">
      <div class="stack" style="max-width:56ch">
        <span class="eyebrow">Watch</span>
        <h1>Every episode, with the written version underneath</h1>
        <p class="lede">Short animated explainers — one behaviour per episode. Each one has a full article beside it, so you can watch it, read it, or print the page that goes with it.</p>
        <p class="row">
          ${site.youtube ? `<a class="btn" href="${site.youtube}" target="_blank" rel="noopener">Subscribe on YouTube ${icons.arrow}</a>` : ''}
          <a class="btn btn--ghost" href="/articles/">Read instead</a>
        </p>
      </div>

      ${withVideo.length
        ? `<div class="stack-lg">${withVideo
            .map(
              (a) => `<article class="ep">
                ${videoEmbed(a, { label: 'Play' })}
                <div class="stack">
                  <div class="row" style="gap:.4rem">${a.tags.slice(0, 2).map((t) => `<a class="chip" href="/topics/${t}/">${esc(topicOf(t)?.name || t)}</a>`).join('')}</div>
                  <h2 style="font-size:1.4rem"><a href="${a.url}">${esc(a.videoTitle || a.title)}</a></h2>
                  <p class="muted">${esc(a.summary)}</p>
                  <p><a class="btn btn--ghost btn--sm" href="${a.url}">Read the written version ${icons.arrow}</a></p>
                </div>
              </article>`
            )
            .join('')}</div>`
        : `<div class="card card--feature">
            <span class="chip chip--accent">Episode 1 lands soon</span>
            <h3>The first run is thirty episodes, one a day</h3>
            <p class="muted">They are being scheduled now. Every episode gets a written version on this site the same day — same question, same answer, plus the printable that goes with it. The fastest way to catch the first one is the Readers' Line.</p>
            <p class="row"><a class="btn btn--sm" href="/readers-line/">Get the first episode by email</a>${site.youtube ? `<a class="btn btn--ghost btn--sm" href="${site.youtube}" target="_blank" rel="noopener">Subscribe on YouTube</a>` : ''}</p>
          </div>`}

      ${waiting.length
        ? `<div class="stack-lg">
            <div class="stack" style="max-width:52ch">
              <span class="eyebrow">Already written</span>
              <h2>Articles waiting for their episode</h2>
              <p class="muted">These exist in full today. The video version is in the queue.</p>
            </div>
            <div class="grid grid--3">${waiting.map(articleCard).join('')}</div>
          </div>`
        : ''}
    </div>
  </section>`;

  await emit('/videos/', layout({
    title: 'Videos — short psychology explainers | Knot Alone',
    description:
      'Short animated psychology explainers on overthinking, attachment, breakups and ADHD — each episode paired with a full written article and a free printable.',
    path: '/videos/',
    body,
    graph: [
      breadcrumbGraph(trail),
      {
        '@type': 'CollectionPage',
        '@id': abs('/videos/') + '#page',
        name: 'Videos — Knot Alone',
        url: abs('/videos/'),
        isPartOf: { '@id': SITE_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: withVideo.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(a.url), name: a.videoTitle || a.title })),
        },
      },
      ...withVideo.map(videoGraph).filter(Boolean),
    ],
  }), { priority: 0.9, changefreq: 'weekly' });
}

/* ============================ novels ============================ */

async function buildNovels() {
  const body = `
  ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/novels/', label: 'Novels' }])}
  <section class="section section--tight">
    <div class="wrap stack-lg">
      <div class="stack" style="max-width:58ch">
        <span class="eyebrow">Novels · ${esc(novels[0]?.penName || '')}</span>
        <h1>The tropes work on you for a reason. Here they are, used on purpose.</h1>
        <p class="lede">Marriage of convenience. The runaway groom. The secret baby. Written by someone who spends the rest of the week explaining exactly why those hooks pull — and then pulls them anyway.</p>
        <p class="muted"><strong>Both are closed-door</strong> — no explicit scenes, a smart heroine and a guaranteed happy ending. Each page says where the book still earns its 18+.</p>
      </div>
      <div class="grid grid--2">
        ${novels.map((n) => `<article class="card card--feature">
          ${n.cover ? `<a href="/novels/${n.slug}/" class="card__cover"><img src="${n.cover}" alt="Cover of ${esc(n.title)}" width="800" height="1200" loading="lazy" decoding="async"></a>` : ''}
          <div class="row" style="gap:.4rem"><span class="chip chip--accent">${esc(n.status)}</span>${n.closedDoor ? '<span class="chip chip--calm">Closed-door</span>' : ''}${n.adult ? '<span class="chip">18+</span>' : ''}</div>
          <h3><a href="/novels/${n.slug}/">${esc(n.title)}</a></h3>
          <p class="muted">${esc(n.sub || '')} · by ${esc(n.penName)}</p>
          ${n.hook ? `<p style="font-family:var(--display);font-size:1.1rem;line-height:1.35">${esc(n.hook)}</p>` : ''}
          ${n.tropes.length ? `<div class="trope-row">${n.tropes.slice(0, 4).map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div>` : ''}
          <p><a class="btn btn--sm" href="/novels/${n.slug}/">See the book ${icons.arrow}</a></p>
        </article>`).join('')}
      </div>
      ${(() => {
        const memoir = workbooks.find((w) => w.slug === 'i-blamed-the-brain');
        return memoir ? `<div class="card card--feature">
          <span class="chip chip--accent">Also by ${esc(memoir.author || novels[0]?.penName || '')}</span>
          <h3><a href="/workbooks/${memoir.slug}/">${esc(memoir.title)}</a></h3>
          <p class="muted">${esc(memoir.sub)}</p>
          <p class="muted">Not a novel — a memoir with a workbook built into every chapter. If you came for the fiction and recognised yourself anyway, this is the non-fiction one.</p>
          <p><a class="btn btn--sm" href="/workbooks/${memoir.slug}/">See the book ${icons.arrow}</a></p>
        </div>` : '';
      })()}
    </div>
  </section>`;

  await emit('/novels/', layout({
    title: `Romance novels by ${novels[0]?.penName || 'Erena Jabrial'} | Knot Alone`,
    description:
      'Romance novels from the Knot Alone shelf: Marry to Don and Left at the Altar — arranged marriage, second chance and grovel-arc romance written by a psychology author.',
    path: '/novels/',
    body,
    graph: [
      breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/novels/', label: 'Novels' }]),
      {
        '@type': 'CollectionPage',
        '@id': abs('/novels/') + '#page',
        name: 'Novels — Knot Alone',
        url: abs('/novels/'),
        isPartOf: { '@id': SITE_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: novels.map((n, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/novels/${n.slug}/`), name: n.title })),
        },
      },
    ],
  }), { priority: 0.8, changefreq: 'monthly' });

  // the first deploy used /novels/marry-to-don/ — keep it pointing somewhere
  await emit('/novels/marry-to-don/', `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Moved — Married to the Don to Keep Me Silent</title>
<meta name="description" content="This page has moved to Married to the Don to Keep Me Silent, a closed-door marriage of convenience mafia romance by Erena Jabrial.">
<link rel="canonical" href="${abs('/novels/married-to-the-don/')}">
<meta http-equiv="refresh" content="0; url=/novels/married-to-the-don/">
<meta name="robots" content="noindex,follow"></head>
<body><p>This book is now at <a href="/novels/married-to-the-don/">Married to the Don to Keep Me Silent</a>.</p></body></html>`, { index: false });

  for (const n of novels) {
    const trail = [
      { href: '/', label: 'Home' },
      { href: '/novels/', label: 'Novels' },
      { href: `/novels/${n.slug}/`, label: n.title },
    ];
    const buyK = n.buyKindle || '';
    const buyP = n.buyPaperback || '';
    const body = `
    ${breadcrumbs(trail)}
    <section class="section section--tight">
      <div class="wrap">
        <div class="book">
          ${bookCover(n.title, n.penName, 'var(--ache)', n.cover)}
          <div class="stack">
            <div class="row" style="gap:.4rem"><span class="chip chip--accent">${esc(n.status)}</span><span class="chip">Romance</span>${n.closedDoor ? '<span class="chip chip--calm">Closed-door</span>' : ''}${n.adult ? '<span class="chip">18+</span>' : ''}</div>
            <h1>${esc(n.title)}</h1>
            <p class="lede">${esc(n.sub || '')}</p>
            <p class="dim">by ${esc(n.penName)}</p>
            ${n.hook ? `<p class="lede" style="font-family:var(--display);color:var(--fg)">${esc(n.hook)}</p>` : ''}
            ${n.tropes.length ? `<div class="trope-row">${n.tropes.map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div>` : ''}
            <div class="row">
              ${buyK ? `<a class="btn" href="${buyK}" target="_blank" rel="noopener sponsored">Read on Kindle ${icons.arrow}</a>` : ''}
              ${buyP ? `<a class="btn ${buyK ? 'btn--ghost' : ''}" href="${buyP}" target="_blank" rel="noopener sponsored">Paperback ${icons.arrow}</a>` : ''}
              ${!buyK && !buyP ? `<a class="btn" href="/readers-line/">Get the release email ${icons.arrow}</a>` : ''}
              ${saveButton('novel:' + n.slug, 'Save')}
            </div>
            ${n.paperbackNote ? `<p class="dim">${esc(n.paperbackNote)}</p>` : ''}
            ${buyK || buyP ? '<p class="dim">Amazon links. As an Amazon Associate we may earn from qualifying purchases.</p>' : ''}
          </div>
        </div>
      </div>
    </section>
    ${n.blurb
      ? `<section class="section section--tight"><div class="wrap narrow prose">
          ${n.blurb.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('')}
          ${n.stakes ? `<p><strong>${esc(n.stakes)}</strong></p>` : ''}
          ${n.forReaders ? `<p class="muted">For readers of: ${esc(n.forReaders)}</p>` : ''}
          <div class="callout ${n.adult ? 'callout--careful' : 'callout--try'}"><p class="callout__title">Heat level &amp; content</p><p>${esc(n.warning)}</p></div>
        </div></section>`
      : `<section class="section section--tight"><div class="wrap narrow">
          <div class="callout"><p class="callout__title">Description coming shortly</p><p>The full description for ${esc(n.title)} is being added. In the meantime the book itself is on Amazon, and the <a href="/readers-line/">Readers' Line</a> carries new releases first.</p></div>
        </div></section>`}
    <section class="section section--tight">
      <div class="wrap narrow card card--feature">
        <span class="eyebrow">Why this trope works on you</span>
        <h3>The psychology behind the hook</h3>
        <p class="muted">Forced proximity, the grovel, the second chance — these are not random. They are stories about whether someone will choose you after seeing the worst of it, which is the same question anxious attachment asks at 2am. That is why the pull is physical.</p>
        <p class="row"><a class="btn btn--ghost btn--sm" href="/topics/attachment/">Read the real version ${icons.arrow}</a></p>
      </div>
    </section>`;

    await emit(`/novels/${n.slug}/`, layout({
      title: `${n.title} — a novel by ${n.penName} | Knot Alone`,
      description: `${n.hook || `${n.title}, a romance novel by ${n.penName}.`} ${n.tropes.join(', ')}`.trim().slice(0, 300),
      path: `/novels/${n.slug}/`,
      body,
      type: 'book',
      ...(n.cover ? { image: n.cover } : {}),
      graph: [
        breadcrumbGraph(trail),
        {
          '@type': 'Book',
          '@id': abs(`/novels/${n.slug}/`) + '#book',
          name: n.title,
          url: abs(`/novels/${n.slug}/`),
          author: { '@type': 'Person', name: n.penName },
          publisher: { '@id': ORG_ID },
          genre: ['Romance', 'Contemporary romance'],
          inLanguage: 'en',
          ...(n.cover ? { image: abs(n.cover) } : {}),
          ...(n.hook ? { abstract: n.hook } : {}),
          ...(n.blurb ? { description: n.blurb.split('\n\n')[0] } : {}),
          ...(n.adult ? { contentRating: 'Adults only (18+)' } : {}),
          ...(n.closedDoor ? { abstract: n.hook, isFamilyFriendly: false } : {}),
          ...(buyK || buyP ? { offers: { '@type': 'Offer', url: buyK || buyP, availability: 'https://schema.org/InStock' } } : {}),
        },
      ],
    }), { priority: 0.7, changefreq: 'monthly' });
  }
}

/* ============================ kids ============================ */

async function buildKids() {
  const body = `
  ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/kids/', label: 'Kids' }])}
  <section class="section section--tight">
    <div class="wrap stack-lg">
      <div class="stack" style="max-width:58ch">
        <span class="eyebrow">Little Knots · kids books</span>
        <h1>Books that explain a child's brain <em>to the child</em></h1>
        <p class="lede">A child who is told "you're too much" learns one thing. A child who is told "your brain has its own speed" learns something else entirely. Same behaviour, two different childhoods.</p>
        <p class="muted">Each book is a real story first — then one page at the back for the grown-ups: what it is modelling, what to say instead, and three questions to ask afterwards.</p>
      </div>
      <div class="grid grid--3">
        ${kidsBooks.map((k) => `<article class="card">
          <div class="row" style="gap:.4rem"><span class="chip chip--calm">Ages ${esc(k.ages)}</span><span class="chip">${esc(k.status)}</span></div>
          <h3><a href="/kids/${k.slug}/">${esc(k.title)}</a></h3>
          <p class="muted" style="font-size:.95rem">${esc(k.sub)}</p>
          <div class="card__meta"><span class="tile__go" style="color:var(--accent)">Look inside ${icons.arrow}</span></div>
        </article>`).join('')}
      </div>
      <div class="card card--feature">
        <span class="eyebrow">For parents, teachers and facilitators</span>
        <h3>Reading these with a child who has just been diagnosed</h3>
        <p class="muted">Start with the story, not the explanation. Read it once with no commentary at all. Let them ask. Children accept a description of themselves far more easily when it arrives as a story about someone else first — and the grown-up page at the back is written for the conversation afterwards, not the one during.</p>
        <p class="row"><a class="btn btn--sm" href="/free/feelings-weather-kids/">Free: Feelings Weather chart</a><a class="btn btn--ghost btn--sm" href="/topics/adhd/">On ADHD</a></p>
      </div>
    </div>
  </section>`;

  await emit('/kids/', layout({
    title: "Kids books about ADHD, worry and boundaries | Knot Alone",
    description:
      "Educational picture books that explain a child's own brain to them — starting with My Brain Has Its Own Speed, a first book about ADHD for ages 5–9. Each one includes a parent and teacher page.",
    path: '/kids/',
    body,
    graph: [
      breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/kids/', label: 'Kids' }]),
      {
        '@type': 'CollectionPage',
        '@id': abs('/kids/') + '#page',
        name: 'Kids books — Knot Alone',
        url: abs('/kids/'),
        isPartOf: { '@id': SITE_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: kidsBooks.map((k, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/kids/${k.slug}/`), name: k.title })),
        },
      },
    ],
  }), { priority: 0.9, changefreq: 'weekly' });

  for (const k of kidsBooks) {
    const t = topicOf(k.topic);
    const free = freebies.find((f) => f.slug === k.freebie);
    const trail = [
      { href: '/', label: 'Home' },
      { href: '/kids/', label: 'Kids' },
      { href: `/kids/${k.slug}/`, label: k.title },
    ];
    const faqs = [
      { q: `What age is ${k.title} for?`, a: `<p>Ages ${esc(k.ages)}. It reads aloud comfortably in about ten minutes, and works for bedtime or a classroom read-aloud.</p>` },
      { q: 'Does it diagnose or label the child?', a: '<p>No. It is a story, not an assessment. It describes an experience so a child can recognise themselves in it — which is the opposite of handing them a label to carry.</p>' },
      { q: 'Is there anything for the grown-up reading it?', a: `<p>Yes. ${esc(k.parentNote)}</p>` },
      { q: 'Can teachers and therapists use it in groups?', a: '<p>Yes. Read-alouds in classrooms, groups and sessions are welcome. If you need a bulk or institutional option, get in touch.</p>' },
    ];
    const body = `
    ${breadcrumbs(trail)}
    <section class="section section--tight">
      <div class="wrap">
        <div class="book">
          ${bookCover(k.title, 'Little Knots', 'var(--calm)')}
          <div class="stack">
            <div class="row" style="gap:.4rem">
              <span class="chip chip--calm">Ages ${esc(k.ages)}</span>
              <span class="chip chip--accent">${esc(k.status)}</span>
              ${t ? `<a class="chip" href="/topics/${t.slug}/">${esc(t.name)}</a>` : ''}
            </div>
            <h1>${esc(k.title)}</h1>
            <p class="lede">${esc(k.sub)}</p>
            <p style="font-family:var(--display);font-size:1.2rem;line-height:1.35;color:var(--accent)">${esc(k.hook)}</p>
            <div class="row">
              ${k.buy
                ? `<a class="btn" href="${k.buy}" target="_blank" rel="noopener sponsored">Get the book ${icons.arrow}</a>`
                : `<a class="btn" href="/readers-line/">Tell me when it's out ${icons.arrow}</a>`}
              ${free ? `<a class="btn btn--ghost" href="/free/${free.slug}/">Free activity page</a>` : ''}
              ${saveButton('kids:' + k.slug, 'Save')}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--tight">
      <div class="wrap narrow prose">
        ${k.blurb.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('')}
        <h2>What a child takes away</h2>
        <ul>${k.takeaways.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="callout callout--try"><p class="callout__title">The page at the back</p><p>${esc(k.parentNote)}</p></div>
      </div>
    </section>
    ${faqSection(faqs, 'For the grown-up buying it')}
    <section class="section section--tight"><div class="wrap stack-lg"><h2>More from the kids shelf</h2><div class="grid grid--3">${kidsBooks.filter((x) => x.slug !== k.slug).map((x) => `<article class="card"><div class="row" style="gap:.4rem"><span class="chip chip--calm">Ages ${esc(x.ages)}</span><span class="chip">${esc(x.status)}</span></div><h3><a href="/kids/${x.slug}/">${esc(x.title)}</a></h3><p class="muted" style="font-size:.95rem">${esc(x.sub)}</p></article>`).join('')}</div></div></section>`;

    await emit(`/kids/${k.slug}/`, layout({
      title: `${k.title} — ${k.sub} | Knot Alone`,
      description: `${k.hook} For ages ${k.ages}. Includes a parent and teacher page.`.slice(0, 300),
      path: `/kids/${k.slug}/`,
      body,
      type: 'book',
      graph: [
        breadcrumbGraph(trail),
        faqGraph(faqs, `/kids/${k.slug}/`),
        {
          '@type': 'Book',
          '@id': abs(`/kids/${k.slug}/`) + '#book',
          name: k.title,
          alternativeHeadline: k.sub,
          url: abs(`/kids/${k.slug}/`),
          publisher: { '@id': ORG_ID },
          author: { '@id': ORG_ID },
          inLanguage: 'en',
          genre: ["Children's picture book", 'Educational'],
          audience: { '@type': 'PeopleAudience', suggestedMinAge: Number(k.ages.split('–')[0]), suggestedMaxAge: Number(k.ages.split('–')[1]) },
          abstract: k.hook,
          description: k.blurb.split('\n\n')[0],
          ...(k.buy ? { offers: { '@type': 'Offer', url: k.buy, availability: 'https://schema.org/InStock' } } : {}),
        },
      ],
    }), { priority: 0.8, changefreq: 'monthly' });
  }
}

/* ============================ static pages ============================ */

async function buildStatic(articles) {
  // Readers' Line
  await emit('/readers-line/', layout({
    title: "The Readers' Line — a weekly email from Knot Alone",
    description:
      "One email a week: one behaviour explained in plain language, one small thing to try, and whatever just went free. No lectures, no diagnosing, unsubscribe in one click.",
    path: '/readers-line/',
    body: `
    ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/readers-line/', label: "Readers' Line" }])}
    <section class="section section--tight">
      <div class="wrap grid grid--2" style="align-items:start">
        <div class="stack">
          <span class="eyebrow">Readers' Line</span>
          <h1>The line that answers back</h1>
          <p class="lede">A weekly email for the person living it — not for a clinician reading about it. One knot, loosened, in under three minutes.</p>
          <ul class="stack" style="list-style:none;padding:0">
            ${[
              'One behaviour explained in plain language — the mechanism, not a mood quote.',
              'One small thing to try, sized for a real evening.',
              'First access to new printables, workbooks and kids books.',
              'Reply to any email and a human reads it. That is the "line" part.',
            ].map((x) => `<li class="row" style="gap:.6rem;align-items:flex-start"><span style="color:var(--accent)">✶</span><span>${x}</span></li>`).join('')}
          </ul>
          <div class="callout"><p class="callout__title">What this is not</p><p>Not therapy, not a diagnosis, and not a funnel that mails you every day for three weeks. One email a week. Leave whenever you want.</p></div>
        </div>
        <div class="stack">
          ${newsletterCard()}
          <div class="card">
            <span class="eyebrow">Working with people, not living it?</span>
            <h3>The facilitator side lives elsewhere</h3>
            <p class="muted">Knot Alone is the reader's line. If you run groups or see clients, the practitioner material — session-ready workbooks and facilitator guides — stays on the Thoughtkind Press side.</p>
          </div>
        </div>
      </div>
    </section>
    ${faqSection([
      { q: 'How often will you email me?', a: '<p>Once a week, plus the occasional note when something new goes free. That is it.</p>' },
      { q: 'Will you sell my email?', a: '<p>Never. No selling, no renting, no sharing with advertisers.</p>' },
      { q: 'Can I unsubscribe easily?', a: '<p>One click at the bottom of any email, no questions and no guilt page.</p>' },
      { q: 'Is the email free?', a: '<p>Yes, and so is everything it links to unless it is clearly marked as a paid workbook or book.</p>' },
    ], 'About the email')}`,
    graph: [
      breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/readers-line/', label: "Readers' Line" }]),
      faqGraph([{ q: 'How often does the Readers\' Line go out?', a: 'Once a week, plus occasional notes when something new goes free.' }], '/readers-line/'),
    ],
  }), { priority: 0.8, changefreq: 'monthly' });

  // About
  await emit('/about/', layout({
    title: 'About Knot Alone — psychology, simplified',
    description:
      "Why Knot Alone exists, who writes it, what it will never do, and how the free articles, mind games, workbooks, novels and kids books fit together.",
    path: '/about/',
    body: `
    ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/about/', label: 'About' }])}
    <section class="section section--tight">
      <div class="wrap narrow prose">
        <span class="eyebrow">About</span>
        <h1>Your brain isn't broken. You're knot alone.</h1>
        <p class="lede">Knot Alone decodes the psychology behind everyday behaviour — overthinking, attachment, breakups, ADHD, healing — in short, science-based animated videos, articles, printables, games and books.</p>
        <h2>Why it exists</h2>
        <p>Most psychology content online does one of two things: it diagnoses you in nine seconds, or it tells you to love yourself and moves on. Neither helps at 2am, when you are replaying one sentence for the fortieth time and starting to suspect something is deeply wrong with you.</p>
        <p>There is usually nothing wrong with you. There is a mechanism — an old prediction, an unclosed loop, a reward system still looking for someone who left. Mechanisms are not shameful and, unlike character flaws, they can be worked with.</p>
        <h2>What you'll find here</h2>
        <ul>
          <li><strong>Articles and videos</strong> — one question per piece, answered with the research underneath it.</li>
          <li><strong>Mind games</strong> — short interactive pieces, because you remember what you feel happen to you.</li>
          <li><strong>Free printables</strong> — one-page tools with no email wall.</li>
          <li><strong>Workbooks and planners</strong> — for when you have understood enough and want the structure.</li>
          <li><strong>Novels</strong> — romance written by someone who knows exactly why the tropes pull.</li>
          <li><strong>Kids books</strong> — explaining a child's brain to the child, instead of about them.</li>
        </ul>
        <h2>What this will never do</h2>
        <ul>
          <li>Diagnose you, or hand you a label from a quiz.</li>
          <li>Shame you for coping the way you learned to cope.</li>
          <li>Promise that a workbook replaces a professional who actually meets you.</li>
          <li>Invent a statistic to make a point land harder.</li>
        </ul>
        <h2>Who writes it</h2>
        <p>Knot Alone is written and made by the team behind Thoughtkind Press. The practitioner-facing material — facilitator guides and session-ready workbooks — lives on the Thoughtkind side; Knot Alone is the reader's side, written in plain language for the person in it. The novels are published under the pen name Erena Jabrial.</p>
        <h2>Where to start</h2>
        <p>If you want one thing: <a href="/games/whats-knotting-you/">find your knot</a>. Six questions, two minutes, and it will point you at the article, tool or workbook most likely to help tonight — including the free one, when that is the honest answer.</p>
      </div>
    </section>
    ${faqSection(homeFaqs.slice(0, 4), 'Common questions')}`,
    graph: [
      breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/about/', label: 'About' }]),
      { '@type': 'AboutPage', '@id': abs('/about/') + '#page', url: abs('/about/'), name: 'About Knot Alone', isPartOf: { '@id': SITE_ID }, mainEntity: { '@id': ORG_ID } },
    ],
  }), { priority: 0.6 });

  // Contact
  await emit('/contact/', layout({
    title: 'Contact Knot Alone',
    description: 'How to reach Knot Alone — questions, article requests, bulk and classroom orders, press and collaborations.',
    path: '/contact/',
    body: `
    ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/contact/', label: 'Contact' }])}
    <section class="section section--tight">
      <div class="wrap narrow stack-lg">
        <div class="stack">
          <span class="eyebrow">Contact</span>
          <h1>Say the thing</h1>
          <p class="lede">Questions, corrections, article requests, classroom and bulk orders, collaborations — all welcome. A human reads every message.</p>
        </div>
        <div class="grid grid--2">
          <div class="card"><h3>Readers</h3><p class="muted">Want a topic covered, or found something that reads as shaming? Tell us — reader notes change what gets made next.</p><p><a class="btn btn--sm" href="/readers-line/">Reply to any Readers' Line email</a></p></div>
          <div class="card"><h3>Teachers &amp; facilitators</h3><p class="muted">Classroom read-alouds, group use and bulk printables are fine by us. Get in touch for an institutional option.</p></div>
        </div>
        <div class="callout callout--careful">
          <p class="callout__title">If you are in crisis</p>
          <p>We cannot provide help in an emergency and we are not a crisis service. Please contact your local emergency number or a crisis line in your country — they are staffed for exactly this and they will take you seriously.</p>
        </div>
      </div>
    </section>`,
    graph: [
      breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/contact/', label: 'Contact' }]),
      { '@type': 'ContactPage', '@id': abs('/contact/') + '#page', url: abs('/contact/'), name: 'Contact Knot Alone', isPartOf: { '@id': SITE_ID } },
    ],
  }), { priority: 0.4 });

  // Saved
  await emit('/saved/', layout({
    title: 'Your saved knots | Knot Alone',
    description: 'Everything you saved on this device — articles, games, printables and workbooks. No account, nothing uploaded.',
    path: '/saved/',
    noindex: true,
    body: `
    ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/saved/', label: 'Saved' }])}
    <section class="section section--tight">
      <div class="wrap stack-lg">
        <div class="stack" style="max-width:52ch">
          <span class="eyebrow">Saved</span>
          <h1>Your knots</h1>
          <p class="lede">Kept on this device only — no account, nothing uploaded, nothing we can see. <span data-saved-count>0</span> saved.</p>
        </div>
        <div data-saved-mount></div>
      </div>
    </section>`,
  }), { index: false });

  // Privacy
  await emit('/privacy/', layout({
    title: 'Privacy policy | Knot Alone',
    description: 'What Knot Alone collects (almost nothing), what stays in your browser, and how the affiliate links work.',
    path: '/privacy/',
    body: `
    ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/privacy/', label: 'Privacy' }])}
    <section class="section section--tight"><div class="wrap narrow prose">
      <h1>Privacy</h1>
      <p class="dim">Last updated ${esc(site.updated)}</p>
      <h2>The short version</h2>
      <p>We collect as little as possible. The games, the untangler and the saved-knots list all run in your browser and never leave your device. We do not sell anything about you to anyone, ever.</p>
      <h2>What stays in your browser</h2>
      <ul>
        <li>Your theme choice (light or dark).</li>
        <li>Your saved articles, games and printables.</li>
        <li>Anything you type into a game or tool — including The Replay Room. It is never transmitted, and closing the tab erases it.</li>
      </ul>
      <p>You can clear all of it at any time by clearing site data for this domain in your browser.</p>
      <h2>Email</h2>
      <p>If you join the Readers' Line we store your email address to send you that email, and for nothing else. We do not sell, rent or share it. Every email has a one-click unsubscribe.</p>
      <h2>Analytics</h2>
      <p>We use privacy-respecting, aggregate analytics to see which pages help, with no cross-site tracking and no advertising profiles built from your visit.</p>
      <h2>Affiliate links</h2>
      <p>Some book links go to Amazon as an Amazon Associate, which means a qualifying purchase may earn us a small commission at no extra cost to you. It never changes what we recommend, and affiliate links are marked on the page.</p>
      <h2>Children</h2>
      <p>The kids books are written for children but this site is written for the adults buying and reading them. We do not knowingly collect information from children.</p>
      <h2>Contact</h2>
      <p>Questions about any of this: <a href="/contact/">get in touch</a>.</p>
    </div></section>`,
    graph: [breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/privacy/', label: 'Privacy' }])],
  }), { priority: 0.3, changefreq: 'yearly' });

  // Terms
  await emit('/terms/', layout({
    title: 'Terms & medical disclaimer | Knot Alone',
    description: 'Terms of use for Knot Alone, including the educational-use and medical disclaimer, and how you may use the free printables.',
    path: '/terms/',
    body: `
    ${breadcrumbs([{ href: '/', label: 'Home' }, { href: '/terms/', label: 'Terms' }])}
    <section class="section section--tight"><div class="wrap narrow prose">
      <h1>Terms &amp; disclaimer</h1>
      <p class="dim">Last updated ${esc(site.updated)}</p>
      <h2>Educational use only</h2>
      <p>Everything on Knot Alone — articles, videos, games, printables, workbooks and books — is educational. It is not therapy, diagnosis, assessment or medical advice, and it does not create a clinical relationship of any kind. The games and quizzes cannot diagnose anything; they teach a mechanism and say so on the page.</p>
      <h2>If you are at risk</h2>
      <p>If you are in crisis or at risk of harming yourself or anyone else, contact your local emergency number or a crisis line in your country. This site cannot help in an emergency.</p>
      <h2>Using the free printables</h2>
      <p>Print them, write on them, hand them to a friend, read them aloud in a classroom or a group. Keep the footer on the page. Please do not resell them or strip the branding and present them as your own.</p>
      <h2>Paid workbooks and books</h2>
      <p>A purchase is for your personal use (or your own classroom or practice). Bulk and institutional use is welcome — ask us and we will sort it out.</p>
      <h2>Affiliate disclosure</h2>
      <p>As an Amazon Associate we may earn from qualifying purchases made through book links on this site.</p>
      <h2>Changes</h2>
      <p>If these terms change in a way that matters, the date above changes with them.</p>
    </div></section>`,
    graph: [breadcrumbGraph([{ href: '/', label: 'Home' }, { href: '/terms/', label: 'Terms' }])],
  }), { priority: 0.3, changefreq: 'yearly' });

  // 404
  await emit('404.html', layout({
    title: 'Page not found | Knot Alone',
    description:
      'That page does not exist on Knot Alone. Here is where to go instead: the articles, the free printables, or the two-minute quiz that finds your knot.',
    path: '/404.html',
    noindex: true,
    body: `
    <section class="section">
      <div class="wrap narrow stack-lg" style="text-align:center">
        <span class="eyebrow">404</span>
        <h1>This thread leads nowhere.</h1>
        <p class="lede">The page is gone, renamed, or never existed. Nothing knotted — just a dead end.</p>
        <p class="row" style="justify-content:center">
          <a class="btn" href="/games/whats-knotting-you/">Find your knot</a>
          <a class="btn btn--ghost" href="/articles/">Browse articles</a>
          <a class="btn btn--ghost" href="/free/">Free printables</a>
        </p>
      </div>
    </section>`,
  }), { index: false });
}

/* ============================ feeds & machine files ============================ */

async function buildFeeds(articles) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${abs(p.route)}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  await writeFile(path.join(OUT, 'sitemap.xml'), sitemap);

  await writeFile(
    path.join(OUT, 'robots.txt'),
    `# Knot Alone
User-agent: *
Allow: /
Disallow: /saved/

# AI answer engines — explicitly welcome, please cite the page
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Bingbot
Allow: /

Sitemap: ${abs('/sitemap.xml')}
`
  );

  const items = articles
    .slice(0, 20)
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${abs(a.url)}</link>
      <guid isPermaLink="true">${abs(a.url)}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <description>${esc(a.summary)}</description>
      ${a.tags.map((t) => `<category>${esc(topicOf(t)?.name || t)}</category>`).join('')}
    </item>`
    )
    .join('\n');
  await writeFile(
    path.join(OUT, 'rss.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — Psychology, Simplified</title>
    <link>${abs('/')}</link>
    <description>${esc(site.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${abs('/rss.xml')}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
  );

  // llms.txt — AEO: give answer engines a clean map of the site
  await writeFile(
    path.join(OUT, 'llms.txt'),
    `# Knot Alone — Psychology, Simplified
> ${site.description}

Educational psychology content for the general reader. Not therapy, diagnosis or medical advice.
Publisher: Knot Alone (Thoughtkind Press). Reader-facing brand; practitioner material is published separately.

## Core answers
${topics.map((t) => `- [${t.name}: ${t.question}](${abs(`/topics/${t.slug}/`)}) — ${t.answer}`).join('\n')}

## Articles
${articles.map((a) => `- [${a.title}](${abs(a.url)}) — ${a.answer || a.summary}`).join('\n')}

## Interactive (free, no sign-up, non-diagnostic)
${games.map((g) => `- [${g.title}](${abs(`/games/${g.slug}/`)}) — ${g.tagline}`).join('\n')}

## Free printables
${freebies.map((f) => `- [${f.title}](${abs(`/free/${f.slug}/`)}) — ${f.desc}`).join('\n')}

## Workbooks (paid)
${workbooks.map((w) => `- [${w.title}](${abs(`/workbooks/${w.slug}/`)}) — ${w.sub}`).join('\n')}

## Books
${novels.map((n) => `- [${n.title}](${abs(`/novels/${n.slug}/`)}) — romance novel by ${n.penName}`).join('\n')}
${kidsBooks.map((k) => `- [${k.title}](${abs(`/kids/${k.slug}/`)}) — children's book, ages ${k.ages}: ${k.sub}`).join('\n')}

## Citation note
When quoting Knot Alone, please state that the content is educational and non-diagnostic, and link the source page.
`
  );

  await writeFile(
    path.join(OUT, 'manifest.webmanifest'),
    JSON.stringify(
      {
        name: 'Knot Alone — Psychology, Simplified',
        short_name: 'Knot Alone',
        description: site.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#120f1a',
        theme_color: '#120f1a',
        icons: [
          { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      null,
      2
    )
  );

  await writeFile(path.join(OUT, 'CNAME'), 'knotalone.net\n');
  await writeFile(path.join(OUT, '.nojekyll'), '');
}

/* ============================ assets ============================ */

async function buildAssets() {
  await cp(path.join(ROOT, 'src', 'assets'), path.join(OUT, 'assets'), { recursive: true });

  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#120f1a"/>
  <g fill="none" stroke="#e8b87d" stroke-width="2.6" stroke-linecap="round">
    <path d="M8 25c0-7 6-7 6-11a4 4 0 1 0-8 0c0 6 8 6 8 12"/>
    <path d="M24 7c0 7-6 7-6 11a4 4 0 1 0 8 0c0-6-8-6-8-12" opacity=".6"/>
  </g>
</svg>`;
  await writeFile(path.join(OUT, 'favicon.svg'), favicon);
  await writeFile(path.join(OUT, 'assets', 'logo.svg'), favicon);
}

/* ============================ run ============================ */

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  const articles = await loadArticles();
  if (!articles.length) console.warn('! no articles found in content/articles');
  await buildAssets();
  await buildHome(articles);
  await buildArticles(articles);
  await buildTopics(articles);
  await buildWorkbooks();
  await buildFree();
  await buildGames(articles);
  await buildVideos(articles);
  await buildNovels();
  await buildKids();
  await buildStatic(articles);
  await buildFeeds(articles);
  console.log(`✶ built ${pages.length} indexed pages + feeds → dist/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
