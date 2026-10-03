# Status implementasi

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
