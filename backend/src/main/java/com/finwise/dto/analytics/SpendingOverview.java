package com.finwise.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class SpendingOverview {
    private BigDecimal totalSpent;
    private BigDecimal totalBudget;
    private BigDecimal remainingBudget;
    private double budgetUtilizationPercentage;
    private BigDecimal averageDailySpending;
}
