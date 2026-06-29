package com.visabooker.notify;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.visabooker.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Sends SMS via Twilio.
 *
 * Required config keys:
 *   twilio.accountSid
 *   twilio.authToken
 *   twilio.fromNumber  (a Twilio number, e.g. +1XXXXXXXXXX)
 *   twilio.toNumber    (your number in E.164, e.g. +9198XXXXXXXX for India)
 */
public final class SmsNotifier implements Notifier {

    private static final Logger log = LoggerFactory.getLogger(SmsNotifier.class);

    private final String fromNumber, toNumber;
    private final boolean enabled;

    public SmsNotifier(Config cfg) {
        String sid = cfg.get("twilio.accountSid");
        String token = cfg.get("twilio.authToken");
        this.fromNumber = cfg.get("twilio.fromNumber");
        this.toNumber = cfg.get("twilio.toNumber");
        this.enabled = sid != null && token != null && fromNumber != null && toNumber != null;
        if (enabled) {
            Twilio.init(sid, token);
        } else {
            log.warn("SMS notifier disabled (missing twilio.* config).");
        }
    }

    @Override
    public boolean isEnabled() { return enabled; }

    @Override
    public void send(String subject, String body) {
        if (!enabled) return;
        try {
            // SMS has no subject; prepend it so the message is self-describing.
            String text = subject + " — " + body;
            if (text.length() > 1500) text = text.substring(0, 1500);
            Message.creator(new PhoneNumber(toNumber), new PhoneNumber(fromNumber), text).create();
            log.info("SMS sent to {}", toNumber);
        } catch (Exception e) {
            log.error("Failed to send SMS", e);
        }
    }
}
