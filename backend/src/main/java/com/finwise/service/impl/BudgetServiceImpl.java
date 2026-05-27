package com.finwise.service.impl;

import com.finwise.dto.budget.BudgetRequest;
import com.finwise.dto.budget.BudgetResponse;
import com.finwise.entity.Budget;
import com.finwise.entity.User;
import com.finwise.exception.ResourceNotFoundException;
import com.finwise.mapper.BudgetMapper;
import com.finwise.repository.BudgetRepository;
import com.finwise.repository.ExpenseRepository;
import com.finwise.repository.UserRepository;
import com.finwise.service.BudgetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Budget service implementation.
 *
 * SOLID principles applied:
 * - SRP: Only handles budget business logic
 * - OCP: Budget period strategies can be extended without modification
 * - DIP: Depends on repository/mapper abstractions
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final BudgetMapper budgetMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getAllByUser(String userId) {
        log.debug("Fetching all budgets for user: {}", userId);
        return budgetRepository.findByUserId(userId)
                .stream()
                .map(budget -> toResponseWithSpending(budget, userId))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BudgetResponse getById(String id) {
        log.debug("Fetching budget: {}", id);
        Budget budget = findBudgetOrThrow(id);
        return toResponseWithSpending(budget, budget.getUser().getId());
    }

    @Override
    @Transactional
    public BudgetResponse create(String userId, BudgetRequest request) {
        log.info("Creating budget for user: {} | name: {} | amount: {}", userId, request.getName(), request.getTotalAmount());

        User user = findUserOrThrow(userId);
        Budget budget = budgetMapper.toEntity(request, user);
        budget = budgetRepository.save(budget);

        log.info("Budget created: {}", budget.getId());
        return toResponseWithSpending(budget, userId);
    }

    @Override
    @Transactional
    public BudgetResponse update(String id, BudgetRequest request) {
        log.info("Updating budget: {}", id);

        Budget budget = findBudgetOrThrow(id);
        budgetMapper.updateEntity(budget, request);
        budget = budgetRepository.save(budget);

        log.info("Budget updated: {}", id);
        return toResponseWithSpending(budget, budget.getUser().getId());
    }

    @Override
    @Transactional
    public void delete(String id) {
        log.info("Deleting budget: {}", id);

        if (!budgetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Budget", id);
        }
        budgetRepository.deleteById(id);

        log.info("Budget deleted: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getActiveBudgets(String userId) {
        log.debug("Fetching active budgets for user: {}", userId);
        LocalDate today = LocalDate.now();
        return budgetRepository
                .findByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(userId, today, today)
                .stream()
                .map(budget -> toResponseWithSpending(budget, userId))
                .toList();
    }

    private BudgetResponse toResponseWithSpending(Budget budget, String userId) {
        Map<String, BigDecimal> categorySpending = getCategorySpending(userId, budget.getStartDate(), budget.getEndDate());
        return budgetMapper.toResponse(budget, categorySpending);
    }

    private Map<String, BigDecimal> getCategorySpending(String userId, LocalDate start, LocalDate end) {
        List<Object[]> results = expenseRepository.getCategoryTotals(userId, start, end);
        return results.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (BigDecimal) row[1]
                ));
    }

    private Budget findBudgetOrThrow(String id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", id));
    }

    private User findUserOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }
}
