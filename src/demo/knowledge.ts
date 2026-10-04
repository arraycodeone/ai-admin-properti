import { organizationA, organizationB } from "./properties";

const entries = [
  ["Bagaimana mengajukan survei rumah?", "Sampaikan kode properti dan waktu yang diinginkan. Sales memeriksa ketersediaan sebelum mengonfirmasi."],
  ["Apakah permintaan survei langsung dikonfirmasi?", "Belum. Jadwal baru pasti setelah konfirmasi sales."],
  ["Apakah harga masih dapat dinegosiasikan?", "Sampaikan penawaran kepada sales. Keputusan memerlukan persetujuan pihak yang berwenang."],
  ["Bagaimana menanyakan rumah NUSA-001?", "Sebutkan kode NUSA-001 saat berbicara dengan tim."],
  ["Apakah rumah dalam katalog ini nyata?", "Tidak. Katalog demo menggunakan data sintetis untuk pengujian."],
  ["Apakah tersedia rumah di BSD?", "Katalog demo memuat contoh properti di BSD, Alam Sutera, dan Bintaro. Gunakan filter lokasi."],
  ["Bagaimana mencari rumah sesuai anggaran?", "Isi anggaran maksimum dalam filter katalog atau sampaikan kebutuhan kepada sales."],
  ["Dapatkah saya meminta dua kamar?", "Gunakan filter minimal kamar atau sampaikan jumlah kamar yang dibutuhkan."],
  ["Apakah pelanggan perlu akun?", "Tidak. Pelanggan berkomunikasi melalui WhatsApp setelah kanal tersedia."],
  ["Apakah tombol WhatsApp langsung mengirim pesan?", "Tidak. Anda tetap perlu menekan Kirim di WhatsApp."],
  ["Apakah biaya tambahan sudah termasuk harga?", "Rincian biaya perlu dikonfirmasi kepada sales untuk properti yang diminati."],
  ["Apakah pengajuan KPR pasti diterima?", "Tidak ada jaminan persetujuan. Persyaratan diperiksa oleh bank terkait."],
  ["Bagaimana mengganti jadwal survei?", "Sampaikan permintaan waktu baru. Sales akan memeriksa dan mengonfirmasi ulang."],
  ["Bagaimana membatalkan survei?", "Hubungi sales agar pembatalan dan alasannya dicatat."],
  ["Dapatkah saya berbicara dengan manusia?", "Sampaikan permintaan untuk berbicara dengan sales."],
  ["Bagaimana jika tidak ada properti yang cocok?", "Ubah filter atau sampaikan alternatif lokasi dan anggaran kepada sales."],
  ["Apakah kunjungan yang terlewat dianggap selesai?", "Tidak. Sales mencatat hasil kunjungan atau alasan pembatalan."],
  ["Bisakah saya menghubungi pemilik unit langsung?", "Kontak pemilik unit bersifat internal. Pertanyaan disampaikan melalui sales."],
  ["Catatan FAQ nonaktif", "FIXTURE_INACTIVE_FAQ"],
  ["FAQ agensi B", "FIXTURE_OTHER_TENANT_FAQ"],
];

export const knowledge = entries.map(([question, answer], index) => ({
  id: `30000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  organization_id: index === 19 ? organizationB : organizationA,
  question, answer, visibility: "public", is_active: index !== 18,
}));
