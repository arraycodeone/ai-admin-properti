import type { Metadata } from "next";
import { AgencyProfile } from "@/modules/site/agency-profile";
import { getSite } from "@/modules/site/queries";

export const metadata: Metadata = {
  title: "Tentang Nusa",
  description: "Mengenal Nusa Property dan pendekatan pencarian hunian di BSD, Alam Sutera, dan Bintaro. Profil agensi demo.",
};

export default async function AboutPage() {
  const site = await getSite();
  return <AgencyProfile phone={site.phone} />;
}
