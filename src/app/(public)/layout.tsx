import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { getSite } from "@/modules/site/queries";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return <><Header name={site.name}/>{children}<Footer name={site.name}/></>;
}
