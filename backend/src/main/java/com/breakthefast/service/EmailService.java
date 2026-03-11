package com.breakthefast.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Email notification service using SendGrid.
 * Falls back to logging in dev mode if not configured.
 */
@Service
@Slf4j
public class EmailService {

    @Value("${app.sendgrid.api-key:}")
    private String apiKey;

    @Value("${app.sendgrid.from-email}")
    private String fromEmail;

    @Value("${app.sendgrid.from-name}")
    private String fromName;

    private boolean isConfigured() {
        return apiKey != null && !apiKey.isEmpty();
    }

    /**
     * Send a transactional email
     */
    public void sendOrderEmail(String toEmail, String subject, String body) {
        if (!isConfigured()) {
            log.info("[DEV] Email to {}: Subject='{}', Body='{}'", toEmail, subject, body);
            return;
        }

        try {
            com.sendgrid.helpers.mail.objects.Email from = new com.sendgrid.helpers.mail.objects.Email(fromEmail, fromName);
            com.sendgrid.helpers.mail.objects.Email to = new com.sendgrid.helpers.mail.objects.Email(toEmail);
            com.sendgrid.helpers.mail.objects.Content content =
                    new com.sendgrid.helpers.mail.objects.Content("text/html", buildHtmlEmail(subject, body));
            com.sendgrid.helpers.mail.Mail mail = new com.sendgrid.helpers.mail.Mail(from, subject, to, content);

            com.sendgrid.SendGrid sg = new com.sendgrid.SendGrid(apiKey);
            com.sendgrid.Request request = new com.sendgrid.Request();
            request.setMethod(com.sendgrid.Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            com.sendgrid.Response response = sg.api(request);
            log.info("Email sent to {}. Status: {}", toEmail, response.getStatusCode());

        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Email send failed", e);
        }
    }

    private String buildHtmlEmail(String subject, String body) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Inter', sans-serif; background: #FFFDF7; color: #1A1A1A; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
                        .header { text-align: center; padding-bottom: 24px; border-bottom: 2px solid #C0392B; }
                        .header h1 { color: #C0392B; font-family: 'Playfair Display', serif; margin: 0; }
                        .badge { display: inline-block; background: #27AE60; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-top: 8px; }
                        .content { padding: 24px 0; line-height: 1.6; white-space: pre-line; }
                        .footer { text-align: center; padding-top: 24px; border-top: 1px solid #eee; color: #555; font-size: 13px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Break The Fast</h1>
                            <span class="badge">🌿 100%% Pure Vegetarian</span>
                        </div>
                        <div class="content">%s</div>
                        <div class="footer">
                            Break The Fast — Authentic Indian Cuisine<br>
                            <small>This is an automated message. Please do not reply directly.</small>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(body.replace("\n", "<br>"));
    }
}
