package com.breakthefast.dto.request;

import com.breakthefast.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull(message = "Status is required")
    private OrderStatus status;

    private String estimatedReadyTime; // ISO 8601, optional
}
