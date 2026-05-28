package com.finwise.dto.budget;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class BudgetRequest {
    @NotBlank
    private String name;

    @NotNull @Positive
    private BigDecimal totalAmount;

    @NotBlank
    private String period;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private List<CategoryAllocation> categories;

    @Data
    public static class CategoryAllocation {
        private String name;
        private BigDecimal allocatedAmount;
    }
}
