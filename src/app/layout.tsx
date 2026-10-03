import type { Metadata } from "next";
import { getEnv } from "@/server/env";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Ruang Properti | Temukan ruang untuk pulang", template: "%s | Ruang Properti" },
  description: "Pratinjau website agensi properti. Cari contoh rumah, apartemen, dan tanah sesuai lokasi serta anggaran.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  getEnv();
  return <html lang="id"><body><a href="#main" className="skip-link">Lewati ke konten</a>{children}</body></html>;
}
