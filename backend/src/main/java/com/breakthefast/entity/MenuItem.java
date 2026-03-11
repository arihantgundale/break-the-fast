package com.breakthefast.entity;

import com.breakthefast.enums.MenuCategory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "menu_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MenuCategory category;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal price;

    @Column(length = 100)
    private String portionSize; // e.g., "16 oz", "12-piece platter"

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isSpicy = false;

    @Column(columnDefinition = "TEXT")
    private String heritageNote; // Cultural/origin story blurb

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
