# Working rules for this repo

## Execution
- **Do the work inline. Avoid subagents** (Agent / Workflow / spawned sessions) — the owner
  pays for the tokens. Use a subagent only when a task truly cannot be done in this session,
  and say so first.
- Prefer one Bash call that does several reads over many small calls.

## Channel scope — the Knot Alone funnel
The business runs on five channels only: **knotalone.net, Amazon (KDP), YouTube, Pinterest,
Instagram.** GoodNovel / web-novel platforms are **not** part of this brand — do not add
links, schema or plans for them.

The loop every change should serve (goal = conversions, not followers):
YouTube / Pinterest / Instagram → article on knotalone.net (answers the question, embeds the
video) → free printable (email) or the matching book → Amazon.

## Content rules
- Educational, never diagnostic. No invented statistics. Cite only sources you have verified
  (`source1:` … `source8:` frontmatter, format `Citation text | https://doi.org/...`).
- Every YouTube video gets a matching article (`video:` frontmatter). New video with no
  matching article = a new article.
- `npm run build && npm run check` before any push.
