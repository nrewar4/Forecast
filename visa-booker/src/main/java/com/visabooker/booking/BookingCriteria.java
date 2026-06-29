package com.visabooker.booking;

import com.visabooker.config.Config;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * What counts as an acceptable slot. Built from config so you can tune your
 * search window and preferred consulates without touching code.
 */
public final class BookingCriteria {

    private final LocalDate earliest;   // ignore slots before this (default: today)
    private final LocalDate latest;     // ignore slots after this (must be set)
    private final List<String> preferredFacilityIds; // empty = any facility
    private final boolean autoBook;     // false = notify only (dry run)

    public BookingCriteria(LocalDate earliest, LocalDate latest,
                           List<String> preferredFacilityIds, boolean autoBook) {
        this.earliest = earliest;
        this.latest = latest;
        this.preferredFacilityIds = preferredFacilityIds;
        this.autoBook = autoBook;
    }

    public static BookingCriteria fromConfig(Config cfg) {
        LocalDate earliest = cfg.getDate("search.earliest");
        if (earliest == null) earliest = LocalDate.now();
        LocalDate latest = cfg.getDate("search.latest");
        if (latest == null) {
            throw new IllegalStateException("search.latest is required (e.g. 2026-12-31)");
        }
        String facilities = cfg.get("search.facilities", ""); // comma-separated facility IDs
        List<String> ids = facilities.isBlank()
                ? List.of()
                : Arrays.stream(facilities.split(",")).map(String::trim).filter(s -> !s.isBlank()).toList();
        boolean autoBook = cfg.getBool("search.autoBook", false);
        return new BookingCriteria(earliest, latest, ids, autoBook);
    }

    public boolean matches(AppointmentSlot slot) {
        if (slot.date().isBefore(earliest) || slot.date().isAfter(latest)) return false;
        if (!preferredFacilityIds.isEmpty()
                && !preferredFacilityIds.contains(slot.facilityId())) return false;
        return true;
    }

    public boolean autoBook() { return autoBook; }
    public LocalDate earliest() { return earliest; }
    public LocalDate latest() { return latest; }
    public List<String> preferredFacilityIds() { return preferredFacilityIds; }
}
