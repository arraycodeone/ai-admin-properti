import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import pg from "pg";
import { testDatabaseConfig } from "../../scripts/test-database";
import { demoAccounts } from "../../src/demo/accounts";
import { organizationA, organizationB, properties } from "../../src/demo/properties";

const database = new pg.Client(testDatabaseConfig());
const userIds = new Map<string, string>();
const sessions = new Set<string>();
const names = ["Owner A", "Andi", "Sari"];

// Only decode this test browser's SSR cookie; never print or assert token values.
async function storedSession(context: BrowserContext) {
  const cookies = (await context.cookies()).filter(cookie => /^sb-.+-auth-token(?:\.\d+)?$/.test(cookie.name));
  cookies.sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
  const value = cookies.map(cookie => cookie.value).join("");
  if (!value.startsWith("base64-")) throw new Error("Cookie sesi uji tidak tersedia.");
  const session = JSON.parse(Buffer.from(value.slice(7), "base64url").toString("utf8")) as {
    access_token: string; refresh_token: string; expires_at: number;
  };
  const claims = JSON.parse(Buffer.from(session.access_token.split(".")[1], "base64url").toString("utf8")) as { session_id: string; sub: string };
  if (!Array.from(userIds.values()).includes(claims.sub) || !/^[0-9a-f-]{36}$/.test(claims.session_id)) {
    throw new Error("Sesi bukan milik akun fixture.");
  }
  sessions.add(claims.session_id);
  return { cookies, session, claims };
}

async function refreshOnNextRequest(context: BrowserContext) {
  const { cookies, session, claims } = await storedSession(context);
  // Expire only cached SDK metadata, keeping the genuine signed JWT unchanged.
  session.expires_at = 1_000_000_000;
  const value = `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`;
  const base = cookies[0].name.replace(/\.\d+$/, "");
  await context.clearCookies({ name: new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\.\\d+)?$`) });
  const chunks = value.match(/.{1,3000}/g)!;
  await context.addCookies(chunks.map((part, index) => ({
    ...cookies[0], name: chunks.length === 1 ? base : `${base}.${index}`, value: part,
  })));
  return claims.session_id;
}

async function login(page: Page, email: string, valid = true) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  try {
    await page.getByLabel("Kata sandi", { exact: true }).fill(valid ? process.env.DEMO_SEED_PASSWORD! : "Incorrect-demo-password-123!");
  } catch { throw new Error("Tidak dapat mengisi password uji; rincian disembunyikan."); }
  await page.getByRole("button", { name: "Masuk ke dashboard" }).click();
}

test.beforeAll(async () => {
  await database.connect();
  const organizations = await database.query("select id,is_demo,processing_paused from public.organizations order by id");
  expect(organizations.rows).toEqual([organizationA, organizationB].map(id => ({ id, is_demo: true, processing_paused: true })));
  const users = await database.query("select id,email from auth.users");
  if (users.rows.length !== demoAccounts.length || users.rows.some(user => !demoAccounts.some(account => account.email === user.email))) {
    throw new Error("NOT RUN: jalankan seed pada target uji sebelum test:auth.");
  }
  users.rows.forEach(user => userIds.set(user.email, user.id));
});

test.afterAll(async () => {
  try {
    // Session IDs come only from cookies created by this suite, never all user sessions.
    if (sessions.size) await database.query("delete from auth.sessions where id=any($1::uuid[]) and user_id=any($2::uuid[])", [[...sessions], [...userIds.values()]]);
  } finally { await database.end(); }
});

test.afterEach(async ({ context }) => {
  if ((await context.cookies()).some(cookie => /^sb-.+-auth-token(?:\.\d+)?$/.test(cookie.name))) {
    await storedSession(context);
  }
});

test("URL internal tanpa sesi tetap tertutup", async ({ page }) => {
  for (const path of ["/app", "/app/properti"]) {
    const response = await page.goto(path);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator(".admin-shell")).toHaveCount(0);
    expect(response?.headers()["cache-control"]).toContain("no-store");
  }
});

for (const account of demoAccounts.filter(account => account.org === organizationA && account.active)) {
  test(`login gagal/berhasil dan logout ${account.display_name}`, async ({ page, context }) => {
    await login(page, account.email, false);
    await expect(page.locator(".login-form [role=alert]")).toHaveText("Login gagal. Periksa email dan kata sandi, lalu coba lagi.");
    await expect(page).toHaveURL(/\/login$/);
    await login(page, account.email);
    await expect(page.getByRole("heading", { name: `Halo, ${account.display_name}.` })).toBeVisible();
    await storedSession(context);
    await expect(page.locator(".summary-strip")).toContainText(account.role === "owner" ? "Owner" : "Sales");
    await expect(page.locator(".summary-strip")).toContainText(String(properties.filter(row => row.organization_id === organizationA).length));
    await expect(page.getByRole("navigation", { name: "Navigasi dashboard" }).getByRole("link")).toHaveCount(2);
    const response = await page.goto("/app/properti");
    expect(response?.headers()["cache-control"]).toContain("no-store");
    await expect(page.locator(".lead-row")).toHaveCount(properties.filter(row => row.organization_id === organizationA).length);
    await expect(page.locator(".lead-list")).not.toContainText("AGB-001");
    await page.getByRole("button", { name: "Keluar" }).click();
    await expect(page).toHaveURL(/\/login$/);
    expect((await context.cookies()).some(cookie => /^sb-.+-auth-token/.test(cookie.name))).toBe(false);
    for (const path of ["/app", "/app/properti"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login$/);
    }
  });
}

for (const email of ["inactive@example.test", "owner.b@example.test"]) {
  test(`membership tidak sah untuk ${email}`, async ({ page, context }) => {
    await login(page, email);
    await expect(page).toHaveURL(/\/login\?error=membership$/);
    await storedSession(context);
    await expect(page.locator(".login-card p[role=alert]")).toContainText("keanggotaan aktif");
    for (const path of ["/app", "/app/properti"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login\?error=membership$/);
      await expect(page.locator(".admin-shell")).toHaveCount(0);
    }
  });
}

test("berganti akun pada browser yang sama tidak menampilkan identitas lama", async ({ page, context }) => {
  for (const name of names) {
    const account = demoAccounts.find(account => account.display_name === name)!;
    await login(page, account.email);
    await expect(page.getByRole("heading", { name: `Halo, ${name}.` })).toBeVisible();
    await storedSession(context);
    for (const other of names.filter(other => other !== name)) await expect(page.locator(".sidebar-bottom")).not.toContainText(other);
    await page.getByRole("link", { name: "Buka katalog internal" }).click();
    await page.getByRole("link", { name: "Ringkasan", exact: true }).click();
    await expect(page.getByRole("heading", { name: `Halo, ${name}.` })).toBeVisible();
    await page.getByRole("button", { name: "Keluar" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goBack();
    await expect(page.locator(".admin-shell")).toHaveCount(0);
  }
});

test("proxy memperbarui sesi dan menolak refresh sesi yang kedaluwarsa", async ({ page, context }) => {
  await login(page, "andi@example.test");
  await expect(page.getByRole("heading", { name: "Halo, Andi." })).toBeVisible();
  const old = await storedSession(context);
  const id = await refreshOnNextRequest(context);
  const response = await page.goto("/app");
  await expect(page.getByRole("heading", { name: "Halo, Andi." })).toBeVisible();
  const fresh = await storedSession(context);
  expect(fresh.session.refresh_token !== old.session.refresh_token).toBe(true);
  expect(fresh.session.expires_at > Date.now() / 1000).toBe(true);
  expect(response?.headers()["cache-control"]).toContain("no-store");
  const expired = await database.query("update auth.sessions set not_after=now()-interval '1 minute' where id=$1 and user_id=$2", [id, userIds.get("andi@example.test")]);
  expect(expired.rowCount).toBe(1);
  await refreshOnNextRequest(context);
  await page.goto("/app/properti");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator(".admin-shell")).toHaveCount(0);
  expect((await context.cookies()).some(cookie => /^sb-.+-auth-token/.test(cookie.name))).toBe(false);
});
