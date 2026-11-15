# Launch & SEO/AEO playbook — knotalone.net

Do these in order. Steps 1–4 are one evening. Steps 5+ are the first 30 days.

---

## 1. Put the site online (GitHub Pages)

1. Merge this branch into `main`.
2. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow builds, runs the link/meta check, deploys.
4. Settings → Pages → **Custom domain**: `knotalone.net` → Save. Tick **Enforce HTTPS**
   once the certificate is issued (can take up to an hour).

`dist/CNAME` is generated on every build, so the custom domain survives redeploys.

## 2. DNS at your registrar

For the apex domain `knotalone.net`, four `A` records:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

And four `AAAA` records:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

Plus a `CNAME` for `www` → `heba846.github.io`.

> Confirm these against GitHub's own Pages docs before pasting — if GitHub ever changes
> the IPs, the authoritative list is in **Settings → Pages** after you add the domain.

DNS can take anywhere from minutes to a few hours. GitHub shows a green check when it sees it.

## 3. Verify in Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console) → **Add property**.
2. Choose **Domain** (not URL prefix) → enter `knotalone.net` → it gives you a **TXT record**.
   Add that TXT at your registrar. Domain-level verification covers `www`, `http` and `https`
   in one go, which is why it is worth the extra step.
   *If your registrar makes TXT records painful:* use the **URL prefix** method instead,
   paste the `content` value into `gscVerification` in `build/config.mjs`, rebuild and push —
   the meta tag renders automatically.
3. Once verified: **Sitemaps → Add a new sitemap → `sitemap.xml` → Submit.**
4. **URL Inspection** → paste `https://knotalone.net/` → *Request indexing*. Do the same for
   your five strongest pages (the two overthinking articles, `/games/whats-knotting-you/`,
   `/free/`, `/kids/my-brain-has-its-own-speed/`). Don't bother doing all 45 — Google will
   crawl the rest from the sitemap.
5. **Settings → Users and permissions**: add a backup email so you never lose access.

### Also worth 10 minutes

- **Bing Webmaster Tools** — you can import directly from Search Console. Bing matters
  more than it used to because ChatGPT search leans on it. Add `bingVerification` in
  `build/config.mjs` if you use the meta method.
- **Pinterest** — claim the domain in Pinterest business settings. Your audience lives there,
  and claimed domains get attribution on every pin.

## 4. Fill in the blanks in `build/config.mjs`

| Field | What it does if empty |
|---|---|
| `youtube` | YouTube link is hidden in the footer and omitted from `sameAs` |
| `amazon['marry-to-don']`, `amazon['left-at-the-altar']` | Buy button becomes "Get the release email" |
| `gscVerification` / `bingVerification` | Verification meta tags are not rendered |

Same pattern in `content/data.mjs`: a workbook with an empty `buy`, a printable with an
empty `file`, or a kids book with an empty `buy` renders a waitlist CTA instead of a dead link.
So you can launch today and fill them in as products go live.

---

## 5. The keyword map (what each page is trying to rank for)

Written into the titles, H1s and the `answer` fields already. Don't fight it — extend it.

| Page | Primary intent | Secondary |
|---|---|---|
| `/articles/how-to-stop-overthinking-at-night/` | how to stop overthinking at night | can't sleep because of thoughts, racing mind at night |
| `/articles/why-your-brain-replays-conversations/` | why do I replay conversations | cringe attacks, replaying conversations anxiety |
| `/articles/why-reassurance-stops-working/` | reassurance seeking relationship | anxious attachment reassurance, why do I need constant reassurance |
| `/articles/why-a-breakup-feels-like-withdrawal/` | why does a breakup hurt physically | breakup withdrawal, how long does breakup pain last |
| `/articles/why-starting-is-the-hardest-part-adhd/` | ADHD can't start tasks | task paralysis, ADHD executive dysfunction starting |
| `/articles/healing-is-a-shorter-spiral/` | healing is not linear | why does healing feel like going backwards |
| `/topics/*` | the five hub pages — internal link targets, topical authority |
| `/free/` | free printable worksheets anxiety / ADHD | free mental health printables |
| `/games/thought-traps/` | cognitive distortions quiz | thought traps test |
| `/games/switch-cost/` | task switching test | ADHD switch cost |
| `/kids/my-brain-has-its-own-speed/` | ADHD book for kids | children's book about ADHD ages 5-9 |
| `/novels/*` | title searches + trope searches (arranged marriage romance, left at the altar romance) |

**The rule:** one question per page, answered in the first 60 words. That first paragraph is
what gets lifted into a featured snippet or an AI answer.

## 6. AEO — being the source an AI answer cites

Already built in:

- **`llms.txt`** at the root: a clean, link-rich map of every answer on the site.
- **`robots.txt`** explicitly allows GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot,
  Google-Extended and Applebot-Extended. (If you ever want out, flip those to `Disallow`.)
- **Answer-first blocks** — the `answer:` frontmatter renders as "The short answer" at the top
  of every article, in the extractable 40–60 word shape.
- **`FAQPage` schema** on articles, games, workbooks, kids books and the home page — this is
  the single highest-leverage thing for both snippets and AI answers.
- **`Organization` + `sameAs`** linking Instagram, Pinterest, Facebook (and YouTube once set),
  so entity recognition connects the brand across platforms.

What to keep doing:

1. **Write FAQs as real questions people type.** `faq1_q` through `faq8_q`. Four per article minimum.
2. **Answer in the first sentence, then explain.** Never bury the answer under a story.
3. **Be the citable one:** name the mechanism, say what is uncertain, never invent a statistic.
   Answer engines disproportionately quote sources that hedge accurately.
4. **One video → one article.** Every YouTube video should have a matching page with the
   same question in the H1 and the video embedded. That is how video traffic becomes search traffic.

## 7. The first 30 days

**Week 1** — Launch, verify, submit sitemap, request indexing on the top 5. Add the site link
to every social bio (Instagram, Pinterest, Facebook, YouTube About + first pinned comment).
Upload the first 3 free printables so `/free/` stops being a waitlist.

**Week 2** — Publish 2 articles that answer questions from your own comments. Pin 5 Pinterest
pins per printable (vertical, text readable at thumbnail size, keyword-rich description
linking to the `/free/<slug>/` page, not the PDF).

**Week 3** — Internal linking pass: every article links to its topic hub, one sibling article,
one game and one printable. This is free and it is what most sites never do.
Check Search Console → **Performance** for queries you're getting impressions on but no
clicks — those titles need rewriting, not new content.

**Week 4** — First backlinks: answer questions on Reddit (r/ADHD, r/attachment_theory,
r/BreakUps) with a real answer and a link only where it genuinely helps. One guest piece or
podcast. Then repeat the loop: video → article → printable → pin.

## 8. Things that will quietly hurt you

- **Thin duplicate pages.** Don't create a page per keyword variation. One strong page per question.
- **Changing slugs after indexing.** If you must, add redirects.
- **Gating the free printables behind email.** It kills the shares and the backlinks that make
  the rest rank. The email list grows from the Readers' Line, not from a wall.
- **Claiming clinical outcomes.** Beyond being wrong, it is the fastest way to be treated as a
  low-quality health source. Educational framing is already on every page — keep it there.

## 9. After launch, run this before every deploy

```bash
npm run build && npm run check
```

It fails the build on broken internal links, missing canonicals, duplicate titles and invalid
JSON-LD — the four things that quietly destroy a site's search performance.
