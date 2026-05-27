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
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Override
    public List<BudgetResponse> getAllByUser(String userId) {
        return budgetRepository.findByUserId(userId)
                .stream()
                .map(budget -> toResponse(budget, userId))
                .toList();
    }

    @Override
    public BudgetResponse getById(String id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", id));
        return toResponse(budget, budget.getUser().getId());
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

        // Add categories
        if (request.getCategories() != null) {
            for (BudgetRequest.CategoryAllocation catReq : request.getCategories()) {
                BudgetCategory category = BudgetCategory.builder()
                        .budget(budget)
                        .name(catReq.getName())
                        .allocatedAmount(catReq.getAllocatedAmount())
                        .build();
                budget.getCategories().add(category);
            }
        }

        budget = budgetRepository.save(budget);
        return toResponse(budget, userId);
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

        // Update categories
        budget.getCategories().clear();
        if (request.getCategories() != null) {
            for (BudgetRequest.CategoryAllocation catReq : request.getCategories()) {
                BudgetCategory category = BudgetCategory.builder()
                        .budget(budget)
                        .name(catReq.getName())
                        .allocatedAmount(catReq.getAllocatedAmount())
                        .build();
                budget.getCategories().add(category);
            }
        }

        budget = budgetRepository.save(budget);
        return toResponse(budget, budget.getUser().getId());
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
                .map(budget -> toResponse(budget, userId))
                .toList();
    }

    private BudgetResponse toResponse(Budget budget, String userId) {
        // Calculate spent amounts from expenses within budget period
        Map<String, BigDecimal> categorySpending = getCategorySpending(userId, budget.getStartDate(), budget.getEndDate());

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

    private Map<String, BigDecimal> getCategorySpending(String userId, LocalDate start, LocalDate end) {
        List<Object[]> results = expenseRepository.getCategoryTotals(userId, start, end);
        return results.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (BigDecimal) row[1]
                ));
    }
}
