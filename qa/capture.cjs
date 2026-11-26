// Refresh the ten final screenshots after visual/content-only corrections.
const { chromium } = require("playwright");
const fs = require("node:fs/promises");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const name of [
      "index",
      "technology",
      "experiment",
      "gallery",
      "survey",
    ]) {
      await page.goto(`http://127.0.0.1:8765/${name}.html`, {
        waitUntil: "domcontentloaded",
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map(async (i) => {
            i.loading = "eager";
            await i.decode().catch(() => {});
          }),
        );
      });
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: [...document.images]
          .filter((x) => !x.complete || !x.naturalWidth)
          .map((x) => x.src),
      }));
      if (state.overflow || state.broken.length)
        throw new Error(JSON.stringify({ name, width, ...state }));
      await page.screenshot({
        path: `/workspace/shared/genesis-qa/${name}-${width}.png`,
        fullPage: true,
        animations: "disabled",
      });
      if (name === "index" && width === 1440)
        await page.screenshot({
          path: "/workspace/shared/genesis-qa/home-desktop.png",
          animations: "disabled",
        });
      if (name === "experiment" && width === 1440)
        await page
          .locator("#audio")
          .screenshot({
            path: "/workspace/shared/genesis-qa/music-desktop.png",
            animations: "disabled",
          });
      console.log(`${name}: ${width}px passed`);
    }
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
