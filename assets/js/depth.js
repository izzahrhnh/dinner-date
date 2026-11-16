/* ==================================================================
   DEPTH — the 3D layer
   - cover: the prints float in 3D space and drift with the pointer;
     the birthday card tilts toward the cursor with a soft glare
   - the ring: a spinning carousel of photos turned by scroll or drag
   - page titles fold up letter by letter
   - archive / page 04 / closing pieces tilt toward the cursor
   Everything here is plain CSS 3D + JS, no libraries.
   ================================================================== */
(() => {
  const S = window.SCRAPBOOK || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let seed = 5; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

  document.documentElement.classList.add('has-depth');
  if (reduced) document.documentElement.classList.add('depth-still');

  /* ---------------- COVER: prints in 3D space ---------------- */
  const cover = $('#cover'), wall = $('[data-cover-wall]'), poster = $('.poster');
  if (wall) {
    const space = document.createElement('div');
    space.className = 'cover-space';
    const prints = $$('.print', wall);
    // a jittered grid that reaches past the screen edges; further prints sit deeper
    const cols = 6, rows = 5;
    prints.forEach((p, i) => {
      const c = i % cols, r = Math.floor(i / cols) % rows;
      const x = -38 + (c + .2 + rnd() * .6) * (176 / cols);
      const y = -34 + (r + .2 + rnd() * .6) * (168 / rows);
      const z = -980 + rnd() * 820;
      const w = 210 + rnd() * 120;
      p.style.cssText += `;--x:${x}%;--y:${y}%;--z:${z}px;--w:${w}px;--ar:${rnd() < .5 ? .78 : 1.28};--r:${(rnd() * 22 - 11).toFixed(1)}deg`;
      space.append(p);
    });
    wall.append(space); wall.classList.add('is-3d');

    let tx = 0, ty = 0, cx = 0, cy = 0, gx = 50, gy = 30, cgx = 50, cgy = 30, t0 = performance.now(), running = true;
    addEventListener('pointermove', e => {
      tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5;
      if (poster) { const r = poster.getBoundingClientRect(); gx = ((e.clientX - r.left) / r.width) * 100; gy = ((e.clientY - r.top) / r.height) * 100; }
    }, { passive: true });
    new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running) requestAnimationFrame(frame); }, { threshold: 0 }).observe(cover);
    function frame(now) {
      if (!running) return;
      const t = (now - t0) / 1000;
      // without a mouse (phones) the scene drifts gently on its own
      const ix = finePointer ? tx : Math.sin(t * .35) * .35, iy = finePointer ? ty : Math.cos(t * .28) * .25;
      cx = lerp(cx, ix, .06); cy = lerp(cy, iy, .06); cgx = lerp(cgx, gx, .12); cgy = lerp(cgy, gy, .12);
      const sy = Math.min(scrollY, innerHeight);
      space.style.transform = `translateZ(${sy * .9}px) rotateX(${(-cy * 9).toFixed(2)}deg) rotateY(${(cx * 13).toFixed(2)}deg)`;
      space.style.opacity = (1 - sy / innerHeight * .9).toFixed(3);
      if (poster && cover.classList.contains('ready')) {
        poster.style.setProperty('--tilt-x', `${(-cy * (finePointer ? 9 : 5)).toFixed(2)}deg`);
        poster.style.setProperty('--tilt-y', `${(cx * (finePointer ? 11 : 6)).toFixed(2)}deg`);
        poster.style.setProperty('--gx', `${cgx.toFixed(1)}%`); poster.style.setProperty('--gy', `${cgy.toFixed(1)}%`);
      }
      if (!reduced) requestAnimationFrame(frame);
    }
    if (!reduced) requestAnimationFrame(frame); else frame(t0);
    if (poster) poster.insertAdjacentHTML('beforeend', '<span class="glare" aria-hidden="true"></span>');
  }

  /* ---------------- THE WHEEL ----------------
     A big, slow wheel of photos turning around a point far below the screen.
     Only a few are in view at once; the one at the top is in focus, with its
     caption written underneath. Scroll (or drag) to turn it. */
  const R = S.ring;
  const ringSec = $('#ring');
  if (ringSec && R && (R.photos || []).length) {
    const rt = $('[data-ring-title]'); (rt.querySelector('.mark') || rt).textContent = R.title || '';
    $('[data-ring-lede]').textContent = R.lede || '';
    const capOf = {}; (S.archive || []).forEach(a => { if (a.src) capOf[a.src] = a.caption; }); Object.assign(capOf, R.notes || {});
    const stage = $('[data-ring-stage]'), track = $('[data-ring-track]'), sticky = $('.ring-sticky', ringSec);
    const core = $('[data-ring-core]'); core.remove();
    sticky.insertAdjacentHTML('beforeend', `<div class="wheel-caption" aria-live="polite"><p class="wc-text"></p><p class="wc-count"></p></div>
      <div class="wheel-dial" aria-hidden="true"><span class="wd-needle"></span><span class="wd-words">${(R.core || []).join(' ')}</span></div>`);
    const capEl = $('.wc-text', sticky), countEl = $('.wc-count', sticky), needle = $('.wd-needle', sticky);
    const n = R.photos.length;
    const cards = R.photos.map((src, i) => {
      const card = document.createElement('figure');
      card.className = 'wheel-card';
      card.innerHTML = '<img alt="" decoding="async">';
      const img = card.querySelector('img'); img.src = src; if (i > 3) img.loading = 'lazy';
      stage.append(card);
      return card;
    });
    let radius = 600, step = .3;
    const layout = () => {
      const cw = cards[0].offsetWidth, ch = cards[0].offsetHeight;
      const vh = sticky.clientHeight;
      if (!cw || !vh) return false;                    // still hidden (book not opened yet)
      radius = Math.max(vh * 1.05, innerWidth * .62);
      step = (cw * 1.7) / radius;                      // generous gaps between photos
      const top = Math.max(vh * .14, 88);
      stage.style.top = `${top + ch / 2 + radius}px`;
      cards.forEach((c, i) => { c.style.transform = `rotate(${i * step}rad) translateY(${-radius}px)`; });
      track.style.height = `${Math.max(2, n * .55) * 100}svh`;
      return true;
    };
    addEventListener('resize', layout);
    (document.readyState === 'complete' ? Promise.resolve() : new Promise(r => addEventListener('load', r, { once: true }))).then(layout);
    layout();

    let drag = 0, dragV = 0, angle = 0, dragging = false, lastX = 0, visible = false, active = -1;
    sticky.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button) return; dragging = true; lastX = e.clientX; dragV = 0; sticky.classList.add('grabbing'); });
    addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; drag -= dx / radius; dragV = -dx / radius; }, { passive: true });
    const end = () => { if (!dragging) return; dragging = false; sticky.classList.remove('grabbing'); };
    addEventListener('pointerup', end); addEventListener('pointercancel', end);

    const show = i => {
      if (i === active) return; active = i;
      capEl.classList.remove('on');
      setTimeout(() => { capEl.textContent = capOf[R.photos[i]] || ''; countEl.textContent = `${String(i + 1).padStart(2, '0')}  /  ${String(n).padStart(2, '0')}`; capEl.classList.add('on'); }, 180);
    };
    const paint = () => {
      stage.style.transform = `rotate(${-angle}rad)`;
      cards.forEach((c, i) => {
        const d = Math.abs(i * step - angle) / step;      // how many places from the top
        const near = Math.max(0, 1 - d);
        c.style.setProperty('--s', (.84 + .16 * near).toFixed(3));
        c.style.opacity = Math.max(0, 1 - Math.max(0, d - .6) * .32).toFixed(3);
        c.style.setProperty('--dim', (.55 + .45 * near).toFixed(3));
        c.classList.toggle('focus', d < .5);
      });
      const i = clamp(Math.round(angle / step), 0, n - 1); show(i);
      needle.style.transform = `rotate(${-50 + (angle / ((n - 1) * step)) * 100}deg)`;
    };
    if (reduced) { new IntersectionObserver(([en]) => { if (en.isIntersecting && layout()) paint(); }).observe(track); }
    else {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) { layout(); requestAnimationFrame(spin); } }).observe(track);
      function spin() {
        if (!visible) return;
        const r = track.getBoundingClientRect();
        const p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
        if (!dragging) { drag += dragV; dragV *= .92; }
        const max = (n - 1) * step;
        drag = clamp(drag, -p * max - step * .4, (1 - p) * max + step * .4);
        // each photo rests at the top for a while before the wheel turns to the next
        const raw = p * (n - 1), k = Math.floor(raw), f = raw - k;
        const e = f < .3 ? 0 : f > .7 ? 1 : (u => u * u * (3 - 2 * u))((f - .3) / .4);
        const target = Math.min(n - 1, k + e) * step + drag;
        angle = lerp(angle, target, .08);
        paint();
        requestAnimationFrame(spin);
      }
    }
  }

  /* ---------------- page titles fold up letter by letter ---------------- */
  if (!reduced) {
    $$('.page-title').forEach(title => {
      const host = title.querySelector('.mark') || title;
      const text = host.textContent;
      if (!text.trim()) return;
      host.setAttribute('aria-label', text);
      host.textContent = '';
      let k = 0;
      text.split(/(\s+)/).forEach(part => {
        if (/^\s+$/.test(part)) { host.append(part); return; }
        const word = document.createElement('span'); word.className = 'fw'; word.setAttribute('aria-hidden', 'true');
        [...part].forEach(ch => { const s = document.createElement('span'); s.className = 'fl'; s.textContent = ch; s.style.setProperty('--k', k++); word.append(s); });
        host.append(word);
      });
      title.classList.add('fold');
    });
    const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('unfold'); tio.unobserve(e.target); } }), { threshold: .4 });
    $$('.page-title.fold').forEach(t => tio.observe(t));
  }

  /* ---------------- tilt toward the cursor ---------------- */
  if (finePointer && !reduced) {
    const tiltables = () => $$('.archive-grid > .item:not(.strip), .group-shot, .mini-polaroid, .closing-photo, .aged-letter, .wheel-card.focus');
    const bind = el => {
      if (el.dataset.tilt) return; el.dataset.tilt = '1';
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.setProperty('--ty', `${(x * 14).toFixed(2)}deg`); el.style.setProperty('--tx', `${(-y * 12).toFixed(2)}deg`);
        el.style.setProperty('--sx', `${((x + .5) * 100).toFixed(1)}%`); el.style.setProperty('--sy', `${((y + .5) * 100).toFixed(1)}%`);
        el.classList.add('tilting');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg'); el.classList.remove('tilting'); });
    };
    const scan = () => tiltables().forEach(bind);
    scan();
    // the story is built when she opens the book, so look again then
    $('[data-open]')?.addEventListener('click', () => setTimeout(scan, 300));
    setTimeout(scan, 1500);
  }

  /* ---------------- scroll-linked depth for the intro letter & closing photo ---------------- */
  if (!reduced) {
    const linked = $$('.aged-letter, .closing-photo');
    let tick = false;
    const update = () => {
      tick = false;
      const vh = innerHeight;
      linked.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = clamp((vh - r.top) / (vh * .8), 0, 1);      // 0 entering → 1 settled
        el.style.setProperty('--enter', (1 - p).toFixed(3));
      });
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
})();
