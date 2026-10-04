import type { Metadata } from "next";
import { getEnv } from "@/server/env";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Nusa Property | Ruang baru, cerita berikutnya", template: "%s | Nusa Property" },
  description: "Pratinjau website agensi properti. Cari contoh rumah, apartemen, dan tanah sesuai lokasi serta anggaran.",
  robots: { index: false, follow: false },
  icons: { icon: "/asset/brand/favicon.svg", apple: "/asset/brand/apple-touch-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  getEnv();
  return <html lang="id"><body><a href="#main" className="skip-link">Lewati ke konten</a>{children}</body></html>;
}
