import { notFound } from "next/navigation";
import { getEnv } from "@/server/env";
import { PreviewDashboard } from "@/modules/dashboard/components/preview-dashboard";

export const dynamic = "force-dynamic";

export default function Preview() {
  if (getEnv().APP_MODE !== "preview") notFound();
  return <PreviewDashboard/>;
}
