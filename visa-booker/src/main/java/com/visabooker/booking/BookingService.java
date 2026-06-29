package com.visabooker.booking;

import com.visabooker.config.Config;
import com.visabooker.notify.NotificationService;
import com.visabooker.portal.VisaPortalClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * One poll cycle: ensure logged in → check each consulate → if a matching slot
 * is found, either book it (autoBook) or just alert. De-duplicates alerts so you
 * aren't spammed for the same slot every cycle.
 */
public final class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final VisaPortalClient portal;
    private final NotificationService notifier;
    private final BookingCriteria criteria;
    private final Map<String, String> facilities; // id -> human name

    private final boolean keepChasing;     // after rescheduling, keep hunting even-earlier dates
    private String lastAlertedSlotKey = null;
    private volatile boolean done = false;  // stop the loop (only when keepChasing=false)

    public BookingService(Config cfg, VisaPortalClient portal, NotificationService notifier) {
        this.portal = portal;
        this.notifier = notifier;
        this.criteria = BookingCriteria.fromConfig(cfg);
        this.facilities = parseFacilities(cfg);
        this.keepChasing = cfg.getBool("search.keepChasing", true);
    }

    /** @return true once the loop should stop (a reschedule succeeded and keepChasing=false). */
    public boolean isBooked() { return done; }

    public void runOnce() {
        if (done) return;

        if (!portal.isLoggedIn()) {
            log.info("Session not authenticated, logging in...");
            portal.login();
        }

        // Establish the date we're trying to beat. Config value wins; else auto-detect.
        if (criteria.currentAppointmentDate() == null) {
            LocalDate detected = portal.fetchCurrentAppointmentDate();
            if (detected != null) {
                criteria.setCurrentAppointmentDate(detected);
                log.info("Current appointment date detected: {}", detected);
            } else {
                log.warn("Current appointment date unknown — set appointment.currentDate in config "
                        + "so the app only books slots EARLIER than it. Skipping this cycle.");
                return;
            }
        }
        LocalDate current = criteria.currentAppointmentDate();
        log.info("Looking for any slot earlier than {} (window from {}{})", current,
                criteria.earliest(), criteria.latest() != null ? " to " + criteria.latest() : "");

        // Which facilities to check: explicit preferences, else all known ones.
        List<String> ids = criteria.preferredFacilityIds().isEmpty()
                ? List.copyOf(facilities.keySet())
                : criteria.preferredFacilityIds();

        // Find the EARLIEST acceptable slot across all facilities, not just the first.
        AppointmentSlot best = null;
        for (String facilityId : ids) {
            String name = facilities.getOrDefault(facilityId, facilityId);
            List<AppointmentSlot> days = portal.fetchAvailableDays(facilityId, name);
            log.info("{}: {} day(s) returned", name, days.size());
            for (AppointmentSlot day : days) {
                if (!criteria.matches(day)) continue;
                if (best == null || day.date().isBefore(best.date())) best = day;
            }
        }

        if (best == null) {
            log.info("No earlier slot this cycle (still {}).", current);
            return;
        }

        // Resolve a concrete time so we can actually book.
        List<LocalTime> times = portal.fetchAvailableTimes(best.facilityId(), best.date());
        AppointmentSlot target = times.isEmpty()
                ? best
                : new AppointmentSlot(best.facilityId(), best.facilityName(), best.date(), times.get(0));

        handleMatch(target, current);
    }

    private void handleMatch(AppointmentSlot slot, LocalDate previous) {
        String key = slot.facilityId() + "|" + slot.date() + "|" + slot.time();

        if (criteria.autoBook()) {
            log.info("Earlier slot found ({} < {}). Attempting reschedule...", slot.date(), previous);
            boolean ok = portal.book(slot);
            if (ok) {
                // Move the goalpost to the new (earlier) date and keep chasing if enabled.
                criteria.setCurrentAppointmentDate(slot.date());
                notifier.notifyAll("✅ Visa appointment RESCHEDULED EARLIER",
                        "Moved from " + previous + " to " + slot + ". "
                                + (keepChasing ? "Still watching for an even earlier date."
                                               : "Watcher stopping. Log in to confirm/pay if required."));
                if (!keepChasing) done = true;
            } else {
                notifier.notifyAll("⚠️ Reschedule attempt failed",
                        "Found " + slot + " (earlier than " + previous + ") but the reschedule did not "
                                + "confirm — it may have been taken. Will keep trying.");
            }
        } else {
            // Notify-only mode: alert once per distinct slot.
            if (!key.equals(lastAlertedSlotKey)) {
                lastAlertedSlotKey = key;
                notifier.notifyAll("Earlier visa slot available",
                        "Open slot " + slot + " is earlier than your " + previous + " appointment. "
                                + "Set search.autoBook=true to grab it automatically, or reschedule yourself.");
            }
        }
    }

    /**
     * facilities config format:  id=Name,id=Name
     * e.g. portal.facilities=122=Mumbai,123=New Delhi,124=Chennai,125=Hyderabad,126=Kolkata
     */
    private static Map<String, String> parseFacilities(Config cfg) {
        Map<String, String> map = new LinkedHashMap<>();
        String raw = cfg.get("portal.facilities", "");
        if (!raw.isBlank()) {
            for (String pair : raw.split(",")) {
                String[] kv = pair.split("=", 2);
                if (kv.length == 2) map.put(kv[0].trim(), kv[1].trim());
            }
        }
        if (map.isEmpty()) {
            log.warn("No portal.facilities configured — nothing to check. "
                    + "Find your consulate facility IDs in the appointment page dropdown.");
        }
        return map;
    }
}
