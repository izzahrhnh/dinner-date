/* ==================================================================
   EDITABLE NOTES (page 04)
   Notes are read from the Google Sheet set in content.js (notesSheet)
   and can be edited and saved right on the page.
   Read-only link for Nurin: add ?for=nurin to the site address.
   Until notesSheet is set, the notes in content.js are shown as-is.
   ================================================================== */
(() => {
  const S = window.SCRAPBOOK || {};
  const url = (S.fiveOfUs && S.fiveOfUs.notesSheet) || '';
  const readOnly = /(^|[?&])for=nurin\b/i.test(location.search);
  const host = document.querySelector('[data-five-notes]');
  if (!host || !url) return;

  const notes = [...host.querySelectorAll('.note-paper')].map(n => ({
    n, p: n.querySelector('p'), name: (n.querySelector('.from')?.textContent || '').replace(/^—\s*/, '').trim(),
  }));
  const isPlaceholder = t => /^\[.*\]$/.test((t || '').trim());

  // ----- load the latest notes from the sheet
  const load = () => fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' })
    .then(r => r.json())
    .then(d => {
      if (!d || !d.ok) return;
      notes.forEach(o => {
        const saved = d.notes && d.notes[o.name];
        if (saved && saved.message.trim()) o.p.textContent = saved.message;
      });
      // on Nurin's link, hide notes nobody has written yet
      if (readOnly) notes.forEach(o => { o.n.hidden = isPlaceholder(o.p.textContent); });
    })
    .catch(() => {});                 // offline / blocked: keep the notes already on the page
  load();
  if (readOnly) return;

  // ----- editing
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  notes.forEach(o => {
    const edit = el('button', 'note-edit', 'Edit');
    edit.type = 'button';
    edit.setAttribute('aria-label', `Edit ${o.name}'s note`);
    o.n.append(edit);

    edit.addEventListener('click', () => {
      if (o.n.classList.contains('editing')) return;
      o.n.classList.add('editing');
      const before = o.p.textContent;
      const box = el('textarea', 'note-box');
      box.value = isPlaceholder(before) ? '' : before;
      box.placeholder = `${o.name}, write your note for ${S.recipient?.firstName || 'her'} here…`;
      box.maxLength = 3000;
      box.setAttribute('aria-label', `${o.name}'s note`);
      const bar = el('div', 'note-bar');
      const status = el('span', 'note-status'); status.setAttribute('role', 'status');
      const cancel = el('button', 'note-cancel', 'Cancel'); cancel.type = 'button';
      const save = el('button', 'note-save', 'Save'); save.type = 'button';
      bar.append(status, cancel, save);
      o.p.hidden = true; edit.hidden = true;
      o.p.after(box, bar);
      const grow = () => { box.style.height = 'auto'; box.style.height = `${box.scrollHeight + 2}px`; };
      box.addEventListener('input', grow); grow(); box.focus();

      const close = () => { box.remove(); bar.remove(); o.p.hidden = false; edit.hidden = false; o.n.classList.remove('editing'); edit.focus(); };
      cancel.addEventListener('click', close);
      box.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

      save.addEventListener('click', async () => {
        const message = box.value.trim();
        save.disabled = cancel.disabled = true; status.textContent = 'Saving…';
        let ok = false;
        try {
          const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ name: o.name, message }) });
          ok = !!(await r.json()).ok;
        } catch {
          // some browsers can't read the reply; check whether it saved anyway
          try { const d = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()); ok = d.notes?.[o.name]?.message === message; } catch {}
        }
        if (ok) {
          o.p.textContent = message || before;
          status.textContent = 'Saved';
          setTimeout(close, 700);
        } else {
          status.textContent = 'Couldn’t save. Check your connection and try again.';
          save.disabled = cancel.disabled = false;
        }
      });
    });
  });
})();
