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

  /* ---------------- THE GALLERY WALK ----------------
     Her photos hang on a gallery wall under spotlights, each with a small
     museum label. A girl walks along in front of them as you scroll, and
     stops to look at each one. */
  const R = S.ring;
  const ringSec = $('#ring');
  if (ringSec && R && (R.photos || []).length) {
    const rt = $('[data-ring-title]'); (rt.querySelector('.mark') || rt).textContent = R.title || '';
    $('[data-ring-lede]').textContent = R.lede || '';
    const capOf = {}; (S.archive || []).forEach(a => { if (a.src) capOf[a.src] = a.caption; }); Object.assign(capOf, R.notes || {});
    const track = $('[data-ring-track]'), sticky = $('.ring-sticky', ringSec), stage = $('[data-ring-stage]');
    $('[data-ring-core]')?.remove();
    sticky.classList.add('gallery-room');
    stage.className = 'gallery-wall';
    const n = R.photos.length;
    const pieces = R.photos.map((src, i) => {
      const art = document.createElement('figure');
      art.className = 'artwork';
      art.innerHTML = `<span class="spot" aria-hidden="true"></span><div class="art-img"><img alt="" decoding="async"></div>
        <figcaption class="placard"><span class="pl-no">No. ${String(i + 1).padStart(2, '0')}</span><span class="pl-title"></span><span class="pl-meta">photograph · from the five of us</span></figcaption>`;
      const img = art.querySelector('img'); img.src = src; if (i > 2) img.loading = 'lazy';
      art.querySelector('.pl-title').textContent = capOf[src] || '';
      stage.append(art);
      return art;
    });
    sticky.insertAdjacentHTML('beforeend', `
      <div class="floor" aria-hidden="true"></div>
      <div class="visitor" aria-hidden="true">
        <svg viewBox="0 0 120 300">
          <defs><linearGradient id="vis-rim" x1="0" x2="1"><stop offset="0" stop-color="#5a3a2e"/><stop offset=".1" stop-color="#140e0c"/><stop offset=".85" stop-color="#140e0c"/><stop offset="1" stop-color="#6b4636"/></linearGradient></defs>
          <g fill="url(#vis-rim)">
            <g class="leg l"><path d="M50 232 L46 292 L56 292 L60 232 Z"/></g>
            <g class="leg r"><path d="M62 232 L64 292 L74 292 L72 232 Z"/></g>
            <path class="dress" d="M40 92 C30 120 24 180 22 240 C40 248 82 248 98 240 C96 180 90 120 80 92 Z"/>
            <path class="arm l" d="M40 98 C32 130 30 160 34 186 L40 186 C40 160 42 132 46 104 Z"/>
            <path class="arm r" d="M80 98 C88 130 90 160 86 186 L80 186 C80 160 78 132 74 104 Z"/>
            <path class="hijab" d="M60 18 C44 18 36 32 36 48 C36 62 40 72 38 84 C34 96 30 108 32 122 C48 128 72 128 88 122 C90 108 86 96 82 84 C80 72 84 62 84 48 C84 32 76 18 60 18 Z"/>
          </g>
        </svg>
        <span class="visitor-shadow"></span>
      </div>`);
    const visitor = $('.visitor', sticky);

    let gap = 400, first = 0;
    const layout = () => {
      const w = sticky.clientWidth; if (!w) return false;
      const aw = pieces[0].offsetWidth;
      gap = Math.max(aw * 1.9, w * .52);               // lots of wall between pictures
      first = w / 2;
      pieces.forEach((p, i) => { p.style.left = `${first + i * gap - aw / 2}px`; });
      stage.style.width = `${first * 2 + (n - 1) * gap}px`;
      track.style.height = `${Math.max(2.5, n * .7) * 100}svh`;
      return true;
    };
    addEventListener('resize', layout);

    let x = 0, visible = false, lastX = 0, facing = 1, walk = 0;
    const paint = target => {
      const v = target - x;
      x = lerp(x, target, .085);
      stage.style.transform = `translate3d(${-x}px,0,0)`;
      const speed = Math.abs(v);
      if (Math.abs(x - lastX) > .4) facing = x > lastX ? 1 : -1;
      lastX = x;
      walk += Math.min(speed, 40) * .02;
      const moving = speed > 6;
      visitor.classList.toggle('walking', moving);
      visitor.style.setProperty('--step', moving ? Math.sin(walk) : 0);
      visitor.style.setProperty('--face', facing);
      // the picture she's standing at lights up
      const at = clamp(Math.round(x / gap), 0, n - 1);
      pieces.forEach((p, i) => p.classList.toggle('lit', i === at && !moving));
    };
    if (reduced) { new IntersectionObserver(([en]) => { if (en.isIntersecting && layout()) paint(0); }).observe(track); }
    else {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) { layout(); requestAnimationFrame(tick); } }).observe(track);
      function tick() {
        if (!visible) return;
        const r = track.getBoundingClientRect();
        const p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
        // she lingers at each picture, then walks on to the next
        const raw = p * (n - 1), k = Math.floor(raw), f = raw - k;
        const e = f < .35 ? 0 : f > .75 ? 1 : (u => u * u * (3 - 2 * u))((f - .35) / .4);
        paint(Math.min(n - 1, k + e) * gap);
        requestAnimationFrame(tick);
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
    const tiltables = () => $$('.archive-grid > .item:not(.strip), .group-shot, .mini-polaroid, .closing-photo, .aged-letter, .artwork.lit .art-img');
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
