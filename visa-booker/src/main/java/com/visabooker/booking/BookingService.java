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

    private String lastAlertedSlotKey = null;
    private volatile boolean booked = false;

    public BookingService(Config cfg, VisaPortalClient portal, NotificationService notifier) {
        this.portal = portal;
        this.notifier = notifier;
        this.criteria = BookingCriteria.fromConfig(cfg);
        this.facilities = parseFacilities(cfg);
    }

    /** @return true once an appointment has been successfully booked (loop can stop). */
    public boolean isBooked() { return booked; }

    public void runOnce() {
        if (booked) return;

        if (!portal.isLoggedIn()) {
            log.info("Session not authenticated, logging in...");
            portal.login();
        }

        // Which facilities to check: explicit preferences, else all known ones.
        List<String> ids = criteria.preferredFacilityIds().isEmpty()
                ? List.copyOf(facilities.keySet())
                : criteria.preferredFacilityIds();

        for (String facilityId : ids) {
            String name = facilities.getOrDefault(facilityId, facilityId);
            List<AppointmentSlot> days = portal.fetchAvailableDays(facilityId, name);
            log.info("{}: {} day(s) returned", name, days.size());

            for (AppointmentSlot day : days) {
                if (!criteria.matches(day)) continue;

                AppointmentSlot target = day;
                // Resolve a concrete time so we can actually book.
                List<LocalTime> times = portal.fetchAvailableTimes(facilityId, day.date());
                if (!times.isEmpty()) {
                    target = new AppointmentSlot(facilityId, name, day.date(), times.get(0));
                }

                handleMatch(target);
                if (booked) return;
                return; // one matching slot per cycle is enough; re-poll next cycle
            }
        }
        log.info("No matching slots this cycle (window {} → {}).",
                criteria.earliest(), criteria.latest());
    }

    private void handleMatch(AppointmentSlot slot) {
        String key = slot.facilityId() + "|" + slot.date() + "|" + slot.time();

        if (criteria.autoBook()) {
            notifier.notifyAll("Visa slot found — booking now",
                    "Attempting to book " + slot);
            boolean ok = portal.book(slot);
            if (ok) {
                booked = true;
                notifier.notifyAll("✅ Visa appointment BOOKED",
                        "Successfully booked " + slot + ". Log in to confirm and pay if required.");
            } else {
                notifier.notifyAll("⚠️ Booking attempt failed",
                        "Found " + slot + " but the booking did not confirm. It may have been taken. Will keep trying.");
            }
        } else {
            // Notify-only mode: alert once per distinct slot.
            if (!key.equals(lastAlertedSlotKey)) {
                lastAlertedSlotKey = key;
                notifier.notifyAll("Visa slot available (not auto-booking)",
                        "Open slot: " + slot + ". Set search.autoBook=true to grab it automatically, "
                                + "or log in and book it yourself.");
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
