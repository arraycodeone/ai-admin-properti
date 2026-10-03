# Panduan kerja proyek

## Konteks

- Satu aplikasi Next.js App Router, TypeScript, React, Tailwind, dan Supabase.
- Bahasa tampilan Indonesia, rupiah berbentuk bigint/string, waktu Asia/Jakarta.
- Mode `preview` memakai data sintetis; mode `supabase` memakai database.
- Website, katalog, login, dan preview tersedia. AI, WhatsApp, jobs, serta CRUD bisnis masih backlog.
- Baca `README.md` untuk menjalankan aplikasi dan `docs/architecture.md` untuk alur kode.

## Cari file berdasarkan tugas

| Tugas | Lokasi awal |
| --- | --- |
| Route, layout, metadata, loading, error | `src/app/` |
| Filter, validasi, query, kartu properti | `src/modules/properties/` |
| Ringkasan dan preview dashboard | `src/modules/dashboard/` |
| Profil agensi dan kanal publik | `src/modules/site/` |
| Komponen umum, header/footer, navigasi | `src/components/` |
| Identitas, sesi, dan izin | `src/server/auth/` |
| Client database dan konfigurasi | `src/server/db/`, `src/server/config.ts`, `src/server/env.ts` |
| Format uang, waktu, URL WhatsApp | `src/lib/` |
| Data sintetis untuk preview/seed | `src/demo/` |
| Migrasi dan tes akses database | `supabase/migrations/`, `supabase/tests/` |
| Tes logika dan alur browser | `tests/integration/`, `tests/e2e/` |
| Aset web / sumber gambar | `public/asset/` / `assets-source/` |

## Aturan perubahan

- Pertahankan nama `modules`; kelompokkan kode berdasarkan fitur yang ada.
- `app` menyusun halaman; query dan aturan bisnis berada di modul terkait.
- `components` untuk tampilan bersama; komponen khusus fitur tinggal di modulnya.
- `lib` berisi helper murni tanpa koneksi database atau secret.
- Kode aplikasi dan script tidak mengimpor dari `tests`; tes boleh memakai `src/demo`.
- Gunakan alias `@/` untuk import lintas folder di `src`, relatif untuk file satu modul.
- File pembaca database memakai `server-only`. Server Actions memakai `use server`.
- Query dashboard memverifikasi actor dan memakai `userClient` agar RLS tetap berlaku.
- `systemClient` hanya untuk operasi terkontrol dengan scope organisasi dan DTO publik.
- Pertahankan validasi, otorisasi, dan filter organisasi saat memindahkan kode.
- Pisahkan export server dari kode client. Jangan membuat barrel yang mencampur keduanya.
- Buat folder/lapisan baru hanya ketika ada kode yang membutuhkannya.
- Tulis JSX multiline agar perubahan mudah dibaca; jangan gabungkan satu halaman ke satu baris.

## Dokumen sesuai kebutuhan

- Desain aktif: `DESIGN.md`; database: `docs/database.md`; aktor: `docs/business.md`.
- Rencana: `docs/roadmap.md`; task: `docs/backlog.md`; hasil aktual: `docs/implementation-status.md`.
- Pertahankan ID task ketika memperbarui backlog dan status.
- `docs/archive/` adalah sejarah, bukan acuan desain aktif.
- Paket Nusa Property belum dipetakan ke katalog Ruang Properti; jangan mengganti identitas/listing secara implisit.
- Cari dengan `rg` pada folder terkait. Baca arsip, prompt gambar, dan seluruh backlog hanya bila tugas memerlukannya.
- Jangan memindai dependensi, hasil build, atau laporan tes sebagai sumber implementasi.

## Pemeriksaan

- Node 24 dipakai pada verifikasi lokal; satu package manager: npm, satu `package-lock.json`.
- Windows: `npm.cmd run dev`; shell lain: `npm run dev`.
- Setelah perubahan kode: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test`.
- Untuk perubahan route/import/UI: `npm.cmd run build`, lalu `npm.cmd run test:e2e`.
- Playwright memakai port 3100; jangan memakai ulang atau menghentikan dev server pengguna.
- Perubahan warna: `node scripts/check-design.mjs`.
- Perubahan database: `npm.cmd run test:db` hanya pada target uji terisolasi yang dikonfigurasi.
- Laporkan pemeriksaan yang tidak dijalankan; fixture/mock tidak membuktikan Auth atau RLS nyata.
- Jangan menjalankan seed tanpa target uji dan konfirmasi isolasi yang disyaratkan script.
- Ikuti `docs/git-workflow.md`; jangan memasukkan secret, hasil build, atau laporan sementara ke Git.
