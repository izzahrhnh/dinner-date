/* A little world for Nurin — all rendering and interactions.
   Content comes from content.js (window.SCRAPBOOK). */
(() => {
  const S = window.SCRAPBOOK || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tilt = (i, max) => +((((i * 37 + 11) % 19) / 9 - 1) * max).toFixed(2);   // same tilt every visit
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
  };

  const first = S.recipient?.firstName || 'Nurin';
  const last = S.recipient?.lastName || '';
  const people = (S.contributors || []).slice(0, 4);
  const isSample = src => S.showPlaceholderTags && /(^|\/)sample-/.test(src || '');

  /* A photograph with lazy loading, the film fade and an optional "sample" tag */
  function photo(src, alt = '', eager = false) {
    const wrap = el('div', 'photo');
    if (!src) return wrap;
    const img = el('img'); img.src = src; img.alt = alt; img.decoding = 'async';
    if (!eager) img.loading = 'lazy';
    wrap.append(img);
    if (isSample(src)) wrap.append(el('span', 'sample-tag', 'sample'));
    return wrap;
  }
  function videoThumb(v) {
    const box = el('div', 'vid');
    box.append(photo(v.poster, ''), el('span', 'play'), el('span', 'vid-label', '▶ FILM'));
    // a silent copy that plays on its own while the clip is on screen (tap opens it with sound)
    const live = el('video', 'vid-live');
    live.muted = true; live.loop = true; live.playsInline = true; live.preload = 'none';
    live.setAttribute('muted', ''); live.setAttribute('playsinline', ''); live.setAttribute('aria-hidden', 'true');
    live.dataset.src = v.src; if (v.poster) live.poster = v.poster;
    live.addEventListener('playing', () => box.classList.add('is-live'));
    box.append(live);
    return box;
  }

  /* =========================================================
     LIGHTBOX — every photo and video in the archive
     ========================================================= */
  const media = [];
  const lb = $('[data-lightbox]'), lbMedia = $('[data-lb-media]');
  let lbIndex = 0, lastFocus = null;
  function addMedia(m) { media.push(m); return media.length - 1; }
  function showMedia(i) {
    lbIndex = (i + media.length) % media.length;
    const m = media[lbIndex];
    lbMedia.replaceChildren();
    if (m.type === 'video') {
      const v = el('video'); v.src = m.src; if (m.poster) v.poster = m.poster;
      v.controls = true; v.playsInline = true; v.autoplay = true; v.preload = 'auto';
      lbMedia.append(v);
    } else {
      const img = el('img'); img.src = m.src; img.alt = m.caption || 'A photograph';
      lbMedia.append(img);
    }
    $('[data-lb-caption]').textContent = m.caption || '';
    $('[data-lb-meta]').textContent = [m.date, m.place].filter(Boolean).join('  ·  ');
  }
  function openLightbox(i, trigger) {
    if (!media.length) return;
    lastFocus = trigger; showMedia(i); lb.showModal(); document.body.classList.add('lb-open');
    if (music.playing && media[i].type === 'video') music.duck(true);
    if (media[i].type === 'video') $$('.vid-live').forEach(v => v.pause());
  }
  lb.addEventListener('close', () => {
    lbMedia.replaceChildren(); document.body.classList.remove('lb-open'); music.duck(false);
    lastFocus?.focus({ preventScroll: true });
  });
  $('[data-lb-close]').addEventListener('click', () => lb.close());
  $('[data-lb-prev]').addEventListener('click', () => showMedia(lbIndex - 1));
  $('[data-lb-next]').addEventListener('click', () => showMedia(lbIndex + 1));
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') showMedia(lbIndex - 1); if (e.key === 'ArrowRight') showMedia(lbIndex + 1); });
  let touchX = null;
  lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 50 && !(e.target.closest('video'))) showMedia(lbIndex + (dx < 0 ? 1 : -1));
  });

  /* =========================================================
     PAGE 01 — COVER
     ========================================================= */
  const cover = S.cover || {};
  $('[data-cover-label]').textContent = cover.label || '';
  $('[data-first]').textContent = first;
  $('[data-last]').textContent = last;
  $('[data-cover-line]').textContent = cover.line || '';
  $('[data-cover-sub]').textContent = cover.subtitle || '';
  $('[data-open-label]').textContent = cover.button || 'Open your little world';
  $('[data-stamp-date]').textContent = cover.stampDate || '';
  $('[data-stamp-path]').textContent = `A LITTLE WORLD · MADE FOR ${first.toUpperCase()} · `;
  document.title = `A little world for ${first}`;

  const collage = $('[data-cover-collage]');
  (cover.photos || []).slice(0, 5).forEach((src, i) => {
    const f = el('div', `c-photo c${i + 1}`);
    f.append(photo(src, '', true));
    if (i === 0) f.append(el('span', 'washi'));
    if (i === 1) f.append(el('span', 'washi wine'));
    collage.append(f);
  });
  if (cover.note) collage.append(el('p', 'cover-note', cover.note));

  const coverEl = $('#cover');
  const ready = () => requestAnimationFrame(() => coverEl.classList.add('ready'));
  (document.fonts?.ready || Promise.resolve()).then(ready);
  setTimeout(ready, 1200);

  const story = $('#story');
  function openStory(scroll) {
    story.hidden = false;
    document.body.classList.remove('is-closed');
    packArchive();                                   // the archive needs its real width to lay out
    store.sset('opened', '1');
    $('[data-music]').hidden = false;
    loadPlayer();
    startObservers();
    if (scroll) requestAnimationFrame(() => $('#begin').scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' }));
  }
  // Opening the book is her tap, so the song starts here (browsers allow sound after a tap).
  $('[data-open]').addEventListener('click', () => { openStory(true); music.play(); });

  /* =========================================================
     PAGE 02 — BEFORE YOU BEGIN
     ========================================================= */
  const intro = $('[data-intro]');
  (S.intro?.paragraphs || []).forEach(p => intro.append(el('p', null, p)));
  $('[data-intro-sign]').textContent = S.intro?.signature || '';

  /* =========================================================
     PAGE 03 — THE MEMORY ARCHIVE
     ========================================================= */
  const grid = $('[data-archive]');
  // spread the videos out evenly between the photos ("selang-seli"), whatever order they were added in
  const archiveItems = (() => {
    const all = S.archive || [];
    const vids = all.filter(a => a.type === 'video'), rest = all.filter(a => a.type !== 'video');
    if (!vids.length) return all;
    const every = Math.max(2, Math.floor(rest.length / (vids.length + 1)));
    const out = []; let v = 0;
    rest.forEach((a, i) => { out.push(a); if ((i + 1) % every === 0 && v < vids.length) out.push(vids[v++]); });
    return out.concat(vids.slice(v));
  })();
  archiveItems.forEach((item, i) => {
    const type = item.type || 'photo';
    if (type === 'note') {
      const f = el('div', 'item note reveal-photo');
      f.style.setProperty('--rot', `${tilt(i, 3)}deg`);
      f.append(el('p', 'note-card', item.text || ''));
      grid.append(f); return;
    }
    if (type === 'strip') {
      const f = el('figure', 'item strip reveal-photo');
      const film = el('div', 'strip-film');
      (item.photos || []).forEach((src, k) => {
        const idx = addMedia({ type: 'photo', src, caption: item.caption, date: item.date, place: item.place });
        const b = el('button', 's-frame'); b.type = 'button'; b.setAttribute('aria-label', `Open photo ${k + 1} of this film strip`);
        b.append(photo(src, ''));
        b.addEventListener('click', () => openLightbox(idx, b));
        film.append(b);
      });
      f.append(film);
      if (item.caption) f.append(el('figcaption', 'cap', item.caption));
      grid.append(f); return;
    }
    const size = item.size || 'small';
    const f = el('figure', `item ${size} reveal-photo`);
    if (size !== 'polaroid') f.style.setProperty('--rot', `${tilt(i, size === 'feature' || size === 'wide' ? .8 : 1.6)}deg`);
    const idx = addMedia({ type, src: item.src, poster: item.poster, caption: item.caption, date: item.date, place: item.place });
    const visual = type === 'video' ? videoThumb(item) : photo(item.src, item.caption || 'A photograph');
    if (size === 'polaroid') { const frame = el('div', 'frame'); frame.append(visual); f.append(frame); }
    else f.append(visual);
    if (size === 'feature') f.append(el('span', 'washi'));
    if (item.date || item.place) {
      const meta = el('div', 'meta');
      if (item.date) meta.append(el('span', 'stamp-date', item.date));
      if (item.place) meta.append(el('span', null, item.place));
      f.append(meta);
    }
    if (item.caption) f.append(el('figcaption', 'cap', item.caption));
    const b = el('button', 'item-btn'); b.type = 'button';
    b.setAttribute('aria-label', `${type === 'video' ? 'Play video' : 'Open photo'}${item.caption ? `: ${item.caption}` : ''}`);
    b.addEventListener('click', () => openLightbox(idx, b));
    f.append(b);
    grid.append(f);
  });

  // Scatter the archive like a scrapbook: some photos on their own, some in pairs or threes,
  // nudged left or right and dropped a little lower than their neighbours. Two videos never
  // share a row. The arrangement is the same every visit (seeded), and redraws on resize.
  const SHAPES = window.PHOTO_SHAPES || {};
  const DEFAULT_SHAPE = { feature: .7, wide: .66, tall: 1.4, polaroid: 1.25, small: 1.25, note: .8 };
  const wideMQ = matchMedia('(min-width: 760px)');
  function packArchive() {
    const wide = wideMQ.matches, cols = wide ? 12 : 6, gap = wide ? 18 : 14, unit = 8;
    const gw = grid.clientWidth; if (!gw) return;
    const colW = (gw - gap * (cols - 1)) / cols;
    const px = span => span * colW + (span - 1) * gap;
    let seed = 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const pick = arr => arr[Math.floor(rnd() * arr.length)];
    const items = [...grid.children].map(n => {
      const kind = n.classList.contains('strip') ? 'strip' : n.classList.contains('note') ? 'note' : n.querySelector('.vid') ? 'video' : 'photo';
      const size = ['feature', 'wide', 'tall', 'polaroid', 'small'].find(c => n.classList.contains(c)) || 'note';
      const src = n.querySelector('img')?.getAttribute('src');
      const shape = SHAPES[src] || DEFAULT_SHAPE[size] || 1;
      return { n, kind, size, shape, portrait: kind === 'note' || shape > 1.05 };
    });
    const heightFor = (it, span) => {
      const w = px(span);
      if (it.kind === 'strip') return wide ? 250 : 190;
      if (it.kind === 'note') return Math.min(w * .8, 240);
      if (it.size === 'polaroid') return (w - 14) * it.shape + 37;
      if (it.kind === 'video') return (w - 28) * it.shape + 24;
      return w * it.shape;
    };
    const take = (pred, max) => {                       // next few items that suit this row
      const got = [];
      for (let k = 0; k < Math.min(queue.length, 4) && got.length < max; k++) if (pred(queue[k], got)) got.push(k);
      return got.reverse().map(k => queue.splice(k, 1)[0]).reverse();
    };
    const queue = items.slice();
    grid.style.gridAutoRows = unit + 'px'; grid.style.rowGap = '0px';
    let top = 1;
    while (queue.length) {
      const a = queue.shift(), row = [];
      const okWith = (q, got) => q.kind !== 'strip' && !(q.kind === 'video' && (a.kind === 'video' || got.some(k => queue[k].kind === 'video')));
      if (a.kind === 'strip') row.push({ it: a, col: 1, span: cols, drop: 0 });
      else if (!a.portrait) {
        const roll = rnd();
        const mate = wide && roll < .5 ? take((q, g) => q.portrait && okWith(q, g), 1)[0] : null;
        const twin = wide && !mate && roll < .85 ? take((q, g) => !q.portrait && okWith(q, g), 1)[0] : null;
        if (mate) {                                      // landscape + portrait
          const big = pick([7, 7, 8]), small = big === 8 ? 4 : pick([4, 5]), left = rnd() < .5;
          row.push({ it: a, col: left ? 1 : 13 - big, span: big, drop: 0 });
          row.push({ it: mate, col: left ? 13 - small : 1, span: small, drop: pick([3, 6, 10]) });
        } else if (twin) {                               // two landscapes, staggered
          const [w1, w2] = pick([[6, 6], [7, 5], [5, 7]]);
          row.push({ it: a, col: 1, span: w1, drop: 0 });
          row.push({ it: twin, col: 13 - w2, span: w2, drop: pick([6, 10, 16]) });
        } else {                                         // one on its own, nudged off-centre
          const span = wide ? pick([7, 8, 9]) : pick([6, 6, 5]);
          row.push({ it: a, col: 1 + Math.floor(rnd() * (cols - span + 1)), span, drop: 0 });
        }
      } else {
        const mates = take((q, g) => q.portrait && okWith(q, g), wide ? pick([1, 2, 2]) : pick([1, 1, 0]));
        const group = [a, ...mates];
        if (wide) {
          const plans = { 1: [[pick([1, 3, 5, 7]), pick([4, 5])]], 2: [[1, 4, 6, 4], [2, 4, 8, 4], [1, 5, 8, 4], [3, 4, 8, 5]], 3: [[1, 4, 5, 4, 9, 4], [1, 3, 5, 4, 10, 3], [2, 3, 6, 4, 10, 3]] };
          const plan = pick(plans[group.length]);
          group.forEach((it, i) => row.push({ it, col: plan[i * 2], span: plan[i * 2 + 1], drop: i === 0 ? 0 : pick([2, 5, 9]) }));
        } else if (group.length === 2) {
          group.forEach((it, i) => row.push({ it, col: i ? 4 : 1, span: 3, drop: i ? pick([3, 6, 9]) : 0 }));
        } else row.push({ it: a, col: pick([1, 3, 2]), span: 4, drop: 0 });
      }
      let bottom = top;
      row.forEach(r => {
        const h = Math.ceil(heightFor(r.it, r.span) / unit), y = top + r.drop;
        r.it.n.style.gridColumn = `${r.col} / span ${r.span}`;
        r.it.n.style.gridRow = `${y} / span ${h}`;
        bottom = Math.max(bottom, y + h);
      });
      top = bottom + (wide ? 4 : 3);
    }
  }
  packArchive();
  wideMQ.addEventListener('change', packArchive);
  let lastW = grid.clientWidth;
  addEventListener('resize', () => { clearTimeout(packArchive.t); packArchive.t = setTimeout(() => { if (grid.clientWidth !== lastW) { lastW = grid.clientWidth; packArchive(); } }, 150); });

  /* =========================================================
     PAGE 04 — FIVE OF US
     ========================================================= */
  const five = S.fiveOfUs || {};
  const frames = $('[data-five-frames]');
  const group = el('figure', 'group-shot reveal-photo'); group.style.margin = 0; group.style.setProperty('--rot', '-.6deg');
  group.append(photo(five.groupPhoto, `All five of us`), el('span', 'washi'), el('span', 'washi wine'));
  frames.append(group);
  const littleFrames = (five.frames || people.map(p => ({ photo: p.photo, caption: p.name }))).filter(f => f.photo).slice(0, 4);
  littleFrames.forEach((p, i) => {
    const fig = el('figure', `mini-polaroid c${i} reveal-photo`);
    fig.style.setProperty('--rot', `${[-4, 3.5, 2.5, -3][i]}deg`);
    fig.append(photo(p.photo, p.caption || first), el('figcaption', null, p.caption || ''));
    frames.append(fig);
  });
  const her = el('figure', 'mini-polaroid her reveal-photo'); her.style.setProperty('--rot', '1.5deg');
  const herCap = el('figcaption', null, first); herCap.append(el('span', 'tagline', 'the reason for all this'));
  her.append(photo(five.recipientPhoto, first), herCap);
  frames.append(her);

  const details = $('[data-five-details]');
  (five.details || []).forEach((d, i) => { const li = el('li', 'reveal', d); li.style.setProperty('--rot', `${tilt(i, 2.5)}deg`); details.append(li); });

  const notes = $('[data-five-notes]');
  people.forEach((p, i) => {
    const n = el('article', `note-paper n${i} reveal`);
    n.style.setProperty('--rot', `${[-.8, .7, -.5, .9][i]}deg`);
    n.append(el('span', 'mini-label', `Note 0${i + 1}`), el('p', null, (five.messages || [])[i] || ''), el('span', 'from', `— ${p.name}`));
    if (i % 2) n.append(el('span', 'washi'));
    notes.append(n);
  });

  /* =========================================================
     PAGE 05 — LITTLE THINGS
     ========================================================= */
  const board = $('[data-things]');
  // sections listed in hiddenPages stay in the code but don't show; page numbers close the gap
  (S.hiddenPages || []).forEach(id => { const sec = document.getElementById(id); if (sec) sec.hidden = true; });
  $$('#story > .page:not([hidden]) .page-no').forEach((n, i) => { n.textContent = `Page ${String(i + 2).padStart(2, '0')}`; });

  (S.littleThings || []).forEach((t, i) => {
    const card = el('article', 'thing reveal');
    card.style.setProperty('--rot', `${tilt(i + 3, 1.2)}deg`);
    card.append(el('h3', null, t.title || ''));
    const ul = el('ul'); (t.items || []).forEach(x => ul.append(el('li', null, x))); card.append(ul);
    if (t.photo) card.append(photo(t.photo, ''));
    else { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'botanical'); svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use'); use.setAttribute('href', i % 2 ? '#bloom' : '#sprig'); svg.append(use); card.append(svg); }
    board.append(card);
  });

  // photobooth strips glide sideways on their own while on screen; a touch pauses them for a moment
  $$('.strip-film').forEach(film => {
    if (reduced.matches) return;
    let visible = false, dir = 1, holdUntil = 0, last = 0, pos = 0;
    const hold = ms => { holdUntil = performance.now() + ms; pos = film.scrollLeft; };
    ['pointerdown', 'wheel', 'touchstart'].forEach(ev => film.addEventListener(ev, () => hold(4000), { passive: true }));
    film.addEventListener('mouseenter', () => hold(1e9)); film.addEventListener('mouseleave', () => hold(800));
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: .4 }).observe(film);
    const step = now => {
      const dt = Math.min(now - last, 50); last = now;
      const max = film.scrollWidth - film.clientWidth;
      if (visible && max > 4 && now > holdUntil) {
        pos += dir * dt * .045;                              // about 45px a second
        if (pos >= max) { pos = max; dir = -1; holdUntil = now + 1400; }
        if (pos <= 0) { pos = 0; dir = 1; holdUntil = now + 1400; }
        film.scrollLeft = pos;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(t => { last = t; requestAnimationFrame(step); });
  });

  // play each archive clip (muted) while it's on screen, pause it when it scrolls away
  const liveClips = $$('.vid-live');
  if (liveClips.length && 'IntersectionObserver' in window && !reduced.matches) {
    const clipIO = new IntersectionObserver(entries => entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else if (!v.paused) v.pause();
    }), { threshold: .6 });
    liveClips.forEach(v => clipIO.observe(v));
    // the open lightbox video has sound; keep the little ones still meanwhile
    lb.addEventListener('close', () => liveClips.forEach(v => { if (v.src && v.getBoundingClientRect().top < innerHeight && v.getBoundingClientRect().bottom > 0) v.play().catch(() => {}); }));
  }

  /* =========================================================
     FILM BANDS between pages (thumbnails slide as you scroll)
     ========================================================= */
  const thumbs = media.filter(m => m.type === 'photo').map(m => m.src);
  $$('[data-film-band]').forEach((track, t) => {
    for (let k = 0; k < 28; k++) {
      if (k % 4 === 0) track.append(el('b', null, k % 8 === 0 ? '25 · 11 · 2004' : `${first.toUpperCase()} · 22`));
      const s = el('span'); s.style.backgroundImage = `url("${encodeURI(thumbs[(k + t * 3) % Math.max(thumbs.length, 1)] || '')}")`; track.append(s);
    }
  });

  /* =========================================================
     PAGE 06 — THE SECRET LETTER
     ========================================================= */
  const SL = S.secretLetter || {};
  const secret = $('#secret');
  const LKEY = 'nurin-letter-v1';
  const state = Object.assign({ attempt: '', hints: 0, unlocked: false, key: '', tries: 0 }, store.get(LKEY, {}));
  const save = () => store.set(LKEY, state);

  $('[data-secret-intro]').textContent = SL.intro || '';
  $('[data-riddle]').textContent = SL.riddle || '';
  $('[data-method]').textContent = SL.methodClue || '';

  const cipherText = String(SL.cipherText || '');
  const paragraphs = text => text.split(/\n\s*\n/);
  // Build the manuscript: one <span> per letter so it can "turn" into the real letter.
  const cipherBody = $('[data-cipher-body]');
  let letterSpans = [];
  function renderCipher() {
    cipherBody.replaceChildren(); letterSpans = [];
    paragraphs(cipherText).forEach(par => {
      const p = el('p');
      [...par].forEach(ch => {
        if (ch === '\n') { p.append(el('br')); return; }
        if (/[A-Za-z]/.test(ch)) { const s = el('span', 'ch', ch); letterSpans.push(s); p.append(s); }
        else p.append(document.createTextNode(ch));
      });
      cipherBody.append(p);
    });
  }
  renderCipher();

  const input = $('#key-input'), form = $('[data-key-form]'), msg = $('[data-key-msg]');
  const hintList = $('[data-hint-list]'), hintBtn = $('[data-hint-btn]');
  const hints = SL.hints || [];
  input.value = state.attempt || '';
  input.addEventListener('input', () => { state.attempt = input.value; save(); });

  function renderHints() {
    hintList.replaceChildren();
    hints.slice(0, state.hints).forEach(h => hintList.append(el('li', null, h)));
    hintBtn.disabled = state.hints >= hints.length;
    hintBtn.textContent = state.hints >= hints.length ? 'No more hints' : state.hints ? 'Another hint' : 'I need a hint';
    hintBtn.hidden = !hints.length;
  }
  renderHints();
  hintBtn.addEventListener('click', () => { state.hints = Math.min(hints.length, state.hints + 1); save(); renderHints(); });

  const wrongLines = ['Not quite. Try another word.', 'Close your eyes, read the riddle again.', 'Not this one — but you’re allowed as many tries as you like.'];

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const key = window.Cipher.cleanKey(input.value);
    if (!key) { msg.textContent = 'Type a word first.'; return; }
    const fp = await window.Cipher.fingerprint(key);
    if (fp !== SL.keyFingerprint) {
      state.tries++; save();
      msg.textContent = wrongLines[(state.tries - 1) % wrongLines.length] + (state.tries >= 2 && state.hints < hints.length ? ' A hint might help.' : '');
      form.classList.remove('wrong'); void form.offsetWidth; form.classList.add('wrong');
      return;
    }
    state.unlocked = true; state.key = key; save();
    msg.textContent = 'That’s it.';
    unlockSequence(key);
  });

  const revealed = $('[data-revealed]');
  function fillLetter(key) {
    const plain = window.Cipher.decode(cipherText, key);
    const body = $('[data-plain-body]'); body.replaceChildren();
    paragraphs(plain).forEach(par => {
      const p = el('p');
      par.split('\n').forEach((line, k) => { if (k) p.append(el('br')); p.append(document.createTextNode(line)); });
      body.append(p);
    });
    return plain;
  }

  function unlockSequence(key) {
    const plainLetters = [...window.Cipher.decode(cipherText, key)].filter(ch => /[A-Za-z]/.test(ch));
    fillLetter(key);
    if (reduced.matches) { finish(); return; }
    secret.classList.add('opening');
    $('[data-manuscript]').scrollIntoView({ behavior: 'smooth', block: 'center' });
    // the encoded letters turn into the real ones, one after another
    const total = letterSpans.length, duration = 2200, startAt = performance.now() + 1100;
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const starts = letterSpans.map((_, i) => (i / total) * duration + Math.random() * 180);
    function frame(now) {
      const t = now - startAt; let done = true;
      letterSpans.forEach((s, i) => {
        if (t < starts[i]) { done = false; return; }
        if (t < starts[i] + 160) {
          done = false; s.classList.add('turning');
          const r = abc[(Math.random() * 26) | 0]; s.textContent = s.textContent === s.textContent.toLowerCase() ? r.toLowerCase() : r;
        } else if (s.textContent !== plainLetters[i] || s.classList.contains('turning')) { s.textContent = plainLetters[i]; s.classList.remove('turning'); }
      });
      if (!done) requestAnimationFrame(frame); else setTimeout(finish, 700);
    }
    requestAnimationFrame(frame);
  }
  function finish() {
    secret.classList.add('unlocked'); secret.classList.remove('opening');
    revealed.hidden = false; revealed.classList.remove('enter'); void revealed.offsetWidth; revealed.classList.add('enter');
    revealed.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    revealed.focus({ preventScroll: true });
  }
  // Already solved on this phone: open straight to the letter.
  if (state.unlocked && state.key) { fillLetter(state.key); secret.classList.add('unlocked'); revealed.hidden = false; }

  $('[data-show-cipher]').addEventListener('click', () => {
    renderCipher(); secret.classList.remove('unlocked', 'opening'); revealed.hidden = true; msg.textContent = '';
    $('[data-manuscript]').scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'center' });
  });

  /* =========================================================
     PAGE 07 — CLOSING
     ========================================================= */
  const C = S.closing || {};
  $('[data-first-2]').textContent = first;
  $('[data-closing-heading]').textContent = C.heading || '';
  const cp = $('[data-closing-photo]');
  cp.append(el('span', 'washi'), photo(C.groupPhoto, 'All five of us'), el('figcaption', null, 'the five of us'));
  const cn = $('[data-closing-notes]');
  (C.messages || []).length && people.forEach((p, i) => {   // optional per-person lines
    const n = el('div', 'closing-note reveal'); n.style.setProperty('--d', `${i * .12}s`);
    n.append(el('p', null, (C.messages || [])[i] || ''), el('span', 'from', p.name));
    cn.append(n);
  });
  // "Happy birthday, Nuwinnn!" → a serif line, then the name in big handwriting with a drawn swash
  const coll = $('[data-closing-collective]'), txt = C.collective || '', cut = txt.indexOf(',');
  if (cut > 0) {
    coll.classList.add('is-wish');
    const name = el('span', 'wish-name', txt.slice(cut + 1).trim());
    name.insertAdjacentHTML('beforeend', '<svg class="wish-swash" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M6 26c46-12 96-17 146-14 44 3 84 9 140-2-40 14-86 20-128 18"/></svg>');
    coll.append(el('span', 'wish-lead', txt.slice(0, cut)), name);
    coll.insertAdjacentHTML('beforeend', '<svg class="wish-spark s1" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1v18M1 10h18M4 4l12 12M16 4L4 16"/></svg><svg class="wish-spark s2" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v16M2 10h16"/></svg><svg class="wish-spark s3" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v14M3 10h14"/></svg>');
  } else coll.textContent = txt;
  $('[data-closing-sign]').textContent = C.signature || '';
  $('[data-closing-date]').textContent = C.date || '';

  /* =========================================================
     MUSIC — never autoplays; remembers the choice this visit
     ========================================================= */
  const audio = $('[data-audio]'), mBtn = $('[data-music]'), mText = $('[data-music-text]');
  const card = $('[data-music-card]');
  const spId = ((S.music?.spotify || '').match(/track[/:]([A-Za-z0-9]{22})/) || [])[1] || '';
  const ytId = spId ? '' : (() => {
    const u = S.music?.youtube || '';
    const m = u.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || u.match(/^([\w-]{11})$/);
    return m ? m[1] : '';
  })();
  const embedded = Boolean(spId || ytId);
  if (spId) card.classList.add('is-spotify');
  $('[data-music-title]').textContent = S.music?.title || '';
  let player = null, playerReady = false, wantPlay = false, hintTimer = null, loading = false;
  const LOUD = 70, SOFT = 12;

  // The player is created when the book opens, so a tap can start it straight away.
  function loadPlayer() {
    if (!embedded || player || loading) return;
    loading = true;
    const tag = document.createElement('script');
    if (spId) {
      window.onSpotifyIframeApiReady = API => {
        API.createController($('#music-player'), { uri: `spotify:track:${spId}`, width: '100%', height: 80 }, ctrl => {
          player = ctrl; playerReady = true;
          let last = 0;
          ctrl.addListener('playback_update', e => {
            const { isPaused, position, duration } = e.data;
            if (!isPaused && position > 0) { clearTimeout(hintTimer); card.classList.remove('needs-tap'); if (!music.playing) music.set(true); }
            // loop: start again when the song (or preview) reaches its end
            if (duration && position >= duration - 400 && last < position && wantPlay) setTimeout(() => { ctrl.seek(0); ctrl.resume(); }, 300);
            if (isPaused && music.playing && !music.ducking && position > 0 && position < duration - 600) music.set(false, true);
            last = position;
          });
          if (wantPlay) ctrl.play();
        });
      };
      tag.src = 'https://open.spotify.com/embed/iframe-api/v1';
    } else {
      window.onYouTubeIframeAPIReady = () => {
        player = new YT.Player('music-player', {
          videoId: ytId, width: 240, height: 200,
          playerVars: { playsinline: 1, controls: 1, loop: 1, playlist: ytId, rel: 0, modestbranding: 1 },
          events: {
            onReady: () => { playerReady = true; player.setVolume(LOUD); if (wantPlay) player.playVideo(); },
            onStateChange: e => {
              if (e.data === YT.PlayerState.PLAYING) { clearTimeout(hintTimer); card.classList.remove('needs-tap'); music.set(true); }
              if (e.data === YT.PlayerState.PAUSED && music.playing && !music.ducking) music.set(false, true);
            },
          },
        });
      };
      tag.src = 'https://www.youtube.com/iframe_api';
    }
    document.head.append(tag);
  }

  const music = {
    playing: false, ducking: false,
    set(on, keepCard) {
      this.playing = on; store.sset('music', on ? 'on' : 'off');
      mBtn.setAttribute('aria-pressed', String(on));
      mBtn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
      mText.textContent = on ? 'Music on' : 'Music off';
      if (embedded && !on && !keepCard) card.classList.remove('is-open');
    },
    async play() {
      if (embedded) {
        card.classList.add('is-open'); wantPlay = true;
        if (playerReady) spId ? player.play() : player.playVideo(); else loadPlayer();
        // some phones only let the player itself start the sound
        clearTimeout(hintTimer); hintTimer = setTimeout(() => { if (!this.playing) card.classList.add('needs-tap'); }, 2500);
        return;
      }
      if (!S.music?.src) return;
      if (!audio.src) audio.src = S.music.src;
      audio.volume = .55;
      try { await audio.play(); this.set(true); } catch { this.set(false); }
    },
    pause() {
      wantPlay = false;
      if (embedded) { if (playerReady) spId ? player.pause() : player.pauseVideo(); card.classList.remove('is-open', 'needs-tap'); this.set(false); return; }
      audio.pause(); this.set(false);
    },
    resumeIfWanted() { if (store.sget('music') === 'on' && !this.playing) this.play(); },
    // quieter while a video plays (Spotify can't change volume, so it pauses instead)
    duck(down) {
      if (!this.playing && !this.ducking) return;
      if (!embedded) { audio.volume = down ? .08 : .55; return; }
      if (!playerReady) return;
      this.ducking = down;
      if (spId) down ? player.pause() : player.resume();
      else player.setVolume(down ? SOFT : LOUD);
    },
  };
  if (!embedded && !S.music?.src) mBtn.remove();
  else {
    mBtn.title = S.music.title || '';
    mBtn.addEventListener('click', () => music.playing || card.classList.contains('is-open') ? music.pause() : music.play());
    $('[data-music-close]').addEventListener('click', () => music.pause());
    // browsers only allow sound after a tap, so a remembered "on" resumes on the first one
    if (store.sget('music') === 'on') addEventListener('pointerdown', () => music.resumeIfWanted(), { once: true });
    // get the player ready while she is still on the cover, so the tap on "Open" can start it at once
    loadPlayer();
  }

  /* =========================================================
     MOTION — reveals, parallax, film bands
     ========================================================= */
  let observersOn = false;
  function startObservers() {
    if (observersOn) return; observersOn = true;
    // stagger items that appear together
    $$('.archive-grid > *').forEach((n, i) => n.style.setProperty('--d', `${(i % 4) * .09}s`));
    $$('.five-frames > *').forEach((n, i) => n.style.setProperty('--d', `${i * .1}s`));
    $$('.things-board > *').forEach((n, i) => n.style.setProperty('--d', `${(i % 3) * .1}s`));
    if (!('IntersectionObserver' in window)) { $$('.reveal, .reveal-photo').forEach(n => n.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    $$('.reveal, .reveal-photo').forEach(n => io.observe(n));
  }

  const coverPhotos = $$('.c-photo');
  const bands = $$('[data-film-band]');
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = scrollY, vh = innerHeight;
      if (!reduced.matches) {
        if (y < vh * 1.2) coverPhotos.forEach((p, i) => { p.style.translate = `0 ${y * [.06, .14, .1, .12, .08][i]}px`; });
        bands.forEach((b, i) => {
          const r = b.parentElement.getBoundingClientRect();
          if (r.bottom > 0 && r.top < vh) b.style.transform = `translateX(${(i % 2 ? -1 : 1) * (r.top - vh) * .35 - 300}px)`;
        });
      }
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Coming back in the same visit: the book is already open.
  if (store.sget('opened') === '1') openStory(false);
})();
