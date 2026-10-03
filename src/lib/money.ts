const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export function parseRupiah(value: string): bigint {
  if (!/^\d{1,19}$/.test(value)) throw new Error("Nominal harus berupa rupiah bulat nonnegatif.");
  const amount = BigInt(value);
  if (amount > 9223372036854775807n) throw new Error("Nominal melebihi batas database.");
  return amount;
}

export function formatRupiah(value: string): string {
  return rupiah.format(parseRupiah(value));
}
