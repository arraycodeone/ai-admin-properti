# Open-WA pada server sendiri

Pengguna memilih Open-WA dengan akun yang sudah dipasangkan. Rilis terbaru yang terverifikasi pada 11 Oktober 2026 adalah **5.4.0**. Jalankan runtime ini di server gateway, terpisah dari aplikasi Next.js. Konfigurasi contoh ada di [`integrations/open-wa/wa.config.mjs`](../integrations/open-wa/wa.config.mjs).

Pada server gateway, simpan konfigurasi dalam direktori kerja privat dan pasang runtime serta plugin webhook pada versi yang sama:

```sh
npm install --save-exact @open-wa/wa-automate@5.4.0 @open-wa/integration-webhook@5.4.0
```

Isi `OPEN_WA_SESSION_ID` sesuai sesi yang sudah dipasangkan, `OPEN_WA_API_KEY`, `OPEN_WA_WEBHOOK_SECRET`, dan `OPEN_WA_WEBHOOK_URL` dengan URL HTTPS penerima aplikasi. Simpan nilainya di pengelola secret server, bukan di Git. Gunakan direktori kerja serta penyimpanan sesi persisten yang sama pada restart. Lalu jalankan:

```sh
npx @open-wa/wa-automate@5.4.0 --config ./wa.config.mjs
```

Jangan arahkan webhook ke aplikasi saat ini: penerima pesan dan transaksi ingest belum diimplementasikan. Runtime juga belum dipasang pada server milik pengguna dari workspace ini. Sebelum mengaktifkannya, periksa kompatibilitas sesi yang sudah dipasangkan; catatan rilis 5.4.0 menyebut perubahan format sesi yang mungkin memerlukan pemindaian QR ulang.

Batasi API dan `/health` pada jaringan privat. Periksa `/health` sampai `connected: true` dan `session.ready: true`. Plugin mengirim header rahasia bersama, bukan tanda tangan HMAC. Penerima harus memeriksa header, membatasi ukuran payload, menyimpan event secara idempoten sebelum memberi respons sukses, dan tidak mencatat isi pesan. Kegagalan setelah percobaan ulang tetap perlu pemantauan; jurnal lokal plugin tidak menjamin seluruh pesan akhirnya terkirim.

Rujukan: [rilis 5.4.0](https://github.com/open-wa/wa-automate-nodejs/releases/tag/v5.4.0), [Easy API](https://openwa.dev/docs/getting-started/easy-api), dan [panduan webhook](https://openwa.dev/docs/guides/webhooks-for-business).
