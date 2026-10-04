import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { seedConfig } from "../../scripts/seed-config";
import { demoAccounts } from "@/demo/accounts";
import { organizationA } from "@/demo/properties";

const { createClient, select, upsert, listUsers, createUser } = vi.hoisted(
  () => ({
    createClient: vi.fn(),
    select: vi.fn(),
    upsert: vi.fn(),
    listUsers: vi.fn(),
    createUser: vi.fn(),
  }),
);
vi.mock("@supabase/supabase-js", () => ({ createClient }));
const originalExit = process.exitCode;

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  for (const [name, value] of Object.entries({
    APP_ENV: "test",
    TEST_DATABASE_CONFIRM_ISOLATED: "true",
    DEMO_SEED_CONFIRM_ISOLATED: "true",
    NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
    TEST_DATABASE_URL: "postgresql://postgres:local@127.0.0.1:54322/postgres",
    SUPABASE_SECRET_KEY: "SECRET_TEST_MARKER",
    DEMO_SEED_PASSWORD: "PASSWORD_TEST_MARKER_123",
  }))
    vi.stubEnv(name, value);
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  process.exitCode = 0;
  select.mockResolvedValue({ data: [], error: null });
  upsert.mockResolvedValue({ error: null });
  listUsers.mockResolvedValue({
    data: {
      users: demoAccounts.map((account, index) => ({
        email: account.email,
        id: `user-${index}`,
      })),
    },
    error: null,
  });
  createClient.mockReturnValue({
    from: () => ({
      select,
      upsert,
      update: () => ({ eq: async () => ({ error: null }) }),
    }),
    auth: { admin: { listUsers, createUser } },
  });
});

afterEach(() => {
  process.exitCode = originalExit;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("seed guard dan pemulihan", () => {
  it.each([
    ["APP_ENV", "production"],
    ["APP_ENV", "demo"],
    ["TEST_DATABASE_CONFIRM_ISOLATED", "false"],
    ["DEMO_SEED_CONFIRM_ISOLATED", "false"],
    ["DEMO_SEED_PASSWORD", "short"],
    ["SUPABASE_SECRET_KEY", ""],
    [
      "TEST_DATABASE_URL",
      "postgresql://postgres:local@db.other.supabase.co/postgres?sslmode=verify-full",
    ],
  ])("menolak %s=%s sebelum membuka client", async (name, value) => {
    vi.stubEnv(name, value);
    expect(() => seedConfig()).toThrow();
    await import("../../scripts/seed-demo");
    expect(createClient).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("NOT RUN: konfigurasi"),
    );
  });

  it.each([
    { id: organizationA, is_demo: false, processing_paused: true },
    { id: organizationA, is_demo: true, processing_paused: false },
    { id: "foreign-org", is_demo: true, processing_paused: true },
  ])("menolak organisasi tidak aman sebelum mutasi", async (row) => {
    select.mockResolvedValue({ data: [row], error: null });
    await import("../../scripts/seed-demo");
    expect(upsert).not.toHaveBeenCalled();
    expect(listUsers).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it("menolak akun asing sebelum mutasi", async () => {
    listUsers.mockResolvedValue({
      data: { users: [{ id: "foreign-user", email: "foreign@example.test" }] },
      error: null,
    });
    await import("../../scripts/seed-demo");
    expect(upsert).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it("menjalankan ulang akun yang ada tanpa mengganti password", async () => {
    await import("../../scripts/seed-demo");
    expect(process.exitCode).toBe(0);
    expect(createUser).not.toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: "user-1",
          role: "sales",
          is_active: true,
        }),
      ]),
      { onConflict: "organization_id,user_id" },
    );
    expect(JSON.stringify(vi.mocked(console.log).mock.calls)).not.toMatch(
      /SECRET_TEST_MARKER|PASSWORD_TEST_MARKER/,
    );
  });

  it("melanjutkan setelah pembuatan akun gagal sebagian tanpa membuat ulang akun yang berhasil", async () => {
    const users: { id: string; email: string }[] = [];
    listUsers.mockImplementation(async () => ({
      data: { users: [...users] },
      error: null,
    }));
    let failed = false;
    createUser.mockImplementation(async ({ email }: { email: string }) => {
      if (users.length === 2 && !failed) {
        failed = true;
        return {
          error: { message: "SECRET_TEST_MARKER" },
          data: { user: null },
        };
      }
      const user = { id: `user-${users.length}`, email };
      users.push(user);
      return { error: null, data: { user } };
    });
    await import("../../scripts/seed-demo");
    expect(process.exitCode).toBe(1);
    expect(users).toHaveLength(2);
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain(
      "SECRET_TEST_MARKER",
    );
    process.exitCode = 0;
    vi.resetModules();
    await import("../../scripts/seed-demo");
    expect(process.exitCode).toBe(0);
    expect(users).toHaveLength(5);
    expect(new Set(users.map((user) => user.email)).size).toBe(5);
    expect(createUser).toHaveBeenCalledTimes(6);
  });
});
