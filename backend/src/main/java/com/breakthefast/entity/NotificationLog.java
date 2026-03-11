package com.breakthefast.entity;

import com.breakthefast.enums.NotificationChannel;
import com.breakthefast.enums.NotificationPhase;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notification_logs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID orderId;

    @Column(nullable = false)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationPhase phase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationChannel channel;

    private String recipient; // phone or email

    @Column(nullable = false)
    @Builder.Default
    private Boolean success = false;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @Column(nullable = false)
    @Builder.Default
    private Integer attemptCount = 0;

    @CreationTimestamp
    private Instant createdAt;
}
