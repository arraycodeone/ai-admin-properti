import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDashboardSummary } from "@/modules/dashboard/queries";
import { getInternalProperties } from "@/modules/properties/queries";
import { organizationB } from "@/demo/properties";

const { requireActor, userClient } = vi.hoisted(() => ({
  requireActor: vi.fn(),
  userClient: vi.fn(),
}));

vi.mock("@/server/auth/actor-context", () => ({ requireActor }));
vi.mock("@/server/db/user-client", () => ({ userClient }));

const actor = { userId: "owner-b", organizationId: organizationB, role: "owner", displayName: "Owner B" };

beforeEach(() => {
  vi.resetAllMocks();
  requireActor.mockResolvedValue(actor);
});

describe.each([
  ["ringkasan", getDashboardSummary, "Ringkasan belum dapat dimuat."],
  ["katalog internal", getInternalProperties, "Properti internal belum dapat dimuat."],
] as const)("query %s", (_name, read, errorMessage) => {
  it("menolak pembacaan tanpa actor sebelum membuka client database", async () => {
    requireActor.mockRejectedValue(new Error("Akses ditolak"));
    await expect(read()).rejects.toThrow("Akses ditolak");
    expect(userClient).not.toHaveBeenCalled();
  });

  it("membatasi pembacaan ke organisasi actor, termasuk organisasi B", async () => {
    const result = { data: [], count: 1, error: null };
    const query = {
      ...result,
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue(result),
    };
    userClient.mockResolvedValue(query);

    const data = await read();

    expect(requireActor).toHaveBeenCalledOnce();
    expect(query.from).toHaveBeenCalledWith("properties");
    expect(query.eq).toHaveBeenCalledWith("organization_id", organizationB);
    if (read === getDashboardSummary) {
      expect(data).toEqual({ actor, listingCount: 1 });
    } else {
      expect(data).toEqual([]);
      expect(query.order).toHaveBeenCalledWith("public_code");
      expect(query.limit).toHaveBeenCalledWith(100);
    }
  });

  it("meneruskan kegagalan tanpa membocorkan detail database atau memakai data demo", async () => {
    const result = { data: null, count: null, error: { message: "PRIVATE_DATABASE_DETAIL" } };
    const query = {
      ...result,
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue(result),
    };
    userClient.mockResolvedValue(query);

    await expect(read()).rejects.toThrow(new Error(errorMessage));
  });
});
