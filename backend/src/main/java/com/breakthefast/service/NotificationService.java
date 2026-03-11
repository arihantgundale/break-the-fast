package com.breakthefast.service;

import com.breakthefast.entity.Customer;
import com.breakthefast.entity.NotificationLog;
import com.breakthefast.entity.Order;
import com.breakthefast.enums.NotificationChannel;
import com.breakthefast.enums.NotificationPhase;
import com.breakthefast.repository.CustomerRepository;
import com.breakthefast.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final TwilioService twilioService;
    private final EmailService emailService;
    private final CustomerRepository customerRepository;
    private final NotificationLogRepository notificationLogRepository;

    private static final int MAX_RETRIES = 3;

    /**
     * Asynchronously send notifications for an order phase.
     * Fire-and-forget — never blocks order status transitions.
     */
    @Async("notificationExecutor")
    public void sendOrderNotification(Order order, NotificationPhase phase) {
        log.info("Dispatching {} notification for order {}", phase, order.getOrderNumber());

        // Determine customer preferences
        boolean sendWhatsApp = true;
        boolean sendEmail = false;
        String email = null;

        if (order.getCustomer() != null) {
            Optional<Customer> customerOpt = customerRepository.findById(order.getCustomer().getId());
            if (customerOpt.isPresent()) {
                Customer customer = customerOpt.get();
                sendWhatsApp = customer.getWhatsappOptIn();
                sendEmail = customer.getEmailOptIn() && customer.getEmail() != null;
                email = customer.getEmail();
            }
        }

        String message = buildMessage(order, phase);

        // Send WhatsApp
        if (sendWhatsApp) {
            sendWithRetry(order, phase, NotificationChannel.WHATSAPP,
                    order.getCustomerPhone(), message);
        }

        // Send Email
        if (sendEmail && email != null) {
            sendWithRetry(order, phase, NotificationChannel.EMAIL,
                    email, message);
        }

        // Log if both channels skipped
        if (!sendWhatsApp && !sendEmail) {
            log.info("No notification channels enabled for order {}", order.getOrderNumber());
            logNotification(order, phase, NotificationChannel.WHATSAPP, order.getCustomerPhone(), false, "Customer opted out", 0);
        }
    }

    private void sendWithRetry(Order order, NotificationPhase phase,
                                NotificationChannel channel, String recipient, String message) {
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                if (channel == NotificationChannel.WHATSAPP) {
                    twilioService.sendWhatsApp(recipient, message);
                } else if (channel == NotificationChannel.EMAIL) {
                    emailService.sendOrderEmail(recipient, getSubject(phase, order.getOrderNumber()), message);
                }

                logNotification(order, phase, channel, recipient, true, null, attempt);
                log.info("Notification sent: {} via {} for order {} (attempt {})",
                        phase, channel, order.getOrderNumber(), attempt);
                return; // Success

            } catch (Exception e) {
                log.warn("Notification attempt {} failed for order {} via {}: {}",
                        attempt, order.getOrderNumber(), channel, e.getMessage());

                if (attempt == MAX_RETRIES) {
                    logNotification(order, phase, channel, recipient, false, e.getMessage(), attempt);
                } else {
                    // Exponential backoff
                    try {
                        Thread.sleep((long) Math.pow(2, attempt) * 1000);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }
    }

    private String buildMessage(Order order, NotificationPhase phase) {
        String orderNum = order.getOrderNumber();
        return switch (phase) {
            case RECEIVED -> String.format(
                    "🎉 Order Confirmed! Your order %s has been received.\n" +
                    "Total: $%.2f\n" +
                    "📍 Remember: Pay at Pickup\n" +
                    "We'll notify you when it's being prepared!",
                    orderNum, order.getTotalAmount());
            case PREPARING -> String.format(
                    "👨‍🍳 Your order %s is now being prepared!\n" +
                    "%s\n" +
                    "We'll let you know when it's ready for pickup.",
                    orderNum,
                    order.getEstimatedReadyTime() != null
                            ? "Estimated ready time: " + order.getEstimatedReadyTime()
                            : "");
            case READY_FOR_PICKUP -> String.format(
                    "✅ Your order %s is READY FOR PICKUP!\n" +
                    "Total: $%.2f\n" +
                    "📍 Break The Fast Restaurant\n" +
                    "Please bring your order number. Pay at Pickup.",
                    orderNum, order.getTotalAmount());
            case COMPLETED -> String.format(
                    "🙏 Thank you for choosing Break The Fast!\n" +
                    "Order %s has been completed.\n" +
                    "We hope you enjoy your authentic Indian meal. Order again soon!",
                    orderNum);
            case CANCELLED -> String.format(
                    "❌ Order %s has been cancelled.\n" +
                    "Reason: %s\n" +
                    "We apologize for the inconvenience. Please feel free to place a new order.",
                    orderNum, order.getCancellationReason() != null ? order.getCancellationReason() : "N/A");
        };
    }

    private String getSubject(NotificationPhase phase, String orderNumber) {
        return switch (phase) {
            case RECEIVED -> "Order Confirmed — " + orderNumber;
            case PREPARING -> "Your Order is Being Prepared — " + orderNumber;
            case READY_FOR_PICKUP -> "🎉 Ready for Pickup! — " + orderNumber;
            case COMPLETED -> "Thank You! — " + orderNumber;
            case CANCELLED -> "Order Cancelled — " + orderNumber;
        };
    }

    private void logNotification(Order order, NotificationPhase phase,
                                  NotificationChannel channel, String recipient,
                                  boolean success, String error, int attempts) {
        NotificationLog logEntry = NotificationLog.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .phase(phase)
                .channel(channel)
                .recipient(recipient)
                .success(success)
                .errorMessage(error)
                .attemptCount(attempts)
                .build();
        notificationLogRepository.save(logEntry);
    }
}
