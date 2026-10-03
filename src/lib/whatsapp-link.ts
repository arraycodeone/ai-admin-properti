export function whatsappLink(phone: string, code?: string): string {
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error("Nomor WhatsApp harus memakai format E.164.");
  if (code && !/^[A-Z0-9-]{3,24}$/.test(code)) throw new Error("Kode properti tidak valid.");
  const text = code ? `Halo, saya ingin bertanya tentang properti ${code}.` : "Halo, saya ingin berkonsultasi tentang properti.";
  return `https://wa.me/${phone.slice(1)}?text=${encodeURIComponent(text)}`;
}
