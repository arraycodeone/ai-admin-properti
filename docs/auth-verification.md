# Verifikasi Auth dan akses

T-012/#8 memiliki bukti lokal pada Supabase uji terisolasi. `npm.cmd run test:auth` lulus 9/9 pada 11 Oktober 2026: login benar/salah, logout, membership tidak aktif/organisasi lain, pergantian akun satu browser, refresh, dan sesi kedaluwarsa. `npm.cmd run test:access` juga lulus untuk owner, sales, anon, RLS, RPC, serta Storage privat.

Playwright menjalankan server sendiri pada port 3100 dan `reuseExistingServer=false`. Tes membuat atau memakai hanya akun fixture yang diizinkan; sesi yang ditangkap suite dibersihkan setelah tes. Jangan menjalankan suite Auth dan akses bersamaan pada target yang sama karena masing-masing memeriksa kondisi fixture.

Gerbang T-012/#8 dan T-013/#9 tetap terbuka sampai login dan isolasi akses dibuktikan pada URL HTTPS aplikasi dari T-006/#7. Tes lokal tidak membuktikan redirect Auth, cookie aman, atau kebijakan jaringan pada hosting.

[Bukti awal](archive/auth-verification-before-nusa-direction.md) dipertahankan sebagai catatan sejarah.
