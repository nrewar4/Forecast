package com.visabooker.notify;

/** A channel that can deliver a short message to the user. */
public interface Notifier {
    void send(String subject, String body);

    /** Whether this channel is configured and should be used. */
    boolean isEnabled();
}
