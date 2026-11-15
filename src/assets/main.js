/* Knot Alone — progressive enhancement. No dependencies, no tracking. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k, f) { try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme ---------- */
  const SUN = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
  const MOON = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';
  const effective = () =>
    document.documentElement.dataset.theme ||
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const paintThemeIcon = () => {
    const el = $('[data-theme-icon]');
    if (el) el.innerHTML = effective() === 'dark' ? SUN : MOON;
  };
  paintThemeIcon();
  $('[data-theme-toggle]')?.addEventListener('click', () => {
    const next = effective() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store.set('ka-theme', next);
    paintThemeIcon();
  });

  /* ---------- nav ---------- */
  const navBtn = $('[data-nav-toggle]');
  const nav = $('[data-nav]');
  navBtn?.addEventListener('click', () => {
    const open = nav.dataset.open === 'true';
    nav.dataset.open = String(!open);
    navBtn.setAttribute('aria-expanded', String(!open));
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.dataset.open === 'true') {
      nav.dataset.open = 'false';
      navBtn.setAttribute('aria-expanded', 'false');
      navBtn.focus();
    }
  });

  const head = $('[data-head]');
  const bar = $('[data-progress]');
  const onScroll = () => {
    if (head) head.dataset.stuck = String(scrollY > 8);
    if (bar) {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, (scrollY / h) * 100) : 0) + '%';
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal ---------- */
  const reveals = $$('.reveal');
  if (reveals.length) {
    if (reduced || !('IntersectionObserver' in window)) reveals.forEach((el) => (el.dataset.shown = 'true'));
    else {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((en) => {
            if (en.isIntersecting) { en.target.dataset.shown = 'true'; io.unobserve(en.target); }
          }),
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      reveals.forEach((el) => io.observe(el));
    }
  }

  /* ---------- toc highlight ---------- */
  const tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    tocLinks.forEach((a) => {
      const t = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (t) map.set(t, a);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            tocLinks.forEach((a) => (a.dataset.active = 'false'));
            map.get(en.target).dataset.active = 'true';
          }
        });
      },
      { rootMargin: '-82px 0px -70% 0px' }
    );
    map.forEach((_, t) => io.observe(t));
  }

  /* ---------- saved knots ---------- */
  const SAVED = 'ka-saved';
  const savedList = () => store.get(SAVED, []);
  const paintSaves = () => {
    const list = savedList();
    $$('[data-save]').forEach((b) => {
      const on = list.some((i) => i.id === b.dataset.save);
      b.setAttribute('aria-pressed', String(on));
      const label = b.querySelector('span');
      if (label) label.textContent = on ? 'Saved' : 'Save';
    });
    const count = $('[data-saved-count]');
    if (count) count.textContent = String(list.length);
  };
  $$('[data-save]').forEach((b) => {
    b.addEventListener('click', () => {
      const id = b.dataset.save;
      const list = savedList();
      const i = list.findIndex((x) => x.id === id);
      if (i > -1) list.splice(i, 1);
      else
        list.unshift({
          id,
          title: b.dataset.title || document.title.split(' | ')[0],
          href: b.dataset.href || location.pathname,
          kind: b.dataset.kind || 'page',
          at: Date.now(),
        });
      store.set(SAVED, list.slice(0, 60));
      paintSaves();
    });
  });
  paintSaves();

  const savedMount = $('[data-saved-mount]');
  if (savedMount) {
    const list = savedList();
    savedMount.innerHTML = list.length
      ? `<div class="grid grid--2">${list
          .map(
            (i) => `<article class="card"><span class="chip chip--accent">${i.kind}</span>
              <h3><a href="${i.href}">${i.title}</a></h3>
              <div class="card__meta"><button class="save-btn" data-remove="${i.id}" aria-pressed="true">Remove</button></div></article>`
          )
          .join('')}</div>`
      : `<div class="card"><h3>Nothing saved yet</h3><p class="muted">Tap <strong>Save</strong> on any article, workbook or game and it waits for you here — on this device, no account.</p><p><a class="btn btn--sm" href="/articles/">Browse articles</a></p></div>`;
    savedMount.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;
      store.set(SAVED, savedList().filter((x) => x.id !== btn.dataset.remove));
      location.reload();
    });
  }

  /* ---------- article filter + search ---------- */
  const filterBar = $('[data-filter]');
  if (filterBar) {
    const cards = $$('[data-tags]');
    const searchInput = $('[data-search]');
    const empty = $('[data-empty]');
    let active = 'all';
    const apply = () => {
      const q = (searchInput?.value || '').trim().toLowerCase();
      let shown = 0;
      cards.forEach((c) => {
        const okTag = active === 'all' || (c.dataset.tags || '').split('|').includes(active);
        const okQ = !q || (c.dataset.index || c.textContent).toLowerCase().includes(q);
        const ok = okTag && okQ;
        c.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    };
    filterBar.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-tag]');
      if (!b) return;
      active = b.dataset.tag;
      $$('button[data-tag]', filterBar).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply();
    });
    searchInput?.addEventListener('input', apply);
    const q = new URLSearchParams(location.search).get('q');
    if (q && searchInput) { searchInput.value = q; apply(); }
  }

  /* ---------- newsletter (no backend yet: queue + honest message) ---------- */
  $$('[data-newsletter]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      const action = form.getAttribute('data-provider');
      if (action) return; // real provider handles it
      e.preventDefault();
      const email = form.querySelector('input[type=email]')?.value?.trim();
      if (!email) return;
      store.set('ka-pending-email', email);
      form.innerHTML = `<div class="callout callout--try reveal-in"><p class="callout__title">You're on the list ✶</p><p>We saved <strong>${email.replace(/[<>&"]/g, '')}</strong> on this device. The Readers' Line goes out weekly — check your inbox for the first one.</p></div>`;
    });
  });

  /* ---------- the 2-minute untangler ---------- */
  const untangle = $('[data-untangle]');
  if (untangle) {
    const out = $('[data-untangle-out]', untangle);
    untangle.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-loop]');
      if (!b) return;
      $$('button[data-loop]', untangle).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      let data = {};
      try { data = JSON.parse(b.dataset.payload); } catch {}
      out.hidden = false;
      out.innerHTML = `<div class="reveal-in stack">
        <span class="eyebrow">${data.label || 'What this is'}</span>
        <h3>${data.name || ''}</h3>
        <p>${data.what || ''}</p>
        <div class="callout callout--try"><p class="callout__title">Try this for 2 minutes</p><p>${data.try || ''}</p></div>
        <p class="row">${(data.links || []).map((l) => `<a class="btn btn--ghost btn--sm" href="${l.href}">${l.label}</a>`).join('')}</p>
      </div>`;
      out.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
    });
  }

  /* ---------- quiz / game engine ---------- */
  const quizEl = $('[data-quiz]');
  if (quizEl) {
    const cfg = JSON.parse($('#quiz-data').textContent);
    let i = 0;
    const picks = [];
    const total = cfg.questions.length;

    const render = () => {
      if (i >= total) return finish();
      const q = cfg.questions[i];
      quizEl.innerHTML = `
        <div class="reveal-in stack">
          <div class="between">
            <span class="eyebrow">${cfg.mode === 'score' ? `Card ${i + 1} of ${total}` : `Question ${i + 1} of ${total}`}</span>
            <span class="dim">${Math.round((i / total) * 100)}%</span>
          </div>
          <div class="progress" style="position:static;height:4px;background:var(--line);border-radius:9px;overflow:hidden">
            <div class="progress__bar" style="width:${(i / total) * 100}%"></div>
          </div>
          <h3>${q.q}</h3>
          ${q.context ? `<p class="muted">${q.context}</p>` : ''}
          <ul class="loop-list">
            ${q.options.map((o, n) => `<li><button data-opt="${n}"><span class="num">${String.fromCharCode(65 + n)}</span><span>${o.text}</span></button></li>`).join('')}
          </ul>
        </div>`;
    };

    const feedback = (q, opt, n) => {
      const right = cfg.mode === 'score' ? !!opt.correct : null;
      quizEl.innerHTML = `
        <div class="reveal-in stack">
          ${right === null ? '' : `<span class="chip ${right ? 'chip--calm' : 'chip--accent'}">${right ? 'Got it' : 'Close'}</span>`}
          <h3>${opt.title || q.q}</h3>
          <p>${opt.why || ''}</p>
          ${opt.tip ? `<div class="callout callout--try"><p class="callout__title">What helps</p><p>${opt.tip}</p></div>` : ''}
          <button class="btn" data-next>${i + 1 >= total ? 'See the whole picture' : 'Next'} <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></button>
        </div>`;
    };

    const finish = () => {
      let result;
      if (cfg.mode === 'score') {
        const score = picks.filter((p) => p.correct).length;
        const band = cfg.results.find((r) => score >= (r.min ?? 0)) || cfg.results[cfg.results.length - 1];
        result = { ...band, headline: band.title.replace('{score}', score).replace('{total}', String(total)) };
      } else {
        const tally = {};
        picks.forEach((p) => { if (p.key) tally[p.key] = (tally[p.key] || 0) + 1; });
        const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
        const band = cfg.results.find((r) => r.key === top) || cfg.results[0];
        result = { ...band, headline: band.title };
      }
      quizEl.innerHTML = `
        <div class="reveal-in stack">
          <span class="eyebrow">${cfg.resultEyebrow || 'Your result'}</span>
          <h3>${result.headline}</h3>
          <p class="lede">${result.body}</p>
          ${result.tip ? `<div class="callout callout--try"><p class="callout__title">Start here</p><p>${result.tip}</p></div>` : ''}
          <div class="callout callout--careful"><p>This is a learning game, not an assessment. It can't diagnose anything — only a qualified professional who actually meets you can do that.</p></div>
          <p class="row">
            ${(result.links || []).map((l) => `<a class="btn ${l.primary ? '' : 'btn--ghost'} btn--sm" href="${l.href}">${l.label}</a>`).join('')}
            <button class="btn btn--ghost btn--sm" data-restart>Play again</button>
          </p>
        </div>`;
    };

    quizEl.addEventListener('click', (e) => {
      const opt = e.target.closest('button[data-opt]');
      if (opt) {
        const q = cfg.questions[i];
        const n = Number(opt.dataset.opt);
        const chosen = q.options[n];
        picks.push({ correct: !!chosen.correct, key: chosen.key });
        feedback(q, chosen, n);
        return;
      }
      if (e.target.closest('[data-next]')) { i++; render(); return; }
      if (e.target.closest('[data-restart]')) { i = 0; picks.length = 0; render(); }
    });
    render();
  }

  /* ---------- the replay room ---------- */
  const replay = $('[data-replay]');
  if (replay) {
    const steps = [
      { eyebrow: 'Step 1 — name it', q: 'What are you replaying?', hint: 'A sentence someone said. A text you sent. The silence after.', ph: 'He said he needed space and I keep hearing it in his voice…' },
      { eyebrow: 'Step 2 — the fear underneath', q: 'If that memory is right about you, what would it mean?', hint: 'Replay loops are rarely about the scene. They are about the verdict we think it proves.', ph: 'That I was too much, again.' },
      { eyebrow: 'Step 3 — the evidence test', q: 'What is one fact from the last month that argues against that verdict?', hint: 'Not a pep talk. A fact. Something that happened.', ph: 'My friend called me first when her dad got sick.' },
    ];
    let s = 0;
    const answers = [];
    const box = $('[data-replay-box]', replay);
    const draw = () => {
      if (s >= steps.length) return done();
      const st = steps[s];
      box.innerHTML = `<div class="reveal-in stack">
        <span class="eyebrow">${st.eyebrow}</span>
        <h3>${st.q}</h3>
        <p class="muted">${st.hint}</p>
        <div class="field"><label for="rp">Type it here — it never leaves this device</label>
        <textarea id="rp" rows="3" placeholder="${st.ph}"></textarea></div>
        <button class="btn" data-rp-next>Next ✶</button>
      </div>`;
      $('#rp', box).focus();
    };
    const done = () => {
      box.innerHTML = `<div class="reveal-in stack">
        <span class="eyebrow">What your brain just did</span>
        <h3>You turned a loop into a sentence.</h3>
        <p>A replay loop runs because the scene feels unfinished — your brain keeps reopening it looking for a door. Naming the scene, the verdict and one piece of counter-evidence gives it the ending it was hunting for. That is the whole mechanism.</p>
        <div class="callout callout--science"><p class="callout__title">Why it works</p><p>Putting feelings into specific words (affect labelling) reliably lowers the intensity of the feeling — it moves the work from pure alarm into language. It doesn't delete the memory; it stops the memory from running you.</p></div>
        <div class="callout callout--try"><p class="callout__title">When the loop comes back tonight</p><p>Say the verdict out loud, then the one fact. Two sentences. That's it. Repetition is the point, not intensity.</p></div>
        <p class="row">
          <button class="btn" data-rp-burn>Let it go ✶</button>
          <a class="btn btn--ghost btn--sm" href="/workbooks/overthinking-reset/">The Overthinking Reset workbook</a>
        </p>
        <p class="dim">Nothing you typed was sent anywhere. Closing this page erases it.</p>
      </div>`;
    };
    replay.addEventListener('click', (e) => {
      if (e.target.closest('[data-rp-next]')) {
        answers.push($('#rp', box)?.value || '');
        s++;
        draw();
      }
      if (e.target.closest('[data-rp-burn]')) {
        box.innerHTML = `<div class="reveal-in stack" style="text-align:center">
          <div style="font-size:3rem;line-height:1">✶</div>
          <h3>Gone from the page.</h3>
          <p class="muted">Not gone from you — that takes longer, and that's normal. Come back tomorrow if it loops again.</p>
          <p class="row" style="justify-content:center"><button class="btn btn--ghost btn--sm" data-rp-restart>Run it again</button></p>
        </div>`;
      }
      if (e.target.closest('[data-rp-restart]')) { s = 0; answers.length = 0; draw(); }
    });
    draw();
  }

  /* ---------- switch-cost demo (ADHD / task switching) ---------- */
  const sw = $('[data-switch]');
  if (sw) {
    const stage = $('[data-switch-stage]', sw);
    let mode = 'single';
    let trials = [];
    let idx = 0;
    let t0 = 0;
    const results = { single: [], switching: [] };

    const makeTrials = (n, switching) =>
      Array.from({ length: n }, () => {
        const num = Math.floor(Math.random() * 8) + 1;
        const letter = 'AEIOUBCDFG'[Math.floor(Math.random() * 10)];
        const task = switching ? (Math.random() < 0.5 ? 'number' : 'letter') : 'number';
        return { num, letter, task };
      });

    const ask = () => {
      if (idx >= trials.length) return report();
      const t = trials[idx];
      stage.innerHTML = `<div class="stack" style="text-align:center">
        <span class="eyebrow">${mode === 'single' ? 'Round 1 — one rule' : 'Round 2 — the rule keeps changing'} · ${idx + 1}/${trials.length}</span>
        <p class="muted">${t.task === 'number' ? 'Is the <strong>number</strong> odd or even?' : 'Is the <strong>letter</strong> a vowel or consonant?'}</p>
        <div style="font-family:var(--display);font-size:clamp(2.5rem,10vw,4rem);letter-spacing:.1em">${t.num}&nbsp;${t.letter}</div>
        <div class="row" style="justify-content:center">
          <button class="btn btn--ghost" data-ans="a">${t.task === 'number' ? 'Odd' : 'Vowel'}</button>
          <button class="btn btn--ghost" data-ans="b">${t.task === 'number' ? 'Even' : 'Consonant'}</button>
        </div>
      </div>`;
      t0 = performance.now();
    };

    const report = () => {
      if (mode === 'single') {
        mode = 'switching';
        trials = makeTrials(10, true);
        idx = 0;
        stage.innerHTML = `<div class="stack" style="text-align:center">
          <h3>Round 2</h3>
          <p class="muted">Same speed, please. But now the rule changes without warning — sometimes the number, sometimes the letter.</p>
          <p><button class="btn" data-sw-go>Start round 2</button></p>
        </div>`;
        return;
      }
      const avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);
      const one = avg(results.single);
      const two = avg(results.switching);
      const cost = two - one;
      stage.innerHTML = `<div class="reveal-in stack">
        <span class="eyebrow">Your switch cost</span>
        <h3>${cost > 0 ? `+${cost}ms slower` : 'About the same'} when the rule kept moving.</h3>
        <div class="grid grid--2">
          <div class="stat"><span class="stat__n">${one}ms</span><span class="stat__l">One rule</span></div>
          <div class="stat"><span class="stat__n">${two}ms</span><span class="stat__l">Rule switching</span></div>
        </div>
        <p>That gap has a name: <strong>switch cost</strong>. Every change of rule makes your brain drop one set of instructions and load another, and the reload is not free. Nearly everyone slows down here — it is how attention is built.</p>
        <div class="callout callout--science"><p class="callout__title">Why this matters if you have ADHD</p><p>Your day is round 2, all day: a notification, a half-finished tab, someone's question, back to the thing. The tiredness isn't laziness or low effort — it's paying the reload fee hundreds of times. Which is also the good news: you can design the fee down by batching similar work and closing the loops that keep calling you back.</p></div>
        <p class="row">
          <a class="btn btn--sm" href="/workbooks/adhd-day-designer/">The ADHD Day Designer</a>
          <a class="btn btn--ghost btn--sm" href="/articles/why-starting-is-the-hardest-part-adhd/">Why starting is the hardest part</a>
          <button class="btn btn--ghost btn--sm" data-sw-restart>Run it again</button>
        </p>
        <p class="dim">A browser game measures reaction time roughly and it cannot assess anyone. It shows one real effect, nothing more.</p>
      </div>`;
    };

    sw.addEventListener('click', (e) => {
      if (e.target.closest('[data-sw-start]') || e.target.closest('[data-sw-go]')) {
        if (!trials.length || mode === 'single') { mode = 'single'; trials = makeTrials(10, false); idx = 0; }
        ask();
        return;
      }
      if (e.target.closest('[data-ans]')) {
        results[mode].push(performance.now() - t0);
        idx++;
        ask();
        return;
      }
      if (e.target.closest('[data-sw-restart]')) {
        mode = 'single'; results.single = []; results.switching = []; trials = makeTrials(10, false); idx = 0; ask();
      }
    });
  }

  /* ---------- copy link ---------- */
  $$('[data-copy]').forEach((b) =>
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy || location.href);
        const old = b.textContent;
        b.textContent = 'Copied ✶';
        setTimeout(() => (b.textContent = old), 1600);
      } catch {}
    })
  );
})();
