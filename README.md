# Nurin's birthday scrapbook

A film-and-scrapbook birthday page: a photo collage cover, a note from the group, **secret letters** only Nurin can open, a film strip of memories, a reel of video messages, and a candle to blow out.

Live at `https://izzahrhnh.github.io/dinner-date/`

## Secret letters (how they stay private)

1. Send each friend this link: `https://izzahrhnh.github.io/dinner-date/write.html`
2. They write their letter (and can add one photo), then set **a question only Nurin can answer** plus the answer.
3. They tap **Seal my letter** and send you the text it gives them (one line starting with `{ from: ...`). If it's too long for chat, they tap **Save as a file** and send the file.
4. Paste that line into the `letters:` list in `memories.js`, replacing their placeholder.

The letter is locked with the answer, so nobody can read it without knowing it, not even you. Capitals, spaces and punctuation in the answer don't matter. Delete the `Sample` letter before the party (its answer is "melaka").

## Everything else

All content lives in **`memories.js`**.

- **Cover:** 4 photos plus a short handwritten note for each.
- **Group note:** `groupNote` lines, everyone can read this.
- **Film strip:** `memories`, oldest first. `date: "2026-10-24"` adds an orange camera stamp.
- **Videos:** `{ from: "Aina", src: "assets/videos/aina.mp4" },` Keep each under about 25 MB.

Photos go in `assets/photos/`, videos in `assets/videos/`. Use simple file names with no spaces.

## Upload on GitHub (no coding)

1. On github.com open the folder (e.g. `assets/photos`) → **Add file → Upload files** → **Commit changes**.
2. To edit `memories.js`: click it → pencil icon → edit → **Commit changes**.
3. The site updates by itself in 1–2 minutes.
