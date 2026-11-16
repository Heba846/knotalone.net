# Generated social queue

Regenerate with `npm run social` — everything here is built from the site's own content,
so adding an article adds its posts automatically.

| File | What |
|---|---|
| `calendar.md` | 8 weeks of dated slots — what goes out, where, when |
| `pinterest.md` | 205 pins, 5 angles per item, with board names |
| `instagram.md` | carousel scripts slide by slide, captions, first comments, hashtags |
| `facebook.md` | longer story-led posts |
| `linkedin.md` | facilitator-lane posts (Thoughtkind audience, different voice) |
| `youtube.md` | title options, descriptions, pinned comments, tags |
| `queue.json` | the same data, machine-readable, for a scheduler API |

## Making it publish by itself

`queue.json` is the handoff. Connect a scheduler that has an API (Publer or Buffer, free tier,
both post to all five platforms), give Claude the API key, and a scheduled GitHub Action pushes
this queue into it. After that it is hands-off.

Without a scheduler key, paste from these files into Meta Business Suite and Pinterest's native
scheduler once a month — about 30 minutes.
