package com.breakthefast.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private long totalOrders;
    private long totalCustomers;
    private BigDecimal totalRevenue;
    private BigDecimal averageOrderValue;
    private List<LocalDate> labels;
    private List<Long> ordersSeries;
    private List<BigDecimal> revenueSeries;
    private List<TopProductResponse> topProducts;
}
