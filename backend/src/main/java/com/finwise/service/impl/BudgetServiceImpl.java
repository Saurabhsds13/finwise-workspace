package com.finwise.service.impl;

import com.finwise.dto.budget.BudgetRequest;
import com.finwise.dto.budget.BudgetResponse;
import com.finwise.entity.Budget;
import com.finwise.entity.BudgetCategory;
import com.finwise.entity.User;
import com.finwise.exception.ResourceNotFoundException;
import com.finwise.repository.BudgetRepository;
import com.finwise.repository.ExpenseRepository;
import com.finwise.repository.UserRepository;
import com.finwise.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    public List<BudgetResponse> getAllByUser(String userId) {
        return budgetRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BudgetResponse getById(String id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", id));
        return toResponse(budget);
    }

    @Override
    @Transactional
    public BudgetResponse create(String userId, BudgetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Budget budget = Budget.builder()
                .user(user)
                .name(request.getName())
                .totalAmount(request.getTotalAmount())
                .period(Budget.BudgetPeriod.valueOf(request.getPeriod()))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .categories(new ArrayList<>())
                .build();

        if (request.getCategories() != null) {
            List<BudgetCategory> categories = request.getCategories().stream()
                    .map(cat -> BudgetCategory.builder()
                            .budget(budget)
                            .name(cat.getName())
                            .allocatedAmount(cat.getAllocatedAmount())
                            .build())
                    .collect(Collectors.toList());
            budget.setCategories(categories);
        }

        Budget saved = budgetRepository.save(budget);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public BudgetResponse update(String id, BudgetRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", id));

        budget.setName(request.getName());
        budget.setTotalAmount(request.getTotalAmount());
        budget.setPeriod(Budget.BudgetPeriod.valueOf(request.getPeriod()));
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());

        if (request.getCategories() != null) {
            budget.getCategories().clear();
            request.getCategories().forEach(cat -> {
                BudgetCategory category = BudgetCategory.builder()
                        .budget(budget)
                        .name(cat.getName())
                        .allocatedAmount(cat.getAllocatedAmount())
                        .build();
                budget.getCategories().add(category);
            });
        }

        Budget saved = budgetRepository.save(budget);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(String id) {
        if (!budgetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Budget", id);
        }
        budgetRepository.deleteById(id);
    }

    @Override
    public List<BudgetResponse> getActiveBudgets(String userId) {
        LocalDate today = LocalDate.now();
        return budgetRepository
                .findByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(userId, today, today)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private BudgetResponse toResponse(Budget budget) {
        // Calculate spent amount from expenses within budget period
        BigDecimal spentAmount = BigDecimal.ZERO;
        List<Object[]> categoryTotals = expenseRepository.getCategoryTotals(
                budget.getUser().getId(), budget.getStartDate(), budget.getEndDate());

        for (Object[] row : categoryTotals) {
            spentAmount = spentAmount.add((BigDecimal) row[1]);
        }

        BigDecimal finalSpent = spentAmount;
        List<BudgetResponse.CategoryResponse> categoryResponses = budget.getCategories() != null
                ? budget.getCategories().stream()
                    .map(cat -> BudgetResponse.CategoryResponse.builder()
                            .id(cat.getId())
                            .name(cat.getName())
                            .allocatedAmount(cat.getAllocatedAmount())
                            .spentAmount(BigDecimal.ZERO) // simplified
                            .build())
                    .collect(Collectors.toList())
                : List.of();

        return BudgetResponse.builder()
                .id(budget.getId())
                .name(budget.getName())
                .totalAmount(budget.getTotalAmount())
                .spentAmount(finalSpent)
                .period(budget.getPeriod().name())
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .categories(categoryResponses)
                .build();
    }
}
