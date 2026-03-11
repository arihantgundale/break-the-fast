package com.breakthefast.entity;

import com.breakthefast.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "customers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 20)
    private String phoneNumber; // E.164 format

    @Column(nullable = false)
    private String name;

    private String email;

    @Column(nullable = false)
    @Builder.Default
    private Boolean whatsappOptIn = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean emailOptIn = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserRole role = UserRole.CUSTOMER;

    @CreationTimestamp
    private Instant createdAt;
}
