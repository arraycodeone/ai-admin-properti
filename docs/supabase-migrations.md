# Migrasi dan tipe database

Issue #4 / T-009 selesai diverifikasi pada 4 Oktober 2026. Target hosted uji dan TLS mengikuti [setup Supabase](supabase-setup.md). Proyek tetap memakai mode aplikasi `preview` sampai seed dan pengujian akses tersedia.

## Membangun proyek uji kosong

Isi `.env.local` sesuai panduan setup: `APP_ENV=test`, URL API/SQL dari proyek yang sama, serta `TEST_DATABASE_CONFIRM_ISOLATED=true`. Koneksi hosted wajib memakai `sslmode=verify-full` dan sertifikat CA yang sesuai. Kredensial tidak menjadi argumen command line.

```powershell
npm.cmd run db:bootstrap -- --check
npm.cmd run db:bootstrap
npm.cmd run db:types
npm.cmd run test:db -- --schema
```

`db:bootstrap` khusus bootstrap proyek kosong. Script menolak tabel/view/sequence/fungsi aplikasi, riwayat migrasi, akun Auth, atau bucket yang sudah ada. Fungsi event trigger bawaan Supabase dan objek extension dipertahankan. Tidak ada reset otomatis atau perintah menghapus schema.

Script menerapkan file `supabase/migrations/` berurutan dalam satu transaksi, mencatat versi/nama/SQL pada `supabase_migrations.schema_migrations`, lalu menjalankan tes schema pada savepoint. Fixture tes selalu dibatalkan. `--check` membatalkan seluruh transaksi termasuk DDL dan riwayat; tanpa flag, hanya schema dan riwayat yang disimpan. Kegagalan membatalkan transaksi.

Pada proyek yang sudah dimigrasi, jalankan `test:db -- --schema` untuk mengulang tes. `db:bootstrap` akan menolak target tersebut; untuk membuktikan bootstrap lagi, gunakan proyek uji kosong lain. Migrasi tambahan pada proyek berisi data harus memakai workflow migrasi berurutan seperti Supabase CLI, bukan bootstrap atau mengedit ulang file yang sudah diterapkan. Struktur riwayat mengikuti kolom CLI (`version`, `name`, `statements`).

Migrasi T-015 `202610110001_listing_management.sql` telah diterapkan secara transaksional dan dicatat pada riwayat **hanya** di proyek uji terisolasi yang dua organisasinya demo dan paused. Aplikasi produksi belum dimigrasi. Sebelum memakai branch T-015 pada lingkungan lain, terapkan migrasi berurutan dengan workflow migrasi yang sesuai, lalu jalankan `db:types`, `test:db -- --schema`, dan tes akses pada target uji tersebut.

## Menghasilkan tipe

`db:types` memakai [generator resmi Supabase](https://github.com/supabase/sdk/tree/main/packages/postgrest-typegen), `@supabase/postgrest-typegen@0.4.0`, dengan `pg` baca saja dan formatter Prettier. Paket generator masih berstatus alpha; versinya dikunci di lockfile. Tidak memerlukan Docker atau token Management API. Metadata hanya schema `public`, diurutkan sebelum ditulis.

- `src/types/database.generated.ts`: hasil introspeksi, jangan diedit manual.
- `src/types/database.ts`: koreksi kontrak wire RPC katalog yang tidak tercermin penuh pada metadata PostgreSQL. Argumen bigint dikirim sebagai string desimal; area yang nullable diperbaiki tipenya.
- Client aplikasi `systemClient`, `userClient`, dan proxy memakai `Database` dari file koreksi tersebut.
- Adapter katalog/internal memvalidasi respons menjadi DTO eksplisit; field tambahan dibuang dan nilai enum tidak dikenal ditolak. Tidak ada fallback fixture ketika database gagal.

Generator memetakan kolom bigint mentah ke `number`. Ini bukan jaminan presisi JavaScript: pembacaan uang harus tetap melalui cast SQL ke text dan DTO string. Jangan mengubah nominal menjadi `Number` untuk menyesuaikan tipe generator. Script seed lama akan ditinjau pada issue #6; generic client aplikasi tidak berarti seed telah terbukti.

## Bukti database nyata

| Pemeriksaan | Hasil 4 Oktober 2026 |
| --- | --- |
| Inspeksi awal | 0 tabel aplikasi, 0 akun Auth, 0 bucket. |
| Bootstrap `--check` | Dua migrasi dan tes schema lulus; seluruh transaksi dibatalkan. |
| Bootstrap permanen | Dua migrasi lulus; riwayat SQL cocok dengan file repository. |
| Schema | 21 tabel public, seluruhnya RLS aktif; bucket `property-media` privat. |
| FK organisasi | Referensi properti lintas organisasi ditolak pada lead dan detail privat. |
| Nominal | Harga negatif dan budget terbalik ditolak; `9007199254740993` tetap string tepat pada RPC. |
| Survei | Interval kosong dan jadwal confirmed yang bertumpuk ditolak; jadwal bersebelahan diterima. |
| Unique key | Kode properti dan provider message ID duplikat ditolak. |
| Default akses | Anon tanpa akses tabel; authenticated tanpa mutasi langsung; helper/RPC yang tidak diizinkan tertutup. Organisasi paused, percakapan human, listing draft. |
| DTO | Field publik sesuai allowlist; draft tidak keluar; filter budget besar presisi. |
| HTTP RPC | Argumen budget string `9223372036854775807` diterima (HTTP 200); hasil kosong karena belum seed. |
| Sesudah rollback fixture | 0 organisasi dan 0 akun Auth; tidak ada seed yang tersimpan. |
| Guard bootstrap ulang | Menolak schema yang sudah ada, tanpa reset. |

Percobaan pertama menemukan grant bawaan Supabase untuk `anon` pada helper fungsi. Sebelum penerapan permanen, migrasi diperbaiki untuk mencabut grant eksplisit dari `public`, `anon`, dan `authenticated`, lalu hanya memberi kembali grant yang diperlukan. `btree_gist` ditempatkan di schema `extensions`.

`npm.cmd run test:db` tanpa flag belum dapat menjalankan suite berseed dan menghasilkan `NOT RUN: fixture seed belum siap`. Ini tidak dihitung sebagai lulus. Pemeriksaan actor/RLS lengkap, seed dua kali, serta login pengguna tetap berada pada issue #5, #6, #8, dan #9.
