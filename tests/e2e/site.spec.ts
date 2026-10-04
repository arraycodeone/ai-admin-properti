import { expect, test, type Page } from "@playwright/test";

async function openMenu(page: Page) {
  const button = page.getByRole("button", { name: "Menu" });
  if (await button.isVisible()) await button.click();
}

test("pencarian BSD sampai detail dan galeri sesuai kebutuhan Dimas", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Temukan rumah/ })).toBeVisible();
  await page.getByLabel("Lokasi", { exact: true }).fill("BSD");
  await page.getByLabel("Tipe properti").selectOption("house");
  await page.getByLabel("Anggaran maks.").selectOption("2000000000");
  await page.getByRole("button", { name: "Cari properti" }).click();
  await page.getByLabel("Minimal kamar").selectOption("2");
  await page.getByRole("button", { name: "Cari properti" }).click();
  await expect(page.getByRole("heading", { name: "2 properti ditemukan" })).toBeVisible();
  await expect(page.getByText("Premium Cluster BSD", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: /NUSA-001/ }).click();
  await expect(page.getByRole("heading", { name: "Modern House BSD" })).toBeVisible();
  for (let index = 0; index < 4; index++) {
    const thumbnail = page.getByRole("button", { name: new RegExp(`^Lihat foto ${index + 1}:`) });
    await thumbnail.focus();
    await page.keyboard.press("Enter");
    await expect(thumbnail).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".gallery-counter")).toHaveText(`${index + 1} / 4`);
    await expect(page.locator(".gallery-main img")).toHaveJSProperty("complete", true);
  }
  await expect(page.getByText("Konsultasi WhatsApp belum aktif")).toBeVisible();
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("hasil kosong, filter invalid, dan listing nonpublik tidak bocor", async ({ page }) => {
  await page.goto("/properti?location=TidakAda");
  await expect(page.getByRole("heading", { name: "Belum ada properti yang cocok" })).toBeVisible();
  await page.getByRole("link", { name: "Hapus filter" }).click();
  await expect(page.getByRole("heading", { name: "10 properti ditemukan" })).toBeVisible();
  await page.goto("/properti?budget=-1");
  await expect(page.getByRole("alert").filter({ hasText: "Filter tidak valid" })).toBeVisible();
  for (const slug of ["rumah-draft", "rumah-paused", "rumah-terjual", "rumah-agensi-b"]) {
    await page.goto(`/properti/${slug}`);
    await expect(page.getByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible();
  }
  expect(await page.content()).not.toContain("PRIVATE_OWNER_TEST_DO_NOT_EXPOSE");
  await page.goto("/properti?budget=1500000000&bedrooms=6");
  await expect(page.getByLabel("Anggaran maks.")).toHaveValue("1500000000");
  await expect(page.getByLabel("Minimal kamar")).toHaveValue("6");
});

test("kategori, kawasan, konsultasi, footer dan profil bekerja", async ({ page }) => {
  for (const [name, count] of [["Apartemen", 2], ["Rumah", 8], ["Semua properti", 10]] as const) {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Kategori properti" }).getByRole("link", { name, exact: true }).click();
    await expect(page.getByRole("heading", { name: `${count} properti ditemukan` })).toBeVisible();
  }
  for (const [name, count] of [["BSD", 4], ["Alam Sutera", 3], ["Bintaro", 3]] as const) {
    await page.goto("/");
    await page.locator(".location-shortcuts").getByRole("link", { name, exact: true }).click();
    await expect(page.getByRole("heading", { name: `${count} properti ditemukan` })).toBeVisible();
    await page.goto("/");
    await page.locator(".area-card").filter({ has: page.getByRole("heading", { name, exact: true }) }).click();
    await expect(page.getByLabel("Lokasi", { exact: true })).toHaveValue(name);
  }
  await page.goto("/");
  await page.getByRole("link", { name: "Lihat pilihan hunian", exact: true }).click();
  await expect(page).toHaveURL(/#pilihan$/);
  await openMenu(page);
  await page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", { name: "Kawasan" }).click();
  await expect(page).toHaveURL(/#kawasan$/);
  await openMenu(page);
  await page.getByRole("link", { name: "Konsultasi", exact: true }).click();
  await expect(page).toHaveURL(/#konsultasi$/);
  await page.getByRole("link", { name: "Pilih properti untuk dibicarakan" }).click();
  await expect(page).toHaveURL(/\/properti$/);
  await page.getByRole("banner").getByRole("link", { name: "Nusa Property, beranda" }).click();
  await page.getByRole("link", { name: "Lihat semua properti" }).click();
  await expect(page).toHaveURL(/\/properti$/);
  await page.getByRole("link", { name: "Privasi", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Privasi pada demo ini" })).toBeVisible();
  await openMenu(page);
  await page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", { name: "Tentang Nusa" }).click();
  await expect(page.getByRole("heading", { name: "Mengenal Nusa Property." })).toBeVisible();
});

test("preview dihapus dan dashboard tetap memerlukan sesi", async ({ page }) => {
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/app/properti");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Login belum aktif", { exact: true })).toBeVisible();
  await expect(page.locator('a[href="/preview"]')).toHaveCount(0);
  const response = await page.goto("/preview");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible();
});

test("setiap kartu menuju detail yang cocok dan tautan navigasi bersama tersedia", async ({ page }, testInfo) => {
  await page.goto("/properti");
  const titles = await page.locator(".property-title").allTextContents();
  expect(titles).toHaveLength(10);
  for (const [index, title] of titles.entries()) {
    await page.goto("/properti");
    await page.locator(".property-link").nth(index).click();
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(page.locator(".gallery-thumbnails button")).toHaveCount(4);
    if (index === 0) {
      await expect(page.locator(".gallery-main img")).toHaveJSProperty("complete", true);
      await page.screenshot({ path: `test-results/detail-${testInfo.project.name}.png`, fullPage: true });
    }
  }
  await page.getByRole("contentinfo").getByRole("link", { name: "Nusa Property, beranda" }).click();
  await openMenu(page);
  await page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", { name: "Properti", exact: true }).click();
  await expect(page).toHaveURL(/\/properti$/);
  await page.getByRole("contentinfo").getByRole("link", { name: "Katalog properti" }).click();
  await expect(page.getByRole("heading", { name: "10 properti ditemukan" })).toBeVisible();
  await page.getByRole("contentinfo").getByRole("link", { name: "Tentang Nusa" }).click();
  await expect(page).toHaveURL(/\/tentang$/);
});

test("noindex, keyboard, gambar dan ukuran layar", async ({ page }, testInfo) => {
  for (const path of ["/", "/properti", "/properti/modern-house-bsd", "/privasi", "/tentang", "/login"]) {
    const response = await page.goto(path);
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), `overflow pada ${path}`).toBe(false);
  }
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Lewati ke konten" })).toHaveCSS("clip-path", "inset(50%)");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Lewati ke konten" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Lewati ke konten" })).toHaveCSS("clip-path", "none");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  if (await page.getByRole("button", { name: "Menu" }).isVisible()) {
    await openMenu(page);
    await page.getByRole("link", { name: "Konsultasi", exact: true }).focus();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
    await expect(page.getByRole("navigation", { name: "Navigasi utama" })).toBeHidden();
  }
  for (const img of await page.locator("main img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveJSProperty("complete", true);
    expect(await img.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("heading", { name: /Temukan rumah/ }).click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: `test-results/landing-${testInfo.project.name}.png`, fullPage: true });
  await page.screenshot({ path: `test-results/landing-${testInfo.project.name}-viewport.png` });
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  for (const viewport of [{ width: 768, height: 1024 }, { width: 800, height: 360 }]) {
    await page.setViewportSize(viewport);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    if (viewport.width === 768) await page.screenshot({ path: `test-results/landing-tablet-${testInfo.project.name}.png`, fullPage: true });
  }
});
