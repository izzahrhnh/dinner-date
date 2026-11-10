(() => {
  const C = window.BIRTHDAY || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const setImg = (node, src) => { if (src) node.style.setProperty('--img', `url("${encodeURI(src)}")`); };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const name = (C.name || 'you').trim();
  const unlockAt = C.unlockAt ? new Date(C.unlockAt) : null;
  const preview = new URLSearchParams(location.search).has('preview');
  const isOpen = () => preview || !unlockAt || Date.now() >= unlockAt.getTime();

  /* ---- Names and text ---- */
  $$('[data-name]').forEach(n => n.textContent = name + '.');
  $('[data-edition]').textContent = `VOL. 25 / FOR ${name.toUpperCase()}`;
  $('[data-hero-line]').textContent = C.heroLine || '';
  document.title = `Happy birthday, ${name} — 25 November`;
  const note = $('[data-my-note]');
  (C.myNote || []).forEach(p => note.append(el('p', null, p)));
  $('[data-signature]').textContent = C.from ? `— ${C.from}` : '';

  /* ---- Contact sheet ---- */
  const sheet = $('#contact-sheet');
  const shots = (C.contactSheet || []).slice(0, 12);
  const scribbles = [['a little', 'escape'], ['good', 'company.'], null, ['moments', 'to keep'], ['another', 'year']];
  const reels = 5, perReel = Math.ceil(Math.max(shots.length, 5) / reels);
  let frameNo = 21;
  for (let r = 0; r < reels; r++) {
    const reel = el('div', `reel reel-${['one','two','three','four','five'][r]}`);
    const rail = el('span', 'rail-label', `A ROLL FOR YOU · 400 / ${frameNo}`); rail.setAttribute('aria-hidden', 'true');
    reel.append(rail);
    const mine = shots.slice(r * perReel, r * perReel + perReel);
    mine.forEach((src, i) => {
      const b = el('button', 'negative'); b.type = 'button';
      b.setAttribute('aria-label', 'Light up this photograph'); b.setAttribute('aria-pressed', 'false');
      setImg(b, src);
      b.append(el('span', 'frame-id', `${frameNo}${i % 2 ? 'A' : ''}`));
      reel.append(b);
      if (i === 0) {
        if (r === 2) {
          const s = el('span', 'scribble date-scribble'); s.append('25', el('br'), 'November');
          const c = el('span', 'pencil-circle'); c.setAttribute('aria-hidden', 'true'); s.append(c); reel.append(s);
        } else if (scribbles[r]) {
          const s = el('span', 'scribble'); s.append(scribbles[r][0], el('br'), scribbles[r][1]); reel.append(s);
        }
      }
    });
    frameNo++;
    if (r === 0 || r === 2 || r === 4) {
      const end = el('span', 'reel-end', ['400 ───── 25A', '', 'EXPOSED WITH LOVE', '', 'END OF ROLL / 36 EXP'][r]);
      end.setAttribute('aria-hidden', 'true'); reel.append(end);
    }
    sheet.append(reel);
  }
  const star = el('span', 'pencil-star', '✶'); star.setAttribute('aria-hidden', 'true'); sheet.append(star);

  $$('.negative').forEach(frame => {
    frame.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch' || reducedMotion.matches) return;
      const r = frame.getBoundingClientRect();
      frame.style.setProperty('--x', `${e.clientX - r.left}px`);
      frame.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
    frame.addEventListener('click', () => frame.setAttribute('aria-pressed', String(frame.getAttribute('aria-pressed') !== 'true')));
  });

  /* ---- Note photos ---- */
  const notePhotos = [C.memories?.[0]?.photo || shots[0], C.memories?.[2]?.photo || shots[1]];
  $$('[data-note-photo]').forEach((n, i) => setImg(n, notePhotos[i]));

  /* ---- Letters ---- */
  const dialog = $('#letter');
  let lastTrigger;
  const grid = $('#letters-grid');
  const letters = C.letters || [];
  const unlockLabel = unlockAt ? unlockAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'Asia/Kuala_Lumpur' }) : '';
  if (!isOpen()) $('[data-letters-hint]').textContent = `Sealed until ${unlockLabel}.`;

  letters.forEach((L, i) => {
    const card = el('button', 'letter-card'); card.type = 'button';
    const ph = el('div', 'letter-photo'); setImg(ph, L.photo);
    if (!L.photo) ph.classList.add('no-photo');
    const meta = el('div', 'letter-meta');
    meta.append(el('span', 'frame-number', `LETTER ${String(i + 1).padStart(2, '0')} / FROM`), el('h3', null, L.from || 'A friend'));
    const first = (L.message || [])[0] || '';
    meta.append(el('p', 'letter-preview', isOpen() ? first : 'Sealed · opens on your birthday'));
    card.append(ph, meta);
    if (!isOpen()) { card.classList.add('sealed'); card.setAttribute('aria-disabled', 'true'); }
    card.addEventListener('click', () => { if (isOpen()) openLetter(L, card); });
    grid.append(card);
  });

  function openLetter(L, trigger) {
    lastTrigger = trigger;
    $('[data-letter-eyebrow]').textContent = `From ${L.from || 'a friend'}`;
    $('#letter-title').textContent = `Dear ${name},`;
    const media = $('[data-letter-media]'); media.replaceChildren();
    if (L.video) { const v = el('video'); v.src = L.video; v.controls = true; v.playsInline = true; v.preload = 'metadata'; media.append(v); }
    else if (L.photo) { const img = el('img'); img.src = L.photo; img.alt = `Photo from ${L.from || 'a friend'}`; img.loading = 'lazy'; media.append(img); }
    const body = $('[data-letter-body]'); body.replaceChildren();
    (L.message || []).forEach(p => body.append(el('p', null, p)));
    body.append(el('p', 'scribble letter-sign', `— ${L.from || 'a friend'}`));
    dialog.showModal();
    document.body.classList.add('invite-open');
    dialog.scrollTop = 0;
  }
  const closeLetter = () => dialog.close();
  $('.close-note').addEventListener('click', closeLetter);
  $('[data-close-letter]').addEventListener('click', closeLetter);
  dialog.addEventListener('click', e => { if (e.target === dialog) closeLetter(); });
  dialog.addEventListener('close', () => {
    $$('video', dialog).forEach(v => v.pause());
    document.body.classList.remove('invite-open');
    lastTrigger?.focus({ preventScroll: true });
  });

  /* ---- The roll ---- */
  const strip = $('#roll-strip');
  (C.memories || []).forEach(M => {
    const a = el('article', 'moment');
    const ph = el('div', 'moment-photo'); setImg(ph, M.photo); ph.setAttribute('role', 'img'); ph.setAttribute('aria-label', M.title || 'Memory');
    a.append(ph, el('span', 'frame-number', `${M.label || ''}`.toUpperCase()), el('h3', null, M.title || ''), el('p', null, M.caption || ''));
    strip.append(a);
  });

  /* ---- The reel ---- */
  const videos = (C.videos || []).filter(v => v && v.src);
  const video = $('#reel-video'), shell = $('#video-shell');
  const label = $('[data-reel-label]');
  const prev = $('[data-reel="prev"]'), next = $('[data-reel="next"]');
  let idx = 0;
  function load(i, autoplay) {
    idx = (i + videos.length) % videos.length;
    const v = videos[idx];
    video.src = v.src; video.preload = 'metadata';
    label.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(videos.length).padStart(2, '0')} · FROM ${(v.from || 'A FRIEND').toUpperCase()}`;
    if (autoplay) video.play().catch(() => {});
  }
  if (videos.length && isOpen()) {
    video.hidden = false; shell.classList.add('has-video');
    if (videos.length > 1) { prev.hidden = false; next.hidden = false; }
    load(0, false);
    video.addEventListener('ended', () => { if (idx < videos.length - 1) load(idx + 1, true); });
    prev.addEventListener('click', () => load(idx - 1, true));
    next.addEventListener('click', () => load(idx + 1, true));
  } else if (videos.length) {
    $('[data-film-sub]').textContent = `${videos.length} little film${videos.length > 1 ? 's' : ''} waiting · opens ${unlockLabel}.`;
  }

  /* ---- Countdown ---- */
  const cd = $('[data-countdown]');
  function tick() {
    if (!unlockAt || isOpen()) { cd.textContent = 'TODAY IS YOUR DAY · SCROLL TO DEVELOP'; return; }
    const ms = unlockAt - Date.now();
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
    cd.textContent = `DEVELOPING IN ${d}D ${h}H ${m}M`;
    if (ms <= 0) location.reload();
  }
  tick(); setInterval(tick, 30000);

  /* ---- Wish ---- */
  const wish = $('.wish'), hint = $('[data-wish-hint]');
  wish.addEventListener('click', () => {
    const out = wish.getAttribute('aria-pressed') !== 'true';
    wish.setAttribute('aria-pressed', String(out));
    hint.textContent = out ? 'WISH MADE · TAP TO RELIGHT' : 'TAP THE CANDLE · MAKE A WISH';
    wish.setAttribute('aria-label', out ? 'Relight the candle' : 'Blow out the candle');
  });
})();
