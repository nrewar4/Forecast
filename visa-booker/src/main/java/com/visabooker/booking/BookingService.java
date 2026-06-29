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
    private boolean bookMode;              // true = initial booking (no appointment yet)
    private String lastAlertedSlotKey = null;
    private volatile boolean done = false;  // stop the loop (only when keepChasing=false)

    public BookingService(Config cfg, VisaPortalClient portal, NotificationService notifier) {
        this.portal = portal;
        this.notifier = notifier;
        this.criteria = BookingCriteria.fromConfig(cfg);
        this.facilities = parseFacilities(cfg);
        this.keepChasing = cfg.getBool("search.keepChasing", true);
        // mode: "book" = grab the first available slot (you have no appointment yet);
        //       "reschedule" = only grab slots earlier than your current appointment.
        this.bookMode = "book".equalsIgnoreCase(cfg.get("appointment.mode", "reschedule").trim());
    }

    /** @return true once the loop should stop (a reschedule succeeded and keepChasing=false). */
    public boolean isBooked() { return done; }

    public void runOnce() {
        if (done) return;

        if (!portal.isLoggedIn()) {
            log.info("Session not authenticated, logging in...");
            portal.login();
        }

        // In RESCHEDULE mode we need the current appointment date (the date to beat).
        // In BOOK mode there is none yet — we grab the first slot in the window.
        if (!bookMode && criteria.currentAppointmentDate() == null) {
            LocalDate detected = portal.fetchCurrentAppointmentDate();
            if (detected != null) {
                criteria.setCurrentAppointmentDate(detected);
                log.info("Current appointment date detected: {}", detected);
            } else {
                log.warn("Current appointment date unknown — set appointment.currentDate, or use "
                        + "appointment.mode=book if you have no appointment yet. Skipping this cycle.");
                return;
            }
        }
        LocalDate current = criteria.currentAppointmentDate(); // null in book mode
        if (bookMode) {
            log.info("BOOK mode: looking for the earliest available slot (window from {}{}).",
                    criteria.earliest(), criteria.latest() != null ? " to " + criteria.latest() : "");
        } else {
            log.info("RESCHEDULE mode: looking for any slot earlier than {} (window from {}{}).", current,
                    criteria.earliest(), criteria.latest() != null ? " to " + criteria.latest() : "");
        }

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
            log.info(bookMode ? "No available slot this cycle."
                              : "No earlier slot this cycle (still " + current + ").");
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

        boolean initial = (previous == null); // book mode with no appointment yet

        if (criteria.autoBook()) {
            log.info(initial ? "Available slot found ({}). Attempting to book..."
                             : "Earlier slot found ({} < " + previous + "). Attempting reschedule...",
                    slot.date());
            boolean ok = portal.book(slot);
            if (ok) {
                // Now we hold this date. Switch to reschedule mode so future cycles
                // chase even-earlier dates, and move the goalpost.
                criteria.setCurrentAppointmentDate(slot.date());
                bookMode = false;
                if (initial) {
                    notifier.notifyAll("✅ Visa appointment BOOKED",
                            "Booked " + slot + ". "
                                    + (keepChasing ? "Now watching for an EARLIER date automatically."
                                                   : "Watcher stopping. Log in to confirm/pay if required."));
                } else {
                    notifier.notifyAll("✅ Visa appointment RESCHEDULED EARLIER",
                            "Moved from " + previous + " to " + slot + ". "
                                    + (keepChasing ? "Still watching for an even earlier date."
                                                   : "Watcher stopping. Log in to confirm/pay if required."));
                }
                if (!keepChasing) done = true;
            } else {
                notifier.notifyAll(initial ? "⚠️ Booking attempt failed" : "⚠️ Reschedule attempt failed",
                        "Found " + slot + (initial ? "" : " (earlier than " + previous + ")")
                                + " but it did not confirm — it may have been taken. Will keep trying.");
            }
        } else {
            // Notify-only mode: alert once per distinct slot.
            if (!key.equals(lastAlertedSlotKey)) {
                lastAlertedSlotKey = key;
                notifier.notifyAll(initial ? "Visa slot available" : "Earlier visa slot available",
                        "Open slot " + slot
                                + (initial ? "" : " is earlier than your " + previous + " appointment")
                                + ". Set search.autoBook=true to grab it automatically, or book it yourself.");
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
