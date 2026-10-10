# Migrasi Supabase

Migrasi berurutan ada di `supabase/migrations/`: fondasi, akses baca/RLS, dan editor listing T-015. Migrasi editor sudah diterapkan **hanya** pada target uji terisolasi. Belum ada migrasi production.

`npm.cmd run db:bootstrap` hanya menerima proyek uji kosong yang identitas API/SQL serta TLS-nya lolos guard; script menolak target berisi tabel, akun, atau bucket. Untuk target yang sudah bermigrasi, terapkan file baru melalui workflow migrasi transaksional yang diaudit; jangan menjalankan bootstrap atau reset ulang. Sesudah migrasi, jalankan `npm.cmd run db:types`, typecheck, `test:db`, dan `test:access` pada target uji yang sama.

Konfigurasi koneksi dan konfirmasi isolasi ada di [setup Supabase](supabase-setup.md). [Bukti migrasi awal](archive/supabase-migrations-before-nusa-direction.md) tetap tersedia.
