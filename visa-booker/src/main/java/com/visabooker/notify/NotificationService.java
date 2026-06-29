package com.visabooker.notify;

import com.visabooker.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/** Fans a single message out to every enabled channel (email + SMS). */
public final class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final List<Notifier> channels;

    public NotificationService(Config cfg) {
        this.channels = List.of(new EmailNotifier(cfg), new SmsNotifier(cfg));
        long enabled = channels.stream().filter(Notifier::isEnabled).count();
        log.info("Notification channels enabled: {}/{}", enabled, channels.size());
    }

    public void notifyAll(String subject, String body) {
        log.info("NOTIFY: {} — {}", subject, body);
        for (Notifier n : channels) {
            if (n.isEnabled()) n.send(subject, body);
        }
    }
}
