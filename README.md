# A little world for Nurin

A digital scrapbook from the four of us. Live at `https://izzahrhnh.github.io/dinner-date/`.

## What's on it

| Page | What it is |
|---|---|
| 01 Cover | Photo collage, name, stamp, "Open your little world" |
| 02 Before you begin | A short letter from the four of us |
| 03 Memory archive | Photos, polaroids, film strips and videos (tap to open) |
| 04 Five of us | Group photo, five polaroids, four notes |
| 05 Little things about you | Cards of habits, favourites, inside jokes |
| 06 Our little chapters | Timeline with photos and optional video |
| 07 Four letters, one little surprise | The encoded secret letter |
| 08 And finally | Closing photo, four closing lines, signature |

## How to personalise it

**Everything is in `content.js`.** Every field you need to fill is marked ✏️ or written in `[square brackets]`. Set `showPlaceholderTags: false` when you're done so the little "sample" tags disappear.

- **Photos:** upload to `assets/photos/`, then use the path in content.js, e.g. `"assets/photos/melaka-1.jpg"`. JPG, PNG, WebP and AVIF all work. Phone photos are fine, but 2000px wide or less loads fastest.
- **Videos:** upload `.mp4` to `assets/videos/`, plus a still image for the thumbnail (`poster`). Keep each video under ~25 MB so it plays smoothly on phones (GitHub refuses files over 100 MB).
- **Music:** put your song in `assets/audio/` and change `music.src`. It never plays until Nurin taps the music button.
- **Archive layout:** each item has a `size` (`feature`, `wide`, `tall`, `polaroid`, `small`), or use `type: "strip"` for a film strip and `type: "note"` for a handwritten note. Mix sizes; the page packs them like a scrapbook.

## The secret letter

**How it's hidden:** a Vigenère cipher. Every letter is shifted forward in the alphabet by the letters of a key word (A=0, B=1 … Z=25), repeating the key. Spaces and punctuation stay the same. Decoding shifts back with the same key and gives the exact original.

**To use your real letter:**
1. Open `https://izzahrhnh.github.io/dinner-date/tools/cipher.html` (not linked from the site).
2. Write the letter, choose the key word, press **Encode**.
3. Paste the two results into `content.js` → `secretLetter.cipherText` and `secretLetter.keyFingerprint`.
4. Rewrite `riddle`, `methodClue` and `hints` so they lead to your key.

The placeholder key is **FIVE**.

**What Nurin sees:** the encoded letter, a riddle, how it was hidden, a box for the key, and up to three hints. Wrong answers just say try again; what she typed and the hints she opened are remembered on her phone. The right key plays the unlocking animation and shows the letter. On her phone it stays unlocked afterwards.

**Limits (it's a surprise, not a safe):** the site has no server, so everything runs in her browser. The real letter is never stored in the files, only its encoded version and a fingerprint of the key, so nobody can read it by viewing the page source. But a Vigenère cipher can be cracked by someone determined with a codebreaking website, especially with a short key. A longer key word makes that much harder. Don't put anything in it that would be a problem if someone did decode it.

## Updating on GitHub (no coding)

1. On github.com, open the folder → **Add file → Upload files** → **Commit changes**.
2. To edit `content.js`: click it → pencil icon → edit → **Commit changes**.
3. The site updates by itself in 1–2 minutes.

## Why plain HTML instead of Next.js

This is a static site (HTML, CSS and JavaScript, no build step), so you can edit and upload files straight on GitHub and it works on GitHub Pages as is. The parts are still organised as reusable pieces: `content.js` (content), `assets/css/style.css` (design system), `assets/js/main.js` (sections and interactions), `assets/js/cipher.js` (the cipher).
