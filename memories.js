/* ==========================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT.
   - Put photos in  assets/photos/   and videos in  assets/videos/
   - Then add them below. Keep the quotes "" and the commas.
   - Everything marked "sample" is a placeholder: replace or delete it.
   ========================================================== */

window.BIRTHDAY = {

  // Shown big on the cover.
  firstName: "Nurin",
  lastName: "Mastura",
  date: "25.11.2026",

  // One line under her name.
  heroLine: "A whole roll of us, developed just for you.",

  // ---------- COVER COLLAGE ----------
  // 4 photos for the collage at the top, plus a short handwritten note for each.
  cover: [
    { photo: "assets/photos/sample-station.jpg", note: "the crew" },
    { photo: "assets/photos/sample-coffee.jpg",  note: "coffee & gossip" },
    { photo: "assets/photos/sample-trees.jpg",   note: "Melaka '26" },
    { photo: "assets/photos/sample-rose.jpg",    note: "our girl" }
  ],

  // ---------- A NOTE FROM ALL OF US (everyone can read this) ----------
  groupNote: [
    "Write a short birthday note from the whole group here.",
    "Each line in quotes becomes its own paragraph."
  ],
  groupSign: "love, the crew",

  // ---------- PRIVATE LETTERS ----------
  // Each friend writes and locks their own letter on the write page:
  //   https://izzahrhnh.github.io/dinner-date/write.html
  // They send you back the code (it starts with NM1.) and their question.
  // Paste them below. Only someone who knows the answer can read it — not even you.
  // Leave code as "" until they send it; the envelope will say it's still being written.
  letters: [
    {
      from: "Sample",
      question: "Which city did we never finish making a website for?",
      code: "NM1.n9ScFK1l2A48NeVuFKiQFx06plUfPXTOlEngFHsqDL3ic36xLPqHuW1kLqXhSMmmO04TvgfyhbMtbUeDE92vAbrTSe47+fGYZm7G/lHcVg4v9uwAP2zRrVi6WftjiwCmEhJTHdrXrDsMArD3j1WnQzgVWm+r7h7ehfWT5btY0eUikiHwbPmwg6IcMMZmOX1eL54QU4FHb5vQxKOKV1ddvhgtYE2VDpCnX57xxeDI5Fyt9eDBTyNVKooWTc+0jQO4Mh5JFZAxbg=="
    },
    { from: "Izzah",      question: "", code: "" },
    { from: "Friend two", question: "", code: "" },
    { from: "Friend three", question: "", code: "" },
    { from: "Friend four", question: "", code: "" }
  ],

  // ---------- THE ROLL SO FAR (film strip) ----------
  // Your memories together, in order. Swipe sideways on the page.
  // date is optional (YYYY-MM-DD): it shows as an orange camera stamp.
  memories: [
    { photo: "assets/photos/sample-train.jpg", date: "2024-03-02", title: "where it started" },
    { photo: "assets/photos/sample-afternoon-film.jpg", date: "2026-10-24", title: "melaka, together" },
    { photo: "assets/photos/sample-candles.jpg", title: "a night to keep" },
    { photo: "assets/photos/sample-cinematic-landscape.jpg", title: "the long way home" }
  ],

  // ---------- OUR LITTLE FILMS ----------
  // Video messages everyone can watch. They play one after another.
  // Use .mp4 files. Keep each under ~25 MB.
  videos: [
    // { from: "Izzah", src: "assets/videos/izzah.mp4" },
  ]
};
