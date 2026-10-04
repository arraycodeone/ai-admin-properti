# Status implementasi

## Font, motion dan profil Nusa, 4 Oktober 2026

- Penyempurnaan hero lanjutan: judul masuk per baris (24 px, stagger 70 ms, 900 ms), foto zoom-out 1.08 ke 1 di dalam bingkai. Tautan hero hanya fade agar area klik tidak bergerak saat menerima fokus. Reduced motion dan tampilan tanpa JavaScript tetap didukung.
- T-019 / T-020 / T-022: `/tentang` tersedia dengan konten agensi demo, foto interior dari aset, pendekatan layanan, kawasan bersama, dan CTA mengikuti status kanal sebenarnya. Profil Michael tetap pada landing.
- Tipografi publik memakai Cormorant Garamond 500 normal/italic dan Manrope 400–600 lokal berlisensi. Filter klik/pointer tanpa outline luar; keyboard memakai indikator charcoal inset 2 px tanpa perubahan ukuran field.
- Reveal dan parallax memakai API browser tanpa dependency tambahan, mendukung reduced motion serta cleanup saat navigasi. HTML dan form GET publik berfungsi tanpa JavaScript; mobile tanpa JavaScript menampilkan navigasi langsung.
- Tautan login/dashboard tidak ada dalam HTML publik. `/preview` serta komponen dashboard khususnya dihapus, URL lama 404. `/login` tetap bisa diakses langsung dan `/app` tetap memerlukan sesi/membership. Fixture seed/tes dipertahankan.
- Typecheck, lint, 26 tes logika, build, 22 E2E dan pemeriksaan kontras lulus. Screenshot landing/profil pada 360, 768, 1440 px serta detail diperiksa. Bukti: [test-results.md](test-results.md).
- Tidak mengubah API pencarian, DTO, database, autentikasi atau RLS pada penyempurnaan ini. Seed, Auth/RLS nyata, aktivasi kanal dan deployment tidak dijalankan. Status integrasi backlog tetap.

## Redesign Nusa Property, 4 Oktober 2026

- T-019 / T-020 / T-022: landing premium hangat, identitas Nusa, pencarian responsif, katalog, favicon, galeri detail keyboard, kawasan dan profil agen demo tersedia. Status integrasi produksi tetap mengikuti tabel backlog; redesign bukan penyelesaian seluruh task tersebut.
- Sepuluh listing publik mengikuti metadata aset Nusa. Spesifikasi sintetis ditambahkan dengan persetujuan pengguna; empat fixture akses tetap dipertahankan, total 14 properti.
- Media hanya ditambahkan pada mode preview sesudah penyaringan publik. DTO Supabase, otorisasi, scope organisasi dan kebijakan tanpa fallback tetap berlaku.
- Typecheck, lint, 26 tes Vitest, build dan 12 tes E2E lulus; kontras teks/kontrol serta screenshot desktop, tablet, mobile dan detail diperiksa. Lihat [bukti](test-results.md) dan [Delivery Gate](anti-slop-check.md).
- Seed dan referensi fixture SQL diselaraskan pada kode saja. Seed, database aktif, login nyata, RLS nyata dan WhatsApp tidak dijalankan atau diubah dalam pekerjaan ini.

Bagian di bawah merekam hasil pekerjaan sebelumnya.

## Migrasi dan tipe database 4 Oktober 2026

- T-009 / issue #4 selesai diverifikasi: dua migrasi diterapkan dari proyek kosong, 21 tabel dengan RLS aktif, bucket privat, dan riwayat migrasi cocok dengan file SQL.
- Uji rollback sebelum penerapan membuktikan schema dapat dibangun dari kosong; uji ulang schema setelah penerapan lulus. FK lintas organisasi, uang bigint, interval/benturan survei, unique key, default akses, dan DTO katalog diuji dengan fixture sementara.
- Grant bawaan anon pada helper dicabut secara eksplisit sebelum migrasi permanen. Extension `btree_gist` berada di schema `extensions`.
- Tipe resmi dihasilkan melalui `db:types`, digunakan pada client aplikasi, dan adapter mempertahankan nominal string serta allowlist DTO. Lihat [panduan migrasi](supabase-migrations.md).
- Typecheck, lint, 25 tes Vitest, build, dan 10 tes E2E preview lulus. Tes schema database nyata lulus; suite berseed menghasilkan `NOT RUN` karena seed belum tersedia.
- Target tetap tanpa organisasi/akun setelah rollback fixture. Berikutnya issue #5 untuk actor/RLS/grant, lalu #6 untuk seed berulang. Aplikasi tetap preview sampai data dan akses siap.

Catatan setup/perapihan serta tabel 3 Oktober di bawah adalah riwayat; status terbaru T-009 ada pada bagian ini.

## Persiapan Supabase 4 Oktober 2026

- Bagian Supabase dari T-003 (issue #3) telah diverifikasi pada `feature/supabase-test-setup`. Layanan eksternal lain dalam T-003 belum disiapkan.
- Panduan ada di [supabase-setup.md](supabase-setup.md) dan checker koneksi baca saja tersedia melalui `npm.cmd run check:supabase`.
- Koneksi nyata Auth health, Auth Admin, dan transaksi PostgreSQL baca saja lulus pada proyek uji. Session pooler memakai TLS dengan verifikasi CA dan hostname; kredensial serta sertifikat tetap lokal dan diabaikan Git.
- Checker berjalan dalam mode `supabase`/`test`; aplikasi tetap `preview` sampai migrasi. Origin localhost dan organisasi A terverifikasi. Rincian target dan setup ada pada panduan.
- Typecheck, lint, dan 21 tes Vitest lulus, termasuk empat kasus penolakan konfigurasi checker. Migrasi, seed, dan `test:db` belum dijalankan; langkah berikutnya issue #4 untuk migrasi dan tipe database.
- Seluruh T-003 belum selesai; status fitur di bawah adalah snapshot milestone sebelumnya.

## Perapihan struktur 4 Oktober 2026

- Dokumentasi aktif dipusatkan di `docs/`; [architecture.md](architecture.md) menjelaskan implementasi sekarang, dan roadmap/backlog tetap menyimpan target fitur.
- Panduan kerja singkat ada di [AGENTS.md](../AGENTS.md); rancangan struktur dan desain lama disimpan di `docs/archive/`.
- Data preview/seed dipindahkan ke `src/demo/`; aplikasi dan script tidak lagi mengimpor dari `tests/`.
- Aset siap pakai berada di `public/asset/`, sumber dan metadata di `assets-source/`. Paket Nusa Property belum dipetakan ke katalog Ruang Properti.
- Query dashboard dipindahkan ke modul dengan verifikasi actor dan scope organisasi tetap berlaku. JSX beranda dan dashboard dirapikan tanpa perubahan tampilan.
- Pemeriksaan lokal: typecheck, lint, 17 tes Vitest, build, 10 tes E2E lulus. Rincian dan batas pengujian ada di [test-results.md](test-results.md).

Perapihan ini tidak menyelesaikan task integrasi layanan eksternal. ID dan status task fitur di bawah tetap mengikuti milestone 3 Oktober.

## Status fitur 3 Oktober 2026

3 Oktober 2026. Status ini adalah catatan pelaksanaan pendamping backlog asli. Checkbox task hanya selesai bila seluruh kriteria task terbukti. Pengguna mengonfirmasi akses eksternal belum tersedia dan meminta pengerjaan lokal terlebih dahulu.

| Task | Status | Hasil / pekerjaan tersisa |
| --- | --- | --- |
| T-001 | done | Scope lokal/demo, aktor, alur target, penerimaan, dan G-01–G-08 dicatat pada decisions/001. |
| T-002 | doing | 2 organisasi, 10 properti, 20 FAQ, 4 lead, 5 definisi akun, marker privat, dan 15 skenario AI tersedia. Foto berizin/sintetis masih placeholder; fixture kegagalan provider belum dibuat. |
| T-003 | blocked | Node/npm/Git dan tools lokal siap. Pengguna belum menyediakan Supabase/Meta/Inngest/hosting/AI. Pemilik akses: pengguna; langkah berikutnya proyek uji terisolasi dan .env.local. |
| T-004 | done | Git, Next/TS/Tailwind, route publik/internal, layout/login, environment, lockfile, server-only, README, typecheck/build tersedia dan lulus lokal. Login sesi nyata termasuk T-012. |
| T-005 | done | Vitest, Playwright, script DB, CI, bukti tes. Check menangkap kesalahan yang sengaja dimasukkan lalu dipulihkan. DB test belum dijalankan dan gagal eksplisit jika target tidak tersedia. |
| T-006 | blocked | Belum ada hosting/URL HTTPS. Pemilik: pengguna. |
| T-007 | blocked | Adapter live menunggu Meta, nomor uji, dan URL HTTPS. Pemilik akses: pengguna. |
| T-008 | blocked | Belum ada handset/kanal nyata untuk tes dua arah. Pemilik akses: pengguna. |
| T-009 | doing | Dua migrasi berisi 21 tabel, constraint, RLS, grant, dan pembaca katalog. Belum dijalankan; tipe generated dan pembuktian constraint menunggu DB uji. |
| T-010 | doing | Actor terverifikasi, client user/system, policy read, mutasi direct tertutup. RLS/Storage/RPC belum terbukti dengan identitas nyata. |
| T-011 | doing | Script seed via Auth Admin tersedia. Seed ulang dua kali belum diuji. |
| T-012 | doing | Login/logout, proxy refresh, membership gate, halaman internal tersedia. Login benar/salah, sesi kedaluwarsa dan lintas peran nyata belum diuji. |
| T-013 | blocked | Suite SQL fondasi tersedia; matriks lengkap memerlukan database. Pemilik akses: pengguna. |
| T-014 | todo | Menunggu hasil T-013. Estimasi sisa belum dihitung ulang. |
| T-015 | todo | Katalog internal read-only sudah ada; CRUD dan audit listing belum ada. |
| T-016 | todo | Bucket privat disiapkan dalam SQL; upload, route aset dan tes pencabutan cache belum ada. |
| T-017 | doing | Pencarian terstruktur dan DTO fixture teruji; RPC baca ditulis. CRUD FAQ dan uji database belum ada. |
| T-018 | todo | Unit filter/publikasi bukan pengganti uji katalog/database/aset gabungan. |
| T-019 | doing | Website, katalog, detail, privasi dan state tersedia lokal. Pembacaan database nyata belum diuji. |
| T-020 | doing | Title/description/noindex dan sitemap demo kosong tersedia; canonical/OG/domain produksi belum diaktifkan. |
| T-021 | doing | Helper link tervalidasi dan CTA berbasis kanal siap. Kanal/metrik klik belum ada. |
| T-022 | doing | Desktop/360 px/landscape, filter, noindex, dan route lokal teruji. WhatsApp app/web dan metrik belum diuji. |
| T-023–T-030 | todo | Ingest/jobs/coordinator/sender/handoff/inbox/assignment/simulator pipeline belum diimplementasikan. `/preview` bukan simulator ini. |
| T-031–T-034 | todo | Operasi survei, follow-up, closing, dan laporan transaksional belum diimplementasikan. |
| T-035–T-039 | todo | Adapter AI, tools dan evaluasi model nyata belum diimplementasikan. 15 skenario baru fixture evaluasi. |
| T-040–T-041 | todo | Integrasi penuh WhatsApp menunggu pipeline dan akses nyata. |
| T-042–T-048 | todo | QA dan dokumentasi lokal tersedia sebagian; kandidat rilis, reset, UAT, dan latihan penuh belum dilakukan. |
| T-049–T-058 | todo | Seluruh tahap produksi belum dimulai. T-052/053 belum diputuskan berlaku atau N/A. |

Milestone berikutnya: siapkan DB Supabase uji, jalankan migrasi dan seed dua kali, generate tipe, jalankan test:db serta matriks akses, kemudian lanjut CRUD sesuai dependensi. Jangan membuka pipeline pengiriman sebelum kontrak coordinator pada T-025 dibuktikan lintas proses.

Estimasi awal 75–120 jam pada plan tetap merupakan estimasi awal, bukan klaim waktu tersisa. Tidak ada timesheet fokus yang cukup untuk menghitung ulang dengan andal pada milestone lokal ini.
