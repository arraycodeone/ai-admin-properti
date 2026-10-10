import { randomBytes } from "node:crypto";
import { expect, test } from "@playwright/test";
import pg from "pg";
import { testDatabaseConfig } from "../../scripts/test-database";
import { organizationA } from "../../src/demo/properties";

const suffix = randomBytes(5).toString("hex");
const code = `TEST-${suffix.toUpperCase()}`;
const slug = `test-listing-${suffix}`;

test.afterAll(async () => {
  const db = new pg.Client(testDatabaseConfig());
  await db.connect();
  try {
    await db.query("begin");
    const scope = await db.query("select is_demo,processing_paused from public.organizations where id = $1", [organizationA]);
    if (scope.rows.length !== 1 || !scope.rows[0].is_demo || !scope.rows[0].processing_paused) {
      throw new Error("Target cleanup bukan organisasi demo yang paused.");
    }
    const listing = await db.query("select id from public.properties where organization_id = $1 and public_code = $2", [organizationA, code]);
    if (listing.rows.length) {
      const id = listing.rows[0].id;
      await db.query("delete from public.audit_events where organization_id = $1 and entity_id = $2 and entity_type = 'property'", [organizationA, id]);
      await db.query("delete from public.property_private_details where organization_id = $1 and property_id = $2", [organizationA, id]);
      await db.query("delete from public.properties where organization_id = $1 and id = $2", [organizationA, id]);
    }
    await db.query("commit");
  } catch (error) {
    await db.query("rollback").catch(() => {});
    throw error;
  } finally { await db.end(); }
});

test("owner membuat dan menerbitkan listing; sales tetap baca saja", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("owner.a@example.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill(process.env.DEMO_SEED_PASSWORD!);
  await page.getByRole("button", { name: "Masuk ke dashboard" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/properti");
  await page.getByRole("link", { name: "Tambah properti" }).click();
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.getByLabel("Kode publik").fill("NUSA-001");
  await page.getByLabel("Slug URL").fill(slug);
  await page.getByLabel("Judul").fill("Rumah uji owner di BSD");
  await page.getByLabel("Deskripsi").fill("Listing uji untuk memeriksa publikasi dan izin owner secara nyata.");
  await page.getByLabel("Kota").fill("Tangerang");
  await page.getByLabel("Kawasan").fill("BSD");
  await page.getByLabel("Harga (rupiah, tanpa pemisah)").fill("-1");
  await page.getByLabel("Kamar tidur").fill("2");
  await page.getByLabel("Kamar mandi").fill("1");
  await page.getByLabel("Fasilitas (satu per baris, maksimal 20)").fill("Kolam renang\nParkir");
  await page.getByLabel("Nama pemilik (opsional)").fill("PRIVATE_BROWSER_OWNER");
  await page.getByRole("button", { name: "Simpan properti" }).click();
  await expect(page.locator(".property-form [role='alert']")).toContainText("Periksa harga");
  await expect(page.getByLabel("Kode publik")).toHaveValue("NUSA-001");

  await page.getByLabel("Harga (rupiah, tanpa pemisah)").fill("9007199254740993");
  await page.getByRole("button", { name: "Simpan properti" }).click();
  await expect(page.locator(".property-form [role='alert']")).toContainText("Kode atau slug sudah dipakai");
  await page.getByLabel("Kode publik").fill(code);
  await page.getByRole("button", { name: "Simpan properti" }).click();
  await expect(page).toHaveURL(/\/app\/properti\/[0-9a-f-]+\/ubah\?tersimpan=1$/);
  const editUrl = page.url();
  await page.reload();
  await expect(page.getByLabel("Harga (rupiah, tanpa pemisah)")).toHaveValue("9007199254740993");
  expect((await page.goto(`/properti/${slug}`))?.status()).toBe(404);

  await page.goto(new URL(editUrl).pathname);
  await page.locator("select[name='publication_status']").selectOption("published");
  await page.getByRole("button", { name: "Simpan properti" }).click();
  await expect(page).toHaveURL(/\?tersimpan=1$/);
  await expect(page.getByRole("status")).toContainText("tersimpan");
  await page.goto(`/properti/${slug}`);
  await expect(page.getByRole("heading", { name: "Rumah uji owner di BSD" })).toBeVisible();
  await expect(page.getByText("Kolam renang")).toBeVisible();
  await expect(page.locator("main")).not.toContainText("PRIVATE_BROWSER_OWNER");

  await page.goto(new URL(editUrl).pathname);
  await page.getByLabel("Harga (rupiah, tanpa pemisah)").fill("9007199254740994");
  await page.getByLabel("Ketersediaan").selectOption("paused");
  await page.getByRole("button", { name: "Simpan properti" }).click();
  await expect(page).toHaveURL(/\?tersimpan=1$/);
  expect((await page.goto(`/properti/${slug}`))?.status()).toBe(404);

  await page.goto("/app/properti");
  await page.getByRole("button", { name: "Keluar" }).click();
  await page.getByLabel("Email", { exact: true }).fill("andi@example.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill(process.env.DEMO_SEED_PASSWORD!);
  await page.getByRole("button", { name: "Masuk ke dashboard" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/properti");
  await expect(page.getByRole("link", { name: "Tambah properti" })).toHaveCount(0);
  await page.goto("/app/properti/baru");
  await expect(page.locator(".property-form")).toHaveCount(0);
  await page.goto(new URL(editUrl).pathname);
  await expect(page.locator(".property-form")).toHaveCount(0);
  await page.goto("/app/properti");
  await page.getByRole("button", { name: "Keluar" }).click();
});
