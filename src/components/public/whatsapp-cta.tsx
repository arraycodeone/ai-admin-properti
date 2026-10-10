import { whatsappLink } from "@/lib/whatsapp-link";
import { Icon } from "@/components/ui/icon";

export function WhatsappCta({ phone, code }: { phone: string | null; code?: string }) {
  if (!phone) return <div className="channel-notice"><Icon name="chat"/><div><strong>Konsultasi WhatsApp belum aktif</strong><p>Kanal konsultasi belum terhubung.</p></div></div>;
  return <div className="cta-group"><a className="button" href={whatsappLink(phone, code)} target="_blank" rel="noopener noreferrer"><Icon name="chat"/>{code ? "Tanya properti ini" : "Konsultasi via WhatsApp"}</a><p className="muted small">Lanjutkan ke WhatsApp, lalu tekan Kirim.</p></div>;
}
