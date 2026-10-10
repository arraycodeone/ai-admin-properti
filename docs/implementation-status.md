# Status implementasi

Diperbarui 11 Oktober 2026. [Backlog aktif](backlog.md) memakai ID T-001–T-058. [Catatan status sebelumnya](archive/implementation-status-before-nusa-direction.md) dipertahankan sebagai sejarah.

## Sudah tersedia

- PR #26 telah tergabung ke `origin/develop`: owner dapat membuat/mengedit listing, mengatur publikasi, fasilitas, dan kontak privat melalui RPC atomik dengan audit. Sales hanya membaca katalog.
- Aplikasi memakai Supabase pada `APP_ENV=development|production`. Pembacaan gagal dengan jelas ketika layanan tidak tersedia. Pembacaan profil website publik pada production menolak organisasi fixture; situs tetap `noindex`.
- Katalog saat ini berisi sepuluh konsep berlabel ilustrasi. Media sintetis hanya dipasangkan pada pembacaan development; data spesifikasi/harga belum diverifikasi sebagai penawaran nyata.
- Dashboard owner/sales menampilkan prospek baru dari sumber pesan, permintaan bantuan manusia, tugas lewat tenggat, survei mendatang, dan tugas terdekat dengan scope Auth/RLS. Prospek fixture manual tidak dihitung sebagai pesan pelanggan nyata. Alur membuat tugas, inbox, dan closing belum ada.
- Branch lokal tinggal `main` dan `develop`. Semua tip branch fitur lama diverifikasi tercakup pada `origin/develop` atau branch remote sebelum branch lokal dihapus. Branch remote dan PR tidak dihapus.
- Pengguna memilih Open-WA pada server sendiri. [Konfigurasi rilis 5.4.0](open-wa.md) tersedia sebagai berkas pemasangan; runtime belum dipasang pada server pengguna dan belum ada receiver aplikasi.

## Pemeriksaan lokal

| Pemeriksaan | Hasil |
| --- | --- |
| Typecheck, lint, unit | Lulus setelah penyesuaian terakhir; 56/56 tes. |
| Database uji terisolasi | `test:db` lulus; tidak ada migrasi production. |
| Matriks akses | `test:access` lulus untuk owner/sales/anon, RLS, RPC, dan Storage. |
| Browser Auth | `test:auth` lulus 9/9 pada port 3100, termasuk sesi kedaluwarsa. |
| Build dan E2E | Build lulus; E2E desktop/ponsel 22/22 lulus pada port 3100. |
| Warna dan whitespace | Pemeriksa kontras dan `git diff --check` lulus. |

Tes browser lokal tidak membuktikan Auth pada HTTPS publik atau pengiriman pesan pada perangkat nyata.

## Gerbang terbuka

- T-006/#7 → T-012/#8 → T-013/T-014/#9: URL HTTPS, Auth, dan matriks akses di lingkungan tersebut.
- T-016–T-022: aset berizin, editor FAQ, metrik klik, dan uji CTA nyata.
- T-023–T-041: ingest, jobs, coordinator lintas proses, inbox/operasi sales, AI, Open-WA, serta uji perangkat.
- T-054–T-058: konten nyata, kredensial, backup, pemantauan, penerimaan production, dan indexing.

Tidak ada klaim siap melayani pelanggan nyata. Detail pembatasan rilis ada di [roadmap](roadmap.md).
