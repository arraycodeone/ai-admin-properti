import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPublicProperties } from "@/modules/properties/queries";
import { organizationA, properties } from "@/demo/properties";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/server/env", () => ({ getEnv: () => ({ APP_MODE: "supabase", SITE_ORGANIZATION_ID: "10000000-0000-4000-8000-000000000001" }) }));
vi.mock("@/server/db/system-client", () => ({ systemClient: () => ({ rpc }) }));

beforeEach(() => vi.resetAllMocks());

describe("adapter katalog dengan tipe database", () => {
  it("menjaga bigint sebagai string, menerima area null, dan membatasi DTO publik", async () => {
    rpc.mockResolvedValue({ data: [{ ...properties[0], price_rupiah: "9007199254740993", land_area_m2: null, building_area_m2: null, internal_notes: "PRIVATE_MARKER" }], error: null });
    const rows = await getPublicProperties({ budget: "9223372036854775807" });
    expect(rpc).toHaveBeenCalledWith("search_public_properties", expect.objectContaining({ p_organization_id: organizationA, p_budget: "9223372036854775807" }));
    expect(rows[0].price_rupiah).toBe("9007199254740993");
    expect(rows[0].land_area_m2).toBeNull();
    expect(rows[0].building_area_m2).toBeNull();
    expect(rows[0]).not.toHaveProperty("organization_id");
    expect(rows[0]).not.toHaveProperty("internal_notes");
    expect(rows[0]).not.toHaveProperty("publication_status");
    expect(rows[0]).not.toHaveProperty("media");
  });

  it.each([
    { data: [{ ...properties[0], property_type: "unknown" }], error: null },
    { data: [{ ...properties[0], price_rupiah: 9007199254740992 }], error: null },
    { data: null, error: { message: "PRIVATE_DATABASE_DETAIL" } },
  ])("menolak respons tidak sesuai tanpa fallback atau detail internal", async result => {
    rpc.mockResolvedValue(result);
    await expect(getPublicProperties()).rejects.toThrow(new Error("Katalog belum dapat dimuat. Silakan coba kembali."));
  });
});
