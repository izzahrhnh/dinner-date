(() => {
  const C = window.BIRTHDAY || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const setImg = (node, src) => { if (src) node.style.setProperty('--img', `url("${encodeURI(src)}")`); };
  // Small, repeatable "random" so tilts stay the same on every visit
  const wobble = (i, max) => (((i * 37 + 11) % 19) / 9 - 1) * max;

  const name = (C.name || 'you').trim();
  const unlockAt = C.unlockAt ? new Date(C.unlockAt) : null;
  const preview = new URLSearchParams(location.search).has('preview');
  const isOpen = () => preview || !unlockAt || Date.now() >= unlockAt.getTime();
  const unlockLabel = unlockAt ? unlockAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'Asia/Kuala_Lumpur' }) : '';
  const stampDate = s => {
    if (!s) return '';
    const d = new Date(s); if (isNaN(d)) return s;
    return `'${String(d.getFullYear()).slice(2)} ${d.getMonth() + 1} ${d.getDate()}`;
  };

  /* ---- Cover ---- */
  document.title = `Happy birthday, ${name}`;
  $('[data-name]').textContent = name;
  $('[data-hero-line]').textContent = C.heroLine || '';

  const ransom = $('[data-ransom]');
  let li = 0;
  'Happy birthday'.split(' ').forEach(word => {
    const w = el('span', 'word'); w.setAttribute('aria-hidden', 'true');
    [...word].forEach(ch => {
      const c = el('span', `cut s${(li * 5 + 2) % 6}`, ch);
      c.style.setProperty('--r', `${wobble(li, 7).toFixed(1)}deg`);
      c.style.setProperty('--y', `${wobble(li + 3, 3).toFixed(1)}px`);
      c.style.setProperty('--i', li);
      w.append(c); li++;
    });
    ransom.append(w);
  });

  // Polaroid stack: tap to send the top photo away
  const stack = $('[data-stack]');
  const shots = (C.contactSheet || []).slice(0, 12);
  const stackCaps = C.stackCaptions || ['us, as usual', 'remember this?', 'good company', 'another year of this', 'keep this one', 'the crew'];
  const cards = shots.map((src, i) => {
    const p = el('figure', 'polaroid'); p.style.margin = 0;
    const shot = el('div', 'shot'); setImg(shot, src);
    p.append(shot, el('figcaption', 'caption', stackCaps[i % stackCaps.length]));
    p.style.setProperty('--i', Math.min(i, 4));
    return p;
  });
  let top = 0;
  function layoutStack() {
    cards.forEach((p, i) => {
      const depth = (i - top + cards.length) % cards.length;
      p.style.zIndex = cards.length - depth;
      p.style.transform = `rotate(${depth === 0 ? -2 : wobble(i, 8).toFixed(1)}deg) translate(${depth ? wobble(i + 5, 10).toFixed(0) : 0}px, ${depth * 2}px)`;
      p.hidden = depth > 4;
    });
  }
  cards.slice().reverse().forEach(p => stack.prepend(p));
  layoutStack();
  $('.stack-hit').addEventListener('click', () => {
    if (cards.length < 2) return;
    const leaving = cards[top];
    leaving.classList.add('out');
    setTimeout(() => { leaving.classList.remove('out'); top = (top + 1) % cards.length; layoutStack(); }, 380);
  });
  if (!cards.length) { stack.hidden = true; $('.stack-hint').hidden = true; }

  /* ---- Countdown sticky note ---- */
  const cd = $('[data-countdown]');
  function tick() {
    if (!unlockAt || isOpen()) { cd.textContent = 'Today is your day. Scroll down, it’s all yours.'; return; }
    const ms = unlockAt - Date.now();
    if (ms <= 0) { location.reload(); return; }
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
    cd.textContent = d > 0
      ? `${d} day${d > 1 ? 's' : ''}, ${h} hour${h !== 1 ? 's' : ''} until we open the rest`
      : `${h}h ${m}m until we open the rest`;
  }
  tick(); setInterval(tick, 30000);

  /* ---- Your note ---- */
  const note = $('[data-my-note]');
  (C.myNote || []).forEach(p => note.append(el('p', null, p)));
  $('[data-signature]').textContent = C.from ? `love, ${C.from}` : '';
  const notePhoto = $('[data-note-photo]');
  const np = C.notePhoto || C.memories?.[0]?.photo || shots[0];
  if (np) setImg(notePhoto, np); else notePhoto.hidden = true;

  /* ---- Letters as envelopes ---- */
  const dialog = $('#letter');
  const env = $('#envelopes');
  let lastTrigger;
  if (!isOpen()) $('[data-letters-hint]').textContent = `Sealed until ${unlockLabel}. Come back then.`;

  (C.letters || []).forEach((L, i) => {
    const from = L.from || 'A friend';
    const b = el('button', 'envelope'); b.type = 'button';
    b.style.setProperty('--r', `${wobble(i, 3).toFixed(1)}deg`);
    const body = el('span', 'body');
    const peek = el('span', 'peek'); setImg(peek, L.photo);
    body.append(peek, el('span', 'flap'));
    const seal = el('span', 'seal', isOpen() ? '♡' : '25');
    body.append(seal);
    b.append(body, el('span', 'to', `from ${from}`));
    if (isOpen()) {
      b.setAttribute('aria-label', `Open the letter from ${from}`);
      b.addEventListener('click', () => openLetter(L, b));
    } else {
      b.classList.add('sealed'); b.setAttribute('aria-disabled', 'true');
      b.setAttribute('aria-label', `Letter from ${from}, sealed until ${unlockLabel}`);
    }
    env.append(b);
  });

  function openLetter(L, trigger) {
    lastTrigger = trigger;
    const media = $('[data-letter-media]'); media.replaceChildren();
    if (L.video) { const v = el('video'); v.src = L.video; v.controls = true; v.playsInline = true; v.preload = 'metadata'; media.append(v); }
    else if (L.photo) { const img = el('img'); img.src = L.photo; img.alt = `Photo from ${L.from || 'a friend'}`; media.append(img); }
    $('#letter-title').textContent = `Dear ${name},`;
    const body = $('[data-letter-body]'); body.replaceChildren();
    (L.message || []).forEach(p => body.append(el('p', null, p)));
    $('[data-letter-sign]').textContent = `— ${L.from || 'a friend'}`;
    dialog.showModal(); dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
  }
  const close = () => dialog.close();
  $('[data-close]').addEventListener('click', close);
  dialog.addEventListener('click', e => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => {
    $$('video', dialog).forEach(v => v.pause());
    document.body.classList.remove('dialog-open');
    lastTrigger?.focus({ preventScroll: true });
  });

  /* ---- Clothesline ---- */
  const line = $('#clothesline');
  (C.memories || []).forEach((M, i) => {
    const h = el('article', 'hang');
    h.style.setProperty('--r', `${wobble(i + 2, 4).toFixed(1)}deg`);
    const p = el('figure', 'polaroid'); p.style.margin = 0;
    const shot = el('div', 'shot'); setImg(shot, M.photo);
    shot.setAttribute('role', 'img'); shot.setAttribute('aria-label', M.title || 'A memory');
    if (M.date) shot.append(el('span', 'date-stamp', stampDate(M.date)));
    const cap = el('figcaption', 'caption', M.title || '');
    if (M.caption) cap.append(el('small', null, M.caption));
    p.append(shot, cap);
    h.append(el('span', 'peg'), p);
    line.append(h);
  });
  if ((C.memories || []).length > 1) line.after(el('p', 'swipe-cue', 'swipe for more'));

  /* ---- Our film ---- */
  const videos = (C.videos || []).filter(v => v && v.src);
  const video = $('#reel-video');
  const label = $('[data-reel-label]');
  const prev = $('[data-reel="prev"]'), next = $('[data-reel="next"]');
  let idx = 0;
  function load(i, autoplay) {
    idx = (i + videos.length) % videos.length;
    const v = videos[idx];
    video.src = v.src;
    label.textContent = `${idx + 1} of ${videos.length}, from ${v.from || 'a friend'}`;
    if (autoplay) video.play().catch(() => {});
  }
  if (videos.length && isOpen()) {
    video.hidden = false; $('[data-screen-empty]').hidden = true;
    if (videos.length > 1) { prev.hidden = false; next.hidden = false; }
    load(0, false);
    video.addEventListener('ended', () => { if (idx < videos.length - 1) load(idx + 1, true); });
    prev.addEventListener('click', () => load(idx - 1, true));
    next.addEventListener('click', () => load(idx + 1, true));
  } else if (videos.length) {
    $('[data-screen-empty]').textContent = `${videos.length} little film${videos.length > 1 ? 's' : ''} waiting for you on ${unlockLabel}.`;
  } else if (isOpen()) {
    $('[data-screen-empty]').textContent = 'No films yet.';
  }

  /* ---- Wish ---- */
  const cake = $('.cake'), hint = $('[data-wish-hint]');
  cake.addEventListener('click', () => {
    const out = cake.getAttribute('aria-pressed') !== 'true';
    cake.setAttribute('aria-pressed', String(out));
    cake.setAttribute('aria-label', out ? 'Relight the candle' : 'Blow out the candle');
    hint.textContent = out ? `wish made. happy birthday, ${name}.` : 'tap the candle to blow it out';
  });
  $('[data-colophon]').textContent = C.colophon || 'Put together with love by the crew.';
})();
