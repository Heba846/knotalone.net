# Knot Alone — knotalone.net

Psychology, simplified. Static site: **zero runtime dependencies**, builds with plain Node.

```bash
npm run build     # content → dist/
npm run dev       # build + preview on http://localhost:4173
npm run check     # broken links, meta lengths, duplicate titles, JSON-LD validity
npm run og        # regenerate the social card + app icons (needs Playwright)
npm run shoot     # screenshot every page type + interaction smoke test (needs Playwright)
```

Push to `main` → GitHub Actions builds and deploys to Pages (`.github/workflows/deploy.yml`).

## Where to edit things

| I want to… | File |
|---|---|
| Add an article | `content/articles/<slug>.md` |
| Add a workbook, printable, game, novel or kids book | `content/data.mjs` |
| Change topics (the five knots) | `content/data.mjs` → `topics` |
| Add Amazon links, YouTube, GSC verification code | `build/config.mjs` |
| Change colours, type, spacing | `src/assets/styles.css` (tokens at the top) |
| Change interactions (quizzes, saved items, theme) | `src/assets/main.js` |
| Change page structure | `build/build.mjs` + `build/templates.mjs` |

Nothing is hardcoded in HTML — every page is generated.

## Article frontmatter

```markdown
---
title: Why your brain replays conversations at 2am
slug: why-your-brain-replays-conversations
date: 2026-10-02
updated: 2026-11-14
summary: One or two sentences. Becomes the card text and the meta description.
answer: The one-paragraph direct answer. Renders as "The short answer" and feeds answer engines.
tags: [overthinking, healing]
faq1_q: Why does overthinking get worse at night?
faq1_a: Because the distractions are gone…
faq2_q: …
faq2_a: …
---
```

- `tags` must match topic slugs in `content/data.mjs` (`overthinking`, `attachment`, `breakups`, `adhd`, `healing`).
- Up to 8 FAQ pairs; they render as an accordion **and** as `FAQPage` structured data.
- Markdown extras: `::: try`, `::: science`, `::: careful` callout blocks.

## What gets generated

`dist/sitemap.xml`, `robots.txt` (AI crawlers explicitly allowed), `rss.xml`, `llms.txt`
(a clean site map for answer engines), `manifest.webmanifest`, `favicon.svg`, `CNAME`, `404.html`.

Every page ships JSON-LD: `Organization`, `WebSite` + `SearchAction`, plus `Article`,
`FAQPage`, `BreadcrumbList`, `Product`, `Book`, `Game` and `CollectionPage` where they apply.

## Going live

See [`docs/LAUNCH.md`](docs/LAUNCH.md) — DNS, GitHub Pages, Search Console, Bing, and the first
30 days of SEO/AEO work in order.

## House rules for content

Educational, never diagnostic. No invented statistics. No shaming, no pressure selling —
breakup, anxious-attachment and ADHD readers arrive in pain. The knowledge is free;
the paid products sell the execution (structure, prompts, printable practice).
