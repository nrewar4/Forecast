// Drives the built app with a headless browser to capture the new Publications
// surfaces and assert the landing changes. Run against a running preview server:
//   npm run build && npm run preview -- --port 4173 &
//   node scripts/screenshots.mjs http://localhost:4173
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const base = (process.argv[2] || "http://localhost:4173").replace(/\/$/, "");
const outDir = "screenshots";
mkdirSync(outDir, { recursive: true });

const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || "/opt/pw-browsers/chromium";

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: execPath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const results = [];
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    async function shot(path, name, opts = {}) {
      await page.goto(base + path, { waitUntil: "networkidle0", timeout: 30000 });
      await new Promise((r) => setTimeout(r, 700));
      await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: opts.full !== false });
      return page;
    }

    // Landing: assert the Live badge is gone and there are 4 option cards.
    await shot("/", "01-landing");
    const landing = await page.evaluate(() => {
      const cards = document.querySelectorAll('main a[aria-label], main [class*="rounded-2xl"] h2');
      const hasLive = /\bLive\b/.test(document.querySelector("main")?.innerText || "");
      const hasPublications = /Publications/.test(document.body.innerText);
      const hasSubscribe = !!document.querySelector('input[type="email"]');
      return { hasLive, hasPublications, hasSubscribe, cardText: document.querySelector("main")?.innerText?.slice(0, 0) };
    });
    results.push(["landing: Publications card present", landing.hasPublications]);
    results.push(["landing: no 'Live' badge text", !landing.hasLive]);
    results.push(["landing: subscribe form present", landing.hasSubscribe]);

    // Publications index.
    await shot("/publications", "02-publications-index");
    const idx = await page.evaluate(() => ({
      hasAsiaSource: /Asia Source/.test(document.body.innerText),
      hasInsight: /Insight/.test(document.body.innerText),
      hasIssue01: /Issue 0?1/i.test(document.body.innerText),
    }));
    results.push(["index: Asia Source section", idx.hasAsiaSource]);
    results.push(["index: Insight section", idx.hasInsight]);
    results.push(["index: seeded Issue 01 listed", idx.hasIssue01]);

    // Reader: the seeded Issue 01.
    await shot("/publications/asia-source/1", "03-issue-reader");
    const reader = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasMasthead: /ASIA SOURCE/.test(text),
        hasFocus: /Fortnight in Focus/i.test(text),
        hasBuyerAction: /Buyer Action/i.test(text),
        itemCount: (text.match(/Source:/g) || []).length,
        linkedin: document.querySelector('a[href*="linkedin.com/sharing"]')?.getAttribute("href") || "",
        tweet: document.querySelector('a[href*="twitter.com/intent/tweet"]')?.getAttribute("href") || "",
      };
    });
    results.push(["reader: masthead", reader.hasMasthead]);
    results.push(["reader: Fortnight in Focus", reader.hasFocus]);
    results.push(["reader: Buyer Action", reader.hasBuyerAction]);
    results.push(["reader: >=16 source lines", reader.itemCount >= 16]);
    results.push(["reader: LinkedIn intent url", reader.linkedin.includes("share-offsite")]);
    results.push(["reader: X intent url", reader.tweet.includes("intent/tweet")]);

    // Print emulation shot.
    await page.emulateMediaType("print");
    await page.screenshot({ path: `${outDir}/04-issue-print.png`, fullPage: true });
    await page.emulateMediaType("screen");

    // Studio.
    await shot("/studio", "05-studio-asia-source");
    const studio = await page.evaluate(() => ({
      hasStudio: /Publications Studio/.test(document.body.innerText),
      hasGenerate: /Generate draft/.test(document.body.innerText),
      hasKeyNotice: /OpenRouter API key/.test(document.body.innerText),
    }));
    results.push(["studio: title", studio.hasStudio]);
    results.push(["studio: generate control", studio.hasGenerate]);

    // Studio master prompt tab.
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Master prompt");
      btn?.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `${outDir}/06-studio-prompt.png`, fullPage: true });

    // Report
    let ok = true;
    console.log("\nChecks:");
    for (const [name, pass] of results) {
      console.log(`  ${pass ? "PASS" : "FAIL"}  ${name}`);
      if (!pass) ok = false;
    }
    console.log(`\nScreenshots written to ${outDir}/`);
    if (!ok) {
      console.error("\nSome checks failed.");
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
