/* ==================================================================
   THE NURIN EXHIBITION — presentation layer
   Runs after main.js has built every section from content.js. It only
   adds exhibition chrome (labels, room names, navigation); all personal
   text is read from window.SCRAPBOOK, never written here.
   ================================================================== */
(() => {
  const S = window.SCRAPBOOK || {};
  const X = S.exhibition || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n, l = 2) => String(n).padStart(l, '0');

  /* ---------------- Room 00: the entrance ---------------- */
  const set = (sel, text) => $$(sel).forEach(n => { n.textContent = text || ''; });
  set('[data-ex-label]', X.label);
  set('[data-ex-title]', X.title);
  set('[data-ex-sub]', X.subtitle);
  set('[data-ex-date]', X.date);
  set('[data-ex-curators]', (S.contributors || []).map(c => c.name).join(', '));
  if (X.title) document.title = X.title;
  const hero = $('.ent-art img');
  if (hero && S.recipient) hero.alt = `${S.recipient.firstName || ''} as a baby`.trim();
  // a gentle reveal once the portrait has loaded (or straight away)
  const cover = $('#cover');
  const ready = () => cover.classList.add('ex-ready');
  if (hero && !hero.complete) { hero.addEventListener('load', ready, { once: true }); setTimeout(ready, 1500); } else ready();

  /* ---------------- clear away scrapbook decoration ---------------- */
  $$('.doodle, .washi, .wish-spark, .wish-swash').forEach(n => n.remove());
  $$('[style*="--rot"]').forEach(n => n.style.removeProperty('--rot'));

  /* ---------------- Room 02: museum labels for every exhibit ---------------- */
  const grid = $('[data-archive]');
  const archive = S.archive || [];
  if (grid) {
    // the film strip opens the gallery, spanning its full width
    const strip = grid.querySelector(':scope > .strip'); if (strip) grid.prepend(strip);
    let no = 0;
    [...grid.children].forEach(item => {
      no++;
      const isVideo = !!item.querySelector('.vid'), isStrip = item.classList.contains('strip'), isNote = item.classList.contains('note');
      const kind = isStrip ? 'Film strip' : isNote ? 'Note' : isVideo ? 'Film' : 'Photograph';
      const oldCap = item.querySelector(':scope > .cap');
      const caption = oldCap ? oldCap.textContent : '';
      const meta = $$('.meta span', item).map(s => s.textContent).filter(Boolean).join(' · ');
      const label = el('figcaption', 'ex-label');
      label.append(el('span', 'ex-no', `Exhibit ${pad(no, 3)} · ${kind}`));
      if (caption && !isNote) label.append(el('span', 'ex-cap', caption));
      if (meta) label.append(el('span', 'ex-meta', meta));
      if (oldCap) oldCap.replaceWith(label); else item.append(label);
      item.dataset.caption = caption;
      if (isNote) item.classList.add('ex-note');
    });
    window.repackArchive?.();
    addEventListener('load', () => window.repackArchive?.(), { once: true });
  }

  /* ---------------- Room 03: people in the picture ---------------- */
  $$('.mini-polaroid').forEach((f, i) => {
    const cap = f.querySelector('figcaption');
    if (!cap || cap.querySelector('.ex-no')) return;
    const text = cap.childNodes[0]?.textContent || cap.textContent;
    const tag = cap.querySelector('.tagline')?.textContent;
    cap.className = 'ex-label';
    cap.replaceChildren(el('span', 'ex-no', f.classList.contains('her') ? `Portrait${tag ? ` · ${tag}` : ''}` : `Portrait ${pad(i + 1)}`), el('span', 'ex-cap', text));
  });
  $$('.closing-photo figcaption').forEach(cap => {
    const text = cap.textContent; cap.className = 'ex-label';
    cap.replaceChildren(el('span', 'ex-no', 'Final exhibit · Photograph'), el('span', 'ex-cap', text));
  });

  /* ---------------- room labels ---------------- */
  const ROOMS = { begin: 'An introduction', archive: 'The memory gallery', ring: 'The memory gallery, continued', five: 'The people in the picture', things: 'The collection of little things', secret: 'Restricted archive', closing: 'The final room' };
  const SHORT = { begin: 'Introduction', archive: 'Memory gallery', five: 'The people', things: 'Little things', secret: 'Hidden archive', closing: 'Final room' };
  const rooms = [];
  let n = 0;
  $$('#story > .page').forEach(sec => {
    if (sec.hidden) return;
    if (sec.id !== 'ring') n++;
    const no = $('.page-no', sec);
    if (no) no.textContent = `Room ${pad(n)} — ${ROOMS[sec.id] || ''}`;
    if (sec.id !== 'ring') rooms.push({ id: sec.id, no: pad(n), name: SHORT[sec.id] || sec.id, sec });
  });
  const ringSec = $('#ring');

  /* ---------------- navigation ---------------- */
  const nav = el('header', 'ex-nav'); nav.hidden = true;
  nav.innerHTML = `
    <a class="ex-mark" href="#cover"></a>
    <nav class="ex-rooms" aria-label="Rooms"><ol></ol></nav>
    <div class="ex-actions">
      <button class="ex-sound" type="button" aria-pressed="false"><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="ex-sound-t">Sound off</span></button>
      <button class="ex-menu-btn" type="button" aria-expanded="false" aria-controls="ex-menu"><span class="ex-current"></span><span>Rooms</span></button>
    </div>`;
  $('.ex-mark', nav).textContent = X.title || '';
  const ol = $('ol', nav);
  const menu = el('div', 'ex-menu'); menu.id = 'ex-menu'; menu.hidden = true;
  menu.innerHTML = `<p class="ex-kicker">Rooms in this exhibition</p><ol></ol>`;
  const mol = $('ol', menu);
  rooms.forEach(r => {
    const li = el('li'); const a = el('a'); a.href = `#${r.id}`; a.dataset.room = r.id;
    a.append(el('span', 'rn', r.no), el('span', 'rt', r.name)); li.append(a); ol.append(li);
    const li2 = li.cloneNode(true); mol.append(li2);
  });
  document.body.append(nav, menu);

  const go = (id, e) => {
    const t = document.getElementById(id); if (!t) return;
    e?.preventDefault();
    closeMenu();                                      // unlock page scrolling first
    requestAnimationFrame(() => t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }));
    // rooms above can grow while we pass them (the gallery walk sizes itself on first view): land precisely
    let tries = 0;
    const settle = () => { const off = t.getBoundingClientRect().top - (id === 'cover' ? 0 : 60); if (Math.abs(off) > 6 && tries++ < 4) { scrollBy({ top: off, behavior: 'auto' }); setTimeout(settle, 250); } };
    setTimeout(settle, reduced ? 50 : 900);
    const focusable = t.querySelector('h2, h1'); if (focusable) { focusable.setAttribute('tabindex', '-1'); focusable.focus({ preventScroll: true }); }
  };
  $$('a[data-room]').forEach(a => a.addEventListener('click', e => go(a.dataset.room, e)));
  $('.ex-mark', nav).addEventListener('click', e => go('cover', e));

  const menuBtn = $('.ex-menu-btn', nav);
  const openMenu = () => { menu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); document.body.classList.add('ex-menu-open'); mol.querySelector('a')?.focus(); };
  function closeMenu() { if (menu.hidden) return; menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('ex-menu-open'); }
  menuBtn.addEventListener('click', () => menu.hidden ? openMenu() : (closeMenu(), menuBtn.focus()));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); menuBtn.focus(); } });
  menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });

  // current room
  let current = '';
  const mark = () => {
    const mid = innerHeight * .4;
    let id = '';
    rooms.forEach(r => { if (r.sec.getBoundingClientRect().top <= mid) id = r.id; });
    if (ringSec && !ringSec.hidden && ringSec.getBoundingClientRect().top <= mid && rooms.find(r => r.id === 'archive')) {
      const next = rooms[rooms.findIndex(r => r.id === 'archive') + 1];
      if (!next || next.sec.getBoundingClientRect().top > mid) id = 'archive';
    }
    if (id === current) return; current = id;
    $$('a[data-room]').forEach(a => { const on = a.dataset.room === id; a.classList.toggle('is-current', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    const r = rooms.find(x => x.id === id);
    $('.ex-current', nav).textContent = r ? `Room ${r.no}` : 'Entrance';
  };
  let tick = false;
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; mark(); }); } }, { passive: true });

  const story = $('#story');
  const show = () => { if (story && !story.hidden) { nav.hidden = false; document.body.classList.add('ex-has-nav'); mark(); } };
  if (story) new MutationObserver(show).observe(story, { attributes: true, attributeFilter: ['hidden'] });
  show();

  /* ---------------- sound control (drives the existing music button) ---------------- */
  const mBtn = $('[data-music]'), sBtn = $('.ex-sound', nav);
  sBtn.addEventListener('click', () => mBtn?.click());
  const syncSound = () => { const on = mBtn?.getAttribute('aria-pressed') === 'true'; sBtn.setAttribute('aria-pressed', on); $('.ex-sound-t', nav).textContent = on ? 'Sound on' : 'Sound off'; nav.classList.toggle('playing', on); };
  if (mBtn) new MutationObserver(syncSound).observe(mBtn, { attributes: true, attributeFilter: ['aria-pressed'] });
  syncSound();
  // the "now playing" card tucks itself into a slim bar once the song is playing
  const mcard = $('[data-music-card]');
  if (mcard && mBtn) {
    let t;
    new MutationObserver(() => { clearTimeout(t); if (mBtn.getAttribute('aria-pressed') === 'true') t = setTimeout(() => mcard.classList.add('docked'), 1800); else mcard.classList.remove('docked'); })
      .observe(mBtn, { attributes: true, attributeFilter: ['aria-pressed'] });
    $('.mc-head', mcard)?.addEventListener('click', e => { if (!e.target.closest('[data-music-close]')) mcard.classList.toggle('docked'); });
  }

  /* ---------------- next-room cue at the end of each room ---------------- */
  rooms.forEach((r, i) => {
    const next = rooms[i + 1]; if (!next) return;
    const host = r.id === 'archive' && ringSec && !ringSec.hidden ? ringSec : r.sec;
    const a = el('a', 'ex-next'); a.href = `#${next.id}`;
    a.append(el('span', 'ex-no', `Next · Room ${next.no}`), el('span', 'ex-next-t', next.name), el('span', 'arrow', '↓'));
    a.addEventListener('click', e => go(next.id, e));
    host.append(a);
  });
})();
