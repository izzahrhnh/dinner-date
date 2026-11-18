/* ==================================================================
   NOTES FOR NURIN — Google Apps Script
   Stores the four birthday notes in this Google Sheet so they can be
   edited straight from the website. Paste into Extensions → Apps Script,
   then Deploy → New deployment → Web app (Execute as: Me,
   Who has access: Anyone). Send the Web app URL to be put in content.js.
   ================================================================== */

// The four people who write notes. Must match the names in content.js.
const NAMES = ['Afikah', 'Izzah', 'Hazi', 'Wahieda'];
const MAX_LENGTH = 3000;

function notesSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('Notes');
  if (!sh) {
    sh = ss.insertSheet('Notes');
    sh.appendRow(['name', 'message', 'last edited']);
    NAMES.forEach(n => sh.appendRow([n, '', '']));
    sh.setColumnWidth(2, 600);
  }
  return sh;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// The website reads the notes from here.
function doGet() {
  const rows = notesSheet_().getDataRange().getValues().slice(1);
  const notes = {};
  rows.forEach(r => {
    if (!r[0]) return;
    notes[String(r[0])] = { message: String(r[1] || '').replace(/^'/, ''), updated: r[2] ? new Date(r[2]).toISOString() : '' };
  });
  return reply_({ ok: true, notes: notes });
}

// The website saves an edited note here.
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const name = String(data.name || '');
    let message = String(data.message || '').slice(0, MAX_LENGTH);
    if (NAMES.indexOf(name) < 0) return reply_({ ok: false, error: 'Unknown name' });
    // stop text starting with = + - @ from being treated as a spreadsheet formula
    if (/^[=+\-@]/.test(message)) message = "'" + message;
    const sh = notesSheet_();
    const rows = sh.getDataRange().getValues();
    const row = rows.findIndex((r, i) => i > 0 && r[0] === name);
    if (row < 0) sh.appendRow([name, message, new Date()]);
    else sh.getRange(row + 1, 2, 1, 2).setValues([[message, new Date()]]);
    return reply_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
