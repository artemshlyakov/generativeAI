// Run against a local HTTP server: node qa/verify.cjs [base URL] [artifact directory].
// Requires Playwright; no runtime dependency is added to the static website.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
(async () => {
  const base = process.argv[2] || "http://127.0.0.1:8765/";
  const out = process.argv[3] || "/workspace/shared/genesis-qa";
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const pages = ["index", "technology", "experiment", "gallery", "survey"];
  const errors = [];
  const results = [];
  const page = await browser.newPage({ reducedMotion: "reduce" });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && r.url().startsWith(base))
      errors.push(`${r.status()} ${r.url()}`);
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    for (const name of pages) {
      await page.goto(`${base}${name}.html`, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const i of document.images) {
          i.loading = "eager";
          await i.decode().catch(() => {});
        }
      });
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: [...document.images]
          .filter((x) => !x.complete || !x.naturalWidth)
          .map((x) => x.src),
        h1: document.querySelectorAll("h1").length,
        nav: [...document.querySelectorAll("#primary-nav a")].map(
          (x) => x.textContent,
        ),
        hiddenText: [...document.querySelectorAll("main .reveal")].filter(
          (x) => getComputedStyle(x).opacity === "0",
        ).length,
      }));
      assert.equal(state.overflow, false, `${name} overflow at ${width}`);
      assert.deepEqual(state.broken, [], `${name} broken image`);
      assert.equal(state.h1, 1);
      assert.equal(state.hiddenText, 0);
      assert.deepEqual(state.nav, [
        "Главная",
        "Технологии",
        "Эксперименты",
        "Медиа",
        "Анкета",
      ]);
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: path.join(out, `${name}-${width}.png`),
          fullPage: true,
          animations: "disabled",
        });
      results.push({ page: name, width, ...state });
    }
  }
  // Every internal file and anchor is checked from every page (including preload/source).
  for (const name of pages) {
    await page.goto(`${base}${name}.html`);
    const links = await page.evaluate(() =>
      [...document.querySelectorAll("[href],[src]")]
        .map((x) => x.getAttribute("href") || x.getAttribute("src"))
        .filter((x) => x && !/^(https?:|data:|mailto:|tel:)/.test(x)),
    );
    for (const link of new Set(links)) {
      const url = new URL(link, `${base}${name}.html`);
      const response = await page.request.get(url.href.split("#")[0]);
      assert.equal(response.ok(), true, `broken ${name}: ${link}`);
      if (url.hash) {
        const body = await response.text();
        assert(
          body.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
          `missing anchor ${link}`,
        );
      }
    }
  }
  // Mobile menu, escape, actual link navigation, and tablet resize regression.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.getByRole("button", { name: "Открыть меню" }).click();
  assert.equal(
    await page.locator("#menu-toggle").getAttribute("aria-expanded"),
    "true",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator("#menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page
    .locator("#primary-nav")
    .getByRole("link", { name: "Технологии", exact: true })
    .click();
  assert(page.url().endsWith("technology.html"));
  await page.setViewportSize({ width: 950, height: 1000 });
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page.setViewportSize({ width: 960, height: 1000 });
  assert.equal(
    await page.locator("#menu-toggle").getAttribute("aria-expanded"),
    "true",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  assert.equal(
    await page.locator("#menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  // Compare at both extremes and keyboard midpoint. All prompt disclosures open and close.
  await page.goto(`${base}experiment.html`);
  await page.locator("#comparison.is-loading").waitFor({ state: "hidden" });
  const range = page.getByRole("slider", { name: "Доля дневной версии" });
  await range.focus();
  await range.press("Home");
  assert.equal(await range.inputValue(), "0");
  await range.press("End");
  assert.equal(await range.inputValue(), "100");
  assert.equal(
    await page
      .locator("#comparison")
      .evaluate((x) => x.style.getPropertyValue("--split")),
    "100%",
  );
  for (let i = 0; i < 50; i++) await range.press("ArrowLeft");
  assert.equal(await range.inputValue(), "50");
  for (const details of await page.locator("details").all()) {
    await details.locator("summary").click();
    assert((await details.getAttribute("open")) !== null);
    await details.locator("summary").click();
  }
  // Laboratory mouseover changes are temporary.
  for (const kind of ["color", "background", "temporary"]) {
    const el = page.locator(`[data-effect="${kind}"]`);
    const original = await el.getAttribute("style");
    await el.hover();
    assert((await el.getAttribute("style")) !== original);
    await page.locator("h1").hover();
    assert.equal(
      await el.evaluate((x) => x.style.color + x.style.backgroundColor),
      "",
    );
  }
  await page.locator("#ambient-trigger").hover();
  assert.equal(
    await page
      .locator("html")
      .evaluate((x) => x.style.getPropertyValue("--page-bg")),
    "#18313a",
  );
  await page.locator("h1").hover();
  assert.equal(
    await page
      .locator("html")
      .evaluate((x) => x.style.getPropertyValue("--page-bg")),
    "#0b1016",
  );
  // Decode and actually advance both media elements, in both locations. Verify mutual exclusion.
  const mediaResults = [];
  for (const name of ["experiment", "gallery"]) {
    await page.goto(`${base}${name}.html`, { waitUntil: "networkidle" });
    for (const type of ["video", "audio"]) {
      const info = await page.locator(type).evaluate(async (el) => {
        await el.play();
        await new Promise((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error("media time did not advance")),
            10000,
          );
          const check = () => {
            if (el.currentTime > 0.15) {
              clearTimeout(timer);
              el.removeEventListener("timeupdate", check);
              resolve();
            }
          };
          el.addEventListener("timeupdate", check);
          check();
        });
        const result = {
          duration: el.duration,
          time: el.currentTime,
          error: el.error?.message || null,
        };
        el.pause();
        return result;
      });
      assert(info.duration > 0);
      assert(info.time > 0.15);
      assert.equal(info.error, null);
      mediaResults.push({ page: name, type, ...info });
    }
    await page.locator("video").evaluate((el) => el.play());
    await page.locator("audio").evaluate((el) => el.play());
    assert.equal(await page.locator("video").evaluate((el) => el.paused), true);
    await page.locator("audio").evaluate((el) => el.pause());
  }
  // Gallery keyboard navigation and focus return.
  await page.locator(".gallery-open").first().click();
  assert(await page.locator("dialog").evaluate((el) => el.open));
  const before = await page.locator("#lightbox-image").getAttribute("src");
  await page.keyboard.press("ArrowRight");
  assert.notEqual(
    await page.locator("#lightbox-image").getAttribute("src"),
    before,
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").evaluate((el) => el.open), false);
  assert(
    await page
      .locator(".gallery-open")
      .first()
      .evaluate((el) => el === document.activeElement),
  );
  // Survey: native required validation, safe local summary, selected night, and reset.
  await page.goto(`${base}survey.html`);
  await page.getByRole("button", { name: "Показать итог" }).click();
  assert.equal(
    await page.locator("#visitor-survey").evaluate((x) => x.checkValidity()),
    false,
  );
  await page
    .getByPlaceholder("Как к вам обращаться")
    .fill("Тестовый посетитель");
  await page.getByPlaceholder("name@example.com").fill("qa@example.com");
  await page.getByPlaceholder("+7 900 000 00 00").fill("+7 900 000 00 00");
  await page.locator("[name=favoriteMedium]").selectOption({ label: "Видео" });
  await page.getByLabel("Ночная", { exact: true }).check();
  await page.locator("[name=futureTopics]").selectOption(["video", "sound"]);
  await page.getByPlaceholder("Что запомнилось?").fill("Проверка сайта");
  await page.getByRole("button", { name: "Показать итог" }).click();
  assert.match(
    await page.locator("#survey-result").innerText(),
    /Спасибо, Тестовый посетитель! Вы выбрали ночную/,
  );
  await page.getByRole("button", { name: "Очистить", exact: true }).click();
  assert.equal(await page.locator("#survey-result").innerText(), "");
  assert.equal(await page.locator("[name=visitorName]").inputValue(), "");
  // Navigation and content still work without JS.
  const plain = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 950, height: 900 },
  });
  await plain.goto(base);
  assert(await plain.locator("#primary-nav").isVisible());
  await plain.close();
  assert.deepEqual(errors, [], "browser errors");
  await fs.writeFile(
    path.join(out, "results.json"),
    JSON.stringify(
      { base, results, mediaResults, errors, functional: "passed" },
      null,
      2,
    ),
  );
  await browser.close();
  console.log(
    JSON.stringify({
      checks: results.length,
      screenshots: 10,
      media: mediaResults,
      errors,
      functional: "passed",
    }),
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
