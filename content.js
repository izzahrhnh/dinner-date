/* ==================================================================
   A LITTLE WORLD FOR NURIN — CONTENT FILE
   ------------------------------------------------------------------
   This is the only file you need to edit. Everything on the website
   (names, photos, videos, captions, messages, the secret letter and
   the music) comes from here.

   ✏️  = needs your input.
   - Put photos in assets/photos/ and videos in assets/videos/.
   - Keep the quotes "" and the commas between items.
   - Anything in [square brackets] is placeholder text to replace.
   - Photos named sample-*.jpg are placeholders to swap for your own.
   ================================================================== */

window.SCRAPBOOK = {

  /* Shows a small "sample" tag on placeholder photos so you can see what
     still needs replacing. Set to false before you send it to Nurin. */
  showPlaceholderTags: true,

  recipient: {
    firstName: "Nurin",
    lastName: "Mastura",
  },

  /* ✏️ The four of you. These names appear on page 04, page 06 and page 07. */
  contributors: [
    { name: "[Contributor 01]", photo: "assets/photos/sample-coffee.jpg" },
    { name: "[Contributor 02]", photo: "assets/photos/sample-trees.jpg" },
    { name: "[Contributor 03]", photo: "assets/photos/sample-rose.jpg" },
    { name: "[Contributor 04]", photo: "assets/photos/sample-candles.jpg" },
  ],

  /* ----------------------------------------------------------------
     PAGE 01 — THE COVER
     ---------------------------------------------------------------- */
  cover: {
    label: "A little something for you",
    line: "A little world, made just for you.",
    subtitle: "A collection of little things, beautiful memories and moments we never want to forget.",
    // ✏️ 3 photos for the opening collage. The first one is the biggest.
    photos: [
      "assets/photos/photobooth-train-2.jpg",
      "assets/photos/camera-flash.jpg",
      "assets/photos/hand-signs.jpg",
    ],
    note: "for you, from us",      // ✏️ small handwritten note
    stampDate: "25 NOV 2026",                  // date on the postage stamp
    button: "Open your little world",
  },

  /* ----------------------------------------------------------------
     PAGE 02 — BEFORE YOU BEGIN
     ---------------------------------------------------------------- */
  intro: {
    // ✏️ Refine the wording so it sounds like you.
    paragraphs: [
      "Four people, countless memories, and one person who makes this little collection worth making.",
      "We realised photographs alone weren't enough to hold all the little things we wanted to remember.",
      "So we made you something.",
    ],
    signature: "with love, from us",
  },

  /* ----------------------------------------------------------------
     PAGE 03 — THE MEMORY ARCHIVE
     Add as many as you like. They're laid out like a scrapbook spread.
     type:  "photo" | "video" | "strip" (3–5 photos on a film strip) | "note"
     size:  "feature" (big) | "wide" | "tall" | "polaroid" | "small"
     caption: short, lowercase works best. Appears on hover/tap.
     date, place: optional little labels.
     For videos: src = the .mp4, poster = a still image for the thumbnail.
     ---------------------------------------------------------------- */
  archive: [
    { type: "photo", size: "feature", src: "assets/photos/board-game-room.jpg", caption: "[caption]" },
    { type: "photo", size: "polaroid", src: "assets/photos/beach-camera.jpg", caption: "[caption]" },
    { type: "note", text: "[a little note]" },
    { type: "photo", size: "tall", src: "assets/photos/shop-photostrip.jpg", caption: "[caption]" },
    { type: "photo", size: "wide", src: "assets/photos/restaurant-two.jpg", caption: "[caption]" },
    { type: "strip", photos: [
        "assets/photos/photobooth-train-1.jpg",
        "assets/photos/photobooth-train-2.jpg",
        "assets/photos/photobooth-train-3.jpg",
      ], caption: "[caption for the photobooth]" },
    { type: "photo", size: "polaroid", src: "assets/photos/car-nap.jpg", caption: "[caption]" },
    { type: "video", size: "wide", src: "assets/videos/sample-clip-1.mp4", poster: "assets/videos/sample-clip-1.jpg", caption: "[video caption]" },
    { type: "photo", size: "tall", src: "assets/photos/cards-table.jpg", caption: "[caption]" },
    { type: "photo", size: "wide", src: "assets/photos/eating-together.jpg", caption: "[caption]" },
    { type: "note", text: "[an inside joke, if you like]" },
    { type: "video", size: "polaroid", src: "assets/videos/sample-clip-3.mp4", poster: "assets/videos/sample-clip-3.jpg", caption: "[video caption]" },
    { type: "photo", size: "tall", src: "assets/photos/shakshuka-stare.jpg", caption: "[caption]" },
    { type: "video", size: "small", src: "assets/videos/sample-clip-2.mp4", poster: "assets/videos/sample-clip-2.jpg", caption: "[video caption]" },
  ],

  /* ----------------------------------------------------------------
     PAGE 04 — FIVE OF US, IN LITTLE FRAMES
     ---------------------------------------------------------------- */
  fiveOfUs: {
    groupPhoto: "assets/photos/red-curtain-five.jpg",   // a photo of all five of you
    recipientPhoto: "assets/photos/sample-station.jpg",     // ✏️ a photo of Nurin
    // ✏️ One short message from each of you, in the same order as contributors above.
    messages: [
      "[Contributor 01 — a few sentences to Nurin, in your own words.]",
      "[Contributor 02 — a few sentences to Nurin, in your own words.]",
      "[Contributor 03 — a few sentences to Nurin, in your own words.]",
      "[Contributor 04 — a few sentences to Nurin, in your own words.]",
    ],
    // ✏️ Little friendship details: inside jokes, nicknames, group-chat lore.
    details: [
      "[an inside joke]",
      "[the group chat name]",
      "[a nickname only we use]",
    ],
  },

  /* ----------------------------------------------------------------
     PAGE 05 — LITTLE THINGS ABOUT YOU
     ✏️ Replace every [bracket] with something real and specific.
     photo is optional.
     ---------------------------------------------------------------- */
  littleThings: [
    { title: "Things we love about you", items: ["[something specific]", "[something specific]", "[something specific]"], photo: "assets/photos/volunteer-certificate.jpg" },
    { title: "Your little habits", items: ["[a habit]", "[a habit]"] },
    { title: "Things that remind us of you", items: ["[a song]", "[a place]", "[a smell, a snack, a colour]"], photo: "assets/photos/phone-cafe-night.jpg" },
    { title: "Your favourite things", items: ["[favourite]", "[favourite]", "[favourite]"] },
    { title: "Things only the five of us understand", items: ["[inside joke]", "[inside joke]"] },
    { title: "Little moments that make us laugh", items: ["[moment]", "[moment]"], photo: "assets/photos/deadpan-two.jpg" },
  ],

  /* ----------------------------------------------------------------
     PAGE 06 — FOUR LETTERS, ONE LITTLE SURPRISE (the secret letter)
     The letter below is ENCODED. To use your real letter:
       1. Open tools/cipher.html on the site.
       2. Write the letter, choose a key word, and press Encode.
       3. Paste the two results into cipherText and keyFingerprint below.
       4. Update the riddle and hints so they lead to your key word.
     The placeholder key is FIVE.
     ---------------------------------------------------------------- */
  secretLetter: {
    intro: "Something is hidden inside. It's written in a code only you can break.",
    riddle: "[Placeholder riddle] Four of us made this, and one of us it's for. Count us all, then write the number as a word.",
    methodClue: "Every letter has been moved forward through the alphabet by the letters of a secret word, one after another, again and again. Find the word.",
    hints: [
      "The answer to the riddle is the key. It's a single word.",
      "It's a Vigenère cipher: shift each letter back by the matching letter of the key (A = 0, B = 1, C = 2…).",
      "[Placeholder hint] The key has four letters and starts with F.",
    ],
    cipherText: "Imvv Scmms,\n\n[Bcmx qn e utvgjpjpimm pjboiw. Bci kwpv tn pw bqgp bzdxj bci wmvp tvz xtozxmmm esl zrhwyi nb rmyp olj kdtmmm xtwg fjnjvj ez wjvy ctc olna kelm.]\n\nRlfbzzjz ri jvy yu emmyqik mmmi, nb rmqt wi nv jyw wrr bwmhx, nmsr igp kwpv tn pw.\n\n[Hwixwqwyywm 01], [Gtvovnjpxtz 02], [Xssbmmgcosw 03] & [Kjryzdfzbjv 04]",
    keyFingerprint: "d17a14aea77314d2c5835d6e26174306b2b869c1887e0f762e0cf92c8fdcd325",
  },

  /* ----------------------------------------------------------------
     PAGE 07 — AND FINALLY, DEAR NURIN
     ---------------------------------------------------------------- */
  closing: {
    heading: "Some memories are too precious to leave in our camera rolls.",
    groupPhoto: "assets/photos/mirror-makcik-bawang.jpg",   // one final group photo
    // ✏️ One closing line from each of you (same order as contributors).
    messages: [
      "[Contributor 01's closing line]",
      "[Contributor 02's closing line]",
      "[Contributor 03's closing line]",
      "[Contributor 04's closing line]",
    ],
    collective: "[A message from all of us together. Keep it simple and true.]",
    signature: "from us",
    date: "25 · 11 · 2026",
  },

  /* ----------------------------------------------------------------
     MUSIC (optional, never autoplays with sound)
     ✏️ Replace with your song: put the .mp3 in assets/audio/.
     ---------------------------------------------------------------- */
  music: {
    src: "assets/audio/placeholder-song.mp3",
    title: "[Song title — artist]",
  },
};
