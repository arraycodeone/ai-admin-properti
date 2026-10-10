# Status implementasi

## Tinjauan fondasi, 11 Oktober 2026

- PR #23 telah digabung ke `develop`; issue #10 untuk identitas/aset Nusa ditutup. T-002 lebih luas tetap terbuka untuk fixture kegagalan provider dan evaluasi AI pada T-039.
- [Tinjauan T-014](foundation-review.md) mencatat bukti akses lokal, owner setiap hambatan, rencana uji coordinator T-025 lintas proses, dan estimasi maju 125–220 jam fokus tersisa termasuk cadangan. Jam aktual P0–P2 tidak dapat diaudit karena tidak ada timesheet fokus.
- T-012/#8 menunggu URL preview HTTPS dari T-006/#7; T-013/T-014/#9 tetap terbuka. T-007/T-008/#12 menunggu akses Meta dan bukti handset dua arah. Jobs/AI belum diverifikasi. Gerbang CRUD T-015 belum dinyatakan lulus.

## Konsistensi katalog demo, 10 Oktober 2026

- Identitas aktif Nusa Property, kode `NUSA-001`, alur Dimas BSD/Rp2 miliar, naskah demo, dokumen bisnis/roadmap, dan 15 fixture evaluasi AI diselaraskan dengan katalog serta seed yang sudah tersedia. Build produksi dan 22 tes E2E desktop/mobile lulus pada branch integrasi. Issue #10 kini ditutup setelah PR #23 digabung; T-002 keseluruhan tetap terbuka untuk fixture kegagalan provider dan tahap evaluasi AI nyata T-039.

## Matriks akses lokal, 10 Oktober 2026

- T-013 / issue #9: `test:access` lulus pada Supabase uji terisolasi dengan lima sesi Auth nyata dan anon. Fixture sementara kini mencakup kanal, pengaturan situs, aset publik/privat, FAQ, percakapan, pesan, survei, tugas, audit, dan metrik di dua organisasi. Pemeriksaan meliputi batas baca peran/tenant, RPC, mutasi langsung yang tertutup, serta penolakan unduh objek nyata dari bucket privat. Objek, baris, dan akun sementara dibersihkan.
- `test:db` berseed, typecheck, lint, dan 54 tes lokal lulus. Verifikasi URL preview HTTPS T-012 masih menunggu #7, sehingga checkbox T-013 tetap terbuka sesuai dependensinya. Pengelolaan aset aplikasi dan pencabutan cache tetap T-016.

## Sesi browser lokal, 4 Oktober 2026

- T-012 / issue #8: 8 skenario `test:auth` lulus pada browser lokal dengan Supabase nyata, mencakup login salah/benar owner/Andi/Sari, logout, URL langsung, membership nonaktif/lintas organisasi, pergantian akun, refresh dan expiry sesi server.
- Proxy membersihkan cookie pada error Auth yang tidak dapat diulang; gangguan sementara tidak memicu logout. Import metadata JSON diberi atribut untuk runner Node 24. Typecheck, lint, 54 tes lokal dan build lulus.
- Sesi tes dibersihkan, fixture seed dipertahankan. Mode aplikasi tetap preview di luar server uji. Bukti dan metode expiry ada di [auth-verification.md](auth-verification.md).
- URL preview HTTPS masih menunggu #7, sehingga T-012 belum selesai untuk seluruh lingkungan. Matriks akses gabungan tetap #9.

## Seed Nusa terverifikasi, 4 Oktober 2026

- T-011 / issue #6 selesai: dua seed pada Supabase uji menghasilkan 2 organisasi, 14 properti (10 publik), 20 FAQ, 5 akun/membership dan 4 kontak/lead tanpa duplikasi. ID, assignment, sales default serta password akun lama tetap sesuai.
- `test:db` berseed lulus untuk akses dan integritas. Fixture tetap tersimpan, sedangkan perubahan transaksi tes dibatalkan. Aplikasi tetap preview dan kanal paused.
- Sisa konflik merge diperbaiki: identitas seed kembali Nusa, dan command `test:access` dipulihkan. Bukti dan prosedur ada di [seed-verification.md](seed-verification.md).
- Berikutnya #8 untuk sesi/login/logout browser dan #9 untuk matriks gabungan. Catatan persiapan di bawah adalah riwayat sebelum seed diizinkan.

## Persiapan verifikasi seed, 4 Oktober 2026

- T-011 / issue #6 belum selesai. `test:seed` tersedia untuk menjalankan seed dua kali dan memeriksa hitungan, ID, membership, assignment, sales default, serta password akun lama.
- Seed kini mewajibkan mode test, konfirmasi database dan seed, kecocokan API/SQL, serta password minimal 16 karakter. Pemeriksaan organisasi demo/paused dan allowlist akun dilakukan sebelum mutasi pertama. Error tidak mencetak respons layanan atau kredensial.
- Definisi lima akun dibagikan dari `src/demo/accounts.ts`; hitungan katalog/FAQ mengikuti fixture aktual agar sesuai setelah PR desain Nusa digabungkan.
- Typecheck, lint dan 38 tes lokal lulus, termasuk 13 tes guard/pemulihan seed. Runner nyata menghasilkan `NOT RUN: konfigurasi` karena konfirmasi khusus seed belum true dan password belum tersedia. Tidak ada seed yang dijalankan atau data Supabase yang diubah pada pekerjaan ini.
- Persiapan, dampak reset fixture, dan pemulihan kegagalan sebagian dicatat pada [seed-verification.md](seed-verification.md). Pembuktian dua run serta suite database berseed menunggu konfigurasi tersebut.

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
