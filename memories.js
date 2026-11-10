/* ==========================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT.
   - Put photos in  assets/photos/   and videos in  assets/videos/
   - Then add them below. Keep the quotes "" and the commas.
   - Everything still marked "sample" is a placeholder: replace or delete it.
   ========================================================== */

window.BIRTHDAY = {

  // Her name (or nickname) — shown in the title, letters and closing.
  name: "[her name]",

  // Your name, for the signature on your note.
  from: "Izzah",

  // When the letters and the film unlock (Malaysia time).
  // Before this, they show as "sealed". Add ?preview to the link to see everything early.
  unlockAt: "2026-11-25T00:00:00+08:00",

  // One line under the big "Happy birthday" title.
  heroLine: "A whole roll of us, developed just for you.",

  // ---------- YOUR OWN NOTE (section 01) ----------
  myNote: [
    "Write your own birthday message to her here.",
    "Each line in quotes becomes its own paragraph."
  ],

  // ---------- CONTACT SHEET (top of the page) ----------
  // 6–12 photos look best. Square-ish photos work best here.
  contactSheet: [
    "assets/photos/sample-station.jpg",
    "assets/photos/sample-candles.jpg",
    "assets/photos/sample-rose.jpg",
    "assets/photos/sample-train.jpg",
    "assets/photos/sample-trees.jpg",
    "assets/photos/sample-coffee.jpg",
    "assets/photos/sample-candles.jpg",
    "assets/photos/sample-station.jpg",
    "assets/photos/sample-rose.jpg",
    "assets/photos/sample-train.jpg"
  ],

  // ---------- LETTERS FROM THE CREW (section 02) ----------
  // One block per friend. photo and video are optional — delete the line if they didn't send one.
  letters: [
    {
      from: "Friend one (sample)",
      photo: "assets/photos/sample-coffee.jpg",
      message: [
        "Paste their birthday message here.",
        "A new line in quotes = a new paragraph."
      ]
    },
    {
      from: "Friend two (sample)",
      photo: "assets/photos/sample-trees.jpg",
      message: ["Their message goes here."]
    },
    {
      from: "Friend three (sample)",
      photo: "assets/photos/sample-rose.jpg",
      message: ["Their message goes here."]
    }
  ],

  // ---------- THE ROLL SO FAR (section 03) ----------
  // Your memories together, in order. Swipe sideways on the page.
  memories: [
    { photo: "assets/photos/sample-train.jpg",  label: "Frame 01", title: "Where it started", caption: "A short caption about this memory." },
    { photo: "assets/photos/sample-afternoon-film.jpg", label: "Frame 02", title: "Melaka, together", caption: "The trip we never finished the site for." },
    { photo: "assets/photos/sample-candles.jpg", label: "Frame 03", title: "A night to keep", caption: "A short caption about this memory." },
    { photo: "assets/photos/sample-cinematic-landscape.jpg", label: "Frame 04", title: "The long way home", caption: "A short caption about this memory." }
  ],

  // ---------- OUR FILM (section 04) ----------
  // Friends' video messages. They play one after another like a reel.
  // Use .mp4 files. Keep each under ~25 MB (send them to Claude to shrink if bigger).
  videos: [
    // { from: "Friend one", src: "assets/videos/friend-one.mp4" },
  ]
};
