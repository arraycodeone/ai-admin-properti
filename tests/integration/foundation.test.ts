import { describe, expect, it } from "vitest";
import { parseConfig } from "@/server/config";
import { parseRupiah, formatRupiah } from "@/lib/money";
import { jakartaDay } from "@/lib/time";
import { whatsappLink } from "@/lib/whatsapp-link";
import { searchProperties } from "@/modules/properties/service";
import { filterSchema, propertySchema, propertyInputSchema } from "@/modules/properties/schemas";
import { canReadLead, requireOwner } from "@/server/auth/permissions";
import { organizationA, organizationB, properties, privateMarker } from "@/demo/properties";

describe("katalog publik", () => {
  it("memilih rumah Dimas tanpa melewati tenant, publikasi, anggaran, atau jumlah kamar", () => {
    const rows = searchProperties(properties, organizationA, { location: "bsd", budget: "2000000000", bedrooms: 2, type: "house" });
    expect(rows.map(row => row.public_code)).toEqual(["NUSA-001", "NUSA-003"]);
    expect(searchProperties(properties, organizationA, { budget: "100000000" })).toEqual([]);
  });
  it("menghasilkan DTO allowlist walaupun row sumber membawa field privat tambahan", () => {
    const contaminated = properties.map(row => ({ ...row, owner_name: privateMarker, secret: "do-not-expose" }));
    const serialized = JSON.stringify(searchProperties(contaminated, organizationA));
    expect(serialized).not.toMatch(/PRIVATE_OWNER|do-not-expose|organization_id|published_at|AGB-001|BKS-006|BKS-007|BKS-008/);
  });
  it("menampilkan perubahan harga dan penarikan listing pada pembacaan berikutnya", () => {
    const changed = properties.map(row => row.public_code === "NUSA-001" ? { ...row, price_rupiah: "2100000000" } : row);
    expect(searchProperties(changed, organizationA, { budget: "2000000000", bedrooms: 2, location: "BSD" }).map(row => row.public_code)).toEqual(["NUSA-003"]);
    changed[0] = { ...changed[0], availability: "paused" };
    expect(searchProperties(changed, organizationA).some(row => row.public_code === "NUSA-001")).toBe(false);
  });
  it("memperlakukan teks pencarian sebagai data", () => {
    expect(searchProperties(properties, organizationA, { location: "%' OR true --" })).toEqual([]);
    expect(searchProperties(properties, organizationB).map(row => row.public_code)).toEqual(["AGB-001"]);
  });
  it("menolak filter tidak sah dan nominal listing tidak valid", () => {
    expect(filterSchema.safeParse({ budget: "-1" }).success).toBe(false);
    expect(filterSchema.safeParse({ bedrooms: "1.5" }).success).toBe(false);
    expect(filterSchema.safeParse({ type: "other" }).success).toBe(false);
    expect(propertySchema.safeParse({ ...properties[0], price_rupiah: "650.000.000" }).success).toBe(false);
  });
  it("memvalidasi formulir owner tanpa mengubah rupiah menjadi Number", () => {
    const input = {
      ...properties[0], price_rupiah: "9007199254740993",
      public_address: "", land_area_m2: "120.50", building_area_m2: "",
      owner_name: "", owner_phone_e164: "+628123456789", exact_address: "", internal_notes: "",
    };
    const parsed = propertyInputSchema.parse(input);
    expect(parsed.price_rupiah).toBe("9007199254740993");
    expect(parsed.land_area_m2).toBe("120.50");
    expect(parsed.building_area_m2).toBeNull();
    for (const price of ["-1", "1.5", "9223372036854775808"]) {
      expect(propertyInputSchema.safeParse({ ...input, price_rupiah: price }).success).toBe(false);
    }
    expect(propertyInputSchema.safeParse({ ...input, land_area_m2: "0.00" }).success).toBe(false);
    expect(propertyInputSchema.safeParse({ ...input, amenities: Array(21).fill("A") }).success).toBe(false);
    expect(propertyInputSchema.safeParse({ ...input, owner_phone_e164: "08123" }).success).toBe(false);
  });
});

describe("uang, waktu, dan CTA", () => {
  it("mempertahankan bigint di atas batas aman Number", () => {
    expect(parseRupiah("9007199254740993")).toBe(9007199254740993n);
    expect(formatRupiah("9007199254740993")).toContain("9.007.199.254.740.993");
    expect(() => parseRupiah("9223372036854775808")).toThrow();
    for (const value of ["-1", "1e6", "1.2", "", "Rp700000000"]) expect(() => parseRupiah(value)).toThrow();
  });
  it("menghitung pergantian hari menggunakan WIB", () => {
    expect(jakartaDay("2026-10-03T16:59:59Z")).toBe("2026-10-03");
    expect(jakartaDay("2026-10-03T17:00:00Z")).toBe("2026-10-04");
  });
  it("hanya menyusun link, dengan encoding benar dan validasi nomor/kode", () => {
    const url = new URL(whatsappLink("+12025550123", "NUSA-001"));
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/12025550123");
    expect(url.searchParams.get("text")).toBe("Halo, saya ingin bertanya tentang properti NUSA-001.");
    expect(() => whatsappLink("08123", "NUSA-001")).toThrow();
    expect(() => whatsappLink("+12025550123", "<script>")).toThrow();
  });
});

describe("konfigurasi dan izin", () => {
  it("preview dipilih secara eksplisit atau menjadi default lokal; konfigurasi live gagal tertutup", () => {
    expect(parseConfig({}).APP_MODE).toBe("preview");
    expect(() => parseConfig({ APP_MODE: "supabase" })).toThrow(/Konfigurasi wajib/);
    expect(() => parseConfig({ APP_MODE: "typo" })).toThrow();
    expect(() => parseConfig({ APP_ENV: "production" })).toThrow(/produksi/);
    expect(() => parseConfig({ SITE_URL: "https://secret:password@example.com" })).toThrow(/origin/);
  });
  it("pesan kegagalan konfigurasi tidak memuat nilai rahasia", () => {
    try { parseConfig({ APP_MODE: "supabase", SUPABASE_SECRET_KEY: "SECRET_TEST_MARKER" }); }
    catch (error) { expect(String(error)).not.toContain("SECRET_TEST_MARKER"); }
  });
  it("owner dan sales tetap dibatasi organisasi dan assignment", () => {
    const sales = { userId: "andi", organizationId: organizationA, role: "sales" as const, displayName: "Andi" };
    const lead = { organization_id: organizationA, assigned_user_id: "andi" };
    expect(canReadLead(sales, lead)).toBe(true);
    expect(canReadLead(sales, { ...lead, assigned_user_id: "sari" })).toBe(false);
    expect(canReadLead({ ...sales, role: "owner" }, { ...lead, organization_id: organizationB })).toBe(false);
    expect(() => requireOwner(sales)).toThrow();
  });
});
