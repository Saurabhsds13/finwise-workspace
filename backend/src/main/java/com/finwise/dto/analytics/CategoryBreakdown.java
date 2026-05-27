package com.finwise.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class CategoryBreakdown {
    private String category;
    private BigDecimal amount;
    private double percentage;
}
