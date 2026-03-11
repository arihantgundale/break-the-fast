package com.breakthefast.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private UUID menuItemId;

    @Column(nullable = false)
    private String menuItemName;

    private String menuItemImageUrl;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal subtotal;
}
