package com.visabooker.booking;

import java.time.LocalDate;
import java.time.LocalTime;

/** A single bookable appointment slot returned by the portal. */
public record AppointmentSlot(
        String facilityId,
        String facilityName,
        LocalDate date,
        LocalTime time   // may be null when only the day is known
) {
    @Override
    public String toString() {
        return facilityName + " (" + facilityId + ") on " + date
                + (time != null ? " at " + time : "");
    }
}
