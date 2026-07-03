// Headless-browser smoke test + screenshots. Run against a preview server:
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
  const check = (name, pass) => results.push([name, pass]);

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    async function go(path, waitMs = 700) {
      await page.goto(base + path, { waitUntil: "networkidle0", timeout: 30000 });
      await new Promise((r) => setTimeout(r, waitMs));
    }
    // Scroll through the page so IntersectionObserver-driven reveals fire, then
    // return to the top for a clean full-page capture.
    async function warmReveals() {
      await page.evaluate(async () => {
        const step = window.innerHeight / 2;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
      });
      await new Promise((r) => setTimeout(r, 900));
    }
    async function shot(name) {
      await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
    }
    const text = () => page.evaluate(() => document.body.innerText);

    // ---- Landing ----
    await go("/", 1200);
    await warmReveals(); // fire scroll reveals + settle count-ups
    await shot("01-landing");
    const t1 = await text();
    check("landing: stat line 8,927", /8,927/.test(t1));
    check("landing: stat line 3,241", /3,241/.test(t1));
    check("landing: About 'One network'", /One network/i.test(t1));
    check("landing: CDMO process", /CDMO process/i.test(t1));
    check("landing: no Publications", !/Publications/.test(t1));
    check("landing: no 'Live' badge", !/\bLive\b/.test(t1));
    check("landing: no em dash", !t1.includes("—"));
    const tiles = await page.evaluate(
      () => [...document.querySelectorAll("main a")].filter((a) => /^(Buy|Knowledge|Custom Synthesis)$/.test(a.innerText.trim().split("\n")[0])).length,
    );
    check("landing: 3 minimal entry tiles", tiles === 3);

    // ---- Anonymous: admin pages redirect to login ----
    await go("/trade-analytics");
    check("guard: /trade-analytics redirects to /login", page.url().includes("/login"));
    await go("/documents");
    check("guard: /documents redirects to /login", page.url().includes("/login"));

    // ---- Knowledge sidebar hides admin items when anonymous ----
    await go("/dashboard");
    const t2 = await text();
    check("sidebar: no Trade Analytics for anonymous", !/Trade Analytics/.test(t2));
    check("sidebar: no Documents for anonymous", !/Documents/.test(t2));
    check("sidebar: has Admin sign in", /Admin sign in/i.test(t2));
    await shot("02-knowledge-anonymous");

    // ---- Synthesis workspace ----
    await go("/synthesis-routes");
    const t3 = await text();
    check("synthesis: workspace title", /Custom Synthesis Routes/.test(t3));
    check("synthesis: own sidebar section", /Custom Synthesis\n/.test(t3));
    await shot("03-synthesis-workspace");

    // ---- Login flow ----
    await go("/login");
    await shot("04-login");
    await page.type('input[placeholder="admin"]', "admin");
    await page.type('input[type="password"]', "apac-admin");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0", timeout: 15000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    await new Promise((r) => setTimeout(r, 900));
    check("login: lands on /admin", page.url().includes("/admin"));
    const t4 = await text();
    check("admin: dashboard title", /Admin Dashboard/.test(t4));
    check("admin: platform data", /Platform data/i.test(t4));
    await shot("05-admin-dashboard");

    // ---- Admin sees gated pages ----
    await go("/trade-analytics");
    check("admin: trade analytics reachable", !page.url().includes("/login"));
    await go("/dashboard");
    const t5 = await text();
    check("sidebar: Trade Analytics visible for admin", /Trade Analytics/.test(t5));
    check("sidebar: Sign out visible", /Sign out/.test(t5));
    await shot("06-knowledge-admin");

    // ---- Report ----
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
