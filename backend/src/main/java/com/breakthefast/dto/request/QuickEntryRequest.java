package com.breakthefast.dto.request;

import com.breakthefast.enums.OrderType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class QuickEntryRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+1\\d{10}$", message = "Phone must be US E.164 format: +1XXXXXXXXXX")
    private String customerPhone;

    @NotNull(message = "Order type is required")
    private OrderType orderType;

    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<OrderItemRequest> items;

    private String specialInstructions;

    // Catering-specific
    private LocalDate eventDate;
    private Integer guestCount;

    private String estimatedReadyTime; // ISO 8601
}
