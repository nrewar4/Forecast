package com.visabooker.notify;

import com.visabooker.config.Config;
import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Properties;

/**
 * Sends email via SMTP. Works with Gmail using an "App Password"
 * (https://myaccount.google.com/apppasswords) — your normal password will not work.
 *
 * Required config keys:
 *   email.smtp.host     (e.g. smtp.gmail.com)
 *   email.smtp.port     (e.g. 587)
 *   email.smtp.username (the sending Gmail address)
 *   email.smtp.password (16-char app password)
 *   email.to            (where alerts are delivered)
 */
public final class EmailNotifier implements Notifier {

    private static final Logger log = LoggerFactory.getLogger(EmailNotifier.class);

    private final String host, username, password, to, from;
    private final int port;
    private final boolean enabled;

    public EmailNotifier(Config cfg) {
        this.host = cfg.get("email.smtp.host");
        this.port = cfg.getInt("email.smtp.port", 587);
        this.username = cfg.get("email.smtp.username");
        this.password = cfg.get("email.smtp.password");
        this.to = cfg.get("email.to");
        this.from = cfg.get("email.from", username);
        this.enabled = host != null && username != null && password != null && to != null;
        if (!enabled) {
            log.warn("Email notifier disabled (missing email.smtp.* / email.to config).");
        }
    }

    @Override
    public boolean isEnabled() { return enabled; }

    @Override
    public void send(String subject, String body) {
        if (!enabled) return;
        Properties p = new Properties();
        p.put("mail.smtp.auth", "true");
        p.put("mail.smtp.starttls.enable", "true");
        p.put("mail.smtp.host", host);
        p.put("mail.smtp.port", String.valueOf(port));

        Session session = Session.getInstance(p, new jakarta.mail.Authenticator() {
            @Override
            protected jakarta.mail.PasswordAuthentication getPasswordAuthentication() {
                return new jakarta.mail.PasswordAuthentication(username, password);
            }
        });

        try {
            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(from));
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            msg.setSubject(subject);
            msg.setText(body);
            Transport.send(msg);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email", e);
        }
    }
}
