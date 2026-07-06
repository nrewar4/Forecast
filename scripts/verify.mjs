// Drives the built app: homepage + about animations, custom synthesis, the new
// synthesis workspace, login flow (bad + good credentials), admin dashboard,
// gated routes, and the em dash check.
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const base = (process.argv[2] || "http://localhost:4173").replace(/\/$/, "");
const outDir = process.argv[3] || "shots";
mkdirSync(outDir, { recursive: true });

const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || "/opt/pw-browsers/chromium";
const results = [];
const ok = (name, cond, extra = "") =>
  results.push(`${cond ? "PASS" : "FAIL"} ${name}${extra ? " :: " + extra : ""}`);

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

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const shot = (name, full = true) =>
    page.screenshot({ path: `${outDir}/${name}.png`, fullPage: full });

  // 1. Homepage
  await page.goto(base + "/", { waitUntil: "networkidle0", timeout: 30000 });
  await sleep(500);
  // scroll to bottom to trigger reveals + countups, then back up
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await sleep(1600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
  const body = await page.evaluate(() => document.body.innerText);
  ok("home stat line", body.includes("8,927") && body.includes("3,241") && body.includes("30+"));
  ok("home about", /about us/i.test(body));
  ok("no publications", !body.includes("Publications"));
  ok("no em dash on home", !body.includes("—"));
  await shot("01-home");

  // 2. Custom synthesis
  await page.goto(base + "/custom-synthesis", { waitUntil: "networkidle0" });
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await sleep(1200);
  await shot("02-custom-synthesis");

  // 3. Explore synthesis routes -> new workspace page with sidebar
  await page.click('a[href="/synthesis/routes"]');
  await sleep(1200);
  const synthText = await page.evaluate(() => document.body.innerText);
  ok(
    "synthesis workspace sidebar",
    synthText.includes("Custom Synthesis Routes") &&
      synthText.includes("Process Development") &&
      synthText.includes("Scale-up & Manufacturing") &&
      synthText.includes("Start a Project"),
  );
  await shot("03-synthesis-routes");

  await page.goto(base + "/synthesis/process", { waitUntil: "networkidle0" });
  await sleep(500);
  await shot("04-synthesis-process");
  await page.goto(base + "/synthesis/enquiry", { waitUntil: "networkidle0" });
  await sleep(500);
  await shot("05-synthesis-enquiry");

  // 4. Knowledge workspace: no admin items when logged out
  await page.goto(base + "/dashboard", { waitUntil: "networkidle0" });
  await sleep(800);
  const dashText = await page.evaluate(() => document.body.innerText);
  ok("no admin nav logged out", !dashText.includes("Trade Analytics") && !dashText.includes("Site Analytics"));
  ok("admin sign in link", dashText.includes("Admin sign in"));
  await shot("06-dashboard-public", false);

  // 5. Gated route redirects to login
  await page.goto(base + "/trade-analytics", { waitUntil: "networkidle0" });
  await sleep(600);
  ok("gated redirect", page.url().includes("/login"));

  // 6. Login: wrong password
  await page.type("#username", "admin");
  await page.type("#password", "wrong-password");
  await page.click('button[type="submit"]');
  await sleep(800);
  const loginText = await page.evaluate(() => document.body.innerText);
  ok("bad credentials rejected", loginText.includes("not recognized"));
  await shot("07-login-error", false);

  // 7. Login: correct credentials -> back to requested page
  await page.evaluate(() => {
    document.querySelector("#password").value = "";
  });
  await page.type("#password", "apacss@2026");
  await page.click('button[type="submit"]');
  await sleep(1500);
  ok("login redirects to requested page", page.url().includes("/trade-analytics"), page.url());
  const taText = await page.evaluate(() => document.body.innerText);
  ok("admin nav visible", taText.includes("Site Analytics") && taText.includes("Documents"));
  await shot("08-trade-analytics-admin", false);

  // 8. Admin dashboard
  await page.goto(base + "/admin", { waitUntil: "networkidle0" });
  await sleep(1200);
  const adminText = await page.evaluate(() => document.body.innerText);
  ok(
    "admin dashboard renders",
    adminText.includes("Site Analytics") &&
      adminText.includes("Daily traffic") &&
      adminText.includes("Catalog analytics"),
  );
  ok("analytics recorded views", /page views, 7 days/i.test(adminText));
  await shot("09-admin-dashboard");

  // 9. Sign out via sidebar
  const buttons = await page.$$("aside button");
  for (const b of buttons) {
    const t = await b.evaluate((el) => el.innerText);
    if (t.includes("Sign out")) {
      await b.click();
      break;
    }
  }
  await sleep(800);
  await page.goto(base + "/admin", { waitUntil: "networkidle0" });
  await sleep(600);
  ok("sign out re-gates admin", page.url().includes("/login"));

  ok("no page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
} finally {
  await browser.close();
}
console.log(results.join("\n"));
if (results.some((r) => r.startsWith("FAIL"))) process.exit(1);
