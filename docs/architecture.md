# Arsitektur yang tersedia

Diperbarui 4 Oktober 2026. Dokumen ini menjelaskan kode yang ada. Target AI, WhatsApp, jobs, dan operasi sales berada di [roadmap](roadmap.md) dan [backlog](backlog.md). Hasil implementasi dan keterbatasannya ada di [status](implementation-status.md).

## Peta folder

```text
src/
  app/                  Route, layout, metadata, loading, dan error Next.js
    (public)/           Website, katalog, detail, tentang, privasi, font lokal
    (auth)/login/       Halaman login
    app/                Dashboard berizin pada URL /app
  modules/
    properties/         Filter, DTO, aturan katalog, query publik/internal, kartu
    dashboard/          Query ringkasan internal
    site/               Profil agensi, konten/kartu kawasan bersama, kanal publik
  components/
    ui/                 Ikon umum
    public/             Header, footer, CTA
    admin/              Form login dan sidebar
  server/
    auth/               Actor, sesi, helper izin
    db/                 Client sesi pengguna dan client sistem
    config.ts           Parser konfigurasi tanpa pembacaan environment
    env.ts              Pembacaan environment khusus server
  lib/                  Helper murni untuk uang, waktu, dan link WhatsApp
  demo/                 Data sintetis bersama untuk preview, seed, dan tes
  types/                Tipe database generated dan koreksi kontrak wire RPC
  proxy.ts              Refresh sesi Supabase
public/asset/           Gambar demo dan brand siap dilayani sebagai URL /asset/*
assets-source/          PNG asli, metadata paket, prompt, dan lembar pratinjau
scripts/                Bootstrap database uji, generation tipe, seed, dan pemeriksaan
supabase/migrations/    Migrasi SQL berurutan
supabase/tests/         Tes SQL akses dan integritas
tests/integration/     Tes logika lokal; tidak membutuhkan layanan eksternal
tests/e2e/             Alur browser desktop/mobile
tests/fixtures/        Skenario khusus tes/evaluasi AI
docs/                  Arsitektur, bisnis, database, rencana, status, dan bukti
docs/archive/          Rancangan yang sudah digantikan
```

`src/app/app/` disengaja: `app` pertama adalah direktori routing, `app` kedua adalah segmen URL. Route group `(public)` dan `(auth)` tidak menambah segmen URL. Konfigurasi framework dan alat pengujian tetap di root.

## Alur data

- Katalog: halaman publik → `modules/properties/queries.ts` → validasi filter → data `demo` dan filter murni pada mode preview, atau RPC Supabase pada mode database → DTO publik.
- Detail: `getPublicProperty` membaca katalog yang sudah dibatasi lalu memilih slug. Listing draft, nonaktif, atau organisasi lain tidak menjadi hasil publik.
- Profil: `modules/site/queries.ts` membaca profil sintetis atau `site_settings` dan kanal siap milik organisasi website.
- Dashboard internal: halaman → query modul → `requireActor()` → `userClient()` → query dengan scope organisasi. Query ringkasan mengembalikan actor terverifikasi beserta jumlah listing.
- Login/logout: form/sidebar → Server Actions `server/auth/session.ts`. `proxy.ts` membantu refresh sesi; izin tetap diverifikasi saat data dibaca.
- Halaman `/tentang`: route membaca kanal melalui `getSite()`, lalu menyusun `AgencyProfile`. Konten pendekatan dan kawasan berada di modul site; kawasan dipakai bersama dengan landing.
- Presentasi publik: `PublicExperience` mengatur modalitas fokus, reveal sekali per kunjungan, dan parallax foto melalui IntersectionObserver/Web Animations/rAF. Data tetap di server. Font berlisensi berada di `(public)/fonts` dan dilayani lokal.
- Seed: `scripts/seed-demo.ts` memakai data `src/demo/` setelah guard target uji. Tes menggunakan data yang sama dan fixture tambahan sesuai skenario.

## Batas tanggung jawab

| Lokasi | Aturan |
| --- | --- |
| `app` | Menyusun halaman dan routing; query bisnis berada di modul terkait. |
| `modules` | Menyimpan komponen, validasi, tipe, query, dan logika fitur. Tidak semua modul perlu semua jenis file. |
| `components` | Tampilan bersama; komponen client tidak mengimpor client database atau secret. |
| `server` | Infrastruktur server, identitas, konfigurasi, koneksi database. |
| `lib` | Helper murni yang aman dibagikan antara server dan client. |
| `demo` | Data sintetis, tanpa secret atau koneksi layanan; bukan data pelanggan nyata. |
| `tests` | Memakai kode aplikasi; aplikasi dan script tidak bergantung pada folder ini. |

Query database ditandai `server-only`. Query internal memverifikasi actor sendiri dan menggunakan client sesi agar RLS ikut berlaku. Client sistem untuk katalog publik memakai organisasi dari konfigurasi server serta RPC/DTO yang membatasi field. Tidak ada fallback ke data demo bila Supabase gagal. Ketentuan database lengkap ada di [database.md](database.md).

Route `/preview` dan komponen dashboard sintetisnya dihapus. Fixture prospek tetap digunakan seed/tes. `/login` dan `/app` tidak ditautkan dari HTML publik; autentikasi dan membership tetap wajib untuk dashboard. Layout publik tidak memakai `loading.tsx`/Suspense yang menyembunyikan HTML akhir di balik script streaming, sehingga kunjungan tanpa JavaScript memperoleh konten dan formulir GET lengkap. Loading dashboard, error boundary, empty state, dan not-found tetap tersedia.

Client aplikasi memakai tipe dari `src/types/database.ts`, yang memperbaiki bigint input dan nullability RPC dari hasil generator. `database.generated.ts` hanya diperbarui melalui `npm.cmd run db:types`. Adapter query memvalidasi respons menjadi DTO publik/internal. Bootstrap dan batas pengujian dijelaskan di [panduan migrasi](supabase-migrations.md).

Gunakan import langsung dengan alias `@/` untuk lintas folder `src`, dan import relatif di dalam satu modul. Hindari barrel export yang mencampur kode server dan browser. Pertahankan `properties/service.ts` sebagai fungsi murni yang bisa diuji tanpa database.

## Data dan aset

`src/demo/` mempertahankan ID dua organisasi, dua puluh FAQ, dan empat prospek. Katalog memiliki sepuluh listing Nusa dan empat fixture akses (draft, paused, sold, organisasi B); UUID fixture akses tetap. Marker sintetis untuk menguji field privat juga dipakai seed. `tests/fixtures/ai-scenarios.json` tetap khusus evaluasi.

`public/asset/` berisi gambar demo Nusa Property dengan URL `/asset/...`. `assets-source/` memuat PNG asli, prompt, metadata, serta bukti pembuatan. Metadata listing dipakai fixture preview; media opsional (cover dan galeri) ditambahkan query setelah filter/DTO publik, khusus mode preview. Respons database tidak diberi media sintetis. Lihat [petunjuk aset](../assets-source/README.md). Foto produksi yang memerlukan pencabutan akses tetap mengikuti rancangan Storage privat.

## Menambah fitur

Mulai dari modul yang sudah ada. Tambahkan modul seperti `leads` atau `inbox` saat task implementasinya dikerjakan; jangan membuat folder kosong dari roadmap. Tambahkan action, service, repository, atau adapter hanya saat ada tanggung jawab nyata yang perlu dipisahkan.

[README](../README.md) memuat cara menjalankan dan menguji. [AGENTS.md](../AGENTS.md) menyediakan peta tugas singkat. [Rancangan struktur sebelumnya](archive/architecture-plan.md) disimpan untuk menelusuri keputusan lama, bukan sebagai daftar kode yang sudah tersedia.
