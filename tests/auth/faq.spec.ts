import { randomBytes } from "node:crypto";
import { expect, test } from "@playwright/test";
import pg from "pg";
import { testDatabaseConfig } from "../../scripts/test-database";
import { organizationA } from "../../src/demo/properties";

const question = `Bagaimana meninjau FAQ ${randomBytes(5).toString("hex")}?`;

test.afterAll(async () => {
  const db = new pg.Client(testDatabaseConfig());
  await db.connect();
  try {
    await db.query("begin");
    const scope = await db.query("select is_demo,processing_paused from public.organizations where id = $1", [organizationA]);
    if (scope.rows.length !== 1 || !scope.rows[0].is_demo || !scope.rows[0].processing_paused) {
      throw new Error("Target cleanup bukan organisasi fixture yang paused.");
    }
    const entry = await db.query("select id from public.knowledge_entries where organization_id = $1 and question = $2", [organizationA, question]);
    if (entry.rows.length) {
      await db.query("delete from public.audit_events where organization_id = $1 and entity_id = $2 and entity_type = 'knowledge_entry'", [organizationA, entry.rows[0].id]);
      await db.query("delete from public.knowledge_entries where organization_id = $1 and id = $2", [organizationA, entry.rows[0].id]);
    }
    await db.query("commit");
  } catch (error) {
    await db.query("rollback").catch(() => {});
    throw error;
  } finally { await db.end(); }
});

test("owner mengelola FAQ; sales hanya melihat FAQ aktif publik", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("owner.a@example.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill(process.env.TEST_SEED_PASSWORD!);
  await page.getByRole("button", { name: "Masuk ke dashboard" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/faq");
  await expect(page.getByRole("heading", { name: "FAQ", exact: true })).toBeVisible();
  const create = page.getByRole("region", { name: "Tambah FAQ" });
  await create.getByLabel("Pertanyaan").fill(question);
  await create.getByLabel("Jawaban").fill("Hubungi tim kami untuk mengatur jadwal.");
  await create.getByLabel("Aktif").check();
  await create.getByRole("button", { name: "Tambah FAQ" }).click();
  await expect(create.getByRole("status")).toHaveText("FAQ tersimpan.");
  await page.reload();
  const card = page.locator(".faq-card").filter({ has: page.getByRole("heading", { name: question }) });
  await expect(card).toBeVisible();
  await page.getByRole("button", { name: "Keluar" }).click();

  await page.getByLabel("Email", { exact: true }).fill("andi@example.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill(process.env.TEST_SEED_PASSWORD!);
  await page.getByRole("button", { name: "Masuk ke dashboard" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/faq");
  await expect(page.getByRole("heading", { name: question })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tambah FAQ" })).toHaveCount(0);
  await expect(page.getByText("Ubah FAQ")).toHaveCount(0);
  await page.getByRole("button", { name: "Keluar" }).click();

  await page.getByLabel("Email", { exact: true }).fill("owner.a@example.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill(process.env.TEST_SEED_PASSWORD!);
  await page.getByRole("button", { name: "Masuk ke dashboard" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/faq");
  const editCard = page.locator(".faq-card").filter({ has: page.getByRole("heading", { name: question }) });
  await editCard.getByText("Ubah FAQ").click();
  await editCard.getByLabel("Visibilitas").selectOption("internal");
  await editCard.getByLabel("Aktif").uncheck();
  await editCard.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(editCard.getByRole("status")).toHaveText("FAQ tersimpan.");
  await page.getByRole("button", { name: "Keluar" }).click();

  await page.getByLabel("Email", { exact: true }).fill("andi@example.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill(process.env.TEST_SEED_PASSWORD!);
  await page.getByRole("button", { name: "Masuk ke dashboard" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/faq");
  await expect(page.getByRole("heading", { name: question })).toHaveCount(0);
});
