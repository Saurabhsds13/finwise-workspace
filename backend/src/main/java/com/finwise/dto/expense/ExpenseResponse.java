package com.finwise.dto.expense;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ExpenseResponse {
    private String id;
    private BigDecimal amount;
    private String category;
    private String description;
    private LocalDate date;
    private boolean isRecurring;
    private LocalDateTime createdAt;
}
