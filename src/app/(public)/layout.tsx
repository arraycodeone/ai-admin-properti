import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { getSite } from "@/modules/site/queries";
import localFont from "next/font/local";
import { PublicExperience } from "@/components/public/public-experience";

const displayFont = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/CormorantGaramond-500Italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-nusa-display",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
const bodyFont = localFont({
  src: "./fonts/Manrope-Latin.woff2",
  weight: "400 600",
  variable: "--font-nusa-body",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <PublicExperience className={`${displayFont.variable} ${bodyFont.variable}`}>
      <noscript><style>{`.menu-toggle { display: none; } .site-header nav { display: flex; flex-wrap: wrap; }`}</style></noscript>
      <Header name={site.name} />
      {children}
      <Footer name={site.name} />
    </PublicExperience>
  );
}
