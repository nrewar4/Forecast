// Headless-browser smoke test + screenshots for the v5 platform. Run against a
// preview server:
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

    async function go(path, waitMs = 1200) {
      await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise((r) => setTimeout(r, waitMs));
    }
    const shot = (name) => page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
    const text = () => page.evaluate(() => document.body.innerText);

    // ---- Landing ----
    await go("/");
    await shot("01-landing");
    const t1 = await text();
    check("landing: 3 buttons Procurement/Product Discovery/CDMO", /Procurement/.test(t1) && /Product Discovery/.test(t1) && /\bCDMO\b/.test(t1));
    check("landing: enlarged logo", await page.evaluate(() => {
      const img = document.querySelector('header img[alt*="APAC"]');
      return !!img && img.getBoundingClientRect().height >= 60;
    }));
    check("landing: floating assistant launcher", await page.evaluate(() => !!document.querySelector('button[aria-label="Open assistant"]')));
    check("landing: no em dash", !t1.includes("—"));

    // Product Discovery button target.
    const pdHref = await page.evaluate(() => {
      const a = [...document.querySelectorAll("main a")].find((el) => /Product Discovery/.test(el.innerText));
      return a ? a.getAttribute("href") : null;
    });
    check("landing: Product Discovery -> /knowledge-base", pdHref === "/knowledge-base");

    // ---- Product Discovery ----
    await go("/knowledge-base", 1600);
    const t2 = await text();
    check("knowledge-base titled Product Discovery", /Product Discovery/.test(t2));
    check("knowledge-base: no currency toggle (USD/INR)", !/USD\s*\/\s*INR/.test(t2));
    check("knowledge-base: no Analyst chip", !/\bAnalyst\b/.test(t2));

    // ---- Trade Partners removed ----
    await go("/partners");
    check("partners redirects away", !/Trade Partners/.test(await text()) && !page.url().endsWith("/partners"));

    // ---- Synthesis routes admin-only ----
    await go("/synthesis-routes");
    check("synthesis-routes redirects to /login when logged out", page.url().includes("/login"));

    // ---- CDMO page ----
    await go("/cdmo", 1500);
    await shot("02-cdmo");
    const t3 = await text();
    check("cdmo: hero", /Tell us the problem/.test(t3));
    check("cdmo: path A + path B", /development pathway/i.test(t3) && /can be made/i.test(t3));
    check("cdmo: embedded assistant", /APAC Assistant/.test(t3));
    check("cdmo: contact phone + email", /092128 03501/.test(t3) && /info@apacss\.com/.test(t3));
    check("cdmo: no floating launcher (embedded only)", !(await page.evaluate(() => !!document.querySelector('button[aria-label="Open assistant"]'))));

    // Drive Path A in the embedded assistant. It now walks a question flow:
    // product -> start -> goal -> speed, then renders the tailored pathway.
    const clickChip = async (label, waitMs = 700) => {
      const clicked = await page.evaluate((lbl) => {
        const b = [...document.querySelectorAll("button")].find((el) => el.textContent.trim() === lbl);
        if (b) { b.click(); return true; }
        return false;
      }, label);
      await new Promise((r) => setTimeout(r, waitMs));
      return clicked;
    };
    const cA0 = await clickChip("De-risk my supply", 800);
    const askedProduct = /which product or molecule/i.test(await text());
    const cA1 = await clickChip("Keep it general", 800);
    const askedStart = /where are you today/i.test(await text());
    const cA2 = await clickChip("Working lab process", 800);
    const askedGoal = /where should the engagement finish/i.test(await text());
    const cA3 = await clickChip("Commercial supply", 800);
    const askedSpeed = /speed or certainty/i.test(await text());
    const cA4 = await clickChip("Balanced", 1200);
    const t4 = await text();
    check("cdmo Path A: asks product then start/goal/speed", cA0 && askedProduct && cA1 && askedStart && cA2 && askedGoal && cA3 && askedSpeed && cA4);
    check("cdmo Path A: tailored pathway spine renders", /Your pathway/i.test(t4) && /Walk-away gate/i.test(t4));
    check("cdmo Path A: timeline + milestones shown", /weeks/i.test(t4) && /\bM1\b/.test(t4) && /Indicative planning range/i.test(t4));
    check("cdmo Path A: enquiry form appears", /Send enquiry/.test(t4));

    // Enquiry submit fires (fill + submit).
    await page.evaluate(() => {
      const set = (sel, val) => { const el = document.querySelector(sel); if (el) { const d = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set; d.call(el, val); el.dispatchEvent(new Event("input", { bubbles: true })); } };
      set('input[placeholder="Your name"]', "Test Buyer");
      set('input[placeholder="Work email"]', "buyer@example.com");
    });
    const enquiryBefore = await page.evaluate(() => JSON.parse(localStorage.getItem("apac.analytics.events.v1") || "[]").filter((e) => e.name === "cdmo_enquiry").length);
    await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((el) => /Send enquiry/.test(el.textContent)); b && b.click(); });
    await new Promise((r) => setTimeout(r, 500));
    const enquiryAfter = await page.evaluate(() => JSON.parse(localStorage.getItem("apac.analytics.events.v1") || "[]").filter((e) => e.name === "cdmo_enquiry").length);
    check("cdmo: enquiry submit fires cdmo_enquiry", enquiryAfter > enquiryBefore);

    // ---- Admin login + leads panel ----
    await go("/login");
    await page.type('input[placeholder="admin"]', "admin");
    await page.type('input[type="password"]', "apac-admin");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    await new Promise((r) => setTimeout(r, 900));
    const t5 = await text();
    check("admin: dashboard", /Admin Dashboard/.test(t5));
    check("admin: assistant and CDMO leads panel", /Assistant and CDMO leads/i.test(t5));
    await shot("03-admin");

    // Admin can reach synthesis routes.
    await go("/synthesis-routes");
    check("admin: synthesis-routes reachable", /Synthesis Routes/.test(await text()) && !page.url().includes("/login"));

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
