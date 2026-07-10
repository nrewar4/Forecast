// Drives the built app end to end: landing (logo + 3 buttons), Product Discovery
// entry + title, removed Trade Partners, header without currency toggle / analyst
// chip, admin-gated synthesis routes, the /cdmo page + assistant (Path B vendor
// count, no vendor names), the enquiry event, and an em dash check.
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const base = (process.argv[2] || "http://localhost:4173").replace(/\/$/, "");
const outDir = process.argv[3] || "shots";
mkdirSync(outDir, { recursive: true });

const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || "/opt/pw-browsers/chromium";
const results = [];
const ok = (name, cond, extra = "") => results.push(`${cond ? "PASS" : "FAIL"} ${name}${extra ? " :: " + extra : ""}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: "new",
  executablePath: execPath,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const shot = (n, full = true) => page.screenshot({ path: `${outDir}/${n}.png`, fullPage: full });

  // 1. Landing
  await page.goto(base + "/", { waitUntil: "networkidle0", timeout: 30000 });
  await sleep(500);
  const logoH = await page.evaluate(() => {
    const img = document.querySelector('header img[alt*="APAC"]');
    return img ? img.getBoundingClientRect().height : 0;
  });
  ok("landing logo enlarged", logoH >= 60, `${Math.round(logoH)}px`);
  const body = await page.evaluate(() => document.body.innerText);
  ok("three entry buttons", /Procurement/.test(body) && /Product Discovery/.test(body) && /CDMO/.test(body));
  ok("no em dash on landing", !body.includes("—"));
  await shot("01-landing");

  // Product Discovery button routes to knowledge base titled Product Discovery
  await page.evaluate(() => {
    const a = [...document.querySelectorAll("a")].find((x) => x.textContent.trim().startsWith("Product Discovery"));
    a?.click();
  });
  await sleep(900);
  ok("product discovery -> knowledge-base", page.url().includes("/knowledge-base"), page.url());
  const kbText = await page.evaluate(() => document.body.innerText);
  const headerText = await page.evaluate(() => document.querySelector("header")?.innerText || "");
  ok("knowledge base titled Product Discovery", /Product Discovery/.test(kbText));
  ok("no analyst chip in header", !/Analyst/.test(headerText) && !/APAC Sourcing/.test(headerText));
  ok("no currency toggle", !/USD\s*\/\s*INR/.test(headerText) && !headerText.includes("INR"));
  await shot("02-product-discovery", false);

  // 2. Trade Partners removed
  await page.goto(base + "/partners", { waitUntil: "networkidle0" });
  await sleep(600);
  ok("partners route removed (redirects)", page.url().includes("/knowledge-base"), page.url());

  // 3. Synthesis routes admin-gated
  await page.goto(base + "/synthesis-routes", { waitUntil: "networkidle0" });
  await sleep(600);
  ok("synthesis routes gated -> login", page.url().includes("/login"), page.url());

  // 4. CDMO page + assistant
  await page.goto(base + "/cdmo", { waitUntil: "networkidle0" });
  await sleep(800);
  const cdmoText = await page.evaluate(() => document.body.innerText);
  ok("cdmo page renders", /Tell us what you are building/.test(cdmoText));
  ok("cdmo assistant embedded", /APAC CDMO Assistant/.test(cdmoText));
  ok("no floating chat on cdmo", (await page.$$('[aria-label="Open the APAC assistant"]')).length === 0);
  await shot("03-cdmo");

  // Path B: type a molecule into the embedded assistant
  const input = await page.$('input[placeholder*="product"], input[placeholder*="CAS"]');
  await input.type("ibuprofen");
  await page.keyboard.press("Enter");
  // wait for the feasibility card (PubChem lookup + render)
  await sleep(9000);
  const afterText = await page.evaluate(() => document.body.innerText);
  ok("feasibility vendor count shown", /capable manufacturers/.test(afterText));
  // The CAS field is always wired; its value resolves live from PubChem in a real
  // browser (PubChem is network-blocked in this sandbox, so it may read "Not listed").
  ok("feasibility shows CAS field", /CAS number/i.test(afterText));
  ok("feasibility core chemistry", /Core chemistry/i.test(afterText));
  ok("timeline options offered", /\bFast\b/.test(afterText) && /Certainty/.test(afterText));
  ok("vendor identities withheld", !/(BASF|Sinopec|Reliance Industries|ExxonMobil)/.test(afterText));
  await shot("04-cdmo-feasibility");

  // Pick a timeline priority and expect a milestone projection
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === "Balanced");
    b?.click();
  });
  await sleep(2500);
  const milestoneText = await page.evaluate(() => document.body.innerText);
  ok("milestones projected", /Milestone projection/.test(milestoneText) && /Indicative timeline/.test(milestoneText));
  await shot("05-cdmo-milestones");

  // Floating widget appears on a non-embedded page
  await page.goto(base + "/", { waitUntil: "networkidle0" });
  await sleep(900);
  ok("floating chat on landing", (await page.$$('[aria-label="Open the APAC assistant"]')).length === 1);

  // Market Overview is framed as chemical trade from a verified source
  await page.goto(base + "/dashboard", { waitUntil: "networkidle0" });
  await sleep(1500);
  const dashText = await page.evaluate(() => document.body.innerText);
  ok("market overview chemical only", /Chemical trade/.test(dashText) && !/merchandise trade/i.test(dashText));

  // 5. Admin login and dashboard shows lead KPIs
  await page.goto(base + "/login", { waitUntil: "networkidle0" });
  await sleep(400);
  await page.type('input[placeholder="admin"]', "admin");
  await page.type('input[type="password"]', "apac-admin");
  await page.click('button[type="submit"]');
  await sleep(1600);
  await page.goto(base + "/admin", { waitUntil: "networkidle0" });
  await sleep(1200);
  const adminText = await page.evaluate(() => document.body.innerText);
  ok("admin login works", !page.url().includes("/login"), page.url());
  ok("admin lead panel present", /assistant and cdmo leads/i.test(adminText));
  await shot("06-admin", false);

  ok("no page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
} finally {
  await browser.close();
}
console.log(results.join("\n"));
if (results.some((r) => r.startsWith("FAIL"))) process.exit(1);
