import type { Metadata } from "next";
import { AgencyProfile } from "@/modules/site/agency-profile";
import { getPublicFaqs } from "@/modules/knowledge/queries";
import { getSite } from "@/modules/site/queries";

export const metadata: Metadata = {
  title: "Tentang Nusa",
  description: "Mengenal Nusa Property dan pendekatan pencarian hunian di BSD, Alam Sutera, dan Bintaro.",
};

export default async function AboutPage() {
  const [site, faqs] = await Promise.all([getSite(), getPublicFaqs()]);
  return <AgencyProfile phone={site.phone} faqs={faqs} />;
}
