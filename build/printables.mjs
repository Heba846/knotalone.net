// Generates the free printable PDFs into src/assets/printables/.
// Run: node build/printables.mjs   (needs Playwright; output is committed)
import { chromium } from 'playwright';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '..', 'src', 'assets', 'printables');

/* Print-first styling: pure black on white, one accent that still reads in
   greyscale, generous write-on space, A4 with safe margins. */
const shell = (title, subtitle, body, foot = '') => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600;700&display=swap">
<style>
  @page { size: A4; margin: 0; }
  *{box-sizing:border-box;margin:0}
  body{width:210mm;min-height:297mm;padding:16mm 15mm 12mm;font-family:Inter,system-ui,sans-serif;
       color:#17131f;background:#fff;font-size:10.5pt;line-height:1.5;display:flex;flex-direction:column}
  .head{display:flex;justify-content:space-between;align-items:flex-start;gap:10mm;border-bottom:1.5pt solid #17131f;padding-bottom:4mm;margin-bottom:6mm}
  h1{font-family:Fraunces,serif;font-size:25pt;line-height:1.02;letter-spacing:-.02em;max-width:16ch}
  .sub{margin-top:2.5mm;font-size:10pt;color:#4b4357;max-width:62ch}
  .mark{display:flex;align-items:center;gap:2mm;font-family:Fraunces,serif;font-size:10pt;white-space:nowrap;padding-top:2mm}
  .mark svg{width:7mm;height:7mm}
  main{flex:1}
  .foot{margin-top:6mm;padding-top:3mm;border-top:.75pt solid #cfc6bb;display:flex;justify-content:space-between;
        gap:6mm;font-size:7.6pt;color:#6b6377}
  .foot b{color:#17131f;font-weight:600}
  .q{margin-bottom:5mm;break-inside:avoid}
  .q .n{display:inline-grid;place-items:center;width:6mm;height:6mm;border-radius:50%;background:#17131f;color:#fff;
        font-size:8.5pt;font-weight:700;margin-right:2.5mm;vertical-align:-1mm}
  .q .t{font-weight:600;font-size:11.5pt}
  .q .h{font-size:8.8pt;color:#6b6377;margin:1mm 0 2mm 8.5mm;font-style:italic}
  .lines{margin-left:8.5mm}
  .line{border-bottom:.75pt solid #b9b0c0;height:8mm}
  .line.sm{height:7mm}
  .box{border:1pt solid #17131f;border-radius:3mm;padding:4mm 5mm;break-inside:avoid}
  .box.tint{background:#faf4ea;border-color:#c98f4b}
  .label{font-size:7.6pt;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#c98f4b;margin-bottom:2mm}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
  .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
  .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:3.5mm}
  .chk{display:flex;gap:2.5mm;align-items:flex-start;padding:1.6mm 0;font-size:10pt}
  .chk i{flex:none;width:4mm;height:4mm;border:1pt solid #17131f;border-radius:1mm;margin-top:.9mm}
  .card{border:.75pt dashed #8b8299;border-radius:2.5mm;padding:3.5mm;min-height:36mm;display:flex;flex-direction:column;gap:1.5mm}
  .card .k{font-size:7.4pt;letter-spacing:.1em;text-transform:uppercase;color:#c98f4b;font-weight:700}
  .card .v{font-family:Fraunces,serif;font-size:11.5pt;line-height:1.14}
  .card .d{font-size:8.4pt;color:#4b4357;margin-top:auto}
  .step{display:flex;gap:3mm;align-items:flex-start;border:1pt solid #17131f;border-radius:2.5mm;padding:3mm 4mm;break-inside:avoid}
  .step .s{font-family:Fraunces,serif;font-size:13pt;color:#c98f4b;line-height:1;flex:none;width:9mm}
  .step .b{flex:1}
  .step .yes{font-size:8.6pt;color:#4b4357;margin-top:1.5mm}
  .arrow{text-align:center;color:#c98f4b;font-size:11pt;line-height:1;margin:1.6mm 0}
  .note{font-size:9pt;color:#4b4357}
  h2{font-family:Fraunces,serif;font-size:13pt;margin-bottom:2.5mm}
  .days{display:grid;grid-template-columns:repeat(7,1fr);gap:2mm;text-align:center}
  .days div{border:.75pt solid #b9b0c0;border-radius:1.5mm;padding:2mm 0 7mm;font-size:8pt;font-weight:600}
  .wx{border:.75pt solid #b9b0c0;border-radius:2.5mm;padding:3mm 2mm;text-align:center}
  .wx .e{font-size:19pt;line-height:1.15}
  .wx .n2{font-family:Fraunces,serif;font-size:10.5pt;margin-top:1mm}
  .wx .d2{font-size:8pt;color:#4b4357;margin-top:.6mm;line-height:1.3}
</style></head><body>
  <div class="head">
    <div><h1>${title}</h1><p class="sub">${subtitle}</p></div>
    <div class="mark"><svg viewBox="0 0 32 32" fill="none" stroke="#c98f4b" stroke-width="2.6" stroke-linecap="round"><path d="M8 25c0-7 6-7 6-11a4 4 0 1 0-8 0c0 6 8 6 8 12"/><path d="M24 7c0 7-6 7-6 11a4 4 0 1 0 8 0c0-6-8-6-8-12" opacity=".6"/></svg>Knot Alone</div>
  </div>
  <main>${body}</main>
  <div class="foot">
    <span>${foot || 'Educational use only — not therapy, diagnosis or medical advice.'}</span>
    <span><b>knotalone.net</b> · free to print, copy and share</span>
  </div>
</body></html>`;

const lines = (n, cls = '') => `<div class="lines">${Array(n).fill(`<div class="line ${cls}"></div>`).join('')}</div>`;
const q = (n, t, h, l = 2) => `<div class="q"><div><span class="n">${n}</span><span class="t">${t}</span></div><p class="h">${h}</p>${lines(l)}</div>`;

const sheets = {
  'spiral-stopper': shell(
    'The Spiral Stopper',
    'Five questions for the loop that will not switch off. Keep this by the bed — a tool you have to go looking for is a tool you will not use at 2am.',
    `${q(1, 'What exactly am I replaying?', 'One sentence. The scene, not the story around it.', 2)}
     ${q(2, 'What do I think it proves about me?', 'The verdict underneath. Usually something like: I am too much. I do not matter. I will be left.', 2)}
     ${q(3, 'What is one fact from this month that argues against that verdict?', 'Not a pep talk — something that actually happened.', 2)}
     ${q(4, 'Is there an action, or is there nothing to do tonight?', 'If there is: write what, and when. If there is not: write "nothing to do tonight" and mean it.', 2)}
     ${q(5, 'What would I say to a friend who read me this exact sentence?', 'Then read it back to yourself in their voice.', 2)}
     <div class="box tint"><p class="label">Before you put this down</p><p class="note">You are not trying to feel better in the next five minutes. You are closing a file so your brain stops reopening it. If the loop comes back in an hour, that is normal — say the verdict and the one fact again. Repetition is the dose.</p></div>`
  ),

  'brain-dump-3am': shell(
    'The 3am Brain Dump',
    'Everything that is open, out of your head and onto paper. No order, no priorities, no solving. Your brain lets go of what it believes something else is holding.',
    `<div class="q"><div><span class="n">1</span><span class="t">Everything that is open right now</span></div>
       <p class="h">Tasks, worries, half-conversations, the thing you keep meaning to send. Messy is correct.</p>${lines(9, 'sm')}</div>
     <div class="grid2">
       <div class="box"><p class="label">Actually mine to solve</p><p class="note" style="margin-bottom:2mm">Which of those are mine, and today?</p><div class="line sm"></div><div class="line sm"></div><div class="line sm"></div></div>
       <div class="box"><p class="label">Not mine / not tonight</p><p class="note" style="margin-bottom:2mm">Name them anyway. Naming is what releases them.</p><div class="line sm"></div><div class="line sm"></div><div class="line sm"></div></div>
     </div>
     <div style="height:5mm"></div>
     <div class="box tint"><p class="label">Tomorrow's one anchor</p><p class="note" style="margin-bottom:2mm">One task that makes tomorrow count. One. A bad day needs a floor, not a to-do list.</p><div class="line"></div></div>
     <div style="height:4mm"></div>
     <p class="note" style="text-align:center"><em>“It is written down. It is not lost. I am allowed to stop holding it until the morning.”</em></p>`
  ),

  'weekly-knot-planner': shell(
    'The Weekly Knot Planner',
    'One week. One knot. Three small moves. The whole planner is one page on purpose — a plan you can finish beats a system you abandon on day nine.',
    `<div class="box tint" style="margin-bottom:5mm"><p class="label">This week's knot</p><p class="note" style="margin-bottom:2mm">The one thing you are working on. Not five. One.</p><div class="line"></div></div>
     <h2>Three small moves</h2>
     <p class="note" style="margin-bottom:3mm">Small enough that a bad day cannot stop them. If a move needs a good mood to happen, it is too big.</p>
     ${[1, 2, 3].map((n) => `<div class="q"><div><span class="n">${n}</span><span class="t" style="font-weight:500">&nbsp;</span></div><div class="lines" style="margin-top:-7mm"><div class="line"></div></div></div>`).join('')}
     <h2 style="margin-top:2mm">Did it happen?</h2>
     <div class="days">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => `<div>${d}</div>`).join('')}</div>
     <div style="height:5mm"></div>
     <div class="grid2">
       <div class="box"><p class="label">Honest energy this week</p><p class="note" style="margin-bottom:2mm">Low / medium / high — plan for the real one.</p><div class="line sm"></div></div>
       <div class="box"><p class="label">What I am dropping</p><p class="note" style="margin-bottom:2mm">Something has to go. Choose it on purpose.</p><div class="line sm"></div></div>
     </div>
     <div style="height:4mm"></div>
     <div class="box"><p class="label">Sunday, one line</p><p class="note" style="margin-bottom:2mm">Not "did I do everything". Ask: did the spiral get shorter this week?</p><div class="line sm"></div></div>`
  ),

  'needs-checklist': shell(
    'The Needs Checklist',
    'Name what you actually need before the conversation — so you ask for it instead of testing whether they will offer it. Tests get defensiveness. Requests get answers.',
    `<h2>Right now, what I need is…</h2>
     <div class="grid2" style="margin:3mm 0 5mm">
       <div>${['To be told we are okay','Time together with no phones','Physical closeness, no talking','To be heard without being fixed','Information — what is actually happening','An apology, named specifically','To know what happens next','Space, with a time it ends']
         .map((x) => `<div class="chk"><i></i><span>${x}</span></div>`).join('')}</div>
       <div>${['To be chosen out loud','Help with something practical','To be believed the first time','Reassurance this is not the end','To be asked how I am','Consistency, not intensity','Repair after the argument, not silence','Something else: ________________']
         .map((x) => `<div class="chk"><i></i><span>${x}</span></div>`).join('')}</div>
     </div>
     <div class="box tint"><p class="label">Now the one sentence</p>
       <p class="note" style="margin-bottom:2.5mm">No preamble, no apology, no case-building. Short requests are easy to meet; long ones sound like an accusation with a question mark at the end.</p>
       <p class="note" style="margin-bottom:2mm"><strong>“When ______________________ happened, I felt ______________________ . What I need is ______________________ .”</strong></p>
       <div class="line"></div><div class="line"></div></div>
     <div style="height:4mm"></div>
     <div class="grid2">
       <div class="box"><p class="label">Asking sounds like</p><p class="note">“I noticed you went quiet and it made me nervous. Are we okay?”</p></div>
       <div class="box"><p class="label">Testing sounds like</p><p class="note">Going quiet to see if they notice. “It's fine.” “Do you even like me?”</p></div>
     </div>`,
    'Educational use only. If a relationship is unsafe, this is not the right tool — please contact a local support service.'
  ),

  'do-i-text-them': shell(
    'Do I Text Them?',
    'Nine questions, one honest answer. Screenshot it. Work down until one stops you — and if nothing stops you, send it with your whole chest.',
    `${[
      ['1', 'Is this an emergency or something genuinely practical?', 'Yes → send it, keep it short and factual. No → keep going.'],
      ['2', 'Am I hoping this message will change how they feel about me?', 'Yes → stop. No message has ever done that. No → keep going.'],
      ['3', 'Have I already said this, in some form, before?', 'Yes → stop. Repetition reads as pressure, not as clarity.'],
      ['4', 'Would I send this at 11am on a Tuesday, sober and rested?', 'No → wait until 11am on a Tuesday. It will look different.'],
      ['5', 'Am I sending it to get a reply, or to put something down?', 'To get a reply → what happens if there is none? Sit with that first.'],
      ['6', 'Is the real need underneath this: to feel close, chosen, or less alone?', 'Then name that need — to yourself, or to a friend, not to them.'],
      ['7', 'Will I check my phone every four minutes after sending?', 'Yes → you are not sending a message, you are opening a wound.'],
      ['8', 'If they do not answer, do I have a plan for tonight?', 'No → make the plan first. Then decide.'],
      ['9', 'Reading it back: is it kind, short, and free of a hook?', 'If yes — send it. You are allowed to reach out as an adult.'],
    ].map(([s, t, y], i, a) => `<div class="step"><div class="s">${s}</div><div class="b"><div style="font-weight:600;font-size:10.4pt">${t}</div><div class="yes">${y}</div></div></div>${i < a.length - 1 ? '<div class="arrow">↓</div>' : ''}`).join('')}
     <div style="height:4mm"></div>
     <div class="box tint"><p class="note">Checking their profile counts as texting them. It is the same dose, taken quietly.</p></div>`
  ),

  'task-starter-cards': shell(
    'Task Starter Cards',
    'Twelve cards that shrink a task until starting it stops being a wall. Cut along the dashed lines, keep them where you work. Pick one, do only that, then you are allowed to stop.',
    `<div class="grid3">${[
      ['Shrink it', 'Do the first two minutes', 'Not the task. The first physical action: open the file, write a bad title.'],
      ['Make it ugly', 'Write the worst version', 'You cannot edit a blank page. You can edit rubbish.'],
      ['Say it out loud', 'Narrate the first step', '“I am opening the laptop now.” Out loud. It works and nobody knows why.'],
      ['Borrow urgency', 'Set a 15-minute timer', 'Importance does not start you. Urgency does. Manufacture it.'],
      ['Body double', 'Do it near someone', 'In person or on a call, doing their own thing. Presence is the tool.'],
      ['Lower the bar', 'Aim for a bad job', 'A bad done thing beats a perfect undone one, every single time.'],
      ['One decision', 'Pre-decide when and where', '“When I sit with coffee at 9, I write the subject line.”'],
      ['Reverse it', 'Do the last step first', 'Write the sign-off. Name the file. Enter the end, then work back.'],
      ['Remove one step', 'Delete a friction point', 'Find the login, the missing file, the question you have to ask. Clear that first.'],
      ['Change the room', 'Move your body somewhere else', 'A new room gives your brain a new context to load. Use it.'],
      ['Finish-cue', 'Decide what "done" is', 'Undefined tasks cannot be started, only worried about.'],
      ['Permission', 'You may do it badly, late, and in pyjamas', 'The task does not know what you were wearing.'],
    ].map(([k, v, d]) => `<div class="card"><div class="k">${k}</div><div class="v">${v}</div><div class="d">${d}</div></div>`).join('')}</div>`,
    'Educational use only. Print, cut, share — classroom and group use welcome.'
  ),

  'feelings-weather-kids': shell(
    'My Feelings Weather',
    'For ages 4–8. Feelings are like weather: they arrive, they are real, and they pass. Point to today\'s weather, then pick one thing that helps.',
    `<div class="grid4" style="margin-bottom:5mm">${[
      ['☀️', 'Sunny', 'Happy, easy, light'],
      ['⛅', 'Cloudy', 'A bit flat or meh'],
      ['🌧️', 'Rainy', 'Sad, teary, heavy'],
      ['⛈️', 'Stormy', 'Angry, big, loud'],
      ['🌪️', 'Windy', 'Worried, spinning, fast'],
      ['🌫️', 'Foggy', 'Tired, far away, fuzzy'],
      ['🌈', 'Rainbow', 'Better after a hard bit'],
      ['❄️', 'Snowy', 'Quiet, still, careful'],
    ].map(([e, n, d]) => `<div class="wx"><div class="e">${e}</div><div class="n2">${n}</div><div class="d2">${d}</div></div>`).join('')}</div>
     <div class="grid2">
       <div class="box tint"><p class="label">Today my weather is…</p><div class="line"></div><p class="note" style="margin-top:2mm">And it is this weather because…</p><div class="line sm"></div><div class="line sm"></div></div>
       <div class="box"><p class="label">When it is stormy, what helps me</p>
         ${['A big squeeze','Water and a snack','Going outside','A quiet corner','Telling a grown-up','Moving my body fast']
           .map((x) => `<div class="chk"><i></i><span>${x}</span></div>`).join('')}</div>
     </div>
     <div style="height:4mm"></div>
     <div class="box"><p class="label">For the grown-up</p>
       <p class="note">Name the weather with them, do not argue with it — “that sounds stormy” lands better than “there's nothing to be angry about”. Feelings get smaller when they are said out loud, and a child who is allowed to name the storm learns they are not the storm. Ask the two questions at the bottom: <strong>what is your weather?</strong> and <strong>what would help?</strong> Then let them choose.</p></div>`,
    'For home and classroom use. Educational — not a diagnostic or assessment tool.'
  ),
};

const browser = await chromium.launch();
const ctx = await browser.newContext();
for (const [slug, html] of Object.entries(sheets)) {
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.pdf({ path: path.join(OUT, `${slug}.pdf`), format: 'A4', printBackground: true });
  await page.close();
  console.log('✶', `${slug}.pdf`);
}
await browser.close();
