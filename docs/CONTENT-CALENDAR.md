# The 30-day run — video ↔ article ↔ printable

Thirty videos over thirty days, each with a written version on the site the same day. This is the
map. One row = one day's full package.

## How to publish a day

1. Schedule the video on YouTube.
2. Add `video:` to that day's article frontmatter — a YouTube id **or** any YouTube URL:

```markdown
---
title: ADHD time blindness — why "five minutes" is never five minutes
slug: adhd-time-blindness
video: https://youtu.be/XXXXXXXXXXX
videoDuration: 6 min
videoDate: 2026-12-03
---
```

3. `npm run build && npm run check`, then push.

What that one line does automatically: embeds the video at the top of the article (nothing loads
from YouTube until the reader presses play, so it costs no page speed), adds `VideoObject`
structured data so the episode can show as a video result in Google, and lists it on `/videos/`.
Articles without `video:` sit in the "waiting for their episode" section of that page.

**In the YouTube description, line one is the article link.** That is the whole traffic loop:
video → article → printable → email list.

---

## The 30 days

Rows marked **✅ written** already exist on the site. The rest are the queue, each with its target
search and the printable it hands off to.

| # | Episode / article | Topic | Target search | Printable |
|---|---|---|---|---|
| 1 | Why your brain replays conversations at 2am ✅ | Overthinking | why do I replay conversations | Spiral Stopper |
| 2 | How to stop overthinking at night ✅ | Overthinking | how to stop overthinking at night | 3am Brain Dump |
| 3 | Why reassurance stops working after twenty minutes ✅ | Attachment | why do I need constant reassurance | Needs Checklist |
| 4 | Why a breakup feels like withdrawal ✅ | Breakups | why does a breakup hurt physically | Do I Text Them |
| 5 | Why starting is the hardest part ✅ | ADHD | ADHD can't start tasks | Task Starter Cards |
| 6 | Healing is a shorter spiral ✅ | Healing | healing is not linear | Weekly Knot Planner |
| 7 | Why I push people away when I like them ✅ | Attachment | why do I push people away | Needs Checklist |
| 8 | ADHD time blindness ✅ | ADHD | ADHD time blindness | Task Starter Cards |
| 9 | How long does it take to get over someone ✅ | Breakups | how long to get over someone | Do I Text Them |
| 10 | Why one criticism outweighs ten compliments ✅ | Overthinking | why do I dwell on criticism | Spiral Stopper |
| 11 | The 3am brain: why everything feels worse at night | Overthinking | why do problems feel worse at night | 3am Brain Dump |
| 12 | What "the ick" actually is | Attachment | what causes the ick | Needs Checklist |
| 13 | Why you remember the cringe thing from 2014 | Overthinking | cringe attacks intrusive memories | Spiral Stopper |
| 14 | Anxious and avoidant: why they find each other | Attachment | anxious avoidant trap | Needs Checklist |
| 15 | Closure is something you write, not something you get | Breakups | how to get closure without them | Closure Letters |
| 16 | Why you clean the kitchen instead of doing the task | ADHD | productive procrastination ADHD | Task Starter Cards |
| 17 | Rejection sensitivity: when a neutral face feels like a verdict | ADHD | rejection sensitive dysphoria explained | Spiral Stopper |
| 18 | Why "just communicate" is useless advice | Attachment | how to express needs in a relationship | Needs Checklist |
| 19 | The grief nobody validates: friendship breakups | Healing | friendship breakup grief | Closure Letters |
| 20 | Why you apologise for things that aren't your fault | Attachment | why do I over-apologise | Needs Checklist |
| 21 | Hyperfocus is not a superpower (and not a failure) | ADHD | ADHD hyperfocus explained | ADHD Day Designer |
| 22 | Why you can't relax on your day off | Overthinking | can't relax guilt resting | Weekly Knot Planner |
| 23 | The 6-week mark: why it gets worse before better | Breakups | breakup timeline weeks | Decompression Kit |
| 24 | Masking: what it costs and why you can't just stop | ADHD | ADHD masking exhaustion | ADHD Day Designer |
| 25 | Why you test people who have done nothing wrong | Attachment | relationship testing behaviour | Needs Checklist |
| 26 | Your nervous system doesn't know the argument ended | Healing | why do I feel shaky after an argument | Spiral Stopper |
| 27 | Why kids say "I'm bored" when they mean something else | Kids | child says bored meaning | Feelings Weather |
| 28 | What to say instead of "calm down" to a child | Kids | what to say instead of calm down | Feelings Weather |
| 29 | Why going no-contact feels like a relapse | Breakups | no contact withdrawal | Do I Text Them |
| 30 | What actually changes an attachment pattern | Attachment | can attachment style change | Anxious to Secure |

---

## Why this order

- **Days 1–10 are already written**, so the first third of the run needs no new writing — only the video ids pasted in. That buys you breathing room while filming.
- **Days 11–30 rotate the five topics** so the channel never looks like a single-issue account and every topic hub keeps filling.
- **Days 27–28 are the kids episodes**, placed late on purpose: by then the channel has adult-audience proof, and they are the two that parents and teachers share hardest.
- **Day 30 is the one that sells**, because by then the audience has watched twenty-nine explanations of a problem and the honest answer is "this is learnable" — which is what the workbook is.

## The weekly rhythm after day 30

One video → one article → one printable → five fresh pins → one Readers' Line email.
That's the loop. Everything else is optional.
