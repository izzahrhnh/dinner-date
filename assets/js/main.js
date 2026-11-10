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
  (cover.photos || []).slice(0, 3).forEach((src, i) => {
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
    store.sset('opened', '1');
    $('[data-music]').hidden = false;
    loadYouTube();
    startObservers();
    if (scroll) requestAnimationFrame(() => $('#begin').scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' }));
  }
  $('[data-open]').addEventListener('click', () => { openStory(true); music.resumeIfWanted(); });

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
  (S.archive || []).forEach((item, i) => {
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

  /* =========================================================
     PAGE 04 — FIVE OF US
     ========================================================= */
  const five = S.fiveOfUs || {};
  const frames = $('[data-five-frames]');
  const group = el('figure', 'group-shot reveal-photo'); group.style.margin = 0; group.style.setProperty('--rot', '-.6deg');
  group.append(photo(five.groupPhoto, `All five of us`), el('span', 'washi'), el('span', 'washi wine'));
  frames.append(group);
  people.forEach((p, i) => {
    const fig = el('figure', `mini-polaroid c${i} reveal-photo`);
    fig.style.setProperty('--rot', `${[-4, 3.5, 2.5, -3][i]}deg`);
    fig.append(photo(p.photo, p.name), el('figcaption', null, p.name));
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

  /* =========================================================
     FILM BANDS between pages (thumbnails slide as you scroll)
     ========================================================= */
  const thumbs = media.filter(m => m.type === 'photo').map(m => m.src);
  $$('[data-film-band]').forEach((track, t) => {
    for (let k = 0; k < 28; k++) {
      if (k % 4 === 0) track.append(el('b', null, `${first.toUpperCase()} 400  ${k + 1}A`));
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
  people.forEach((p, i) => {
    const n = el('div', 'closing-note reveal'); n.style.setProperty('--d', `${i * .12}s`);
    n.append(el('p', null, (C.messages || [])[i] || ''), el('span', 'from', p.name));
    cn.append(n);
  });
  $('[data-closing-collective]').textContent = C.collective || '';
  $('[data-closing-sign]').textContent = C.signature || '';
  $('[data-closing-date]').textContent = C.date || '';

  /* =========================================================
     MUSIC — never autoplays; remembers the choice this visit
     ========================================================= */
  const audio = $('[data-audio]'), mBtn = $('[data-music]'), mText = $('[data-music-text]');
  const ytId = (() => {
    const u = S.music?.youtube || '';
    const m = u.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || u.match(/^([\w-]{11})$/);
    return m ? m[1] : '';
  })();
  const card = $('[data-music-card]');
  let yt = null, ytReady = false, wantPlay = false, hintTimer = null;
  const LOUD = 70, SOFT = 12;

  // YouTube's player: created once the book is opened, so a tap can start it straight away.
  function loadYouTube() {
    if (!ytId || yt || window.__ytLoading) return;
    window.__ytLoading = true;
    $('[data-music-title]').textContent = S.music.title || '';
    window.onYouTubeIframeAPIReady = () => {
      yt = new YT.Player('yt-player', {
        videoId: ytId, width: 240, height: 200,
        playerVars: { playsinline: 1, controls: 1, loop: 1, playlist: ytId, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => { ytReady = true; yt.setVolume(LOUD); if (wantPlay) yt.playVideo(); },
          onStateChange: e => {
            if (e.data === YT.PlayerState.PLAYING) { clearTimeout(hintTimer); card.classList.remove('needs-tap'); music.set(true); }
            if (e.data === YT.PlayerState.PAUSED && music.playing && !music.ducking) music.set(false, true);
          },
        },
      });
    };
    const tag = document.createElement('script'); tag.src = 'https://www.youtube.com/iframe_api'; document.head.append(tag);
  }

  const music = {
    playing: false, ducking: false,
    set(on, keepCard) {
      this.playing = on; store.sset('music', on ? 'on' : 'off');
      mBtn.setAttribute('aria-pressed', String(on));
      mBtn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
      mText.textContent = on ? 'Music on' : 'Music off';
      if (ytId && !on && !keepCard) card.classList.remove('is-open');
    },
    async play() {
      if (ytId) {
        card.classList.add('is-open'); wantPlay = true;
        if (ytReady) yt.playVideo(); else loadYouTube();
        // some phones only let the video itself start the sound
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
      if (ytId) { if (ytReady) yt.pauseVideo(); card.classList.remove('is-open', 'needs-tap'); this.set(false); return; }
      audio.pause(); this.set(false);
    },
    resumeIfWanted() { if (store.sget('music') === 'on' && !this.playing) this.play(); },
    duck(down) {
      if (!this.playing) return;
      if (ytId && ytReady) { this.ducking = down; yt.setVolume(down ? SOFT : LOUD); }
      else audio.volume = down ? .08 : .55;
    },
  };
  if (!ytId && !S.music?.src) mBtn.remove();
  else {
    mBtn.title = S.music.title || '';
    mBtn.addEventListener('click', () => music.playing || card?.classList.contains('is-open') ? music.pause() : music.play());
    $('[data-music-close]')?.addEventListener('click', () => music.pause());
    // browsers only allow sound after a tap, so a remembered "on" resumes on the first one
    if (store.sget('music') === 'on') addEventListener('pointerdown', () => music.resumeIfWanted(), { once: true });
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
        if (y < vh * 1.2) coverPhotos.forEach((p, i) => { p.style.translate = `0 ${y * [.06, .14, .1][i]}px`; });
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
