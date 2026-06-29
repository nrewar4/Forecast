package com.visabooker;

import com.visabooker.booking.BookingService;
import com.visabooker.captcha.CaptchaSolver;
import com.visabooker.config.Config;
import com.visabooker.notify.NotificationService;
import com.visabooker.portal.VisaPortalClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ThreadLocalRandom;

/**
 * Entry point. Runs an endless poll loop: every N minutes (jittered) it checks
 * for an open appointment and books/alerts per your criteria. Stops once booked.
 *
 *   mvn -q exec:java         (dev)
 *   java -jar target/visa-booker.jar   (packaged)
 */
public final class App {

    private static final Logger log = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        Config cfg = Config.load();

        int baseIntervalSec = cfg.getInt("poll.intervalSeconds", 180); // 3 min default
        int jitterSec = cfg.getInt("poll.jitterSeconds", 60);          // +0..60s random

        CaptchaSolver captcha = new CaptchaSolver(cfg);
        NotificationService notifier = new NotificationService(cfg);

        log.info("===== US Visa (India B2) appointment watcher starting =====");
        log.info("Poll interval ~{}s (+ up to {}s jitter). Auto-book={}",
                baseIntervalSec, jitterSec, cfg.getBool("search.autoBook", false));

        try (VisaPortalClient portal = new VisaPortalClient(cfg, captcha)) {
            portal.start();
            BookingService booking = new BookingService(cfg, portal, notifier);

            // Graceful shutdown.
            Runtime.getRuntime().addShutdownHook(new Thread(() -> log.info("Shutting down...")));

            int consecutiveFailures = 0;
            while (!booking.isBooked()) {
                try {
                    booking.runOnce();
                    consecutiveFailures = 0;
                } catch (Exception e) {
                    consecutiveFailures++;
                    log.error("Poll cycle failed (#{}): {}", consecutiveFailures, e.getMessage(), e);
                    if (consecutiveFailures == 3) {
                        notifier.notifyAll("⚠️ Visa watcher having trouble",
                                "3 consecutive failures. Latest: " + e.getMessage()
                                        + ". The watcher keeps retrying.");
                    }
                    // Back off harder when failing repeatedly (avoid IP ban).
                    sleep((long) baseIntervalSec * Math.min(consecutiveFailures, 5) * 1000L);
                    continue;
                }

                long waitMs = (baseIntervalSec + ThreadLocalRandom.current().nextInt(jitterSec + 1)) * 1000L;
                log.info("Next check in {}s", waitMs / 1000);
                sleep(waitMs);
            }
            log.info("Appointment booked — watcher exiting. Congratulations!");
        }
    }

    private static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
