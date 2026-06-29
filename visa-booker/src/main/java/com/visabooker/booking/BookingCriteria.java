package com.visabooker.booking;

import com.visabooker.config.Config;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * What counts as an acceptable slot for a RESCHEDULE-to-earlier search.
 *
 * A slot matches only if it is strictly EARLIER than your current appointment
 * (the whole point — grab a sooner date), on/after {@code earliest}, on/before
 * the optional {@code latest} cap, and at a preferred consulate (if specified).
 *
 * The current appointment date can change (after a successful reschedule, or be
 * auto-detected each cycle), so it is mutable.
 */
public final class BookingCriteria {

    private final LocalDate earliest;   // ignore slots before this (default: today)
    private final LocalDate latest;     // optional hard upper cap (may be null)
    private final List<String> preferredFacilityIds; // empty = any facility
    private final boolean autoBook;     // false = notify only (no auto-reschedule)

    private LocalDate currentAppointmentDate; // upper bound (exclusive); set per cycle

    public BookingCriteria(LocalDate earliest, LocalDate latest,
                           List<String> preferredFacilityIds, boolean autoBook,
                           LocalDate currentAppointmentDate) {
        this.earliest = earliest;
        this.latest = latest;
        this.preferredFacilityIds = preferredFacilityIds;
        this.autoBook = autoBook;
        this.currentAppointmentDate = currentAppointmentDate;
    }

    public static BookingCriteria fromConfig(Config cfg) {
        LocalDate earliest = cfg.getDate("search.earliest");
        if (earliest == null) earliest = LocalDate.now();
        LocalDate latest = cfg.getDate("search.latest"); // optional now
        String facilities = cfg.get("search.facilities", ""); // comma-separated facility IDs
        List<String> ids = facilities.isBlank()
                ? List.of()
                : Arrays.stream(facilities.split(",")).map(String::trim).filter(s -> !s.isBlank()).toList();
        // Default true: the user wants automatic rescheduling.
        boolean autoBook = cfg.getBool("search.autoBook", true);
        LocalDate current = cfg.getDate("appointment.currentDate"); // optional; else auto-detected
        return new BookingCriteria(earliest, latest, ids, autoBook, current);
    }

    public boolean matches(AppointmentSlot slot) {
        // Must be earlier than the appointment we already hold.
        if (currentAppointmentDate != null && !slot.date().isBefore(currentAppointmentDate)) return false;
        if (slot.date().isBefore(earliest)) return false;
        if (latest != null && slot.date().isAfter(latest)) return false;
        if (!preferredFacilityIds.isEmpty()
                && !preferredFacilityIds.contains(slot.facilityId())) return false;
        return true;
    }

    public void setCurrentAppointmentDate(LocalDate date) { this.currentAppointmentDate = date; }
    public LocalDate currentAppointmentDate() { return currentAppointmentDate; }

    public boolean autoBook() { return autoBook; }
    public LocalDate earliest() { return earliest; }
    public LocalDate latest() { return latest; }
    public List<String> preferredFacilityIds() { return preferredFacilityIds; }
}
