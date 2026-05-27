package com.finwise.mapper;

import com.finwise.dto.budget.BudgetRequest;
import com.finwise.dto.budget.BudgetResponse;
import com.finwise.entity.Budget;
import com.finwise.entity.BudgetCategory;
import com.finwise.entity.User;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Maps between Budget entity and DTOs.
 */
@Component
public class BudgetMapper {

    public BudgetResponse toResponse(Budget budget, Map<String, BigDecimal> categorySpending) {
        BigDecimal totalSpent = categorySpending.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<BudgetResponse.CategoryResponse> categoryResponses = budget.getCategories() != null
                ? budget.getCategories().stream()
                    .map(cat -> BudgetResponse.CategoryResponse.builder()
                            .id(cat.getId())
                            .name(cat.getName())
                            .allocatedAmount(cat.getAllocatedAmount())
                            .spentAmount(categorySpending.getOrDefault(cat.getName(), BigDecimal.ZERO))
                            .build())
                    .toList()
                : List.of();

        return BudgetResponse.builder()
                .id(budget.getId())
                .name(budget.getName())
                .totalAmount(budget.getTotalAmount())
                .spentAmount(totalSpent)
                .period(budget.getPeriod().name())
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .categories(categoryResponses)
                .build();
    }

    public Budget toEntity(BudgetRequest request, User user) {
        Budget budget = Budget.builder()
                .user(user)
                .name(request.getName())
                .totalAmount(request.getTotalAmount())
                .period(Budget.BudgetPeriod.valueOf(request.getPeriod()))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .categories(new ArrayList<>())
                .build();

        addCategories(budget, request.getCategories());
        return budget;
    }

    public void updateEntity(Budget budget, BudgetRequest request) {
        budget.setName(request.getName());
        budget.setTotalAmount(request.getTotalAmount());
        budget.setPeriod(Budget.BudgetPeriod.valueOf(request.getPeriod()));
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());

        budget.getCategories().clear();
        addCategories(budget, request.getCategories());
    }

    private void addCategories(Budget budget, List<BudgetRequest.CategoryAllocation> allocations) {
        if (allocations != null) {
            for (BudgetRequest.CategoryAllocation catReq : allocations) {
                BudgetCategory category = BudgetCategory.builder()
                        .budget(budget)
                        .name(catReq.getName())
                        .allocatedAmount(catReq.getAllocatedAmount())
                        .build();
                budget.getCategories().add(category);
            }
        }
    }
}
