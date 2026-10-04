# Verifikasi sesi browser Supabase

Issue #8 / T-012, 4 Oktober 2026. Delapan skenario lokal lulus terhadap Supabase uji nyata. Pengujian pada URL preview HTTPS belum dijalankan karena menunggu issue #7; T-012 belum dinyatakan selesai untuk seluruh lingkungan.

## Menjalankan

```powershell
npm.cmd run build
npm.cmd run test:auth
```

Konfigurasi memakai `APP_ENV=test`, `TEST_DATABASE_CONFIRM_ISOLATED=true`, API/SQL dari proyek uji yang sama, TLS hosted terverifikasi, publishable key, secret key dan password lima akun seed dari `.env.local`. Jangan menjalankan suite ini dengan akun pengguna nyata. Password yang diperlukan adalah password akun yang dibuat pada seed pertama; menjalankan seed lagi tidak meresetnya.

Konfigurasi Playwright khusus menyalakan build produksi pada `127.0.0.1:3100` dengan `APP_MODE=supabase` dan organisasi A. Ia menolak penggunaan server yang sudah berjalan. `.env.local` dan mode dev server pengguna tidak diubah. Jalankan terpisah dari `test:e2e` karena keduanya memakai port uji yang sama. Suite tidak dimasukkan ke CI biasa yang tidak memiliki akses database.

## Hasil lokal

| Skenario | Bukti |
| --- | --- |
| Tanpa sesi | `/app` dan `/app/properti` menuju `/login`; tidak ada dashboard. |
| Owner A, Andi, Sari | Password salah ditolak; password benar membuka identitas/role yang sesuai. Katalog internal memuat 13 properti organisasi A, tanpa AGB-001. |
| Logout | Cookie Auth hilang, kedua URL internal kembali tertutup. |
| Nonaktif dan Owner B | Login Auth berhasil tetapi membership situs ditolak; URL langsung tetap menuju pesan membership. |
| Pergantian akun | Owner A → Andi → Sari pada context browser yang sama; navigasi internal dan Back setelah logout tidak menampilkan identitas sebelumnya. |
| Refresh | Proxy mengirim cookie sesi baru, token refresh berganti dan halaman tetap terbuka. Respons internal tetap `no-store`. |
| Sesi kedaluwarsa | Auth mengembalikan `session_expired`; dashboard ditolak dan cookie sesi dibersihkan. |

Menu saat ini sama-sama hanya ringkasan dan katalog baca saja. Label Owner/Sales mengikuti actor terverifikasi; belum ada menu/mutasi CRUD khusus owner yang dapat diuji. Server Actions login/logout dipanggil melalui form browser asli. Akses tabel/RPC langsung sudah diuji pada [verifikasi akses](access-verification.md); suite ini tidak mengklaim mutasi bisnis yang belum ada.

## Cara menguji expiry dan cleanup

Login selalu melalui UI dan layanan Auth nyata. Untuk memicu refresh tanpa menunggu satu jam, tes membuat `expires_at` pada cache cookie SDK berada di masa lalu; JWT bertanda tangan tidak diubah. Token refresh kemudian benar-benar ditukar oleh proxy melalui Supabase.

Untuk expiry server, tes mengubah `auth.sessions.not_after` menjadi masa lalu hanya pada session ID Andi yang baru dibuat suite, lalu meminta refresh berikutnya. Supabase menolak refresh dengan `session_expired`. Ini membuktikan penanganan sesi yang habis pada saat refresh, bukan pengujian menunggu JWT kedaluwarsa secara alami atau perubahan pengaturan lifetime proyek.

Teardown menghapus hanya session ID yang ditangkap dari cookie suite dan cocok dengan akun fixture. Akun, membership, katalog dan lead seed dipertahankan. Jika proses dihentikan paksa, sesi uji dapat tersisa sampai dicabut atau kedaluwarsa; jangan menghapus seluruh sesi proyek sebagai pemulihan. Perilaku logout aplikasi menggunakan sign-out Supabase bawaan, sehingga suite harus dijalankan dengan akun demo khusus ini.

Trace, video, screenshot dan penyimpanan storage state dimatikan; jangan mengaktifkannya pada akun nyata. Password tidak dicetak. SDK dapat mencetak diagnostic `session_expired` yang memang diharapkan dalam skenario negatif; token tidak dicetak.

## Perbaikan yang ditemukan

- Proxy sebelumnya menolak akses sesi kedaluwarsa tetapi menyisakan cookie. Kini error Auth yang bukan gangguan sementara memicu sign-out scope lokal. Empat tes lokal memeriksa sesi valid, expiry, kegagalan sementara dan penerusan cookie/no-store.
- Fixture JSON memerlukan atribut `type: "json"` saat dimuat oleh runner ESM Node 24; atribut ditambahkan tanpa mengubah dataset.
- Selector tes membatasi alert ke kartu/form login dan katalog ke daftar propertinya agar tidak memilih route announcer atau loading boundary Next.js.

Referensi: [sesi Supabase dan pemeriksaan lifetime saat refresh](https://supabase.com/docs/guides/auth/sessions), [client SSR Supabase](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs).
