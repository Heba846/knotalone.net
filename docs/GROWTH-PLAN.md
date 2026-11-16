# Sales in 8 weeks — the honest plan

Written 16 Nov 2026. Goal: money in, not followers.

---

## The single biggest problem: two businesses wearing one coat

You are running two companies and marketing them as one. That is why the sales are flat.

| | **Thoughtkind Press** | **Knot Alone** |
|---|---|---|
| Buyer | Clinicians running IOP/PHP groups | Adults with ADHD, anxious attachment, breakups |
| Product | Group therapy curriculum, worksheets | Memoir, novels, printables |
| Price | Higher, institutional | $3–15, impulse |
| They buy because | A group on Tuesday needs material | A sentence described them exactly |
| Where they are | **LinkedIn**, professional groups | **Pinterest, YouTube, Amazon** |
| Decision time | Weeks, with a budget | Four minutes |

A clinician does not buy from a Pinterest pin. An ADHD reader at 1am does not read a LinkedIn
post about group facilitation. Posting both to the same feed means **each audience scrolls past
most of what you publish**, which teaches every algorithm that your content is weak.

**Decision needed from you:** keep them as two brands with two channel sets. One shared engine
(this repo) can feed both — but the accounts, the voice and the offers stay separate.

---

## Reality check on "organic ranking in 2 months"

Google SEO for a 2-day-old domain does not produce sales in 8 weeks. It is a 4–8 month play and
it is already set up correctly — leave it running and stop measuring it weekly.

**But you already own the search engine that matters: Amazon.** Three books are listed. Amazon's
own search is where people with purchase intent type "ADHD memoir" and "closed door mafia
romance". That is the fastest path to money, and it costs nothing but editing.

So the ranking order of effort for the next 8 weeks:

1. **Amazon listing optimisation** — fastest money, zero audience needed
2. **Pinterest** — slowest-decaying organic traffic in this niche; a pin works for months
3. **LinkedIn (facilitators only)** — one post can reach the exact institutional buyer
4. **YouTube** — the 30 videos; builds the asset that feeds everything else
5. **Instagram / Facebook** — last. With 0 followers these are the *worst* return per hour.

If you only do one thing this month, do #1.

---

## Week-by-week

### Weeks 1–2 — Amazon first (the only channel with buyers already in it)

For each of the three books:

- [ ] **Backend keywords** (7 fields, KDP → edit listing). Not your title words — the phrases
      buyers type. For the memoir: `late diagnosed adhd women`, `adhd masking book`,
      `adhd memoir`, `high functioning adhd`, `adhd diagnosis adult woman`,
      `women with adhd book`, `adhd workbook adults`.
- [ ] **Two categories each**, as narrow as you can get. Narrow category = "#1 Best Seller"
      badge is reachable. Broad category = invisible forever.
- [ ] **A+ Content** (free in KDP for brand-registered authors). Three modules: who it is for,
      what is inside, the author note.
- [ ] **Series page** if any two books belong together.
- [ ] **First 10 reviews.** This is the whole game. Amazon shows books with reviews. Use your
      existing Gumroad downloaders — the people who already took a free printable are the
      warmest audience you will ever have, and you have their emails.
- [ ] **Author Central profile** (free): photo, bio, link to knotalone.net, all books claimed.

**Why this first:** a person searching "adhd masking book" on Amazon has a credit card open.
A person scrolling Instagram does not.

### Weeks 2–4 — Pinterest, built properly once

Pinterest is the only social channel where a single piece of work keeps producing for months,
and the audience match for printables and ADHD content is the strongest of any platform.

- [ ] Business account, **claim knotalone.net** (you already have the site verified with Google —
      this is the same kind of step, 5 minutes)
- [ ] 8 boards, each named with the search phrase, not a cute name:
      `ADHD tips for adults` · `Overthinking help` · `Anxious attachment` ·
      `Breakup recovery` · `Free mental health printables` · `ADHD planner printables` ·
      `Books for ADHD adults` · `Closed door romance books`
- [ ] **5 different images per printable** (not the same pin repinned — that is now treated as
      spam). 7 printables × 5 = 35 pins. Batch them in Canva in one sitting.
- [ ] Every pin links to the **page** (`/free/<slug>/`), never the PDF. The page has the email
      capture and the internal links; the PDF is a dead end.
- [ ] Pin text names a **skill**, never a symptom: *"a 5-minute worksheet to slow a spiral"*,
      not *"signs you have anxiety"*. Pinterest explicitly prohibits "negative self-talk"
      content — the aesthetic sad-quote pin that does well in this niche is the exact format
      that gets suppressed.

### Weeks 3–6 — the 30 videos, and LinkedIn for the other business

**YouTube:** schedule the 30. Every description's first line is the article link. Pin a comment
with the free printable. After the first week, read only two numbers — CTR and 30-second
retention — and rewrite the titles and thumbnails of the remaining videos based on what they say.

**LinkedIn — facilitators only.** This is where the Thoughtkind money is, and it is completely
untapped. Two posts a week, no selling for the first three weeks:
- a real problem from running groups ("what to do when the room goes silent in week 3")
- one concrete thing that worked
- the book mentioned only when someone asks

One post that reaches 40 clinicians is worth more than 4,000 Instagram impressions, because
each of them has a budget and a recurring need.

### Weeks 6–8 — convert the attention

- [ ] Email list working (the single biggest hole — see below)
- [ ] A "start here" offer: free printable → 5-email sequence → the book that matches their knot
- [ ] First outreach wave from `docs/BACKLINKS.md` (Mind Remake Project, OER Commons, NDSU)
- [ ] Read the data: which topic produced the most traffic → write the next 8 articles there

---

## The hole that will swallow everything else

**You have no working email list.** The Readers' Line currently points at the Gumroad subscribe
page, which is better than nothing and worse than a real list.

30 videos will produce the biggest traffic spike this brand has ever had. Without a list, every
one of those people arrives, reads, and is gone forever. With a list, 5–10% of them become people
you can reach again for free, every week, for years.

**MailerLite free tier: 1,000 subscribers, 30 minutes to set up.** Then send me the form URL and
it is wired into every page on the site in one line.

This is worth more than any single thing in this plan.

---

## What "fully automatic" can and cannot mean

Being exact, because this matters:

**What I can automate completely** (and am building):
- Generating every post for every platform from the site's own content — Pinterest titles and
  descriptions, Instagram carousel scripts and captions, Facebook posts, LinkedIn posts,
  YouTube titles, descriptions and pinned comments
- Regenerating the whole queue whenever an article is added
- A dated publishing calendar, so nothing has to be decided in the moment

**What I cannot do from here:** publish to Facebook, Instagram, LinkedIn, Pinterest or YouTube.
There is no authorised connection to any of them in this workspace, and no amount of cleverness
changes that.

**The bridge, and it is one step:** a scheduler with an API — **Publer** or **Buffer**, free tier,
both post to all five platforms. You connect your accounts once, give me the API key, and a
GitHub Action pushes the generated queue into the scheduler on a cron. After that it is genuinely
hands-off: new article → posts generated → scheduled → published.

**Without that key**, the realistic version is: everything is generated for you, and you bulk-paste
into Meta Business Suite and Pinterest's native scheduler once a month. About 30 minutes monthly.

**What I will not do:** post in Facebook groups under your name. Most groups ban promotion
outright, and group posting from an automated account is the fastest route to losing the page.
Groups are worth using — by you, as yourself, answering questions, with a link only where it
genuinely helps.

---

## How to tell if this is working

Ignore followers. Watch these, weekly:

| Metric | Where | Week 8 target |
|---|---|---|
| Amazon units sold | KDP dashboard | the only number that matters |
| Amazon reviews | product pages | 10+ per book |
| Email subscribers | provider | 150+ |
| Pinterest outbound clicks | Pinterest analytics | 300+/month |
| Site users | GA4 | 1,000/month |
| LinkedIn post views (facilitator posts) | LinkedIn | 500+/post |

Google impressions will be near zero for 6 weeks and then start moving. That is normal and it is
not a reason to change anything.
