# A roll for you — birthday site

A film-style birthday page: a contact sheet of photos, letters from friends, a swipeable roll of memories, and a reel of video messages. Letters and videos stay **sealed until 25 November, 12:00am (Malaysia time)**.

## Add what friends send you

All content lives in **`memories.js`**. You never need to touch the other files.

1. **Photos** → upload into `assets/photos/` (JPG works best; phone photos are fine).
2. **Videos** → upload into `assets/videos/` as `.mp4`. Keep each one **under about 25 MB** so it loads on phones. GitHub refuses files over 100 MB.
3. Open `memories.js` and add or replace entries. Copy an existing block, keep the quotes `" "` and the commas `,` between blocks.
   - A friend's letter: `{ from: "Aina", photo: "assets/photos/aina.jpg", message: ["Line one", "Line two"] },`
   - A letter with its own video instead of a photo: add `video: "assets/videos/aina.mp4"`
   - A video for the reel: `{ from: "Aina", src: "assets/videos/aina.mp4" },`
4. Delete every entry still marked **(sample)**, and the `sample-*.jpg` photos once you've replaced them.
5. Set `name:` at the top to her name.

**Tip:** use simple file names with no spaces (`aina-video.mp4`, not `IMG 2041 (1).MOV`).

## Upload on GitHub (no coding)

1. Open the repo on github.com → **Add file → Upload files**.
2. Drag the files in. To put them in a folder, open the folder first (e.g. `assets/photos`) and then upload there.
3. Scroll down and click **Commit changes**.
4. Wait 1–2 minutes. The site updates by itself at `https://izzahrhnh.github.io/dinner-date/`.

To edit `memories.js` on GitHub: click the file → pencil icon ✏️ → edit → **Commit changes**.

## Check it before her birthday

Add `?preview` to the end of the link to see the letters and videos early:
`https://izzahrhnh.github.io/dinner-date/?preview`

Send her the normal link (without `?preview`).
