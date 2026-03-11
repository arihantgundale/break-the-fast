package com.breakthefast.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Twilio integration for SMS and WhatsApp.
 * If Twilio credentials are not configured, messages are logged instead.
 */
@Service
@Slf4j
public class TwilioService {

    @Value("${app.twilio.account-sid:}")
    private String accountSid;

    @Value("${app.twilio.auth-token:}")
    private String authToken;

    @Value("${app.twilio.phone-number:}")
    private String phoneNumber;

    @Value("${app.twilio.whatsapp-number:}")
    private String whatsappNumber;

    private boolean isConfigured() {
        return accountSid != null && !accountSid.isEmpty()
                && authToken != null && !authToken.isEmpty();
    }

    /**
     * Send SMS message
     */
    public void sendSms(String to, String body) {
        if (!isConfigured()) {
            log.info("[DEV] SMS to {}: {}", to, body);
            return;
        }

        try {
            com.twilio.Twilio.init(accountSid, authToken);
            com.twilio.rest.api.v2010.account.Message.creator(
                    new com.twilio.type.PhoneNumber(to),
                    new com.twilio.type.PhoneNumber(phoneNumber),
                    body
            ).create();
            log.info("SMS sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", to, e.getMessage());
            throw new RuntimeException("SMS send failed", e);
        }
    }

    /**
     * Send WhatsApp message
     */
    public void sendWhatsApp(String to, String body) {
        if (!isConfigured()) {
            log.info("[DEV] WhatsApp to {}: {}", to, body);
            return;
        }

        try {
            com.twilio.Twilio.init(accountSid, authToken);
            com.twilio.rest.api.v2010.account.Message.creator(
                    new com.twilio.type.PhoneNumber("whatsapp:" + to),
                    new com.twilio.type.PhoneNumber("whatsapp:" + whatsappNumber),
                    body
            ).create();
            log.info("WhatsApp sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send WhatsApp to {}: {}", to, e.getMessage());
            throw new RuntimeException("WhatsApp send failed", e);
        }
    }
}
