# Verifikasi actor dan akses Supabase

Issue #5 / T-010. Jalankan `npm.cmd run test:access` pada proyek uji yang sudah dimigrasi. Perintah terpisah dari `npm.cmd test` dan CI biasa karena memakai Auth serta Data API nyata.

## Target dan fixture

Konfigurasi mengikuti [setup Supabase](supabase-setup.md): `APP_ENV=test`, `TEST_DATABASE_CONFIRM_ISOLATED=true`, URL API/SQL proyek yang sama, publishable key, secret key, dan TLS hosted terverifikasi. Organisasi yang sudah ada harus demo dan processing paused. Mode aplikasi tidak perlu diubah dari preview.

Runner membuat lima akun sementara dengan Auth Admin, password acak dalam memori, dua organisasi UUID acak, dua properti, tiga kontak dan tiga lead. Akun menggunakan email `access-<run UUID>-<index>@example.test` dan metadata admin `access_test_run`. Tidak menjalankan seed, mengirim email, atau mengubah akun demo yang sudah ada.

SQL privileged hanya menyiapkan/membersihkan fixture, mengaudit grant, dan menonaktifkan membership uji untuk memeriksa pencabutan akses. Setiap pemeriksaan akses memakai client publishable key dan sesi hasil login password akun terkait; anon memakai client tanpa sesi. Tidak memakai service key untuk skenario owner/sales/anon.

## Cakupan

- Audit RLS/grant 21 tabel; fungsi helper, trigger, dan RPC katalog memiliki grant serta search path yang sesuai.
- Owner A/B hanya membaca organisasi sendiri; Andi/Sari hanya membaca lead dan kontak masing-masing; akun nonaktif tidak membaca data bisnis.
- Kontak pemilik unit hanya terbaca owner organisasinya. Manipulasi ID lead organisasi lain tidak menghasilkan baris.
- Query membership dibatasi user Auth, organisasi situs dan status aktif. Tes lokal `actor-context.test.ts` menguji kontrak `requireActor`, termasuk penolakan sesi, metadata role/organisasi palsu, dan error database.
- Insert membership, update role/assignment/organisasi, delete lead, serta RPC katalog langsung ditolak bagi seluruh akun.
- Anon ditolak pada 21 tabel dan tiga RPC pembaca. Bucket `property-media` privat, tanpa policy objek; listing objek oleh akun tidak menghasilkan data.
- Sesi sales yang masih valid kehilangan akses setelah membership dinonaktifkan.

Belum membuktikan login/logout browser, refresh/kedaluwarsa sesi, atau perpindahan akun pada UI (#8). Seed berulang tetap #6. Matriks seluruh operasi dan tabel berisi fixture, upload/download/pencabutan cache aset, serta RPC mutasi bisnis yang belum tersedia tetap #9/T-016. Audit grant tidak menggantikan pengujian fitur tersebut.

## Cleanup dan kegagalan

Blok `finally` membatalkan transaksi yang belum selesai, menghapus data hanya dari dua UUID organisasi milik run, lalu menghapus akun Auth yang dibuat run. Kegagalan cleanup membuat exit code nonzero dan mencetak UUID run tanpa secret. Error pengujian hanya mencetak tahap, tanpa respons layanan/token/password.

Jika proses dihentikan paksa atau request pembuatan akun kehilangan respons, cleanup mungkin tidak lengkap. Pada proyek uji yang sama, cocokkan slug `access-<run>-0/1` serta email/metadata akun dengan run sebelum pemulihan. Hapus hanya fixture run dalam urutan lead, kontak, detail privat, properti, membership, organisasi, lalu akun melalui Auth Admin. Jangan memakai reset schema atau menghapus akun berdasarkan nama tampilan. Akun yang belum tercatat dalam respons tetap dapat dikenali dari metadata `access_test_run`.

Referensi: [RLS dan grant Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security), [Auth Admin createUser](https://supabase.com/docs/reference/javascript/auth-admin-createuser), [akses Storage](https://supabase.com/docs/guides/storage/security/access-control).
