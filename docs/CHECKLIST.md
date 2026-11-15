# The 14-day launch checklist — knotalone.net

One block a day, 30–60 minutes. Tick as you go. Nothing here needs code.
Anything marked **⛔ only you can do** needs your logins; everything else is already done or
can be handed back to Claude.

---

## Phase 1 — Get it on the internet (days 1–3)

### Day 1 — Domain & deploy
- [x] ~~Pages source set to GitHub Actions~~ — **done**, the first deploy went green on its own
- [ ] ⛔ **Settings → General → Default branch → switch it to `main`**
      *(it is still the `claude/…` dev branch; Pages only deploys from the default branch, so
      the workflow lists both branches as a workaround until this is done)*
- [ ] ⛔ At your registrar, add the four `A` records and four `AAAA` records from
      [`LAUNCH.md`](LAUNCH.md#2-dns-at-your-registrar), plus `www` → `heba846.github.io`
- [ ] ⛔ Settings → Pages → **Custom domain** → `knotalone.net` → Save
- [ ] Wait for the green check (minutes to a few hours), then tick **Enforce HTTPS**
- [ ] Open `https://knotalone.net` on your phone. If it loads, phase 1 is basically done.

### Day 2 — Search Console & Bing
- [ ] ⛔ Search Console → **Add property → Domain** → `knotalone.net` → add the TXT record
- [ ] ⛔ Sitemaps → submit `sitemap.xml`
- [ ] ⛔ URL Inspection → *Request indexing* for these five:
  - [ ] `/`
  - [ ] `/articles/how-to-stop-overthinking-at-night/`
  - [ ] `/games/whats-knotting-you/`
  - [ ] `/free/`
  - [ ] `/kids/my-brain-has-its-own-speed/`
- [ ] ⛔ Bing Webmaster Tools → import from Search Console (10 minutes, worth it — ChatGPT search uses Bing)
- [ ] ⛔ Add a second email under Search Console → Users, so access can never be lost

### Day 3 — Make the site findable from everything you already own
- [ ] ⛔ Instagram bio → `knotalone.net`
- [ ] ⛔ Pinterest → claim the domain in business settings, bio link
- [ ] ⛔ Facebook page → website field
- [ ] ⛔ YouTube → About → website, plus a pinned comment on your 3 best videos
- [ ] Send Claude the YouTube channel URL → goes into `build/config.mjs` (footer + `sameAs` schema)

---

## Phase 2 — Fill the gaps (days 4–8)

### Day 4 — Products & links
- [ ] ⛔ Send Claude your **Gumroad username/links** for the free products → they get wired in
      as real download buttons (same as the 7 PDFs now live)
- [ ] ⛔ Amazon / GoodNovel links for **Marry to Don** and **Left at the Altar**
- [ ] ⛔ Buy link for **My Brain Has Its Own Speed**
- [ ] ⛔ Prices for the 5 workbooks (empty price = no `Product` offer schema, which costs you rich results)

> Nothing breaks while these are empty — each one shows a waitlist CTA instead of a dead link.

### Day 5 — The email list actually working
- [ ] ⛔ Pick a provider (MailerLite or Kit/ConvertKit free tier is plenty)
- [ ] ⛔ Create the list + a welcome email that delivers one printable
- [ ] Send Claude the form action URL → the Readers' Line form stops being a local stub
- [ ] Write Readers' Line #1 (one behaviour, one thing to try, one free thing)

### Day 6 — Check the whole site on a real phone
- [ ] Every nav item opens
- [ ] Play all 5 mind games to the end
- [ ] Download 2 PDFs and actually print one
- [ ] Save something, then open `/saved/`
- [ ] Switch dark/light
- [ ] Read one article top to bottom — note any sentence that reads as shaming, send it to Claude

### Day 7 — Light week / buffer
- [ ] Catch up on anything above. Do not add new scope.

### Day 8 — First two new articles
Pick from the gap list (these have search demand and no page yet):
- [ ] "Why do I push people away when I like them?" (attachment)
- [ ] "What is a trauma dump, and why do I do it?" (healing)
- [ ] "Why do I remember the one criticism and not the ten compliments?" (overthinking)
- [ ] "ADHD and time blindness: why 'five minutes' is never five minutes" (adhd)
- [ ] "How long does it take to get over someone? (the honest answer)" (breakups)

---

## Phase 3 — Make it grow (days 9–14)

### Day 9 — Pinterest engine
- [ ] 5 vertical pins per printable (7 printables = 35 pins, batch them in Canva)
- [ ] Each pin description: keyword-rich, links to `/free/<slug>/` **not** the PDF
- [ ] Schedule across 2 weeks, not all at once

### Day 10 — Internal linking pass
- [ ] Every article links to: its topic hub + one sibling article + one game + one printable
- [ ] Every game links to its matching article
- [ ] *(Claude can do this pass in one go — just ask)*

### Day 11 — Video → page pairing
- [ ] List your top 10 YouTube videos
- [ ] For each, note the one question it answers
- [ ] Mark which already have a matching article; the rest become the content queue

### Day 12 — First backlinks
- [ ] Answer 3 questions on Reddit (r/ADHD, r/attachment_theory, r/BreakUps) with a real answer,
      link only where it genuinely helps
- [ ] Pitch one guest post or podcast

### Day 13 — Read the data
- [ ] Search Console → Performance → queries with impressions but no clicks
- [ ] Rewrite those page titles (that is a title problem, not a content problem)
- [ ] Note which of the 5 games gets the most traffic → build the next one like it

### Day 14 — Lock the rhythm
- [ ] Decide the weekly loop: 1 video → 1 article → 1 printable → 5 pins → 1 email
- [ ] Put it in the calendar as a repeating block
- [ ] Run `npm run build && npm run check` before any deploy, always

---

## Still open (tracked, not forgotten)

| Gap | Blocked on | Who |
|---|---|---|
| Live domain + HTTPS | DNS at registrar | ⛔ you |
| Search Console verified | your Google account | ⛔ you |
| Amazon / GoodNovel links | the books being listed | ⛔ you |
| Gumroad freebies on site | your Gumroad links | ⛔ you → then Claude |
| Newsletter provider | your choice of provider | ⛔ you → then Claude |
| YouTube in footer + schema | channel URL | ⛔ you → then Claude |
| Kids books 2 & 3 | writing + illustration | you (Claude can draft) |
| More articles | content queue | Claude |
| Internal linking pass | nothing | Claude |
| Arabic version of the site | a decision | you |

**The honest priority order:** domain → Search Console → email list → Gumroad/Amazon links →
more articles. Everything else can wait, and the site works fine without it in the meantime.
