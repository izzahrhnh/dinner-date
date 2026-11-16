/* ==================================================================
   MIX — burgundy bookends around the bright museum
   1. Opening: a floating glass envelope; tap the seal and the
      birthday card rises out of it.
   2. Glass navigation: chapter name, progress, previous/next, music.
   3. Page 02: the letter's lines appear one after another.
   4. Page 04: the little frames swipe sideways on phones.
   5. Final page: burgundy, drifting petals, the message revealed
      line by line.
   ================================================================== */
(() => {
  const S = window.SCRAPBOOK || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get(k) { try { return sessionStorage.getItem(k); } catch { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch {} } };
  const first = (S.recipient && S.recipient.firstName) || '';

  /* ---------- floating particles (gold dust on the cover, petals at the end) ---------- */
  function particles(host, kind) {
    if (reduced || !host) return;
    const c = document.createElement('canvas');
    c.className = `particles ${kind}`; c.setAttribute('aria-hidden', 'true');
    host.prepend(c);
    const ctx = c.getContext('2d');
    let w, h, dpr, items = [], running = false;
    const count = kind === 'petals' ? 22 : 46;
    const make = initial => ({
      x: Math.random() * w, y: initial ? Math.random() * h : (kind === 'petals' ? -20 : h + 10),
      r: kind === 'petals' ? 5 + Math.random() * 6 : .6 + Math.random() * 1.8,
      vx: (Math.random() - .5) * .25, vy: kind === 'petals' ? .25 + Math.random() * .45 : -(.12 + Math.random() * .3),
      a: Math.random() * Math.PI * 2, va: (Math.random() - .5) * .02, o: .25 + Math.random() * .55, ph: Math.random() * 10,
    });
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); w = host.clientWidth; h = host.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); items = Array.from({ length: count }, () => make(true));
    addEventListener('resize', size);
    const draw = t => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      items.forEach((p, i) => {
        p.x += p.vx + Math.sin(t / 1600 + p.ph) * (kind === 'petals' ? .35 : .12); p.y += p.vy; p.a += p.va;
        if (p.y > h + 30 || p.y < -30 || p.x < -30 || p.x > w + 30) items[i] = make(false);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = p.o;
        if (kind === 'petals') {
          ctx.fillStyle = i % 3 ? '#C98A94' : '#E8C7C3';
          ctx.beginPath(); ctx.moveTo(0, -p.r); ctx.bezierCurveTo(p.r, -p.r * .6, p.r * .7, p.r, 0, p.r * 1.1); ctx.bezierCurveTo(-p.r * .7, p.r, -p.r, -p.r * .6, 0, -p.r); ctx.fill();
        } else {
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 4);
          g.addColorStop(0, 'rgba(255, 228, 190, .95)'); g.addColorStop(1, 'rgba(255, 228, 190, 0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, p.r * 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      });
      requestAnimationFrame(draw);
    };
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) requestAnimationFrame(draw); }).observe(host);
  }

  /* ---------- 1. the envelope ---------- */
  const cover = $('#cover'), poster = $('.poster');
  if (cover && poster) {
    cover.classList.add('wine');
    particles(cover, 'dust');
    const env = document.createElement('div');
    env.className = 'gift';
    env.innerHTML = `
      <button class="gift-env" type="button" aria-label="Open the envelope">
        <span class="ge-back"></span>
        <span class="ge-flap"></span>
        <span class="ge-front"><span class="ge-to">for ${first}</span><span class="ge-date">25 · 11</span></span>
        <span class="ge-seal" aria-hidden="true">${(first[0] || '♡').toUpperCase()}</span>
      </button>
      <p class="gift-hint">tap the seal to open</p>`;
    cover.append(env);
    const opened = store.get('opened') === '1' || store.get('envelope') === '1';
    const open = () => {
      if (cover.classList.contains('unsealed')) return;
      store.set('envelope', '1');
      cover.classList.add('unsealing');
      setTimeout(() => { cover.classList.add('unsealed'); $('[data-open]')?.focus({ preventScroll: true }); }, reduced ? 0 : 1250);
    };
    if (opened) { cover.classList.add('unsealing', 'unsealed'); }
    else cover.classList.add('sealed');
    $('.gift-env', env).addEventListener('click', open);
  }

  /* ---------- 2. glass navigation ---------- */
  const story = $('#story');
  const nav = document.createElement('nav');
  nav.className = 'glass-nav'; nav.setAttribute('aria-label', 'Chapters'); nav.hidden = true;
  nav.innerHTML = `
    <button class="gn-btn gn-prev" type="button" aria-label="Previous chapter">‹</button>
    <div class="gn-mid"><span class="gn-no"></span><span class="gn-name"></span><span class="gn-dots" aria-hidden="true"></span></div>
    <button class="gn-btn gn-next" type="button" aria-label="Next chapter">›</button>
    <button class="gn-btn gn-music" type="button" aria-label="Play or pause music" aria-pressed="false"><span class="eq"><i></i><i></i><i></i></span></button>`;
  document.body.append(nav);
  const chapters = () => [cover, ...$$('#story > .page:not([hidden])')];
  const nameOf = sec => {
    if (sec === cover) return 'Happy birthday';
    const t = sec.querySelector('.page-title, .closing-heading');
    const lbl = sec.querySelector('.label');
    if (sec.id === 'closing') return 'And finally';
    return (t && (t.querySelector('[aria-label]')?.getAttribute('aria-label') || t.getAttribute('aria-label') || t.textContent) || '').trim();
  };
  let current = 0;
  const dots = $('.gn-dots', nav);
  const update = () => {
    const list = chapters(), mid = innerHeight * .45;
    let idx = 0; list.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) idx = i; });
    if (dots.childElementCount !== list.length) dots.innerHTML = list.map(() => '<i></i>').join('');
    [...dots.children].forEach((d, i) => d.classList.toggle('on', i <= idx));
    if (idx !== current || !$('.gn-name', nav).textContent) {
      current = idx;
      $('.gn-no', nav).textContent = String(idx + 1).padStart(2, '0');
      $('.gn-name', nav).textContent = nameOf(list[idx]);
    }
    $('.gn-prev', nav).disabled = idx === 0; $('.gn-next', nav).disabled = idx === list.length - 1;
    nav.classList.toggle('on-wine', list[idx] === cover || list[idx].id === 'closing');
  };
  const go = d => { const list = chapters(); const t = list[Math.max(0, Math.min(list.length - 1, current + d))]; t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); };
  $('.gn-prev', nav).addEventListener('click', () => go(-1));
  $('.gn-next', nav).addEventListener('click', () => go(1));
  const mBtn = $('[data-music]');
  $('.gn-music', nav).addEventListener('click', () => mBtn?.click());
  if (mBtn) new MutationObserver(() => { const on = mBtn.getAttribute('aria-pressed') === 'true'; $('.gn-music', nav).setAttribute('aria-pressed', on); nav.classList.toggle('playing', on); }).observe(mBtn, { attributes: true, attributeFilter: ['aria-pressed'] });
  // once the song is actually playing, tuck the player card down into a small bar
  const mcard = $('[data-music-card]');
  if (mcard && mBtn) {
    let dockT;
    new MutationObserver(() => {
      clearTimeout(dockT);
      if (mBtn.getAttribute('aria-pressed') === 'true') dockT = setTimeout(() => mcard.classList.add('docked'), 1800);
      else mcard.classList.remove('docked');
    }).observe(mBtn, { attributes: true, attributeFilter: ['aria-pressed'] });
    $('.mc-head', mcard)?.addEventListener('click', e => { if (e.target.closest('[data-music-close]')) return; mcard.classList.toggle('docked'); });
  }
  let tick = false;
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; update(); }); } }, { passive: true });
  const showNav = () => { if (story && !story.hidden) { nav.hidden = false; document.body.classList.add('has-nav'); update(); } };
  if (story) new MutationObserver(showNav).observe(story, { attributes: true, attributeFilter: ['hidden'] });
  showNav();

  /* ---------- 3. page 02: the letter writes itself in ---------- */
  const letter = $('.aged-letter');
  if (letter && !reduced) {
    letter.classList.add('writing');
    const lines = $$('p', letter);
    lines.forEach((p, i) => p.style.setProperty('--li', i));
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { letter.classList.add('written'); o.disconnect(); } }, { threshold: .35 }).observe(letter);
  }

  /* ---------- 4. page 04: swipeable little frames ---------- */
  const frames = $('[data-five-frames]');
  if (frames) {
    const minis = $$('.mini-polaroid:not(.her)', frames);
    if (minis.length) {
      const row = document.createElement('div'); row.className = 'frame-row';
      minis[0].before(row); minis.forEach(m => row.append(m));
    }
  }

  /* ---------- 5. final page ---------- */
  const closing = $('#closing');
  if (closing) {
    closing.classList.add('wine');
    particles(closing, 'petals');
    const heading = $('.closing-heading', closing);
    if (heading && !reduced) {
      const words = heading.textContent.trim().split(/\s+/);
      heading.setAttribute('aria-label', heading.textContent.trim());
      heading.innerHTML = words.map((w, i) => `<span class="cw" aria-hidden="true" style="--wi:${i}">${w}</span>`).join(' ');
      new IntersectionObserver(([e], o) => { if (e.isIntersecting) { heading.classList.add('said'); o.disconnect(); } }, { threshold: .5 }).observe(heading);
    }
  }
})();
