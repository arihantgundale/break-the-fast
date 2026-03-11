package com.breakthefast.dto.request;

import com.breakthefast.enums.OrderType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PlaceOrderRequest {

    @NotNull(message = "Order type is required")
    private OrderType orderType;

    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<OrderItemRequest> items;

    private String specialInstructions;

    // Catering-specific fields
    private LocalDate eventDate;
    private Integer guestCount;
}
