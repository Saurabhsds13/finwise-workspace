package com.finwise.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class SpendingTrend {
    private String month;
    private BigDecimal totalSpent;
    private BigDecimal budgetAmount;
}
