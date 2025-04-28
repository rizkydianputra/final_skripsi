// tambahSaldo.js
require('dotenv').config();                 // ← load .env
const admin = require('firebase-admin');
const fs    = require('fs');

// pastikan file key ada
if (!fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
  console.error('serviceAccountKey.json tidak ditemukan!');
  process.exit(1);
}

/* -------- init admin ---------- */
admin.initializeApp({
  credential : admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS)),
  databaseURL: process.env.DB_URL,
});

const db = admin.database();

/* -------- argumen CLI ---------- */
const [, , idBank, nominalArg] = process.argv;
const nominal = Number(nominalArg);

if (!idBank || !nominal) {
  console.log('Usage: node tambahSaldo.js <IDBankNotes> <nominal>');
  process.exit(1);
}

/* -------- tulis database ------- */
(async () => {
  const ref  = db.ref(`BankNotes/${idBank}`).push();   // auto-ID
  const now  = new Date();
  const time = now.toLocaleDateString('en-GB') + ' ' +
               now.toLocaleTimeString('en-GB');

  await ref.set({
    nominal : String(nominal),
    waktu   : time,
    isWd    : false,
    warna   : '#86FFAF',
  });

  console.log(`✓ Saldo ${nominal} ditambahkan ke ${idBank}`);
  process.exit(0);
})();
