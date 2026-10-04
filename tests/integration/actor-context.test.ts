import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireActor } from "@/server/auth/actor-context";

const { getEnv, userClient, getUser, query } = vi.hoisted(() => ({
  getEnv: vi.fn(), userClient: vi.fn(), getUser: vi.fn(),
  query: { select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn() },
}));
vi.mock("@/server/env", () => ({ getEnv }));
vi.mock("@/server/db/user-client", () => ({ userClient }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`redirect:${path}`); } }));

beforeEach(() => {
  vi.resetAllMocks();
  getEnv.mockReturnValue({ APP_MODE: "supabase", SITE_ORGANIZATION_ID: "trusted-org" });
  getUser.mockResolvedValue({ data: { user: { id: "verified-user", user_metadata: { role: "owner", organization_id: "forged-org" } } }, error: null });
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.maybeSingle.mockResolvedValue({ data: { role: "sales", display_name: "Sales" }, error: null });
  userClient.mockResolvedValue({ auth: { getUser }, from: vi.fn(() => query) });
});

describe("actor server", () => {
  it("mengambil identitas dari Auth dan role dari membership aktif organisasi server", async () => {
    await expect(requireActor()).resolves.toEqual({ userId: "verified-user", organizationId: "trusted-org", role: "sales", displayName: "Sales" });
    expect(getUser).toHaveBeenCalledOnce();
    expect(query.eq.mock.calls).toEqual([["organization_id", "trusted-org"], ["user_id", "verified-user"], ["is_active", true]]);
  });

  it("menolak preview sebelum membuka client", async () => {
    getEnv.mockReturnValue({ APP_MODE: "preview" });
    await expect(requireActor()).rejects.toThrow("redirect:/login");
    expect(userClient).not.toHaveBeenCalled();
  });

  it.each([null, { message: "expired" }])("menolak sesi kosong atau gagal sebelum membaca membership", async error => {
    getUser.mockResolvedValue({ data: { user: null }, error });
    await expect(requireActor()).rejects.toThrow("redirect:/login");
    expect(query.select).not.toHaveBeenCalled();
  });

  it.each([null, { role: "admin", display_name: "Invalid" }])("menolak membership tidak aktif, berbeda organisasi, atau role tidak sah", async data => {
    query.maybeSingle.mockResolvedValue({ data, error: null });
    await expect(requireActor()).rejects.toThrow("redirect:/login?error=membership");
  });

  it("gagal tertutup tanpa membocorkan error database", async () => {
    query.maybeSingle.mockResolvedValue({ data: null, error: { message: "PRIVATE_DATABASE_DETAIL" } });
    await expect(requireActor()).rejects.toThrow(new Error("Tidak dapat memeriksa akses. Silakan coba lagi."));
  });
});
