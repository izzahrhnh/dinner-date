/* Private letters: each message is locked with an answer only Nurin knows.
   AES-GCM, key derived from the answer with PBKDF2. Nothing readable is stored in the repo. */
window.Seal = (() => {
  const PREFIX = 'NM1.';
  const ITER = 150000;
  const enc = new TextEncoder(), dec = new TextDecoder();

  // Forgiving answers: "Melaka!", " melaka " and "MELAKA" all match.
  const normalize = s => (s || '').normalize('NFKD').toLowerCase().replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

  const b64 = bytes => { let s = ''; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s); };
  const unb64 = str => Uint8Array.from(atob(str), c => c.charCodeAt(0));

  async function keyFrom(answer, salt) {
    const base = await crypto.subtle.importKey('raw', enc.encode(normalize(answer)), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }

  async function lock(payload, answer) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await keyFrom(answer, salt);
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(payload))));
    const all = new Uint8Array(salt.length + iv.length + ct.length);
    all.set(salt); all.set(iv, 16); all.set(ct, 28);
    return PREFIX + b64(all);
  }

  // Returns the payload, or null when the answer is wrong.
  async function unlock(code, answer) {
    try {
      const all = unb64(String(code).trim().replace(PREFIX, '').replace(/\s+/g, ''));
      const key = await keyFrom(answer, all.slice(0, 16));
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: all.slice(16, 28) }, key, all.slice(28));
      return JSON.parse(dec.decode(pt));
    } catch { return null; }
  }

  return { lock, unlock, normalize, PREFIX };
})();
if (typeof module !== 'undefined') module.exports = window.Seal;
