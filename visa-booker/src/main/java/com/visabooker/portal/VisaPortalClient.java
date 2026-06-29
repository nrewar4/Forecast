package com.visabooker.portal;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import com.visabooker.booking.AppointmentSlot;
import com.visabooker.captcha.CaptchaSolver;
import com.visabooker.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Drives the visa portal with a real browser (Playwright/Chromium).
 *
 * Strategy:
 *   - Log in once, persist the session (cookies) to storage-state.json so
 *     subsequent polls reuse it and avoid re-logging-in / re-solving captcha.
 *   - Poll availability by hitting the portal's own JSON endpoints through the
 *     authenticated browser context — far more reliable than scraping rendered HTML.
 *   - Book by filling the appointment form and submitting.
 *
 * NOTE: This is intended to book YOUR OWN single appointment. Selectors and
 * endpoints live in {@link PortalConfig}; verify them against your live portal.
 */
public final class VisaPortalClient implements AutoCloseable {

    private static final Logger log = LoggerFactory.getLogger(VisaPortalClient.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final Path STORAGE_STATE = Path.of("storage-state.json");

    private final Config cfg;
    private final PortalConfig portal;
    private final CaptchaSolver captcha;
    private final boolean headless;
    private final int debugPort;

    private Playwright playwright;
    private Browser browser;
    private BrowserContext context;
    private Page page;

    public VisaPortalClient(Config cfg, CaptchaSolver captcha) {
        this.cfg = cfg;
        this.portal = new PortalConfig(cfg);
        this.captcha = captcha;
        this.headless = cfg.getBool("browser.headless", false);
        this.debugPort = cfg.getInt("browser.debugPort", 9222);
    }

    /** Launch the browser and restore a saved session if one exists. */
    public void start() {
        playwright = Playwright.create();
        BrowserType.LaunchOptions launch = new BrowserType.LaunchOptions()
                .setHeadless(headless)
                .setSlowMo(headless ? 0 : 80);
        // Expose a stable CDP port so the audio-bypass solver can attach to THIS
        // browser (and thus our authenticated session) when captcha.mode=audio.
        if (captcha.mode() == CaptchaSolver.Mode.AUDIO) {
            launch.setArgs(List.of("--remote-debugging-port=" + debugPort));
        }
        browser = playwright.chromium().launch(launch);

        Browser.NewContextOptions ctxOpts = new Browser.NewContextOptions()
                .setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                        + "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
        if (Files.exists(STORAGE_STATE)) {
            ctxOpts.setStorageStatePath(STORAGE_STATE);
            log.info("Restored saved session from {}", STORAGE_STATE);
        }
        context = browser.newContext(ctxOpts);
        page = context.newPage();
    }

    /** True if the current session is authenticated (no re-login needed). */
    public boolean isLoggedIn() {
        try {
            page.navigate(portal.appointmentUrl(), new Page.NavigateOptions().setTimeout(30000));
            return page.locator(portal.loggedInIndicatorSelector).first().isVisible();
        } catch (Exception e) {
            return false;
        }
    }

    /** Log in with credentials from config; solves captcha if present; saves the session. */
    public void login() {
        String email = cfg.require("portal.email");
        String password = cfg.require("portal.password");

        log.info("Navigating to sign-in page...");
        page.navigate(portal.signInUrl(), new Page.NavigateOptions().setTimeout(45000));

        page.fill(portal.emailSelector, email);
        page.fill(portal.passwordSelector, password);

        // Some flows require accepting a policy checkbox before the button enables.
        Locator policy = page.locator("#policy_confirmed, input[type='checkbox']").first();
        if (policy.count() > 0 && policy.isVisible()) {
            try { policy.check(); } catch (Exception ignore) { /* not required on all portals */ }
        }

        solveCaptchaIfPresent();

        page.click(portal.signInButtonSelector);
        page.waitForLoadState();

        if (!page.locator(portal.loggedInIndicatorSelector).first().isVisible()) {
            throw new IllegalStateException(
                    "Login appears to have failed — check credentials and sel.loggedIn selector.");
        }
        saveSession();
        log.info("Login successful, session saved.");
    }

    /**
     * Fetch available appointment days for a facility via the portal's JSON endpoint,
     * reusing the authenticated browser cookies.
     */
    public List<AppointmentSlot> fetchAvailableDays(String facilityId, String facilityName) {
        List<AppointmentSlot> slots = new ArrayList<>();
        try {
            APIResponse resp = context.request().get(portal.daysJsonUrl(facilityId));
            if (!resp.ok()) {
                log.warn("Days endpoint returned {} for facility {}", resp.status(), facilityId);
                return slots;
            }
            JsonNode arr = MAPPER.readTree(resp.text());
            if (arr.isArray()) {
                for (JsonNode node : arr) {
                    String dateStr = node.path("date").asText(null);
                    if (dateStr != null) {
                        slots.add(new AppointmentSlot(facilityId, facilityName,
                                LocalDate.parse(dateStr), null));
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch available days for {}", facilityId, e);
        }
        return slots;
    }

    /** Fetch bookable times for a specific day. */
    public List<LocalTime> fetchAvailableTimes(String facilityId, LocalDate date) {
        List<LocalTime> times = new ArrayList<>();
        try {
            APIResponse resp = context.request().get(portal.timesJsonUrl(facilityId, date.toString()));
            if (!resp.ok()) return times;
            JsonNode json = MAPPER.readTree(resp.text());
            JsonNode available = json.path("available_times");
            if (available.isArray()) {
                for (JsonNode t : available) {
                    times.add(LocalTime.parse(t.asText()));
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch times for {} on {}", facilityId, date, e);
        }
        return times;
    }

    /**
     * Attempt to actually book the given slot via the appointment form.
     * @return true if the confirmation page was reached.
     */
    public boolean book(AppointmentSlot slot) {
        try {
            log.info("Attempting to book: {}", slot);
            page.navigate(portal.appointmentUrl(), new Page.NavigateOptions().setTimeout(45000));

            page.selectOption(portal.consulateDropdownSelector, slot.facilityId());
            page.waitForTimeout(1500); // let the date picker refresh for the facility

            // The portal usually exposes a JS-driven datepicker; setting the input
            // directly is the most robust path but may need adjustment per portal.
            page.fill(portal.dateInputSelector, slot.date().toString());
            page.waitForTimeout(1000);

            if (slot.time() != null) {
                page.selectOption(portal.timeDropdownSelector, slot.time().toString());
            }

            solveCaptchaIfPresent();

            page.click(portal.submitButtonSelector);
            page.waitForLoadState();

            boolean confirmed = page.getByText("successfully scheduled").count() > 0
                    || page.getByRole(AriaRole.HEADING).filter(
                            new Locator.FilterOptions().setHasText("Consular Appointment")).count() > 0;
            log.info("Booking submitted. Confirmed={}", confirmed);
            saveSession();
            return confirmed;
        } catch (Exception e) {
            log.error("Booking attempt failed for {}", slot, e);
            return false;
        }
    }

    private void solveCaptchaIfPresent() {
        String siteKey = portal.recaptchaSiteKey;
        if (siteKey == null || siteKey.isBlank()) {
            // Try to discover it from the page.
            Locator rc = page.locator(".g-recaptcha[data-sitekey]").first();
            if (rc.count() > 0) {
                siteKey = rc.getAttribute("data-sitekey");
            }
        }
        boolean present = (siteKey != null && !siteKey.isBlank())
                || page.locator(".g-recaptcha, iframe[src*='recaptcha']").count() > 0;
        if (!present) return; // no captcha on this page

        // ---- FREE automated mode: GoogleRecaptchaBypass audio solver ----
        if (captcha.mode() == CaptchaSolver.Mode.AUDIO) {
            boolean ok = solveWithAudioBypass();
            if (!ok && !headless) {
                log.warn("Audio solver failed — falling back to manual solve.");
                waitForManualCaptcha(captcha.manualTimeoutSec());
            }
            return;
        }

        // ---- FREE manual mode: you solve it in the visible browser window ----
        if (captcha.mode() == CaptchaSolver.Mode.MANUAL) {
            if (headless) {
                log.error("reCAPTCHA present but browser is headless and captcha.mode=manual. "
                        + "Set browser.headless=false so you can solve it, or use a solver.");
                return;
            }
            waitForManualCaptcha(captcha.manualTimeoutSec());
            return;
        }

        if (captcha.mode() == CaptchaSolver.Mode.NONE || !captcha.isEnabled()) {
            log.warn("reCAPTCHA present but no solver configured — submission will likely fail.");
            return;
        }
        String token = captcha.solveRecaptchaV2(siteKey, page.url());
        if (token != null) {
            // Inject the token into the hidden textarea reCAPTCHA reads from.
            page.evaluate("(tok) => {"
                    + " let el = document.getElementById('g-recaptcha-response');"
                    + " if (!el) { el = document.createElement('textarea');"
                    + "   el.id = 'g-recaptcha-response'; el.name = 'g-recaptcha-response';"
                    + "   el.style.display='none'; document.body.appendChild(el); }"
                    + " el.value = tok;"
                    + "}", token);
        }
    }

    /**
     * Free automated captcha solving via sarperavci/GoogleRecaptchaBypass.
     * Runs the Python sidecar (python-captcha/solve.py), which attaches to THIS
     * Chromium over its remote-debugging port and solves the audio challenge inside
     * our authenticated session. Requires `./setup-captcha.sh` to have been run.
     * @return true if the sidecar reports the captcha solved.
     */
    private boolean solveWithAudioBypass() {
        String python = cfg.get("captcha.pythonCommand", "python3");
        String script = cfg.get("captcha.solverScript", "python-captcha/solve.py");
        int timeoutSec = cfg.getInt("captcha.audioTimeoutSeconds", 150);
        String address = "127.0.0.1:" + debugPort;

        log.info("Running audio-bypass solver: {} {} {}", python, script, address);
        try {
            try { page.bringToFront(); } catch (Exception ignore) {}

            ProcessBuilder pb = new ProcessBuilder(python, script, address);
            pb.redirectErrorStream(true);
            Process proc = pb.start();

            // Surface the sidecar's progress in our logs.
            Thread pump = new Thread(() -> {
                try (BufferedReader r = new BufferedReader(
                        new InputStreamReader(proc.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = r.readLine()) != null) log.info("[solver] {}", line);
                } catch (Exception ignore) { /* process ended */ }
            });
            pump.setDaemon(true);
            pump.start();

            boolean finished = proc.waitFor(timeoutSec, TimeUnit.SECONDS);
            if (!finished) {
                proc.destroyForcibly();
                log.error("Audio solver timed out after {}s.", timeoutSec);
                return false;
            }
            int exit = proc.exitValue();
            if (exit == 0) {
                log.info("Audio solver reported success.");
                return true;
            }
            if (exit == 3) {
                log.error("Audio solver not set up. Run ./setup-captcha.sh "
                        + "(needs ffmpeg + the cloned GoogleRecaptchaBypass repo).");
            } else {
                log.warn("Audio solver exited with code {} (captcha not solved).", exit);
            }
            return false;
        } catch (Exception e) {
            log.error("Failed to run audio solver", e);
            return false;
        }
    }

    /**
     * Free captcha handling: alert the user (console bell + log) and wait until they
     * tick the reCAPTCHA in the visible browser. We detect completion by polling the
     * hidden g-recaptcha-response field that Google populates once solved.
     * @return true if solved within the timeout.
     */
    private boolean waitForManualCaptcha(int timeoutSec) {
        System.out.print(''); // terminal bell to get your attention
        log.warn("============================================================");
        log.warn("  ACTION NEEDED: please solve the reCAPTCHA in the browser");
        log.warn("  window now. Waiting up to {}s...", timeoutSec);
        log.warn("============================================================");
        try { page.bringToFront(); } catch (Exception ignore) {}

        long deadline = System.currentTimeMillis() + timeoutSec * 1000L;
        while (System.currentTimeMillis() < deadline) {
            try {
                Object val = page.evaluate(
                        "() => { const el = document.getElementById('g-recaptcha-response');"
                                + " return el ? el.value : ''; }");
                if (val != null && !val.toString().isBlank()) {
                    log.info("reCAPTCHA solved — continuing.");
                    return true;
                }
            } catch (Exception ignore) {
                // page may be navigating; keep polling
            }
            page.waitForTimeout(2000);
        }
        log.error("reCAPTCHA not solved within {}s — giving up this cycle.", timeoutSec);
        return false;
    }

    private void saveSession() {
        context.storageState(new BrowserContext.StorageStateOptions().setPath(STORAGE_STATE));
    }

    @Override
    public void close() {
        try { if (context != null) context.close(); } catch (Exception ignore) {}
        try { if (browser != null) browser.close(); } catch (Exception ignore) {}
        try { if (playwright != null) playwright.close(); } catch (Exception ignore) {}
    }
}
