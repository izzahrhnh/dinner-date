/* ============================================================
   The secret letter's cipher: a Vigenère cipher.

   How it works
   - The key is a single word (letters only, e.g. "FIVE").
   - Each letter of the letter is shifted forward in the alphabet by the
     matching letter of the key (A = 0, B = 1 … Z = 25). The key repeats.
   - Spaces, numbers and punctuation are left as they are and do not use
     up a key letter, so the encoded letter keeps its shape.
   - Capital letters stay capital.
   Decoding shifts backwards with the same key, which gives back the exact
   original text. Use tools/cipher.html to encode your real letter.

   Only the encoded text and a fingerprint (SHA-256) of the key are kept in
   content.js. The real letter is never written in the site's files.
   ============================================================ */
(function (root) {
  const A = 'A'.charCodeAt(0), a = 'a'.charCodeAt(0);

  const cleanKey = key => String(key || '').toUpperCase().replace(/[^A-Z]/g, '');

  function shift(text, key, dir) {
    const k = cleanKey(key);
    if (!k) return text;
    let i = 0, out = '';
    for (const ch of String(text)) {
      const c = ch.charCodeAt(0);
      const base = c >= A && c <= A + 25 ? A : c >= a && c <= a + 25 ? a : -1;
      if (base < 0) { out += ch; continue; }
      const s = (k.charCodeAt(i % k.length) - A) * dir;
      out += String.fromCharCode(((c - base + s) % 26 + 26) % 26 + base);
      i++;
    }
    return out;
  }

  const encode = (text, key) => shift(text, key, 1);
  const decode = (text, key) => shift(text, key, -1);

  async function fingerprint(key) {
    const data = new TextEncoder().encode('nurin:' + cleanKey(key));
    const subtle = (root.crypto || globalThis.crypto).subtle;
    const hash = await subtle.digest('SHA-256', data);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const api = { encode, decode, fingerprint, cleanKey };
  root.Cipher = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
