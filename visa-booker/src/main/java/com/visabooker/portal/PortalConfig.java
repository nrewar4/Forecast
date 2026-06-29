package com.visabooker.portal;

import com.visabooker.config.Config;

/**
 * Every portal-specific URL, selector and endpoint lives here.
 *
 * ────────────────────────────────────────────────────────────────────────
 *  WHY THIS FILE EXISTS
 * ────────────────────────────────────────────────────────────────────────
 *  The US visa appointment portal changes its markup periodically, and India's
 *  B2 flow runs on usvisascheduling.com — which differs from the older
 *  ais.usvisa-info.com system that most open-source bots target.
 *
 *  Rather than scatter brittle CSS selectors through the code, they are all
 *  collected here and overridable from config.properties. After you log in and
 *  open the browser dev-tools (Network + Elements tabs), copy the real values
 *  in and you're done — no recompile needed if you set them in config.
 *
 *  The DEFAULTS below follow the well-documented ais.usvisa-info.com flow as a
 *  reference. VERIFY each one against your actual portal before relying on it.
 * ────────────────────────────────────────────────────────────────────────
 */
public final class PortalConfig {

    // Base, e.g. https://www.usvisascheduling.com  OR  https://ais.usvisa-info.com
    public final String baseUrl;
    // Locale/country path segment used by the usvisa-info flow, e.g. "en-ca". For
    // usvisascheduling this is unused; leave default.
    public final String localePath;
    // Your existing appointment "schedule id" (from the URL once logged in).
    public final String scheduleId;

    // --- Page paths (relative to baseUrl) ---
    public final String signInPath;
    public final String appointmentPath;

    // --- Login form selectors ---
    public final String emailSelector;
    public final String passwordSelector;
    public final String signInButtonSelector;
    public final String loggedInIndicatorSelector; // something only visible when authenticated

    // --- Appointment form selectors ---
    public final String consulateDropdownSelector;
    public final String dateInputSelector;
    public final String timeDropdownSelector;
    public final String submitButtonSelector;
    public final String recaptchaSiteKey; // data-sitekey of the reCAPTCHA, "" if none

    public PortalConfig(Config cfg) {
        this.baseUrl     = cfg.get("portal.baseUrl", "https://ais.usvisa-info.com");
        this.localePath  = cfg.get("portal.localePath", "en-ca");
        this.scheduleId  = cfg.get("portal.scheduleId", "");

        this.signInPath      = cfg.get("portal.signInPath", "/{locale}/niv/users/sign_in");
        this.appointmentPath = cfg.get("portal.appointmentPath",
                "/{locale}/niv/schedule/{scheduleId}/appointment");

        this.emailSelector        = cfg.get("sel.email", "#user_email");
        this.passwordSelector     = cfg.get("sel.password", "#user_password");
        this.signInButtonSelector = cfg.get("sel.signInButton", "input[name='commit']");
        this.loggedInIndicatorSelector = cfg.get("sel.loggedIn", "a.down-arrow, .medium-12.column");

        this.consulateDropdownSelector = cfg.get("sel.consulate", "#appointments_consulate_appointment_facility_id");
        this.dateInputSelector  = cfg.get("sel.dateInput", "#appointments_consulate_appointment_date");
        this.timeDropdownSelector = cfg.get("sel.time", "#appointments_consulate_appointment_time");
        this.submitButtonSelector = cfg.get("sel.submit", "#appointments_submit");
        this.recaptchaSiteKey   = cfg.get("portal.recaptchaSiteKey", "");
    }

    public String signInUrl() {
        return baseUrl + expand(signInPath);
    }

    public String appointmentUrl() {
        return baseUrl + expand(appointmentPath);
    }

    /**
     * Days-available JSON endpoint (usvisa-info style):
     *   /{locale}/niv/schedule/{scheduleId}/appointment/days/{facilityId}.json
     * Returns: [{"date":"2026-07-15","business_day":true}, ...]
     */
    public String daysJsonUrl(String facilityId) {
        return baseUrl + expand("/{locale}/niv/schedule/{scheduleId}/appointment/days/"
                + facilityId + ".json?appointments[expedite]=false");
    }

    /**
     * Times-available JSON endpoint for a given day:
     *   /{locale}/niv/schedule/{scheduleId}/appointment/times/{facilityId}.json?date=YYYY-MM-DD
     * Returns: {"available_times":["09:00","09:30"], "business_times":[...]}
     */
    public String timesJsonUrl(String facilityId, String date) {
        return baseUrl + expand("/{locale}/niv/schedule/{scheduleId}/appointment/times/"
                + facilityId + ".json?date=" + date + "&appointments[expedite]=false");
    }

    private String expand(String template) {
        return template.replace("{locale}", localePath).replace("{scheduleId}", scheduleId);
    }
}
