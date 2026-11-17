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

  /* ---------------- THE LITTLE WORLD: the memory archive as a globe ----------------
     Every photo, video, film-strip frame and note from the archive is placed
     on a sphere, each at its own shape and size, in uneven rows. It turns
     slowly; drag to spin. Tapping a photo or video opens the usual viewer. */
  const orbHost = $('[data-orb]'), source = $('[data-archive]');
  if (orbHost && source) {
    const SHAPES = window.PHOTO_SHAPES || {};
    const ball = $('[data-orb-ball]', orbHost), capEl = $('.oc-text', orbHost);
    // collect the memories from the (hidden) archive, in order
    const mems = [];
    [...source.children].forEach(item => {
      if (item.classList.contains('note')) { mems.push({ note: item.querySelector('.note-card')?.textContent || '', shape: .8 }); return; }
      if (item.classList.contains('strip')) {
        const cap = item.querySelector('.cap')?.textContent || '';
        $$('.s-frame', item).forEach(btn => { const src = btn.querySelector('img')?.getAttribute('src'); mems.push({ src, btn, cap, shape: SHAPES[src] || 1.33 }); });
        return;
      }
      const btn = item.querySelector('.item-btn'), src = item.querySelector('img')?.getAttribute('src');
      mems.push({ src, btn, cap: item.querySelector('.cap')?.textContent || '', video: !!item.querySelector('.vid'), shape: SHAPES[src] || 1 });
    });
    let seed = 3; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const tiles = mems.map(m => {
      const t = document.createElement('button'); t.type = 'button';
      t.className = `orb-tile${m.note ? ' is-note' : ''}${m.video ? ' is-video' : ''}`;
      if (m.note) { t.textContent = m.note; t.setAttribute('aria-label', m.note); t.tabIndex = -1; }
      else { t.innerHTML = '<img alt="" loading="lazy" decoding="async">'; t.querySelector('img').src = m.src; t.setAttribute('aria-label', `${m.video ? 'Play video' : 'Open photo'}${m.cap ? `: ${m.cap}` : ''}`); }
      ball.append(t);
      // each memory keeps its own proportions; sizes vary a little for a hand-placed feel
      return { m, t, size: .74 + rnd() * .34, nudge: (rnd() - .5) * .3 };
    });

    let radius = 260;
    const BANDS = [-58, -30, 0, 30, 58];
    const layout = () => {
      const w = orbHost.clientWidth; if (!w) return;
      radius = Math.min(w * (w < 600 ? .44 : .36), innerHeight * (w < 600 ? .34 : .4), 420);
      const bandH = radius * (28 * Math.PI / 180);      // height of one row on the surface
      // share the memories between rows by how much room each row has
      const room = BANDS.map(l => Math.cos(l * Math.PI / 180)), total = room.reduce((a, b) => a + b, 0);
      let k = 0;
      BANDS.forEach((lat, r) => {
        const count = r === BANDS.length - 1 ? tiles.length - k : Math.round(tiles.length * room[r] / total);
        const row = tiles.slice(k, k + count); k += count;
        const circ = 2 * Math.PI * radius * Math.cos(lat * Math.PI / 180);
        const sizes = row.map(o => { const h = bandH * .86 * o.size; return { h, w: h / o.m.shape }; });
        const used = sizes.reduce((a, s) => a + s.w, 0);
        const fit = Math.min(1.25, (circ * .9) / used);  // shrink or grow the row to wrap the globe
        let lon = (r * 37) % 360;
        const gap = (circ - used * fit) / Math.max(1, row.length);
        row.forEach((o, i) => {
          const tw = sizes[i].w * fit, th = sizes[i].h * fit;
          const span = (tw / circ) * 360;
          const c = lon + span / 2, la = lat + o.nudge * 10;
          Object.assign(o.t.style, { width: `${tw}px`, height: `${th}px`, marginLeft: `${-tw / 2}px`, marginTop: `${-th / 2}px`,
            transform: `rotateY(${c}deg) rotateX(${-la}deg) translateZ(${radius}px)`, fontSize: `${Math.max(9, th * .11)}px` });
          o.lon = c; o.lat = la;
          lon += span + (gap / circ) * 360;
        });
      });
      orbHost.style.setProperty('--r', `${radius}px`);
    };
    layout(); addEventListener('resize', layout);

    let rx = -10, ry = 0, vx = 0, vy = reduced ? 0 : .12, dragging = false, moved = 0, lx = 0, ly = 0, visible = false, front = null;
    // zoom: pinch with two fingers, pinch on a laptop trackpad (ctrl + wheel), or the + / − buttons
    let zoom = 1, zoomTarget = 1;
    const ZMIN = .6, ZMAX = 2.4;
    const setZoom = z => { zoomTarget = clamp(z, ZMIN, ZMAX); if (!visible || reduced) { zoom = zoomTarget; paint(); } };
    const scene = $('.orb-scene', orbHost);
    scene.style.touchAction = 'pan-y';                 // up/down still scrolls the page on phones
    const pts = new Map(); let pinch0 = 0, zoom0 = 1;
    const dist = () => { const [a, b] = [...pts.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
    scene.addEventListener('pointerdown', e => {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try { scene.setPointerCapture(e.pointerId); } catch {}
      if (pts.size === 2) { pinch0 = dist(); zoom0 = zoomTarget; dragging = false; moved = 99; return; }
      dragging = true; moved = 0; lx = e.clientX; ly = e.clientY; vx = vy = 0; scene.classList.add('grabbing');
    });
    scene.addEventListener('pointermove', e => {
      if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2 && pinch0) { setZoom(zoom0 * dist() / pinch0); return; }
      if (!dragging) return;
      const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
      vy = dx * .3 / zoom; vx = -dy * .3 / zoom; ry += vy; rx = clamp(rx + vx, -32, 32); paint();
    });
    const up = e => {
      pts.delete(e.pointerId); if (pts.size < 2) pinch0 = 0;
      // pointer capture sends the click to the globe, so find the tapped memory ourselves
      if (dragging && moved < 8 && e.type === 'pointerup') {
        const hit = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.classList?.contains('orb-tile'));
        const o = hit && tiles.find(x => x.t === hit); if (o && o.m.btn) o.m.btn.click();
      }
      dragging = false; scene.classList.remove('grabbing');
      if (!reduced && Math.abs(vy) < .12) vy = .12 * Math.sign(vy || 1);
    };
    scene.addEventListener('pointerup', up); scene.addEventListener('pointercancel', up);
    // trackpad pinch arrives as ctrl + wheel; a plain wheel still scrolls the page
    scene.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); setZoom(zoomTarget * Math.exp(-e.deltaY * .01)); }, { passive: false });
    // Safari's own pinch events on Mac trackpads
    let gz = 1;
    scene.addEventListener('gesturestart', e => { e.preventDefault(); gz = zoomTarget; });
    scene.addEventListener('gesturechange', e => { e.preventDefault(); setZoom(gz * e.scale); });
    orbHost.insertAdjacentHTML('beforeend', '<div class="orb-zoom-ctl" role="group" aria-label="Zoom the globe"><button type="button" data-z="-1" aria-label="Zoom out">−</button><button type="button" data-z="0" aria-label="Reset size"><span></span></button><button type="button" data-z="1" aria-label="Zoom in">+</button></div>');
    const zLabel = $('.orb-zoom-ctl span', orbHost);
    $$('.orb-zoom-ctl button', orbHost).forEach(b => b.addEventListener('click', () => { const s = +b.dataset.z; setZoom(s === 0 ? 1 : zoomTarget * (s > 0 ? 1.25 : .8)); }));
    tiles.forEach(o => o.t.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && o.m.btn) { e.preventDefault(); o.m.btn.click(); } }));

    function paint() {
      zoom += (zoomTarget - zoom) * (reduced ? 1 : .18);
      if (zLabel) zLabel.textContent = `${Math.round(zoomTarget * 100)}%`;
      ball.style.transform = `scale3d(${zoom.toFixed(3)}, ${zoom.toFixed(3)}, ${zoom.toFixed(3)}) translateZ(${-radius}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      let best = null, bestD = -2;
      tiles.forEach(o => {
        const facing = Math.cos((o.lon + ry) * Math.PI / 180) * Math.cos((-o.lat + rx) * Math.PI / 180);
        o.t.style.opacity = (.35 + .65 * Math.max(0, facing)).toFixed(3);
        if (facing > bestD) { bestD = facing; best = o; }
      });
      if (best && best !== front) {
        front?.t.classList.remove('front'); front = best; best.t.classList.add('front');
        capEl.classList.remove('on');
        clearTimeout(paint.t); paint.t = setTimeout(() => { capEl.textContent = best.m.note ? '' : (best.m.cap || ''); capEl.classList.add('on'); }, 160);
      }
    }
    function spin() {
      if (!visible) return;
      if (!dragging) { ry += vy; rx = clamp(rx + vx, -32, 32); vx *= .92; if (Math.abs(vy) > .12) vy *= .95; }
      paint(); requestAnimationFrame(spin);
    }
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) { layout(); requestAnimationFrame(spin); } }).observe(orbHost);
    paint();
  }

  /* ---------------- globe / grid switch ---------------- */
  const toggle = $('.view-toggle'), gridEl = $('[data-archive]'), orbEl = $('[data-orb]');
  if (toggle && gridEl && orbEl) {
    const KEY = 'nurin-archive-view';
    const setView = (v, remember) => {
      const grid = v === 'grid';
      orbEl.hidden = grid;
      gridEl.classList.toggle('globe-source', !grid);
      $$('[data-view]', toggle).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
      $('#archive')?.classList.toggle('is-grid', grid);
      if (grid) requestAnimationFrame(() => { window.repackArchive?.(); dispatchEvent(new Event('resize')); });
      if (remember) { try { localStorage.setItem(KEY, v); } catch {} }
    };
    let saved = null; try { saved = localStorage.getItem(KEY); } catch {}
    setView(saved === 'grid' ? 'grid' : 'globe', false);
    $$('[data-view]', toggle).forEach(b => b.addEventListener('click', () => setView(b.dataset.view, true)));
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
