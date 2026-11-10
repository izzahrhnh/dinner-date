(() => {
  const C = window.BIRTHDAY || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const setImg = (node, src) => { if (src) node.style.setProperty('--img', `url("${encodeURI(src)}")`); };
  const wobble = (i, max) => (((i * 37 + 11) % 19) / 9 - 1) * max;   // same tilt on every visit
  const first = C.firstName || 'Nurin';
  const stampDate = s => { const d = new Date(s); return isNaN(d) ? s : `'${String(d.getFullYear()).slice(2)} ${d.getMonth() + 1} ${d.getDate()}`; };

  /* ---- Spiral binding ---- */
  const spiral = $('.spiral');
  const drawRings = () => {
    spiral.replaceChildren();
    const n = Math.max(8, Math.floor(spiral.offsetWidth / 26));
    for (let i = 0; i < n; i++) spiral.append(el('i'));
  };
  drawRings(); addEventListener('resize', drawRings);

  /* ---- Cover ---- */
  document.title = `Happy birthday, ${first}`;
  $('[data-first]').textContent = first;
  $('[data-last]').textContent = C.lastName || '';
  $('[data-date]').textContent = C.date || '';
  $('[data-hero-line]').textContent = C.heroLine || '';

  const collage = $('[data-collage]');
  const kinds = ['p-print', 'p-neg', 'p-torn', 'p-cut'];
  const notePos = [
    { left: '-1%', top: '5%', r: -6 },
    { right: '4%', top: '9%', r: 5 },
    { left: '5%', top: '93%', r: -3 },
    { right: '6%', top: '95%', r: 3 }
  ];
  (C.cover || []).slice(0, 4).forEach((item, i) => {
    const p = el('figure', `piece ${kinds[i]}`); p.style.margin = 0;
    const ph = el('div', 'ph'); setImg(ph, item.photo); ph.setAttribute('role', 'img'); ph.setAttribute('aria-label', item.note || 'Photo of us');
    p.append(ph);
    if (kinds[i] === 'p-print') {
      p.append(el('span', 'tape'));
      const s = el('span', 'side-text', `PHOTO 01 · ${C.date || ''}`); s.setAttribute('aria-hidden', 'true'); p.append(s);
    }
    if (kinds[i] === 'p-neg') {
      const m = el('span', 'marks'); m.setAttribute('aria-hidden', 'true');
      m.append(el('span', null, '▶ 18'), el('span', null, '2511 0525'), el('span', null, '6B'));
      p.append(m, el('span', 'code'));
    }
    collage.append(p);
    if (item.note) {
      const n = el('p', 'note', item.note); const pos = notePos[i];
      Object.entries(pos).forEach(([k, v]) => { if (k !== 'r') n.style[k] = v; });
      n.style.transform = `rotate(${pos.r}deg)`; n.setAttribute('aria-hidden', 'true');
      collage.append(n);
    }
  });
  const peony = el('img', 'sticker sticker-peony-c'); peony.src = 'assets/stickers/peony.png'; peony.alt = '';
  collage.append(peony);

  /* ---- Group note ---- */
  const gn = $('[data-group-note]');
  (C.groupNote || []).forEach(p => gn.append(el('p', null, p)));
  $('[data-group-sign]').textContent = C.groupSign || '';

  /* ---- Private letters ---- */
  const dialog = $('#letter');
  const lockForm = $('[data-lock]'), opened = $('[data-opened]');
  const msg = $('[data-lock-msg]');
  const unlockedThisVisit = new Map();   // kept only in memory: closing the tab locks them again
  let current = null, lastTrigger = null;

  (C.letters || []).forEach((L, i) => {
    const from = L.from || 'a friend';
    const ready = Boolean(L.code && L.code.startsWith(window.Seal.PREFIX));
    const b = el('button', 'env'); b.type = 'button';
    b.style.setProperty('--r', `${wobble(i, 3).toFixed(1)}deg`);
    const body = el('span', 'body');
    body.append(el('span', 'flap'), el('span', 'wax', '✦'));
    b.append(body, el('span', 'strip from', `from ${from}`));
    const status = el('span', 'status', ready ? 'sealed for you' : 'still being written');
    b.append(status);
    if (!ready) { b.classList.add('waiting'); b.setAttribute('aria-disabled', 'true'); b.setAttribute('aria-label', `Letter from ${from}, still being written`); }
    else b.setAttribute('aria-label', `Open the secret letter from ${from}`);
    b.addEventListener('click', () => { if (ready) openLetter(L, b, status); });
    $('#envelopes').append(b);
  });

  function openLetter(L, trigger, status) {
    current = { L, trigger, status }; lastTrigger = trigger;
    $('[data-letter-from]').textContent = `from ${L.from || 'a friend'}`;
    $('[data-question]').textContent = L.question || 'What is the secret word?';
    msg.textContent = ''; lockForm.reset();
    const saved = unlockedThisVisit.get(L);
    if (saved) showLetter(saved); else { lockForm.hidden = false; opened.hidden = true; }
    dialog.showModal(); dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
    if (!saved && matchMedia('(hover: hover)').matches) lockForm.answer.focus();
  }

  let tries = 0;
  lockForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('.unlock-btn', lockForm);
    btn.disabled = true; msg.textContent = 'Checking…';
    const payload = await window.Seal.unlock(current.L.code, lockForm.answer.value);
    btn.disabled = false;
    if (!payload) {
      tries++;
      msg.textContent = tries > 2 ? 'Not quite. Spelling and spaces don’t matter, only the word itself. Ask the sender for a hint if you’re stuck.' : 'Not quite. Try again.';
      lockForm.classList.remove('shake'); void lockForm.offsetWidth; lockForm.classList.add('shake');
      return;
    }
    tries = 0;
    unlockedThisVisit.set(current.L, payload);
    current.trigger.classList.add('opened');
    current.status.textContent = 'opened';
    showLetter(payload);
  });

  function showLetter(P) {
    lockForm.hidden = true; opened.hidden = false;
    const fig = $('[data-opened-photo]');
    if (P.p) { $('img', fig).src = P.p; $('img', fig).alt = `Photo from ${current.L.from || 'a friend'}`; fig.hidden = false; } else fig.hidden = true;
    $('[data-dear]').textContent = `Dear ${first},`;
    const body = $('[data-opened-body]'); body.replaceChildren();
    (P.m || []).forEach(p => body.append(el('p', null, p)));
    $('[data-opened-sign]').textContent = `— ${current.L.from || 'a friend'}`;
    dialog.scrollTop = 0;
  }

  $('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    lastTrigger?.focus({ preventScroll: true });
  });

  /* ---- Film strip ---- */
  const film = $('#film');
  (C.memories || []).forEach((M, i) => {
    const f = el('figure', 'frame'); f.style.margin = 0;
    const ph = el('div', 'ph'); setImg(ph, M.photo); ph.setAttribute('role', 'img'); ph.setAttribute('aria-label', M.title || 'A memory');
    if (M.date) ph.append(el('span', 'stamp', stampDate(M.date)));
    const no = el('span', 'fno', `${i + 1}A  ▶`); no.setAttribute('aria-hidden', 'true');
    f.append(no, ph);
    if (M.title) f.append(el('figcaption', 'strip cap', M.title));
    film.append(f);
  });

  /* ---- Videos ---- */
  const videos = (C.videos || []).filter(v => v && v.src);
  const video = $('#reel'), label = $('[data-reel-label]');
  const prev = $('[data-reel="prev"]'), next = $('[data-reel="next"]');
  let idx = 0;
  const load = (i, play) => {
    idx = (i + videos.length) % videos.length;
    video.src = videos[idx].src;
    label.textContent = `${idx + 1} of ${videos.length}, from ${videos[idx].from || 'a friend'}`;
    if (play) video.play().catch(() => {});
  };
  if (videos.length) {
    video.hidden = false; $('[data-reel-empty]').hidden = true;
    if (videos.length > 1) { prev.hidden = false; next.hidden = false; }
    load(0, false);
    video.addEventListener('ended', () => { if (idx < videos.length - 1) load(idx + 1, true); });
    prev.addEventListener('click', () => load(idx - 1, true));
    next.addEventListener('click', () => load(idx + 1, true));
  }

  /* ---- Wish ---- */
  const cake = $('.cake'), hint = $('[data-wish-hint]');
  cake.addEventListener('click', () => {
    const out = cake.getAttribute('aria-pressed') !== 'true';
    cake.setAttribute('aria-pressed', String(out));
    cake.setAttribute('aria-label', out ? 'Relight the candle' : 'Blow out the candle');
    hint.textContent = out ? `wish made. happy birthday, ${first}.` : 'tap the candle to blow it out';
  });
})();
