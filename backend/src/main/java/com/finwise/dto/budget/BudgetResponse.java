package com.finwise.dto.budget;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class BudgetResponse {
    private String id;
    private String name;
    private BigDecimal totalAmount;
    private BigDecimal spentAmount;
    private String period;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<CategoryResponse> categories;

    @Data
    @Builder
    @AllArgsConstructor
    public static class CategoryResponse {
        private String id;
        private String name;
        private BigDecimal allocatedAmount;
        private BigDecimal spentAmount;
    }
}
