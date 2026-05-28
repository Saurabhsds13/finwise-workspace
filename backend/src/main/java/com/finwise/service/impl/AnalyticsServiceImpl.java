package com.finwise.service.impl;

import com.finwise.dto.analytics.CategoryBreakdown;
import com.finwise.dto.analytics.SpendingOverview;
import com.finwise.dto.analytics.SpendingTrend;
import com.finwise.entity.Budget;
import com.finwise.repository.BudgetRepository;
import com.finwise.repository.ExpenseRepository;
import com.finwise.service.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsServiceImpl.class);

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    @Autowired
    public AnalyticsServiceImpl(ExpenseRepository expenseRepository, BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public SpendingOverview getSpendingOverview(String userId, String period) {
        log.debug("Generating spending overview for user: {} | period: {}", userId, period);

        LocalDate[] dateRange = resolvePeriod(period);
        LocalDate start = dateRange[0];
        LocalDate end = dateRange[1];

        BigDecimal totalSpent = calculateTotalSpent(userId, start, end);
        BigDecimal totalBudget = getActiveBudgetTotal(userId, start, end);
        BigDecimal remainingBudget = totalBudget.subtract(totalSpent);

        double utilization = totalBudget.compareTo(BigDecimal.ZERO) > 0
                ? totalSpent.divide(totalBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0.0;

        long daysInPeriod = ChronoUnit.DAYS.between(start, end) + 1;
        BigDecimal avgDaily = daysInPeriod > 0
                ? totalSpent.divide(BigDecimal.valueOf(daysInPeriod), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return SpendingOverview.builder()
                .totalSpent(totalSpent)
                .totalBudget(totalBudget)
                .remainingBudget(remainingBudget)
                .budgetUtilizationPercentage(utilization)
                .averageDailySpending(avgDaily)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryBreakdown> getCategoryBreakdown(String userId, String period) {
        log.debug("Generating category breakdown for user: {} | period: {}", userId, period);

        LocalDate[] dateRange = resolvePeriod(period);
        List<Object[]> categoryTotals = expenseRepository.getCategoryTotals(userId, dateRange[0], dateRange[1]);

        BigDecimal grandTotal = categoryTotals.stream()
                .map(row -> (BigDecimal) row[1])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return categoryTotals.stream()
                .map(row -> {
                    String category = (String) row[0];
                    BigDecimal amount = (BigDecimal) row[1];
                    double percentage = grandTotal.compareTo(BigDecimal.ZERO) > 0
                            ? amount.divide(grandTotal, 4, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(100)).doubleValue()
                            : 0.0;

                    return CategoryBreakdown.builder()
                            .category(category)
                            .amount(amount)
                            .percentage(percentage)
                            .build();
                })
                .sorted((a, b) -> Double.compare(b.getPercentage(), a.getPercentage()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpendingTrend> getSpendingTrends(String userId, int months) {
        log.debug("Generating spending trends for user: {} | months: {}", userId, months);

        List<SpendingTrend> trends = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = today.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());

            BigDecimal totalSpent = calculateTotalSpent(userId, monthStart, monthEnd);
            BigDecimal budgetAmount = getActiveBudgetTotal(userId, monthStart, monthEnd);

            String monthLabel = monthStart.getMonth().name().substring(0, 3) + " " + monthStart.getYear();

            trends.add(SpendingTrend.builder()
                    .month(monthLabel)
                    .totalSpent(totalSpent)
                    .budgetAmount(budgetAmount)
                    .build());
        }

        return trends;
    }

    private BigDecimal calculateTotalSpent(String userId, LocalDate start, LocalDate end) {
        List<Object[]> totals = expenseRepository.getCategoryTotals(userId, start, end);
        return totals.stream()
                .map(row -> (BigDecimal) row[1])
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getActiveBudgetTotal(String userId, LocalDate start, LocalDate end) {
        List<Budget> activeBudgets = budgetRepository
                .findByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(userId, end, start);
        return activeBudgets.stream()
                .map(Budget::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private LocalDate[] resolvePeriod(String period) {
        LocalDate today = LocalDate.now();
        return switch (period.toLowerCase()) {
            case "week" -> new LocalDate[]{today.minusDays(6), today};
            case "month" -> new LocalDate[]{today.withDayOfMonth(1), today};
            case "year" -> new LocalDate[]{today.withDayOfYear(1), today};
            case "quarter" -> new LocalDate[]{today.minusMonths(3).withDayOfMonth(1), today};
            default -> new LocalDate[]{today.withDayOfMonth(1), today};
        };
    }
}
