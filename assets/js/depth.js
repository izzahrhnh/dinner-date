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

  /* ---------------- THE LITTLE WORLD: a globe of photos ----------------
     Photos tile a sphere in latitude bands. It turns slowly on its own;
     drag (mouse or finger) to spin it, with a little momentum. The photo
     facing her shows its caption underneath; tap one to see it closer. */
  const R = S.ring || {};
  const orbHost = $('[data-orb]');
  if (orbHost) {
    const rt = $('[data-ring-title]'); if (rt) (rt.querySelector('.mark') || rt).textContent = R.title || '';
    const rl = $('[data-ring-lede]'); if (rl) rl.textContent = R.lede || '';
    const capOf = {}; (S.archive || []).forEach(a => { if (a.src) capOf[a.src] = a.caption; }); Object.assign(capOf, R.notes || {});
    const pool = [...new Set([...(R.photos || []), ...(S.archive || []).filter(a => a.type === 'photo').map(a => a.src)])];
    const ball = $('[data-orb-ball]', orbHost), capEl = $('.oc-text', orbHost), zoom = $('[data-orb-zoom]', orbHost);
    const LATS = [-60, -40, -20, 0, 20, 40, 60], BASE = 12;
    const tiles = [];
    let k = 0;
    LATS.forEach(lat => {
      const n = Math.max(5, Math.round(BASE * Math.cos(lat * Math.PI / 180)));
      for (let i = 0; i < n; i++) {
        const lon = (360 / n) * i + (lat / 20) * 9;      // stagger rows like bricks
        const src = pool[k++ % pool.length];
        const t = document.createElement('button'); t.type = 'button'; t.className = 'orb-tile';
        t.setAttribute('aria-label', capOf[src] || 'photo');
        t.innerHTML = '<img alt="" loading="lazy" decoding="async">'; t.querySelector('img').src = src;
        ball.append(t); tiles.push({ t, lat, lon, n, src });
      }
    });
    let radius = 260;
    const layout = () => {
      const w = orbHost.clientWidth; if (!w) return;
      radius = Math.min(w * (w < 600 ? .44 : .4), innerHeight * .34, 330);
      const rowArc = radius * (20 * Math.PI / 180);
      tiles.forEach(o => {
        const tw = (2 * Math.PI * radius * Math.cos(o.lat * Math.PI / 180)) / o.n * .9, th = rowArc * .88;
        Object.assign(o.t.style, { width: `${tw}px`, height: `${th}px`, marginLeft: `${-tw / 2}px`, marginTop: `${-th / 2}px`,
          transform: `rotateY(${o.lon}deg) rotateX(${-o.lat}deg) translateZ(${radius}px)` });
      });
      orbHost.style.setProperty('--r', `${radius}px`);
    };
    layout(); addEventListener('resize', layout);

    let rx = -12, ry = 0, vx = 0, vy = reduced ? 0 : .12, dragging = false, moved = 0, lx = 0, ly = 0, visible = false, front = null;
    const scene = $('.orb-scene', orbHost);
    scene.addEventListener('pointerdown', e => { dragging = true; moved = 0; lx = e.clientX; ly = e.clientY; vx = vy = 0; scene.setPointerCapture(e.pointerId); scene.classList.add('grabbing'); });
    scene.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
      vy = dx * .3; vx = -dy * .3; ry += vy; rx = clamp(rx + vx, -32, 32); paint();
    });
    const up = e => {
      // pointer capture sends the click to the globe, so find the tapped photo ourselves
      if (dragging && moved < 8 && e.type === 'pointerup') {
        const hit = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.classList?.contains('orb-tile'));
        const o = hit && tiles.find(x => x.t === hit); if (o) openZoom(o);
      }
      dragging = false; scene.classList.remove('grabbing'); if (!reduced && Math.abs(vy) < .12) vy = .12 * Math.sign(vy || 1); };
    scene.addEventListener('pointerup', up); scene.addEventListener('pointercancel', up);
    // vertical swipes on phones still scroll the page; horizontal ones spin the globe
    scene.style.touchAction = 'pan-y';

    function paint() {
      ball.style.transform = `translateZ(${-radius}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      // which photo faces her most
      let best = null, bestD = -2;
      tiles.forEach(o => {
        const a = (o.lon + ry) * Math.PI / 180, b = (-o.lat + rx) * Math.PI / 180;
        const facing = Math.cos(a) * Math.cos(b);
        o.t.style.opacity = (.35 + .65 * Math.max(0, facing)).toFixed(3);
        if (facing > bestD) { bestD = facing; best = o; }
      });
      if (best !== front) {
        front?.t.classList.remove('front'); front = best; best.t.classList.add('front');
        capEl.classList.remove('on');
        clearTimeout(paint.t); paint.t = setTimeout(() => { capEl.textContent = capOf[best.src] || ''; capEl.classList.add('on'); }, 160);
      }
    }
    function spin() {
      if (!visible) return;
      if (!dragging) { ry += vy; rx = clamp(rx + vx, -32, 32); vx *= .92; if (Math.abs(vy) > .12) vy *= .95; }
      paint(); requestAnimationFrame(spin);
    }
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) { layout(); requestAnimationFrame(spin); } }).observe(orbHost);
    paint();

    // tap a photo to see it closer
    function openZoom(o) {
      const img = $('img', zoom); img.src = o.src; img.alt = capOf[o.src] || '';
      $('figcaption', zoom).textContent = capOf[o.src] || '';
      zoom.hidden = false; requestAnimationFrame(() => zoom.classList.add('open')); $('.oz-close', zoom).focus({ preventScroll: true });
    }
    // keyboard: Enter/Space on a focused photo
    tiles.forEach(o => o.t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openZoom(o); } }));
    const closeZoom = () => { zoom.classList.remove('open'); setTimeout(() => { zoom.hidden = true; }, 300); };
    zoom.addEventListener('click', e => { if (e.target === zoom || e.target.closest('.oz-close')) closeZoom(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !zoom.hidden) closeZoom(); });
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
