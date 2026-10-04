import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthApiError, AuthRetryableFetchError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

const { createServerClient, getUser, signOut, parseConfig } = vi.hoisted(() => ({
  createServerClient: vi.fn(), getUser: vi.fn(), signOut: vi.fn(), parseConfig: vi.fn(),
}));
vi.mock("@supabase/ssr", () => ({ createServerClient }));
vi.mock("@/server/config", () => ({ parseConfig }));

beforeEach(() => {
  vi.resetAllMocks();
  parseConfig.mockReturnValue({ APP_MODE: "supabase", NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-key" });
  getUser.mockResolvedValue({ error: null });
  signOut.mockResolvedValue({ error: null });
  createServerClient.mockReturnValue({ auth: { getUser, signOut } });
});

describe("proxy sesi", () => {
  it.each([
    [null, false],
    [new AuthApiError("Session Expired", 400, "session_expired"), true],
    [new AuthRetryableFetchError("Temporarily unavailable", 503), false],
  ])("membersihkan sesi tidak sah tetapi mempertahankan sesi saat layanan terganggu", async (error, shouldSignOut) => {
    getUser.mockResolvedValue({ error });
    const response = await proxy(new NextRequest("http://localhost/app"));
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    if (shouldSignOut) expect(signOut).toHaveBeenCalledWith({ scope: "local" });
    else expect(signOut).not.toHaveBeenCalled();
  });

  it("meneruskan cookie yang diperbarui dan mempertahankan no-store", async () => {
    const request = new NextRequest("http://localhost/app", { headers: { cookie: "session=old" } });
    getUser.mockImplementation(async () => {
      const adapter = createServerClient.mock.calls[0][2].cookies;
      adapter.setAll([{ name: "session", value: "new", options: { path: "/", httpOnly: true } }]);
      return { error: null };
    });
    const response = await proxy(request);
    expect(request.cookies.get("session")?.value).toBe("new");
    expect(response.cookies.get("session")?.value).toBe("new");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
});
