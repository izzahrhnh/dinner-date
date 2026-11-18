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

  /* Pages to hide for now (they stay in the code and can be brought back by
     removing them from this list). "things" = Little things about you, "secret" = the coded letter. */
  hiddenPages: ["things", "secret"],

  recipient: {
    firstName: "Nurin",
    lastName: "Mastura",
  },

  /* ✏️ The four of you. These names sign the notes on page 04.
     (You can add photo: "assets/photos/…" to each to show a little polaroid of them.) */
  contributors: [
    { name: "Afikah" },
    { name: "Izzah" },
    { name: "Hazi" },
    { name: "Wahieda" },
  ],

  /* ----------------------------------------------------------------
     PAGE 01 — THE COVER
     ---------------------------------------------------------------- */
  cover: {
    // ✏️ the big cut-out photo of her in the middle of the birthday poster
    hero: "assets/photos/baby-nurin.jpg",
    age: "22",
    // little words around the poster (top-left, top-right, left, right)
    tags: ["", "", "our chosen family", "through everything, together"],
    line: "A little world, made just for you.",
    // the photos that lead the wall of prints behind the poster (the rest come from the archive)
    photos: [
      "assets/photos/photobooth-pink-1.jpg",
      "assets/photos/flowers-jump-close.jpg",
      "assets/photos/hand-signs.jpg",
      "assets/photos/camera-flash.jpg",
    ],
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
     Add as many as you like. They're scattered like a scrapbook spread, and
     videos are spread out between the photos automatically.
     type:  "photo" | "video" | "strip" (3–5 photos on a film strip) | "note"
     size:  "feature" (big) | "wide" | "tall" | "polaroid" | "small"
     caption: short, lowercase works best. Appears on hover/tap.
     date, place: optional little labels.
     For videos: src = the .mp4, poster = a still image for the thumbnail.
     ---------------------------------------------------------------- */
  archive: [
    { type: "photo", size: "feature", src: "assets/photos/beach-selfie.jpg", caption: "beach day, wind in our faces" },
    { type: "photo", size: "polaroid", src: "assets/photos/beach-camera.jpg", caption: "our photographer, even in the dark" },
    { type: "note", text: "twenty-two years of you, and we got to be part of it" },
    { type: "photo", size: "tall", src: "assets/photos/shop-photostrip.jpg", caption: "caught her mid-shopping" },
    { type: "photo", size: "wide", src: "assets/photos/restaurant-two.jpg", caption: "peace sign, pose number 47" },
    { type: "strip", photos: [
        "assets/photos/photobooth-pink-2.jpg",
        "assets/photos/photobooth-pink-3.jpg",
        "assets/photos/photobooth-pink-4.jpg",
        "assets/photos/photobooth-pink-5.jpg",
        "assets/photos/photobooth-pink-6.jpg",
      ], caption: "five of us, squeezed into one frame" },
    { type: "photo", size: "polaroid", src: "assets/photos/car-nap.jpg", caption: "knocked out before we even left" },
    { type: "video", size: "tall", src: "assets/videos/clip-stall.mp4", poster: "assets/videos/clip-stall.jpg", caption: "stocking up the milk stall" },
    { type: "photo", size: "tall", src: "assets/photos/cards-table.jpg", caption: "waiting for the food like" },
    { type: "photo", size: "wide", src: "assets/photos/eating-together.jpg", caption: "phones out, food coming" },
    { type: "note", text: "thank you for every laugh, every meal, every late night" },
    { type: "video", size: "polaroid", src: "assets/videos/clip-floor.mp4", poster: "assets/videos/clip-floor.jpg", caption: "down bad on the floor (again)" },
    { type: "photo", size: "tall", src: "assets/photos/concert-night.jpg", caption: "concert night outfit, checked ✓" },
    { type: "video", size: "polaroid", src: "assets/videos/clip-concert.mp4", poster: "assets/videos/clip-concert.jpg", caption: "excited for Blackpinkkk" },
    { type: "photo", size: "tall", src: "assets/photos/japan-crosswalk.jpg", caption: "posing at every crossing" },
    { type: "video", size: "tall", src: "assets/videos/clip-roadside.mp4", poster: "assets/videos/clip-roadside.jpg", caption: "wandering by the roadside" },
    { type: "video", size: "small", src: "assets/videos/clip-shop.mp4", poster: "assets/videos/clip-shop.jpg", caption: "strutting through the shop" },
    { type: "photo", size: "wide", src: "assets/photos/photobooth-license.jpg", caption: "officially licensed, no refunds" },
    { type: "photo", size: "tall", src: "assets/photos/stairs-keluar.jpg", caption: "keluar, but make it a photoshoot" },
    { type: "photo", size: "polaroid", src: "assets/photos/stairs-solo.jpg", caption: "stairway model" },
    { type: "photo", size: "polaroid", src: "assets/photos/avocado-melaka.jpg", caption: "avocado drink supremacy" },
    { type: "photo", size: "wide", src: "assets/photos/melaka-street-four.jpg", caption: "jalan-jalan, lost but cute" },
    { type: "photo", size: "wide", src: "assets/photos/atv-three.jpg", caption: "ATV squad, ready to ride" },
    { type: "photo", size: "small", src: "assets/photos/pillar-smile.jpg", caption: "that shy smile" },
    { type: "photo", size: "polaroid", src: "assets/photos/market-stamp.jpg", caption: "giggling at the market" },
    { type: "note", text: "here's to more memories, together" },
    { type: "photo", size: "wide", src: "assets/photos/beach-two.jpg", caption: "shh, the sunset's watching" },
    { type: "photo", size: "tall", src: "assets/photos/mirror-roses.jpg", caption: "mirror pic with the roses" },
    { type: "photo", size: "small", src: "assets/photos/holding-photostrip.jpg", caption: "proudly holding the photostrip" },
    { type: "photo", size: "wide", src: "assets/photos/garden-selfie.jpg", caption: "night selfie, besties edition" },
    { type: "photo", size: "wide", src: "assets/photos/cafe-orange.jpg", caption: "waiting for her drink, on her phone" },
    { type: "photo", size: "tall", src: "assets/photos/volunteer-certificate.jpg", caption: "certified volunteer, so proud" },
    { type: "photo", size: "wide", src: "assets/photos/restaurant-thumbs.jpg", caption: "please & thumbs up" },
    { type: "photo", size: "wide", src: "assets/photos/sleepover-selfie.jpg", caption: "sleepover: one already asleep" },
    { type: "video", size: "wide", src: "assets/videos/clip-breakfast.mp4", poster: "assets/videos/clip-breakfast.jpg", caption: "breakfast and a little dance" },
    { type: "photo", size: "wide", src: "assets/photos/mario-lamp.jpg", caption: "cards under the little lamp" },
    { type: "photo", size: "tall", src: "assets/photos/makcik-bawang-three.jpg", caption: "beware of makcik bawang (us)" },
    { type: "photo", size: "wide", src: "assets/photos/beach-chairs.jpg", caption: "beach chairs and cold drinks" },
    { type: "photo", size: "wide", src: "assets/photos/cafe-three.jpg", caption: "three heads, one phone screen" },
    { type: "video", size: "tall", src: "assets/videos/clip-pose.mp4", poster: "assets/videos/clip-pose.jpg", caption: "the pose. iconic." },
    { type: "photo", size: "wide", src: "assets/photos/plants-cafe.jpg", caption: "peace sign behind the plants" },
    { type: "photo", size: "wide", src: "assets/photos/black-hijab-two.jpg", caption: "matching greys, arms crossed" },
    { type: "photo", size: "tall", src: "assets/photos/seaside-two.jpg", caption: "seaside, side by side" },
    { type: "photo", size: "wide", src: "assets/photos/frying-night.jpg", caption: "our early encounter" },
    { type: "photo", size: "wide", src: "assets/photos/nasi-campur-stare.jpg", caption: "don't touch my food" },
    { type: "photo", size: "tall", src: "assets/photos/avocado-mirror.jpg", caption: "cashier this way →" },
    { type: "photo", size: "wide", src: "assets/photos/mala-table.jpg", caption: "table 88, mala night" },
    { type: "photo", size: "polaroid", src: "assets/photos/driving.jpg", caption: "our favourite driver" },
    { type: "photo", size: "polaroid", src: "assets/photos/lift-selfie.jpg", caption: "lift selfie, peace sign included" },
    { type: "photo", size: "tall", src: "assets/photos/padel-camera.jpg", caption: "camera up, padel night" },
    { type: "photo", size: "tall", src: "assets/photos/garden-camera.jpg", caption: "snapping the garden lights" },
    { type: "photo", size: "tall", src: "assets/photos/flash-street.jpg", caption: "flash on, city nights" },
    { type: "photo", size: "tall", src: "assets/photos/blackpink-day.jpg", caption: "BLACKPINK day, light stick ready" },
    { type: "video", size: "wide", src: "assets/videos/clip-booth-chat.mp4", poster: "assets/videos/clip-booth-chat.jpg", caption: "booth gossip, thumbs up" },
    { type: "video", size: "tall", src: "assets/videos/clip-pasta.mp4", poster: "assets/videos/clip-pasta.jpg", caption: "pasta night" },
    { type: "video", size: "tall", src: "assets/videos/clip-cards-game.mp4", poster: "assets/videos/clip-cards-game.jpg", caption: "who's cheating? (it's you)" },
    { type: "video", size: "tall", src: "assets/videos/clip-atv.mp4", poster: "assets/videos/clip-atv.jpg", caption: "off she goes on the ATV" },
    { type: "video", size: "polaroid", src: "assets/videos/clip-beach-cards.mp4", poster: "assets/videos/clip-beach-cards.jpg", caption: "one more round by the sea" },
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
    // The Google Sheet web-app link that stores the notes, so they can be edited on the site.
    // Leave "" to just show the messages below. (Nurin's read-only link: add ?for=nurin)
    notesSheet: "",
    // ✏️ One short birthday message from each of you, in the same order as contributors above.
    messages: [
      "Happy birthday to my best friend, my roommate, my travel partner and my concert buddy! Thank you for always being there for me through all my ups and downs. Good luck with your future endeavors as a data analyst!! Go kill it, I know you can do it! Even if we're apart after graduation, please remember that I'm always just one call away. Again, I love you always and in all ways and thank you for staying 🤍",
      "Happy 22nd birthday Nurinnn!!!! Wishing you well every now and then, keep being you and semoga sentiasa diberkati Tuhan dalam setiap perlakuanmu…. May your 22nd bday be the memories that you'll cherish foreverrr.",
      "[Hazi — a few sentences to Nurin, in your own words.]",
      "[Wahieda — a few sentences to Nurin, in your own words.]",
    ],
    // ✏️ Little friendship details: inside jokes, nicknames, group-chat lore.
    details: [
      "five of us, always",
      "25 · 11 · 2004",
      "more memories to come",
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
    { title: "Little moments that make us laugh", items: ["[moment]", "[moment]"], photo: "assets/photos/cafe-orange.jpg" },
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
    // a small extra wish shown above the big "Happy birthday" (delete these two lines to remove it)
    extraWish: "Twenty-two looks good on you. May this year bring you new places, loud concerts, quiet good days, and friends who keep showing up exactly like these four.",
    extraWishFrom: "a little wish from Claude",
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
