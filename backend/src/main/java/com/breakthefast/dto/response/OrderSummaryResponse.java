package com.breakthefast.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class OrderSummaryResponse {
    private long totalOrders;
    private Map<String, Long> statusCounts; // RECEIVED: 5, PREPARING: 3, etc.
}
