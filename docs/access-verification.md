# Verifikasi akses

T-013/#9 memiliki bukti lokal pada Supabase uji terisolasi. `npm.cmd run test:access` lulus pada 11 Oktober 2026 untuk owner organisasi A/B, sales Andi/Sari, membership tidak aktif, dan anon. Runner memeriksa RLS/grant 21 tabel, RPC, isolasi kontak serta detail privat, dan Storage. Organisasi, akun Auth, serta objek Storage sementara dibersihkan setelah tes.

`npm.cmd run test:auth` lulus 9/9 untuk login/logout, pergantian akun satu browser, refresh, dan expiry. Jalankan kedua suite secara berurutan agar fixture sementara tidak mengganggu pemeriksaan kondisi awal suite lain.

Gerbang tetap terbuka sampai Auth dan matriks akses diuji pada URL HTTPS aplikasi dari T-006/#7. Upload/pencabutan cache foto adalah T-016 tersendiri. [Bukti sebelumnya](archive/access-verification-before-nusa-direction.md) dipertahankan sebagai sejarah.
