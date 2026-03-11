package com.breakthefast.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "otp_records")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OtpRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 20)
    private String phoneNumber;

    @Column(nullable = false, length = 6)
    private String otpCode;

    @Column(nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean used = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer failedAttempts = 0;

    private Instant lockedUntil;

    @CreationTimestamp
    private Instant createdAt;
}
