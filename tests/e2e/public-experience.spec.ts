import { expect, test } from "@playwright/test";

test("filter membedakan pointer dan keyboard tanpa mengubah ukuran", async ({ page, isMobile }) => {
  for (const route of ["/", "/properti"]) {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".public-site")).toBeVisible();
    for (const field of await page.locator(".search-fields input, .search-fields select").all()) {
      await field.scrollIntoViewIfNeeded();
      const before = await field.evaluate(el => ({ width: el.clientWidth, height: el.clientHeight }));
      if (isMobile) await field.tap();
      else await field.click();
      if (await field.evaluate(el => el.tagName === "SELECT")) await page.keyboard.press("Escape");
      await expect(field).toBeFocused();
      await expect(field).toHaveCSS("outline-style", "none");
      await expect(field).toHaveCSS("box-shadow", "none");
      await expect(field).toHaveCSS("font-size", "16px");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(field).toBeFocused();
      await expect(field).toHaveCSS("box-shadow", "rgb(36, 40, 36) 0px -2px 0px 0px inset");
      expect(await field.evaluate(el => ({ width: el.clientWidth, height: el.clientHeight }))).toEqual(before);
    }
    await page.getByRole("button", { name: "Cari properti" }).focus();
    await expect(page.getByRole("button", { name: "Cari properti" })).toHaveCSS("outline-width", "3px");
  }
});

test("font lokal dan tautan pelanggan tersedia di HTML publik", async ({ page, request }) => {
  const externalFontRequests: string[] = [];
  page.on("request", req => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) externalFontRequests.push(req.url());
  });
  for (const route of ["/", "/tentang", "/properti", "/properti/modern-house-bsd", "/privasi"]) {
    const response = await request.get(route);
    expect(await response.text()).not.toMatch(/href=["']\/(?:login|app|preview)(?:[/?#"'])/);
    await page.goto(route);
    await expect(page.locator('a[href^="/login"], a[href^="/app"], a[href^="/preview"]')).toHaveCount(0);
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      const heading = getComputedStyle(document.querySelector("h1")!);
      const body = getComputedStyle(document.querySelector(".public-site")!);
      const headingFamily = heading.fontFamily.split(",")[0];
      const bodyFamily = body.fontFamily.split(",")[0];
      return {
        headingLoaded: document.fonts.check(`500 40px ${headingFamily}`),
        italicLoaded: document.querySelector("em") ? document.fonts.check(`italic 500 40px ${headingFamily}`) : null,
        bodyLoaded: document.fonts.check(`400 16px ${bodyFamily}`),
        weight: heading.fontWeight,
        distinct: heading.fontFamily !== body.fontFamily,
        resources: performance.getEntriesByType("resource").map(entry => entry.name).filter(name => name.includes(".woff2")),
      };
    });
    expect(fonts).toMatchObject({ headingLoaded: true, bodyLoaded: true, distinct: true });
    if (route === "/" || route === "/tentang") expect(fonts.italicLoaded).toBe(true);
    expect(fonts.weight).toBe("500");
    expect(fonts.resources.length).toBeGreaterThanOrEqual(3);
    expect(fonts.resources.every(url => new URL(url).origin === "http://127.0.0.1:3100")).toBe(true);
  }
  expect(externalFontRequests).toEqual([]);
});

test("profil, kawasan dan tampilan pada tiga lebar layar", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/tentang");
  await page.getByRole("link", { name: "Kenali pendekatan kami" }).click();
  await expect(page).toHaveURL(/#pendekatan$/);
  await expect(page.locator(".approach-list li")).toHaveCount(3);
  await expect(page.getByText("Konsultasi WhatsApp belum aktif")).toBeVisible();
  await expect(page.locator("main")).not.toContainText("Michael");
  for (const area of ["BSD", "Alam Sutera", "Bintaro"]) {
    await page.locator(".area-card").filter({ has: page.getByRole("heading", { name: area, exact: true }) }).click();
    await expect(page.getByLabel("Lokasi", { exact: true })).toHaveValue(area);
    await page.goBack();
  }
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.getByRole("heading", { name: "Mengenal Nusa Property." }).click();
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: `test-results/about-${width}-${testInfo.project.name}.png`, fullPage: true });
  }
  await page.getByRole("link", { name: "Lihat katalog properti" }).click();
  await expect(page.getByRole("heading", { name: "10 properti ditemukan" })).toBeVisible();
});

test("motion sekali per kunjungan, scroll cepat, parallax terbatas dan reduced motion", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".hero-line").last()).toHaveAttribute("data-motion-state", "done");
  const hero = page.locator(".hero-image img");
  if (isMobile) await expect(hero).toHaveCSS("transform", "none");
  else {
    await expect.poll(() => hero.evaluate(el => el.style.getPropertyValue("--parallax-offset"))).not.toBe("");
    const offset = await hero.evaluate(el => parseFloat(el.style.getPropertyValue("--parallax-offset")));
    expect(Math.abs(offset)).toBeLessThanOrEqual(12);
  }
  await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await expect(page.locator(".footer-main")).toHaveAttribute("data-motion-state", "done");
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.locator(".hero-line").last()).toHaveAttribute("data-motion-state", "done");
  expect(await page.locator(".hero-copy h1").evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await page.getByRole("contentinfo").getByRole("link", { name: "Tentang Nusa" }).click();
  await expect(page.locator(".about-hero h1")).toHaveAttribute("data-motion-state", "done");
  await page.getByRole("banner").getByRole("link", { name: "Nusa Property, beranda" }).click();
  await expect(page.locator(".hero-line").last()).toHaveAttribute("data-motion-state", "done");
  await page.locator("#pilihan").scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
  await expect(hero).toHaveCSS("transform", "none");
  for (const element of await page.locator("[data-motion]").all()) {
    await expect(element).toHaveCSS("opacity", "1");
    await expect(element).toHaveAttribute("data-motion-state", "done");
  }
  await page.goto("/tentang");
  await expect(page.locator(".about-hero h1")).toHaveAttribute("data-motion-state", "done");
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  expect(errors).toEqual([]);
});

test("konten dan pencarian tetap tersedia tanpa JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  try {
    for (const route of ["/", "/tentang"]) {
      await page.goto(`http://127.0.0.1:3100${route}`);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("h1")).toHaveCSS("opacity", "1");
      await expect(page.locator(".area-card")).toHaveCount(3);
      await expect(page.locator('a[href^="/login"], a[href^="/preview"]')).toHaveCount(0);
    }
    await page.goto("http://127.0.0.1:3100/");
    await page.getByLabel("Lokasi", { exact: true }).fill("BSD");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Cari properti" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "4 properti ditemukan" })).toBeVisible();
  } finally {
    await context.close();
  }
});
