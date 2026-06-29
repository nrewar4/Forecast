package com.visabooker.captcha;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.visabooker.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Solves Google reCAPTCHA v2 using the 2Captcha API (https://2captcha.com).
 * Returns the g-recaptcha-response token, which you then inject into the page
 * before submitting the form.
 *
 * Required config:
 *   captcha.provider   (currently only "2captcha")
 *   captcha.apiKey
 *
 * To use it you need the site's reCAPTCHA "sitekey" (visible in page HTML,
 * data-sitekey attribute) and the page URL.
 */
public final class CaptchaSolver {

    private static final Logger log = LoggerFactory.getLogger(CaptchaSolver.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    /**
     * manual    = free, you solve it in the visible browser.
     * audio     = free, automated via GoogleRecaptchaBypass (audio challenge + STT).
     * 2captcha  = paid API, automated.
     * none      = do nothing.
     */
    public enum Mode { MANUAL, AUDIO, TWOCAPTCHA, NONE }

    private final String apiKey;
    private final Mode mode;
    private final int manualTimeoutSec;
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(20)).build();

    public CaptchaSolver(Config cfg) {
        this.apiKey = cfg.get("captcha.apiKey");
        this.manualTimeoutSec = cfg.getInt("captcha.manualTimeoutSeconds", 300);
        // Default: free manual mode unless a 2captcha key is supplied.
        String configured = cfg.get("captcha.mode",
                (apiKey != null && !apiKey.isBlank()) ? "2captcha" : "manual");
        this.mode = switch (configured.trim().toLowerCase()) {
            case "2captcha", "twocaptcha" -> Mode.TWOCAPTCHA;
            case "audio", "bypass" -> Mode.AUDIO;
            case "none", "off" -> Mode.NONE;
            default -> Mode.MANUAL;
        };
        if (mode == Mode.TWOCAPTCHA && (apiKey == null || apiKey.isBlank())) {
            log.warn("captcha.mode=2captcha but no captcha.apiKey set — falling back to none.");
        }
        log.info("Captcha mode: {}", mode);
    }

    public Mode mode() { return mode; }
    public int manualTimeoutSec() { return manualTimeoutSec; }

    /** True only for the paid API path (manual solving needs no remote service). */
    public boolean isEnabled() { return mode == Mode.TWOCAPTCHA && apiKey != null && !apiKey.isBlank(); }

    /**
     * Submits the captcha to 2Captcha and polls until solved.
     * @return the reCAPTCHA token, or null on failure.
     */
    public String solveRecaptchaV2(String siteKey, String pageUrl) {
        if (!isEnabled()) return null;
        try {
            // 1. Submit the task.
            String submitUrl = "https://2captcha.com/in.php?key=" + apiKey
                    + "&method=userrecaptcha&googlekey=" + siteKey
                    + "&pageurl=" + URI.create(pageUrl).toASCIIString()
                    + "&json=1";
            JsonNode submit = MAPPER.readTree(getBody(submitUrl));
            if (submit.path("status").asInt() != 1) {
                log.error("2Captcha submit failed: {}", submit.path("request").asText());
                return null;
            }
            String captchaId = submit.path("request").asText();
            log.info("Captcha submitted (id={}), waiting for solution...", captchaId);

            // 2. Poll for the result (2Captcha needs ~15-30s).
            String resUrl = "https://2captcha.com/res.php?key=" + apiKey
                    + "&action=get&id=" + captchaId + "&json=1";
            for (int attempt = 0; attempt < 24; attempt++) {  // ~2 minutes max
                Thread.sleep(5000);
                JsonNode res = MAPPER.readTree(getBody(resUrl));
                String request = res.path("request").asText();
                if (res.path("status").asInt() == 1) {
                    log.info("Captcha solved.");
                    return request;
                }
                if (!"CAPCHA_NOT_READY".equals(request)) {
                    log.error("2Captcha error: {}", request);
                    return null;
                }
            }
            log.error("Captcha solve timed out.");
            return null;
        } catch (Exception e) {
            log.error("Captcha solve failed", e);
            return null;
        }
    }

    private String getBody(String url) throws Exception {
        HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(30)).GET().build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        return resp.body();
    }
}
