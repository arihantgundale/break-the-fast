package com.breakthefast.entity;

import com.breakthefast.enums.OrderSource;
import com.breakthefast.enums.OrderStatus;
import com.breakthefast.enums.OrderType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 20)
    private String orderNumber; // BTF-YYYY-XXXX

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer; // nullable for phone orders

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false, length = 20)
    private String customerPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderSource orderSource = OrderSource.WEB;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.RECEIVED;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String specialInstructions;

    private LocalDate eventDate; // for catering orders only

    private Integer guestCount; // for catering orders only

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal totalAmount;

    private Instant estimatedReadyTime;

    private String cancellationReason;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}
