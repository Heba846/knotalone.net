/* ===========================================================
   Knot Alone — content data.
   Edit this file to add workbooks, games, novels and kids books.
   Empty `buy`/`file` fields render as "coming soon" instead of
   a broken link, so you can publish now and fill in later.
   =========================================================== */

export const topics = [
  {
    slug: 'overthinking',
    name: 'Overthinking',
    tint: 'var(--rope)',
    question: 'Why do I replay one sentence for three days?',
    answer: 'Your brain treats an unfinished conversation like an unsolved threat — so it keeps reopening the file.',
    intro:
      'Rumination is not a personality flaw and it is not "deep thinking". It is a loop that runs because your brain thinks the problem is still live. These pieces explain the mechanism, then give you something to do at 2am.',
  },
  {
    slug: 'attachment',
    name: 'Attachment',
    tint: 'var(--ache)',
    question: 'Why do I need reassurance I already got?',
    answer: 'Reassurance soothes the feeling, not the prediction. The prediction is what learned to expect leaving.',
    intro:
      'Attachment is not a zodiac sign for relationships. It is a set of predictions your nervous system made early about whether closeness is safe — and predictions can be updated, which is the entire point.',
  },
  {
    slug: 'breakups',
    name: 'Breakups',
    tint: 'var(--violet)',
    question: 'Why does missing them feel like withdrawal?',
    answer: 'Because the reward system that tracked them is still firing and the reward stopped arriving.',
    intro:
      'A breakup is a nervous-system event, not only a sad story. Knowing which part of you is grieving and which part is just in withdrawal makes the first six weeks survivable.',
  },
  {
    slug: 'adhd',
    name: 'ADHD',
    tint: 'var(--calm)',
    question: 'Why can I do the hard thing but not the easy one?',
    answer: 'Because the system runs on interest and urgency, not on importance.',
    intro:
      'ADHD is not a motivation problem with extra steps. It is a different relationship with interest, urgency and time — and once you can see it, you can build a day that stops fighting it.',
  },
  {
    slug: 'healing',
    name: 'Healing',
    tint: 'var(--rope)',
    question: 'Why does healing feel like going backwards?',
    answer: 'Because progress shows up as a shorter spiral, not as no spiral.',
    intro:
      'What healing actually looks like from the inside — unglamorous, non-linear, measured in how fast you come back rather than whether you left.',
  },
];

export const workbooks = [
  {
    slug: 'i-blamed-the-brain',
    title: 'I Blamed the Brain',
    sub: 'A Memoir of Late-Diagnosed ADHD and Masking — with the Workbook I Needed at Seven',
    topic: 'adhd',
    author: 'Erena Jabrial',
    buy: 'https://www.amazon.com/dp/B0HQ7Z2V6M',
    format: 'Paperback on Amazon',
    kindleNote: 'The Kindle edition is in review.',
    hook: 'An acquittal letter, delivered to the wrong defendant.',
    promise:
      'A diagnosis that arrived three decades late, and the childhood that made it necessary — with a workbook built into every chapter.',
    for: [
      'You were called clever, but — lazy, but — too sensitive, but',
      'You were treated for depression or anxiety for years before anyone asked a different question',
      'You are competent at work and cannot explain why it costs what it costs',
      'You have been performing wellness so convincingly that nobody has ever thought to worry about you',
    ],
    different: [
      'It is a memoir, not a manual — a real childhood, a real diagnosis at thirty, and the ten years of being partly right that came before it.',
      'Every clinical claim is sourced: 94 numbered notes. Where the evidence is thin or contested, the book says so — including the popular ADHD statistics it takes apart.',
      'It does not sell you a superpower. No cures, no hacks, and no promise that understanding fixes everything.',
    ],
    inside:
      'Every chapter ends with The Notebook — the three-line protocol an eight-year-old invented for herself in the back of a school exercise book — and one thing to try this week, small enough to actually keep. There are ruled pages to write on, and fourteen nights of guided entries at the back.',
    warning:
      'Contains descriptions of childhood emotional abuse and family conflict. It is not a substitute for assessment or treatment, and says so repeatedly.',
    freebie: 'task-starter-cards',
  },
  {
    slug: 'how-to-get-over-someone-you-still-love',
    title: 'How to Get Over Someone You Still Love',
    sub: "30 days of practical steps for grief, self-worth and life after a separation you didn't choose",
    topic: 'breakups',
    buy: 'https://www.amazon.com/dp/B0HP24255Z',
    format: 'Paperback & Kindle on Amazon',
    hook: 'Day 9 is usually worse than day 2. Nobody warns you, so you decide you are failing at this.',
    promise: 'Thirty days of practical steps, taken one day at a time, for the version of this where you did not want it to end.',
    for: [
      'The separation was not your choice',
      'You still love them and that feels like a problem to solve',
      'Everyone says "time" and you need something to actually do today',
    ],
    freebie: 'do-i-text-them',
  },
  {
    slug: 'you-dont-need-the-text-back',
    title: "You Don't Need the Text Back",
    sub: 'Practical exercises for relationship anxiety and building self-trust',
    topic: 'attachment',
    buy: 'https://www.amazon.com/dp/B0HP7RM7HX',
    format: 'Paperback & Kindle on Amazon',
    hook: 'You are not too much. You are running a prediction that was accurate once.',
    promise: 'Exercises for the gap between sending something and hearing back — and for trusting your own read of it.',
    for: [
      'You read tone into every delayed reply',
      'You need reassurance and then distrust the reassurance',
      'You want to stop testing people and start asking them',
    ],
    freebie: 'needs-checklist',
  },
  {
    slug: 'sudoku-for-a-busy-mind',
    title: 'Sudoku for a Busy Mind',
    sub: '60 calming puzzles in sets of ten for ADHD, anxious and overthinking minds, with a workspace page beside every puzzle',
    topic: 'overthinking',
    buy: 'https://www.amazon.com/dp/B0HKQ7VNNS',
    format: 'Paperback on Amazon',
    hook: 'Somewhere for a loud brain to go that is not your own thoughts.',
    promise: 'Sixty puzzles in sets of ten, with a workspace page beside each one so you are not writing in the margins.',
    for: [
      'Your head is loudest when there is nothing to do with it',
      'You want something absorbing rather than something restful',
      'Scrolling leaves you worse and you want a replacement',
    ],
    freebie: 'brain-dump-3am',
  },
];

export const freebies = [
  { slug: 'spiral-stopper', title: 'The Spiral Stopper', kind: 'Card', topic: 'overthinking', desc: 'One page. Five questions. Keep it by the bed for 2am.', file: '/assets/printables/spiral-stopper.pdf' },
  { slug: 'brain-dump-3am', title: 'The 3am Brain Dump Sheet', kind: 'Printable', topic: 'overthinking', desc: 'Get the loop out of your head and onto paper so your brain stops rehearsing it.', file: '/assets/printables/brain-dump-3am.pdf' , gumroad: 'https://thoughtkindworkbook.gumroad.com/l/3am-spiral-reset', gumroadName: "Free 3 a.m. Spiral Reset" },
  { slug: 'weekly-knot-planner', title: 'The Weekly Knot Planner', kind: 'Planner', topic: 'healing', desc: 'One week, one knot, three small moves. The whole planner is one page on purpose.', file: '/assets/printables/weekly-knot-planner.pdf' },
  { slug: 'needs-checklist', title: 'The Needs Checklist', kind: 'Checklist', topic: 'attachment', desc: 'Name what you actually need before the conversation, so you ask instead of test.', file: '/assets/printables/needs-checklist.pdf' , gumroad: 'https://thoughtkindworkbook.gumroad.com/l/anxious-attachment-checklist-free', gumroadName: "Free Anxious Attachment Checklist" },
  { slug: 'do-i-text-them', title: 'The "Do I Text Them" Flowchart', kind: 'Flowchart', topic: 'breakups', desc: 'Nine questions, one honest answer. Screenshot it.', file: '/assets/printables/do-i-text-them.pdf' , gumroad: 'https://thoughtkindworkbook.gumroad.com/l/before-you-text-them', gumroadName: "Free Before You Text Them Checklist" },
  { slug: 'task-starter-cards', title: 'ADHD Task Starter Cards', kind: 'Cards', topic: 'adhd', desc: 'Twelve cards that shrink a task until starting it stops being a wall.', file: '/assets/printables/task-starter-cards.pdf' , gumroad: 'https://thoughtkindworkbook.gumroad.com/l/i-cant-start', gumroadName: "Free I Can't Start Worksheet" },
  { slug: 'adhd-reset-system', title: 'The ADHD Reset System', kind: 'Notion template', topic: 'adhd', desc: 'Reset cards, a brain dump and a weekly reset, built for the days that got away from you.', file: '', gumroad: 'https://thoughtkindworkbook.gumroad.com/l/adhd-reset-system', gumroadName: 'Free ADHD Reset System' },
  { slug: 'feelings-weather-kids', title: 'Feelings Weather Chart (Kids)', kind: 'Kids printable', topic: 'healing', desc: 'For ages 4–8: name the feeling as weather, because weather passes.', file: '/assets/printables/feelings-weather-kids.pdf' },
];

export const games = [
  {
    slug: 'whats-knotting-you',
    title: "What's Knotting You?",
    tagline: 'Six questions. Then we point you at the one thing most likely to help tonight.',
    kind: 'Router',
    minutes: 2,
    topic: 'healing',
    blurb:
      'Not a personality test. A sorting hat for your current knot — it reads what you are stuck in right now and hands you the article, tool or workbook built for exactly that.',
    engine: 'quiz',
    quiz: {
      mode: 'key',
      resultEyebrow: 'Tonight, start here',
      questions: [
        {
          q: 'It is 1am. What is your brain doing?',
          options: [
            { text: 'Replaying a conversation, word by word', key: 'overthinking', title: 'The replay loop', why: 'Your brain reopens the scene hunting for an ending it never got. That is rumination, and it has a mechanism you can interrupt.' },
            { text: 'Checking whether they replied', key: 'attachment', title: 'The reassurance loop', why: 'Checking is what a nervous system does when it predicts leaving. The relief it buys lasts about twenty minutes.' },
            { text: 'Missing someone who is gone', key: 'breakups', title: 'Withdrawal, not weakness', why: 'The system that tracked them is still firing and the reward stopped arriving. That is chemistry, not a character flaw.' },
            { text: 'Everything at once, and the laundry', key: 'adhd', title: 'Too many open tabs', why: 'An open loop keeps calling you back. Twenty of them feels like noise with no source.' },
          ],
        },
        {
          q: 'Which sentence stings most?',
          options: [
            { text: '"You are overthinking it."', key: 'overthinking', title: 'Named it', why: 'It stings because it is half true and completely useless as advice.' },
            { text: '"You are too much."', key: 'attachment', title: 'Named it', why: 'That line is usually someone else\'s capacity described as your size.' },
            { text: '"You will find someone better."', key: 'breakups', title: 'Named it', why: 'It answers a question you did not ask. You are not shopping; you are grieving.' },
            { text: '"You just need to apply yourself."', key: 'adhd', title: 'Named it', why: 'Effort was never the missing ingredient. Interest, urgency and structure were.' },
          ],
        },
        {
          q: 'What does a hard day cost you?',
          options: [
            { text: 'Sleep', key: 'overthinking', title: 'Sleep goes first', why: 'The loop gets louder when there is nothing left to distract you from it.' },
            { text: 'My dignity, in texts', key: 'attachment', title: 'The 2am send', why: 'Panic writes fast and edits nothing. There is a repair protocol for the morning after.' },
            { text: 'Hours on their profile', key: 'breakups', title: 'Checking', why: 'Each check re-doses the system you are trying to wean.' },
            { text: 'The one task that mattered', key: 'adhd', title: 'The anchor slips', why: 'Without one anchor task, a bad day has no floor.' },
          ],
        },
        {
          q: 'Pick the thing you want most right now.',
          options: [
            { text: 'Quiet in my head', key: 'overthinking', title: 'Quiet', why: 'Quiet comes from closing the loop, not from thinking harder until it resolves.' },
            { text: 'To feel chosen without asking', key: 'attachment', title: 'To be chosen', why: 'The painful upgrade is learning to ask plainly — and to believe the answer.' },
            { text: 'To stop missing them', key: 'breakups', title: 'For it to stop', why: 'It gets shorter before it gets smaller. That is the normal shape.' },
            { text: 'To start the thing', key: 'adhd', title: 'To start', why: 'Starting is a separate skill from doing, and it can be engineered.' },
          ],
        },
        {
          q: 'How long has this been running?',
          options: [
            { text: 'Days', key: 'overthinking', title: 'Still fresh', why: 'Fresh loops respond fastest to structure.' },
            { text: 'Every relationship, actually', key: 'attachment', title: 'A pattern, not an incident', why: 'Patterns point at predictions, and predictions are learnable.' },
            { text: 'Weeks since it ended', key: 'breakups', title: 'In the window', why: 'Weeks two to six are usually the worst. Nobody warns you.' },
            { text: 'My whole life', key: 'adhd', title: 'Lifelong wiring', why: 'Lifelong usually means wiring, not willpower.' },
          ],
        },
        {
          q: 'How much time do you have tonight?',
          options: [
            { text: 'Two minutes', key: 'overthinking', title: 'Two minutes is enough', why: 'Two minutes of writing beats an hour of thinking.' },
            { text: 'Ten minutes', key: 'attachment', title: 'Ten minutes', why: 'Enough to name the need and draft one clean sentence.' },
            { text: 'An evening', key: 'breakups', title: 'An evening', why: 'Enough for the first no-send letter.' },
            { text: 'No idea, honestly', key: 'adhd', title: 'Unknown', why: 'Then we pick the smallest possible first step.' },
          ],
        },
      ],
      results: [
        { key: 'overthinking', title: 'Your knot is the replay loop.', body: 'Your brain is holding a conversation open because it never got an ending. The fix is not more analysis — it is giving the loop a closing sentence tonight.', tip: 'Run The Replay Room for two minutes, then keep the Spiral Stopper by your bed.', links: [{ href: '/games/replay-room/', label: 'Open The Replay Room', primary: true }, { href: '/topics/overthinking/', label: 'Read on overthinking' }, { href: '/workbooks/overthinking-reset/', label: 'The Overthinking Reset' }] },
        { key: 'attachment', title: 'Your knot is an old prediction about leaving.', body: 'You are not needy. You are running a forecast that was accurate once and has not been updated since. Updating it is slow, boring and completely possible.', tip: 'Name one need in one sentence, with no preamble and no apology. That is the whole exercise.', links: [{ href: '/topics/attachment/', label: 'Read on attachment', primary: true }, { href: '/workbooks/anxious-to-secure/', label: 'Anxious to Secure' }, { href: '/free/needs-checklist/', label: 'Free: Needs Checklist' }] },
        { key: 'breakups', title: 'Your knot is withdrawal wearing grief\'s coat.', body: 'Two different pains are running at once: losing a person, and losing the daily chemistry of that person. Separating them makes the next six weeks navigable.', tip: 'Write the first no-send letter tonight. Do not edit it. Do not send it.', links: [{ href: '/topics/breakups/', label: 'Read on breakups', primary: true }, { href: '/workbooks/breakup-decompression/', label: 'The Decompression Kit' }, { href: '/free/do-i-text-them/', label: 'Free: Do I Text Them?' }] },
        { key: 'adhd', title: 'Your knot is a day designed for someone else\'s brain.', body: 'Importance does not start tasks for you — interest and urgency do. Nothing about that is fixable by trying harder, and most of it is fixable by designing differently.', tip: 'Pick one anchor task for tomorrow. One. Write it where you will physically see it.', links: [{ href: '/games/switch-cost/', label: 'Feel your switch cost', primary: true }, { href: '/topics/adhd/', label: 'Read on ADHD' }, { href: '/workbooks/adhd-day-designer/', label: 'The ADHD Day Designer' }] },
      ],
    },
  },
  {
    slug: 'thought-traps',
    title: 'Spot the Thought Trap',
    tagline: 'Ten everyday thoughts. Can you name what your brain just did?',
    kind: 'Card game',
    minutes: 5,
    topic: 'overthinking',
    blurb:
      'The same ten distortions run through almost every spiral. Learn to name them in someone else\'s thoughts and you start catching them in your own — usually about four seconds earlier each time.',
    engine: 'quiz',
    quiz: {
      mode: 'score',
      resultEyebrow: 'Your score',
      questions: [
        { q: '"She left me on read. She\'s done with me."', context: 'What did the brain just do?', options: [
          { text: 'Mind reading', correct: true, title: 'Mind reading', why: 'You filled in someone else\'s thoughts and treated the guess as data. One unread message, one invented verdict.', tip: 'Write the guess, then write two other endings that fit the same facts. Hold all three until you have real information.' },
          { text: 'Catastrophising', why: 'Close — catastrophising jumps to the worst outcome. Here the jump is into her head, not into the future.' },
          { text: 'Should statements', why: 'No rule is being enforced here. The leap is into what she must be thinking.' },
          { text: 'All-or-nothing', why: 'Not quite — nothing is split into two extremes yet.' },
        ]},
        { q: '"I got one thing wrong in the meeting. I am terrible at this job."', context: 'What did the brain just do?', options: [
          { text: 'All-or-nothing thinking', correct: true, title: 'All-or-nothing', why: 'One data point became a whole identity. There is no middle setting — only flawless or terrible.', tip: 'Add the word "and": I got that wrong AND I handled the rest well. Both can be true.' },
          { text: 'Mind reading', why: 'Nobody else\'s thoughts are being invented here — the verdict is self-issued.' },
          { text: 'Emotional reasoning', why: 'Close, but the move is the all-or-nothing split rather than treating a feeling as proof.' },
          { text: 'Discounting the positive', why: 'That is part of it, but the headline move is the extreme split.' },
        ]},
        { q: '"I feel like a burden, so I must be one."', context: 'What did the brain just do?', options: [
          { text: 'Emotional reasoning', correct: true, title: 'Emotional reasoning', why: 'A feeling was used as evidence of a fact. Feelings are real; they are not verdicts.', tip: 'Finish this sentence instead: "I feel like a burden, and the evidence for that is…" Then look at what you actually wrote.' },
          { text: 'Labelling', why: 'There is a label, but it arrives *through* the feeling — that is the key move.' },
          { text: 'Fortune telling', why: 'No prediction about the future here.' },
          { text: 'Personalisation', why: 'Nothing external is being taken as your fault.' },
        ]},
        { q: '"If I text first, I look desperate. If I wait, I look cold."', context: 'What did the brain just do?', options: [
          { text: 'All-or-nothing thinking', correct: true, title: 'All-or-nothing', why: 'Two extremes, no third option, and both roads lead to being judged. The trap is the missing middle.', tip: 'Name a third option out loud: a short, warm, unapologetic message. It exists.' },
          { text: 'Mind reading', why: 'There is a dash of it, but the structure is the false choice between two extremes.' },
          { text: 'Should statements', why: 'No rule is being enforced — a binary is being invented.' },
          { text: 'Catastrophising', why: 'No disaster forecast yet, just two bad labels.' },
        ]},
        { q: '"I should be over this by now."', context: 'What did the brain just do?', options: [
          { text: 'Should statement', correct: true, title: 'Should statement', why: 'A borrowed timetable became a rule, and then the rule became proof you are failing. Nobody has ever met this schedule.', tip: 'Swap "should" for "I wish": I wish I were further along. True, honest, and not an accusation.' },
          { text: 'Emotional reasoning', why: 'The engine is the rule, not the feeling.' },
          { text: 'Labelling', why: 'No name is being assigned — a deadline is.' },
          { text: 'Mind reading', why: 'Nobody else\'s thoughts are involved.' },
        ]},
        { q: '"They were quiet at dinner. I must have done something."', context: 'What did the brain just do?', options: [
          { text: 'Personalisation', correct: true, title: 'Personalisation', why: 'Someone else\'s mood got filed under your responsibility. Their quiet could be work, sleep, their mother, a headache.', tip: 'List three causes that have nothing to do with you before you ask. Then ask plainly.' },
          { text: 'Catastrophising', why: 'No disaster is being forecast — blame is being absorbed.' },
          { text: 'All-or-nothing', why: 'No extremes here.' },
          { text: 'Fortune telling', why: 'The move is backwards-looking blame, not prediction.' },
        ]},
        { q: '"There is no point starting. I will only abandon it like everything else."', context: 'What did the brain just do?', options: [
          { text: 'Fortune telling', correct: true, title: 'Fortune telling', why: 'The future was reported as a finished fact, which conveniently removes the need to try. Past evidence is real; a verdict on tomorrow is not.', tip: 'Shrink it until the prediction stops mattering: two minutes, one page, one sentence.' },
          { text: 'Labelling', why: 'A label is lurking, but the main move is predicting the ending.' },
          { text: 'Emotional reasoning', why: 'The dread fuels it, but the structure is a forecast.' },
          { text: 'Discounting the positive', why: 'Close — that is the sidekick here, not the lead.' },
        ]},
        { q: '"She only said my work was good to be nice."', context: 'What did the brain just do?', options: [
          { text: 'Discounting the positive', correct: true, title: 'Discounting the positive', why: 'Evidence that contradicts the story got disqualified on arrival. The story then stays undefeated, because it never faces anything.', tip: 'Write the compliment down verbatim, undiscounted. Keep a file of them. Read it on the bad days.' },
          { text: 'Mind reading', why: 'There is mind reading inside it, but the function is to delete good evidence.' },
          { text: 'All-or-nothing', why: 'No extreme split here.' },
          { text: 'Personalisation', why: 'Nothing is being taken as your fault.' },
        ]},
        { q: '"I am such an idiot."', context: 'What did the brain just do?', options: [
          { text: 'Labelling', correct: true, title: 'Labelling', why: 'A behaviour became an identity. "I made a mistake" is fixable; "I am an idiot" is a life sentence with no appeal.', tip: 'Describe the action instead: "I sent the email before checking the file." Now there is something to change.' },
          { text: 'Should statement', why: 'No rule — a name.' },
          { text: 'Emotional reasoning', why: 'Feeling-as-proof is close, but this is the label itself.' },
          { text: 'Catastrophising', why: 'No forecast of disaster.' },
        ]},
        { q: '"If this relationship ends I will never recover."', context: 'What did the brain just do?', options: [
          { text: 'Catastrophising', correct: true, title: 'Catastrophising', why: 'The worst outcome was selected, then your ability to cope with it was deleted. That second half is the part that does the damage.', tip: 'Ask the forgotten question: "and then what would I do?" Answer it concretely. Coping is the data your brain skipped.' },
          { text: 'Fortune telling', why: 'Very close. Both predict — catastrophising specifically predicts disaster plus zero coping.' },
          { text: 'All-or-nothing', why: 'There is an extreme, but the move is the disaster forecast.' },
          { text: 'Labelling', why: 'No identity is being assigned.' },
        ]},
      ],
      results: [
        { min: 9, title: 'You named {score} of {total}. You can see the machinery.', body: 'You are already spotting the move, not just the mood. The next skill is catching it live, in your own thoughts, before it finishes the sentence — which is slower and much less flattering.', tip: 'For one week, write down the trap name whenever you notice one. Just the name. Noticing is the dose.', links: [{ href: '/workbooks/overthinking-reset/', label: 'The Overthinking Reset', primary: true }, { href: '/games/replay-room/', label: 'Try The Replay Room' }] },
        { min: 6, title: 'You named {score} of {total}. Solid.', body: 'You know these from the inside, which is exactly why some of them are hard to label — when a thought is familiar it stops looking like a thought and starts looking like the truth.', tip: 'Print the Spiral Stopper and keep it where the spirals happen. Usually: the bed.', links: [{ href: '/free/spiral-stopper/', label: 'Free: The Spiral Stopper', primary: true }, { href: '/topics/overthinking/', label: 'Read on overthinking' }] },
        { min: 0, title: 'You named {score} of {total}. Good — now you have the list.', body: 'Nobody arrives knowing these. The whole value is in the names: a thought you can name is a thought you can question, and an unnamed one just feels like reality.', tip: 'Pick the one trap that felt most familiar and watch only for that one this week.', links: [{ href: '/articles/why-your-brain-replays-conversations/', label: 'Start with the replay loop', primary: true }, { href: '/free/', label: 'Free printables' }] },
      ],
    },
  },
  {
    slug: 'replay-room',
    title: 'The Replay Room',
    tagline: 'Three questions that turn a loop into a sentence. Two minutes.',
    kind: 'Tool',
    minutes: 2,
    topic: 'overthinking',
    blurb:
      'Type the thing you keep replaying. The room walks you through naming the scene, the verdict underneath it and one fact that argues back — then you close the page and it is gone. Nothing is ever sent anywhere.',
    engine: 'replay',
  },
  {
    slug: 'switch-cost',
    title: 'Feel Your Switch Cost',
    tagline: 'Two rounds. Watch what happens to your speed when the rules keep moving.',
    kind: 'Experiment',
    minutes: 3,
    topic: 'adhd',
    blurb:
      'A one-minute version of a classic task-switching experiment. Round one has a single rule. Round two changes the rule without warning — and the gap between your two scores is the invisible fee your day has been charging you.',
    engine: 'switch',
  },
  {
    slug: 'dinner-party',
    title: 'The Attachment Dinner Party',
    tagline: 'One awkward dinner. Four ways of reading the same silence.',
    kind: 'Scenario',
    minutes: 4,
    topic: 'attachment',
    blurb:
      'Same evening, same silence at the table — and four completely different stories about what it means. Pick what you would actually do and see the prediction underneath the reaction. A learning game, not a label.',
    engine: 'quiz',
    quiz: {
      mode: 'key',
      resultEyebrow: 'The pattern you leaned toward',
      questions: [
        { q: 'Your partner goes quiet halfway through dinner. You:', options: [
          { text: 'Ask three times if they are okay', key: 'anxious', title: 'The check', why: 'The quiet reads as a warning sign, so you move toward it fast. The asking is an attempt to make the uncertainty stop.' },
          { text: 'Go quiet too and wait it out', key: 'avoidant', title: 'The matched retreat', why: 'If closeness has historically cost you something, distance feels like the safer move.' },
          { text: 'Ask once, then let it sit', key: 'secure', title: 'The single ask', why: 'One clear question, then room. This is the thing the other patterns are learning toward.' },
          { text: 'Both: need them close, want to flee', key: 'mixed', title: 'The push-pull', why: 'Approach and retreat fire at the same time, which is exhausting and makes you look inconsistent from outside.' },
        ]},
        { q: 'They say "I just need a minute." You hear:', options: [
          { text: '"Something is wrong with us."', key: 'anxious', title: 'The alarm', why: 'Ambiguity gets filled with the worst available meaning, because an answered threat feels safer than an open one.' },
          { text: 'Relief — space is fine.', key: 'avoidant', title: 'The exhale', why: 'Space registers as safety rather than distance.' },
          { text: '"They need a minute."', key: 'secure', title: 'The literal read', why: 'Taking words at face value is a skill, not a personality trait.' },
          { text: 'Nothing. I go numb.', key: 'mixed', title: 'The shutdown', why: 'When both responses fire at once the system sometimes picks neither.' },
        ]},
        { q: 'Later, they apologise. You:', options: [
          { text: 'Need them to say it twice more', key: 'anxious', title: 'The re-dose', why: 'Reassurance soothes the feeling but not the prediction, so the need comes back in twenty minutes.' },
          { text: 'Say it is fine before it is fine', key: 'avoidant', title: 'The early close', why: 'Ending the conversation ends the discomfort, and the unfinished part gets filed away.' },
          { text: 'Say what you needed, plainly', key: 'secure', title: 'The plain ask', why: 'Naming the need gives the other person something they can actually do.' },
          { text: 'Pick a fight about something else', key: 'mixed', title: 'The displaced fight', why: 'The real subject feels too exposing, so a safer one gets substituted.' },
        ]},
        { q: 'The next morning you mostly feel:', options: [
          { text: 'Scanning for whether we are okay', key: 'anxious', title: 'The scan', why: 'The nervous system stays on watch until it gets certainty, which never fully arrives.' },
          { text: 'Fine, and faintly annoyed it was a thing', key: 'avoidant', title: 'The minimise', why: 'Minimising keeps the peace and keeps the distance.' },
          { text: 'Settled, with one thing to say', key: 'secure', title: 'The repair', why: 'Repair is the actual skill. Not avoiding ruptures — closing them.' },
          { text: 'Embarrassed by how much I needed', key: 'mixed', title: 'The hangover', why: 'The shame after the need is often louder than the need was.' },
        ]},
      ],
      results: [
        { key: 'anxious', title: 'You leaned anxious — the pattern that moves toward.', body: 'Ambiguity reads as danger, so you close the gap fast: ask, check, ask again. It is not weakness and it is not too much. It is a system that learned certainty was worth chasing because it once was.', tip: 'Replace one check with one plain statement: "I noticed you went quiet and it made me nervous." Statements get answers; tests get defensiveness.', links: [{ href: '/workbooks/anxious-to-secure/', label: 'Anxious to Secure', primary: true }, { href: '/topics/attachment/', label: 'Read on attachment' }] },
        { key: 'avoidant', title: 'You leaned avoidant — the pattern that moves away.', body: 'Space registers as safety, so you take it before anyone can hand you less than you asked for. This usually gets described as coldness by people who have never seen what taught it.', tip: 'Stay in one uncomfortable conversation ninety seconds longer than you want to. Ninety seconds, not ninety minutes.', links: [{ href: '/topics/attachment/', label: 'Read on attachment', primary: true }, { href: '/workbooks/anxious-to-secure/', label: 'Anxious to Secure' }] },
        { key: 'secure', title: 'You leaned secure — the pattern that asks once and waits.', body: 'Not drama-free: ruptures still happen. The difference is that you expect them to be repairable, so you ask plainly and you believe the answer. If you got here the long way, that counts too — this is learnable, which is the whole point.', tip: 'You are probably the regulating presence in someone else\'s loop. Make sure someone is holding yours.', links: [{ href: '/topics/attachment/', label: 'How security gets built', primary: true }, { href: '/readers-line/', label: "Join the Readers' Line" }] },
        { key: 'mixed', title: 'You leaned push-pull — both alarms at once.', body: 'Needing closeness and needing escape, firing together. From inside it feels like being broken; from outside it looks inconsistent. It is neither. It is two learned strategies that never got to take turns.', tip: 'Name the split out loud to one safe person: "part of me wants to leave the room and part of me wants you closer." Saying it drops the pressure fast.', links: [{ href: '/workbooks/anxious-to-secure/', label: 'Anxious to Secure', primary: true }, { href: '/topics/attachment/', label: 'Read on attachment' }] },
      ],
    },
  },
];

export const novels = [
  {
    slug: 'married-to-the-don',
    title: 'Married to the Don to Keep Me Silent',
    sub: 'A Closed-Door Marriage of Convenience Mafia Romance',
    penName: 'Erena Jabrial',
    status: 'Out now',
    closedDoor: true,
    hook: 'He married her to keep her silent. He forgot the choice to speak belongs to the wife.',
    tropes: ['Marriage of convenience', 'Mafia romance', 'Forced marriage', 'He falls first', 'Legal thriller spine', 'Guaranteed HEA'],
    blurb: "At 3 a.m., ER doctor Ivy Marlowe stitches a stranger's arm and types his name into the chart when he pays her not to. Thirty minutes later, she watches him stand over a dying man in her hospital garage with a gun in his hand.\n\nNow she's the FBI's only witness against Nico Vescari, the quiet, dangerous don of Red Hook. A rival family wants her dead before she can testify. Her little brother owes them forty thousand dollars. And Nico has one offer: marry him. A wife can't be forced to testify against her husband.\n\nHer terms: her own bedroom with a lock on her side. Her brother's debt erased. Her residency untouched. And he never lies to her.\n\nHe agrees to all of it. He just won't always answer.\n\nBut Ivy is a doctor, and doctors notice things. Like the splint she built on his right hand. Like the gun that was in his left. Like the fact that someone inside his own house is feeding her schedule to the men trying to kill her.",
    stakes: "The privilege is hers. Only she can keep it, and only she can break it.",
    forReaders: 'Readers of clean and closed-door mafia romance, forced marriage romance, and romantic suspense with a smart heroine.',
    warning: 'Closed-door romance — no explicit scenes.',
    buyKindle: 'https://www.amazon.com/dp/B0HPZSG98N',
    buyPaperback: '',
  },
  {
    slug: 'left-at-the-altar',
    title: 'Left at the Altar',
    sub: 'A Secret Baby Second Chance Romance',
    penName: 'Erena Jabrial',
    status: 'Out now',
    closedDoor: true,
    hook: 'He played a recording at the altar and walked away from his own wedding.',
    tropes: ['Second chance', 'Secret baby', 'Closed-door', 'Complete with epilogue', 'No cliffhanger'],
    blurb: "It took Wren Calloway five years to find out it was a line from a romance novel she'd narrated in a coat closet for four hundred dollars.\n\nNow she's back in his building as the voice of his company's biggest product \u2014 and her four-year-old son has a white streak in his hair, just left of center.\n\nSomebody built that sentence out of fourteen hours of her. Somebody in her own family.\n\nShe's going to find the hand that did it. On paper. In front of everybody.",
    stakes: 'A heroine who wins with her own professional skill.',
    forReaders: 'Readers of closed-door second chance romance with a secret baby and a five-year lie.',
    warning: 'Closed-door romance — no explicit scenes.',
    buyKindle: 'https://www.amazon.com/dp/B0HRQNC6TK',
    buyPaperback: '',
    paperbackNote: 'The paperback is new and still in review.',
  },
];

export const kidsBooks = [
  {
    slug: 'my-brain-has-its-own-speed',
    title: 'My Brain Has Its Own Speed',
    sub: 'A story-and-activity book for kids with ADHD',
    ages: '7–10',
    topic: 'adhd',
    status: 'Out now',
    buy: 'https://www.amazon.com/dp/B0HML85DRL',
    alsoIn: 'Also available in German',
    hook: 'Some brains walk. Mine runs — and sometimes it forgets to tell my feet.',
    blurb:
      'A story first, activities second: a book for children whose brains move faster than the room around them, and who keep being told to slow down as if speed were something they chose this morning.\n\nWritten so a child hears "your brain works differently" instead of "your brain is wrong" — with pages to write and draw on, so it is something a child does rather than something read at them.',
    takeaways: [
      'Your speed is not misbehaviour',
      'Forgetting is not the same as not caring',
      'Outside helpers — lists, timers, one step at a time — are not cheating',
      'The thing that makes you hard to teach is often the thing that makes you good at something',
    ],
    parentNote:
      'Built for reading together and for classroom read-alouds, with activity pages a child can fill in at their own pace.',
    freebie: 'task-starter-cards',
  },
];

/* FAQs — these feed FAQPage schema (AEO) */
export const homeFaqs = [
  {
    q: 'What is Knot Alone?',
    a: '<p>Knot Alone explains the psychology behind everyday behaviour — overthinking, attachment, breakups, ADHD and healing — in short, science-based animated videos, free printables, workbooks and articles. It is written for the person living it, not for a clinician reading about it.</p>',
  },
  {
    q: 'Is Knot Alone therapy?',
    a: '<p>No. Everything here is educational. It does not diagnose, treat or replace care from a qualified professional who actually meets you. If you are in crisis or at risk, contact local emergency services or a crisis line in your country.</p>',
  },
  {
    q: 'Is any of it free?',
    a: '<p>Most of it. Every article, every mind game and a growing shelf of printables are free. The paid workbooks and planners exist for people who want the execution — structure, prompts and a week-by-week path — rather than more information.</p>',
  },
  {
    q: 'Why "Knot Alone"?',
    a: '<p>Because the feeling is usually a knot, not a fault — tangled, tight, and far more common than it looks from inside. Two things are true at once: your brain is not broken, and you are not the only one doing this.</p>',
  },
  {
    q: 'Can the quizzes and games tell me if I have ADHD or an attachment style?',
    a: '<p>No, and they are built to say so. They are learning games: they teach the mechanism and show you the pattern you lean toward. Diagnosis needs a qualified professional and a real conversation about your history.</p>',
  },
  {
    q: 'How often do you publish?',
    a: '<p>New videos weekly, with articles and printables alongside them. The Readers\' Line email carries one explanation, one small thing to try, and whatever just went free.</p>',
  },
];
