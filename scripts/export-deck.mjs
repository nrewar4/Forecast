// Render the /deck route to a print-perfect PDF, one slide per page.
// Usage: node scripts/export-deck.mjs [url] [outfile]
// Assumes a static server is already serving the built app (npm run preview).

import puppeteer from "puppeteer";
import { existsSync } from "node:fs";

const URL = process.argv[2] || process.env.DECK_URL || "http://localhost:4173/deck";
const OUT = process.argv[3] || "Pharma_District_MAI_Deck.pdf";

// Prefer puppeteer's own Chromium; fall back to a preinstalled browser.
function resolveExecutable() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  try {
    const p = puppeteer.executablePath();
    if (p && existsSync(p)) return undefined; // let puppeteer use its default
  } catch {}
  for (const c of ["/opt/pw-browsers/chromium", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"]) {
    if (existsSync(c)) return c;
  }
  return undefined;
}

const executablePath = resolveExecutable();

const browser = await puppeteer.launch({
  headless: "new",
  executablePath,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
  console.log("Loading", URL);
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 }).catch(async () => {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  });
  // Let fonts settle and charts paint.
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));

  const count = await page.evaluate(() => document.querySelectorAll(".slide").length);
  console.log("Slides found:", count);
  if (!count) throw new Error("No .slide elements found at " + URL);

  await page.pdf({
    path: OUT,
    printBackground: true,
    width: "1280px",
    height: "720px",
    pageRanges: `1-${count}`,
    preferCSSPageSize: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log("Wrote", OUT, "(" + count + " pages)");
} finally {
  await browser.close();
}
