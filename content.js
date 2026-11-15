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
   ================================================================== */

window.SCRAPBOOK = {

  /* Shows a small "sample" tag on placeholder photos so you can see what
     still needs replacing. Set to false before you send it to Nurin. */
  showPlaceholderTags: true,

  recipient: {
    firstName: "Nurin",
    lastName: "Mastura",
  },

  /* ✏️ The four of you. These names sign the notes on page 04.
     (You can add photo: "assets/photos/…" to each to show a little polaroid of them.) */
  contributors: [
    { name: "Izzah" },
    { name: "Afikah" },
    { name: "Hazi" },
    { name: "Wahieda" },
  ],

  /* ----------------------------------------------------------------
     PAGE 01 — THE COVER
     ---------------------------------------------------------------- */
  cover: {
    label: "A little something for you",
    line: "A little world, made just for you.",
    subtitle: "A collection of little things, beautiful memories and moments we never want to forget.",
    // ✏️ Up to 5 photos for the opening collage. The first one is the biggest.
    photos: [
      "assets/photos/baby-nurin.jpg",
      "assets/photos/photobooth-pink-1.jpg",
      "assets/photos/hand-signs.jpg",
      "assets/photos/flowers-jump.jpg",
      "assets/photos/camera-flash.jpg",
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
    { type: "photo", size: "feature", src: "assets/photos/beach-selfie.jpg", caption: "[caption]" },
    { type: "photo", size: "polaroid", src: "assets/photos/beach-camera.jpg", caption: "[caption]" },
    { type: "note", text: "[a little note]" },
    { type: "photo", size: "tall", src: "assets/photos/shop-photostrip.jpg", caption: "[caption]" },
    { type: "photo", size: "wide", src: "assets/photos/restaurant-two.jpg", caption: "[caption]" },
    { type: "strip", photos: [
        "assets/photos/photobooth-pink-2.jpg",
        "assets/photos/photobooth-pink-3.jpg",
        "assets/photos/photobooth-pink-4.jpg",
        "assets/photos/photobooth-pink-5.jpg",
        "assets/photos/photobooth-pink-6.jpg",
      ], caption: "[caption for the photobooth]" },
    { type: "photo", size: "polaroid", src: "assets/photos/car-nap.jpg", caption: "[caption]" },
    { type: "video", size: "tall", src: "assets/videos/clip-stall.mp4", poster: "assets/videos/clip-stall.jpg", caption: "[video caption]" },
    { type: "photo", size: "tall", src: "assets/photos/cards-table.jpg", caption: "[caption]" },
    { type: "photo", size: "wide", src: "assets/photos/eating-together.jpg", caption: "[caption]" },
    { type: "note", text: "[an inside joke, if you like]" },
    { type: "video", size: "polaroid", src: "assets/videos/clip-floor.mp4", poster: "assets/videos/clip-floor.jpg", caption: "[video caption]" },
    { type: "photo", size: "tall", src: "assets/photos/concert-night.jpg", caption: "[caption]" },
    { type: "video", size: "polaroid", src: "assets/videos/clip-concert.mp4", poster: "assets/videos/clip-concert.jpg", caption: "[video caption]" },
    { type: "photo", size: "tall", src: "assets/photos/japan-crosswalk.jpg", caption: "[caption]" },
    { type: "video", size: "tall", src: "assets/videos/clip-roadside.mp4", poster: "assets/videos/clip-roadside.jpg", caption: "[video caption]" },
    { type: "video", size: "small", src: "assets/videos/clip-shop.mp4", poster: "assets/videos/clip-shop.jpg", caption: "[video caption]" },
    { type: "photo", size: "wide", src: "assets/photos/photobooth-license.jpg", caption: "[caption]" },
    { type: "photo", size: "tall", src: "assets/photos/stairs-keluar.jpg", caption: "[caption]" },
    { type: "photo", size: "polaroid", src: "assets/photos/stairs-solo.jpg", caption: "[caption]" },
    { type: "photo", size: "polaroid", src: "assets/photos/avocado-melaka.jpg", caption: "[caption]", place: "Melaka" },
    { type: "photo", size: "wide", src: "assets/photos/melaka-street-four.jpg", caption: "[caption]", place: "Melaka" },
    { type: "photo", size: "wide", src: "assets/photos/atv-three.jpg", caption: "[caption]" },
    { type: "photo", size: "small", src: "assets/photos/pillar-smile.jpg", caption: "[caption]" },
    { type: "photo", size: "polaroid", src: "assets/photos/market-stamp.jpg", caption: "[caption]" },
    { type: "note", text: "[a little note]" },
    { type: "photo", size: "wide", src: "assets/photos/beach-two.jpg", caption: "[caption]" },
    { type: "photo", size: "wide", src: "assets/photos/cafe-orange.jpg", caption: "[caption]" },
    { type: "photo", size: "tall", src: "assets/photos/mirror-roses.jpg", caption: "[caption]" },
    { type: "photo", size: "small", src: "assets/photos/holding-photostrip.jpg", caption: "[caption]" },
    { type: "photo", size: "wide", src: "assets/photos/garden-selfie.jpg", caption: "[caption]" },
  ],

  /* ----------------------------------------------------------------
     PAGE 04 — FIVE OF US, IN LITTLE FRAMES
     ---------------------------------------------------------------- */
  fiveOfUs: {
    groupPhoto: "assets/photos/red-curtain-five.jpg",   // a photo of all five of you
    recipientPhoto: "assets/photos/photobooth-lune-6.jpg",     // the polaroid labelled with her name
    // ✏️ Four little frames of Nurin around the group photo (photo + a short handwritten caption).
    frames: [
      { photo: "assets/photos/osaka-glico-sq.jpg", caption: "Osaka" },
      { photo: "assets/photos/nara-deer-sq.jpg", caption: "Nara" },
      { photo: "assets/photos/umbrella-night-sq.jpg", caption: "rainy night" },
      { photo: "assets/photos/singapore-gallery-sq.jpg", caption: "Singapore" },
    ],
    // ✏️ One short birthday message from each of you, in the same order as contributors above.
    messages: [
      "[Izzah — a few sentences to Nurin, in your own words.]",
      "[Afikah — a few sentences to Nurin, in your own words.]",
      "[Hazi — a few sentences to Nurin, in your own words.]",
      "[Wahieda — a few sentences to Nurin, in your own words.]",
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
    collective: "Happy birthday, Nuwinnn!",
    signature: "from us",
    date: "25 · 11 · 2026",
  },

  /* ----------------------------------------------------------------
     MUSIC (starts when she taps "Open your little world")
     Plays from YouTube in a small "now playing" card, so the song file
     isn't stored in this public site. Paste any YouTube link to change it.
     (A spotify: "song link" line here would play from Spotify instead,
     but logged-out visitors only hear a 30-second preview.)
     ---------------------------------------------------------------- */
  music: {
    youtube: "https://youtu.be/eD7kpZRGyGs",
    title: "pink skies — LANY",
  },
};
