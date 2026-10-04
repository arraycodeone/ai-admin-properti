import "server-only";
import { getEnv } from "@/server/env";
import { systemClient } from "@/server/db/system-client";

export async function getSite() {
  const env = getEnv();
  if (env.APP_MODE === "preview") return { name: "Nusa Property", phone: null as string | null, preview: true };
  const db = systemClient();
  const { data, error } = await db.from("site_settings").select("brand_name, cta_channel_id")
    .eq("organization_id", env.SITE_ORGANIZATION_ID).single();
  if (error) throw new Error("Profil agensi belum dapat dimuat.");
  let phone: string | null = null;
  if (data.cta_channel_id) {
    const { data: channel, error: channelError } = await db.from("channels").select("public_phone_e164")
      .eq("organization_id", env.SITE_ORGANIZATION_ID).eq("id", data.cta_channel_id)
      .eq("kind", "whatsapp").eq("status", "ready").maybeSingle();
    if (channelError) throw new Error("Kanal konsultasi belum dapat dimuat.");
    phone = channel?.public_phone_e164 ?? null;
  }
  return { name: data.brand_name, phone, preview: false };
}
