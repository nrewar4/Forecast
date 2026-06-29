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

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

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

    private Playwright playwright;
    private Browser browser;
    private BrowserContext context;
    private Page page;

    public VisaPortalClient(Config cfg, CaptchaSolver captcha) {
        this.cfg = cfg;
        this.portal = new PortalConfig(cfg);
        this.captcha = captcha;
        this.headless = cfg.getBool("browser.headless", false);
    }

    /** Launch the browser and restore a saved session if one exists. */
    public void start() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions().setHeadless(headless).setSlowMo(headless ? 0 : 80));

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
        if (siteKey == null || siteKey.isBlank()) return; // no captcha on this page

        if (!captcha.isEnabled()) {
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
