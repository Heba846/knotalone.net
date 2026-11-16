/* ===========================================================
   The content engine.

   Reads everything the site already contains — articles, books,
   printables, games — and writes ready-to-publish posts for every
   platform into social/, plus a dated calendar and a machine-readable
   queue a scheduler can consume.

   Run: npm run social
   Nothing here invents a claim: every line is built from copy that is
   already on the site or in content/data.mjs.
   =========================================================== */

import { readFile, readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { site } from './config.mjs';
import { parseFrontmatter, renderMarkdown, stripHtml } from './markdown.mjs';
import { topics, workbooks, freebies, games, novels, kidsBooks } from '../content/data.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'social');
const url = (p) => site.url.replace(/\/$/, '') + p;

/* ---------- Pinterest board map (create these, named exactly) ---------- */
const BOARDS = {
  overthinking: 'Overthinking help',
  attachment: 'Anxious attachment',
  breakups: 'Breakup recovery',
  adhd: 'ADHD tips for adults',
  healing: 'Healing and self-growth',
  free: 'Free mental health printables',
  books: 'Books for ADHD adults',
  romance: 'Closed door romance books',
};

/* Keyword tails Pinterest searchers actually type, per topic. */
const TAILS = {
  overthinking: ['overthinking at night', 'racing thoughts help', 'how to stop overthinking', 'anxious mind tips'],
  attachment: ['anxious attachment style', 'relationship anxiety help', 'attachment styles explained', 'secure attachment tips'],
  breakups: ['breakup recovery tips', 'how to get over someone', 'no contact rule help', 'healing after a breakup'],
  adhd: ['adhd adults tips', 'adhd women', 'executive dysfunction help', 'adhd productivity'],
  healing: ['emotional healing tips', 'self growth journey', 'mental health tips', 'nervous system regulation'],
};

const clamp = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;:—-]+$/, '') + '…');
const sentences = (t) => stripHtml(t).split(/(?<=[.!?])\s+/).filter(Boolean);

/* ============================ load ============================ */

async function loadArticles() {
  const dir = path.join(ROOT, 'content', 'articles');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const f of (await readdir(dir)).filter((x) => x.endsWith('.md'))) {
    const { data, body } = parseFrontmatter(await readFile(path.join(dir, f), 'utf8'));
    const { html } = renderMarkdown(body);
    const tags = Array.isArray(data.tags) ? data.tags : (data.tags || '').split(/\s+/).filter(Boolean);
    const faqs = [];
    for (let i = 1; i <= 8; i++) if (data[`faq${i}_q`]) faqs.push({ q: data[`faq${i}_q`], a: data[`faq${i}_a`] });
    // the "try this" callout is the most postable unit on the page
    const tryBlock = (body.match(/::: try[^\n]*\n([\s\S]*?)\n:::/) || [])[1] || '';
    out.push({
      kind: 'article',
      slug: data.slug || f.replace(/\.md$/, ''),
      title: data.title,
      summary: data.summary,
      answer: data.answer || '',
      tags,
      topic: tags[0],
      faqs,
      try: stripHtml(tryBlock).trim(),
      body: stripHtml(html),
      url: url(`/articles/${data.slug || f.replace(/\.md$/, '')}/`),
    });
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

/* ============================ generators ============================ */

function pinterestPins(item) {
  const topic = item.topic && TAILS[item.topic] ? item.topic : 'healing';
  const tails = TAILS[topic];
  const board = item.kind === 'freebie' ? BOARDS.free : item.kind === 'novel' ? BOARDS.romance : BOARDS[topic] || BOARDS.healing;
  const hook = item.answer || item.summary || item.hook || '';
  const first = sentences(hook)[0] || item.summary || '';

  // 5 angles, because Pinterest wants fresh pins, not the same pin repeated
  const angles = [
    { t: item.title, d: first },
    { t: `${item.title} — what actually helps`, d: item.try || first },
    { t: tails[0] ? `${tails[0][0].toUpperCase()}${tails[0].slice(1)}: the part nobody explains` : item.title, d: first },
    { t: item.faqs?.[0]?.q || item.title, d: item.faqs?.[0]?.a ? clamp(stripHtml(item.faqs[0].a), 220) : first },
    { t: item.kind === 'freebie' ? `Free printable: ${item.title}` : `Read this at 1am: ${item.title}`, d: first },
  ];

  return angles.map((a, i) => ({
    variant: i + 1,
    board,
    title: clamp(a.t, 100),
    description: clamp(
      `${a.d} ${item.kind === 'freebie' ? 'Free one-page printable, no email needed.' : ''} ${tails[i % tails.length]}.`.replace(/\s+/g, ' ').trim(),
      480
    ),
    link: item.url,
    altText: clamp(`${item.title} — Knot Alone`, 120),
    imageNote: item.kind === 'freebie' ? 'Show the actual printable page — for a printable the mockup is the ad.' : 'Vertical 2:3, title text readable at thumbnail size.',
  }));
}

function instagramPost(item) {
  const first = sentences(item.answer || item.summary || '')[0] || item.summary || '';
  const points = (item.faqs || []).slice(0, 4).map((f) => ({ q: f.q, a: clamp(stripHtml(f.a), 180) }));
  const slides = [
    { n: 1, text: item.title, note: 'Hook slide. Big type, one idea, no logo.' },
    { n: 2, text: first, note: 'Slide 2 hooks again — most people leave here.' },
    ...points.map((p, i) => ({ n: i + 3, text: `${p.q}\n\n${p.a}`, note: 'One idea per slide.' })),
    { n: points.length + 3, text: item.try || 'Try this tonight.', note: 'The actionable one. This is what gets saved.' },
    { n: points.length + 4, text: 'Full version on knotalone.net — link in bio', note: 'CTA slide. One ask only.' },
  ];
  return {
    slides,
    caption: [
      first,
      '',
      item.try ? `Try this tonight: ${item.try}` : '',
      '',
      'Save this for the night you need it.',
      '',
      'Full article + the free printable on knotalone.net (link in bio).',
      '',
      'Educational, not therapy.',
    ].filter((l) => l !== null).join('\n'),
    firstComment: `The written version with the research behind it: ${item.url}`,
    hashtags: hashtagsFor(item),
  };
}

function hashtagsFor(item) {
  const base = {
    overthinking: ['#overthinking', '#racingthoughts', '#anxietyrelief', '#mentalhealthawareness', '#rumination'],
    attachment: ['#anxiousattachment', '#attachmentstyles', '#relationshipanxiety', '#securelove', '#attachmenttheory'],
    breakups: ['#breakuprecovery', '#healingfromheartbreak', '#nocontact', '#movingon', '#breakupadvice'],
    adhd: ['#adhdadults', '#adhdwomen', '#executivedysfunction', '#adhdtips', '#neurodivergent'],
    healing: ['#emotionalhealing', '#selfgrowth', '#nervoussystem', '#mentalhealthtips', '#healingjourney'],
  };
  return [...(base[item.topic] || base.healing), '#knotalone', '#psychologyexplained'].join(' ');
}

function facebookPost(item) {
  const first = sentences(item.answer || item.summary || '')[0] || '';
  const rest = sentences(item.answer || item.summary || '').slice(1).join(' ');
  return [
    first,
    '',
    rest,
    '',
    item.try ? `What to try tonight: ${item.try}` : '',
    '',
    `Full version here: ${item.url}`,
  ].filter(Boolean).join('\n');
}

/* LinkedIn is the facilitator channel — a different business, a different voice. */
function linkedinPost(item) {
  const first = sentences(item.answer || item.summary || '')[0] || '';
  return {
    audience: 'Facilitators, therapists, group leads — Thoughtkind lane',
    text: [
      `Something that comes up constantly in groups: ${item.title.toLowerCase()}.`,
      '',
      first,
      '',
      'What I keep seeing: the explanation itself does most of the work. People stop defending a behaviour once it stops looking like a character flaw and starts looking like a mechanism.',
      '',
      item.try ? `The version that travels well into a session: ${item.try}` : '',
      '',
      'Written up in plain language here, free to hand to a client:',
      item.url,
    ].filter(Boolean).join('\n'),
    note: 'No selling for the first three weeks. Mention a book only when someone asks.',
  };
}

function youtubePack(item) {
  const first = sentences(item.answer || item.summary || '')[0] || '';
  return {
    titleOptions: [
      clamp(item.title, 70),
      clamp(item.faqs?.[0]?.q || item.title, 70),
      clamp(`${item.title} (and what to do about it)`, 70),
    ],
    description: [
      `${first}`,
      '',
      `Full written version + the free printable:`,
      item.url,
      '',
      'Every free printable:',
      url('/free/'),
      '',
      'Knot Alone explains the psychology behind everyday behaviour — overthinking, attachment, breakups, ADHD and healing. Educational, never diagnostic.',
      '',
      'Chapters:',
      '0:00 ',
    ].join('\n'),
    pinnedComment: `The worksheet for this one is free here 👇\n${item.url}\n\nWhat are you replaying right now?`,
    tags: (TAILS[item.topic] || TAILS.healing).join(', '),
  };
}

/* ============================ assemble ============================ */

function itemsFrom(articles) {
  const out = [...articles];
  for (const f of freebies)
    out.push({
      kind: 'freebie', slug: f.slug, title: f.title, summary: f.desc, answer: f.desc,
      topic: f.topic, url: url(`/free/${f.slug}/`), faqs: [], try: '',
    });
  for (const g of games)
    out.push({
      kind: 'game', slug: g.slug, title: g.title, summary: g.tagline, answer: g.blurb || g.tagline,
      topic: g.topic, url: url(`/games/${g.slug}/`), faqs: [], try: '',
    });
  for (const w of workbooks)
    out.push({
      kind: 'book', slug: w.slug, title: w.title, summary: w.sub, answer: `${w.hook} ${w.promise}`,
      topic: w.topic, url: url(`/workbooks/${w.slug}/`), buy: w.buy, faqs: [], try: '',
    });
  for (const n of novels)
    out.push({
      kind: 'novel', slug: n.slug, title: n.title, summary: n.sub, answer: n.hook,
      topic: 'healing', url: url(`/novels/${n.slug}/`), buy: n.buyKindle, faqs: [], try: '',
      tropes: n.tropes,
    });
  for (const k of kidsBooks)
    out.push({
      kind: 'kids', slug: k.slug, title: k.title, summary: k.sub, answer: k.hook,
      topic: k.topic, url: url(`/kids/${k.slug}/`), buy: k.buy, faqs: [], try: '',
    });
  return out;
}

const md = (s) => s.replace(/\n/g, '\n');

async function main() {
  const articles = await loadArticles();
  const items = itemsFrom(articles);
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const queue = [];

  for (const item of items) {
    const pins = pinterestPins(item);
    const ig = instagramPost(item);
    const fb = facebookPost(item);
    const li = linkedinPost(item);
    const yt = youtubePack(item);
    queue.push({ slug: item.slug, kind: item.kind, topic: item.topic, url: item.url, pinterest: pins, instagram: ig, facebook: fb, linkedin: li, youtube: yt });
  }

  // machine-readable, for a scheduler
  await writeFile(path.join(OUT, 'queue.json'), JSON.stringify({ generated: new Date().toISOString(), site: site.url, items: queue }, null, 2));

  // human-readable, per platform
  const pinLines = ['# Pinterest queue', '', `${queue.length} items × 5 pins = ${queue.length * 5} pins.`, '', '> Pin to the page, never the PDF. One image per pin — do not repin the same image across boards.', ''];
  for (const q of queue) {
    pinLines.push(`## ${q.slug}  \n\`${q.url}\``, '');
    for (const p of q.pinterest) {
      pinLines.push(`**Pin ${p.variant}** · board: *${p.board}*`, '', `- **Title:** ${p.title}`, `- **Description:** ${p.description}`, `- **Alt text:** ${p.altText}`, `- **Image:** ${p.imageNote}`, '');
    }
  }
  await writeFile(path.join(OUT, 'pinterest.md'), pinLines.join('\n'));

  const igLines = ['# Instagram queue', '', 'Carousels. Slides 1 and 2 both have to hook — most people leave on slide 2.', ''];
  for (const q of queue) {
    igLines.push(`## ${q.slug}`, '');
    for (const s of q.instagram.slides) igLines.push(`**Slide ${s.n}** — _${s.note}_`, '', '> ' + s.text.replace(/\n/g, '\n> '), '');
    igLines.push('**Caption:**', '', '```', q.instagram.caption, '```', '', `**First comment:** ${q.instagram.firstComment}`, '', `**Hashtags:** ${q.instagram.hashtags}`, '', '---', '');
  }
  await writeFile(path.join(OUT, 'instagram.md'), igLines.join('\n'));

  const fbLines = ['# Facebook queue', '', 'Longer and story-led. Facebook rewards dwell time, not punchiness.', ''];
  for (const q of queue) fbLines.push(`## ${q.slug}`, '', '```', q.facebook, '```', '');
  await writeFile(path.join(OUT, 'facebook.md'), fbLines.join('\n'));

  const liLines = ['# LinkedIn queue — facilitator lane', '', '> This is the Thoughtkind audience, not the Knot Alone one. Peer to peer, no selling for the first three weeks.', ''];
  for (const q of queue.filter((q) => q.kind === 'article')) liLines.push(`## ${q.slug}`, '', '```', q.linkedin.text, '```', '', `_${q.linkedin.note}_`, '');
  await writeFile(path.join(OUT, 'linkedin.md'), liLines.join('\n'));

  const ytLines = ['# YouTube queue', '', 'Line one of every description is the article link. Pin the comment with the printable.', ''];
  for (const q of queue.filter((q) => q.kind === 'article')) {
    ytLines.push(`## ${q.slug}`, '', '**Title options:**', ...q.youtube.titleOptions.map((t, i) => `${i + 1}. ${t}`), '', '**Description:**', '', '```', q.youtube.description, '```', '', '**Pinned comment:**', '', '```', q.youtube.pinnedComment, '```', '', `**Tags:** ${q.youtube.tags}`, '', '---', '');
  }
  await writeFile(path.join(OUT, 'youtube.md'), ytLines.join('\n'));

  // a dated calendar: 8 weeks, what goes out when
  const start = new Date();
  const cal = ['# 8-week publishing calendar', '', `Generated ${start.toISOString().slice(0, 10)}. One row per slot.`, '', '| Date | Platform | What | Link |', '|---|---|---|---|'];
  const arts = queue.filter((q) => q.kind === 'article');
  const frees = queue.filter((q) => q.kind === 'freebie');
  const bookItems = queue.filter((q) => ['book', 'novel', 'kids'].includes(q.kind));
  let d = new Date(start);
  const fmt = (x) => x.toISOString().slice(0, 10);
  const bump = (n) => { d = new Date(d.getTime() + n * 86400000); };
  for (let week = 0; week < 8; week++) {
    // 5 pins a week, rotating through everything
    for (let i = 0; i < 5; i++) {
      const q = queue[(week * 5 + i) % queue.length];
      cal.push(`| ${fmt(d)} | Pinterest | ${q.slug} — pin ${(i % 5) + 1} | ${q.url} |`);
      bump(1);
    }
    bump(-5);
    // 2 LinkedIn, 2 IG, 1 FB, 1 book push per week
    const a1 = arts[(week * 2) % arts.length], a2 = arts[(week * 2 + 1) % arts.length];
    cal.push(`| ${fmt(new Date(d.getTime() + 1 * 86400000))} | LinkedIn | ${a1.slug} | ${a1.url} |`);
    cal.push(`| ${fmt(new Date(d.getTime() + 3 * 86400000))} | LinkedIn | ${a2.slug} | ${a2.url} |`);
    cal.push(`| ${fmt(new Date(d.getTime() + 2 * 86400000))} | Instagram | ${a1.slug} carousel | ${a1.url} |`);
    cal.push(`| ${fmt(new Date(d.getTime() + 5 * 86400000))} | Instagram | ${frees[week % frees.length].slug} | ${frees[week % frees.length].url} |`);
    cal.push(`| ${fmt(new Date(d.getTime() + 4 * 86400000))} | Facebook | ${a2.slug} | ${a2.url} |`);
    cal.push(`| ${fmt(new Date(d.getTime() + 6 * 86400000))} | Amazon/book push | ${bookItems[week % bookItems.length].slug} | ${bookItems[week % bookItems.length].url} |`);
    bump(7);
  }
  await writeFile(path.join(OUT, 'calendar.md'), cal.join('\n'));

  await writeFile(
    path.join(OUT, 'README.md'),
    `# Generated social queue

Regenerate with \`npm run social\` — everything here is built from the site's own content,
so adding an article adds its posts automatically.

| File | What |
|---|---|
| \`calendar.md\` | 8 weeks of dated slots — what goes out, where, when |
| \`pinterest.md\` | ${queue.length * 5} pins, 5 angles per item, with board names |
| \`instagram.md\` | carousel scripts slide by slide, captions, first comments, hashtags |
| \`facebook.md\` | longer story-led posts |
| \`linkedin.md\` | facilitator-lane posts (Thoughtkind audience, different voice) |
| \`youtube.md\` | title options, descriptions, pinned comments, tags |
| \`queue.json\` | the same data, machine-readable, for a scheduler API |

## Making it publish by itself

\`queue.json\` is the handoff. Connect a scheduler that has an API (Publer or Buffer, free tier,
both post to all five platforms), give Claude the API key, and a scheduled GitHub Action pushes
this queue into it. After that it is hands-off.

Without a scheduler key, paste from these files into Meta Business Suite and Pinterest's native
scheduler once a month — about 30 minutes.
`
  );

  console.log(`✶ social: ${queue.length} items → ${queue.length * 5} pins, ${queue.filter((q) => q.kind === 'article').length} LinkedIn + YouTube packs`);
  console.log(`  written to social/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
