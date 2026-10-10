import { beforeEach, expect, it, vi } from "vitest";
import { getInternalFaqs, getPublicFaqs } from "@/modules/knowledge/queries";
import { organizationA } from "@/demo/properties";

const { requireActor, userClient, systemClient } = vi.hoisted(() => ({
  requireActor: vi.fn(), userClient: vi.fn(), systemClient: vi.fn(),
}));
vi.mock("@/server/auth/actor-context", () => ({ requireActor }));
vi.mock("@/server/db/user-client", () => ({ userClient }));
vi.mock("@/server/db/system-client", () => ({ systemClient }));
vi.mock("@/server/env", () => ({ getEnv: () => ({ SITE_ORGANIZATION_ID: organizationA }) }));

function query(data: unknown, error: unknown = null) {
  return {
    from: vi.fn().mockReturnThis(), select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data, error }),
  };
}

beforeEach(() => vi.resetAllMocks());

it("membatasi FAQ publik pada organisasi, status aktif, dan visibilitas publik", async () => {
  const db = query([{ id: "10000000-0000-4000-8000-000000000001", question: "Bagaimana mengatur kunjungan?", answer: "Hubungi tim untuk membuat jadwal.", internal_notes: "PRIVATE" }]);
  systemClient.mockReturnValue(db);
  const rows = await getPublicFaqs();
  expect(db.eq).toHaveBeenCalledWith("organization_id", organizationA);
  expect(db.eq).toHaveBeenCalledWith("visibility", "public");
  expect(db.eq).toHaveBeenCalledWith("is_active", true);
  expect(db.limit).toHaveBeenCalledWith(50);
  expect(rows[0]).not.toHaveProperty("internal_notes");
});

it("memeriksa actor sebelum query FAQ internal dan tidak memakai data pengganti saat gagal", async () => {
  requireActor.mockRejectedValueOnce(new Error("Akses ditolak"));
  await expect(getInternalFaqs()).rejects.toThrow("Akses ditolak");
  expect(userClient).not.toHaveBeenCalled();
  requireActor.mockResolvedValue({ organizationId: organizationA, role: "sales", userId: "sales-a", displayName: "Sales" });
  const db = query(null, { message: "PRIVATE_DATABASE_DETAIL" });
  userClient.mockResolvedValue(db);
  await expect(getInternalFaqs()).rejects.toThrow("FAQ internal belum dapat dimuat.");
  expect(db.eq).toHaveBeenCalledWith("organization_id", organizationA);
});
