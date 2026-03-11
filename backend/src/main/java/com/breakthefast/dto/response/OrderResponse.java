package com.breakthefast.dto.response;

import com.breakthefast.enums.OrderSource;
import com.breakthefast.enums.OrderStatus;
import com.breakthefast.enums.OrderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class OrderResponse {
    private UUID id;
    private String orderNumber;
    private UUID customerId;
    private String customerName;
    private String customerPhone;
    private OrderType orderType;
    private OrderSource orderSource;
    private OrderStatus status;
    private List<OrderItemResponse> items;
    private String specialInstructions;
    private LocalDate eventDate;
    private Integer guestCount;
    private BigDecimal totalAmount;
    private Instant estimatedReadyTime;
    private String cancellationReason;
    private Instant createdAt;
    private Instant updatedAt;
}
