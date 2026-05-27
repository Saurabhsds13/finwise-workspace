package com.finwise.service.impl;

import com.finwise.entity.AiInsight;
import com.finwise.entity.Budget;
import com.finwise.entity.SavingsGoal;
import com.finwise.entity.User;
import com.finwise.exception.ResourceNotFoundException;
import com.finwise.repository.*;
import com.finwise.service.AiAdvisorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * AI Advisor service — rule-based spending analysis engine.
 *
 * Generates insights by analyzing:
 * - Budget utilization rates
 * - Category spending patterns
 * - Goal progress vs timeline
 * - Month-over-month spending changes
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiAdvisorServiceImpl implements AiAdvisorService {

    private final AiInsightRepository insightRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository goalRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AiInsight> getInsights(String userId) {
        return insightRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional
    public List<AiInsight> generateInsights(String userId) {
        log.info("Generating AI insights for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        List<AiInsight> insights = new ArrayList<>();

        insights.addAll(analyzeBudgetUtilization(user));
        insights.addAll(analyzeGoalProgress(user));
        insights.addAll(analyzeSpendingPatterns(user));

        // Save generated insights
        if (!insights.isEmpty()) {
            insightRepository.saveAll(insights);
            log.info("Generated {} insights for user: {}", insights.size(), userId);
        }

        return insights;
    }

    @Override
    @Transactional
    public void analyzeSpendingBehavior(String userId) {
        generateInsights(userId);
    }

    private List<AiInsight> analyzeBudgetUtilization(User user) {
        List<AiInsight> insights = new ArrayList<>();
        LocalDate today = LocalDate.now();

        List<Budget> activeBudgets = budgetRepository
                .findByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(user.getId(), today, today);

        for (Budget budget : activeBudgets) {
            List<Object[]> categoryTotals = expenseRepository.getCategoryTotals(
                    user.getId(), budget.getStartDate(), budget.getEndDate());

            BigDecimal totalSpent = categoryTotals.stream()
                    .map(row -> (BigDecimal) row[1])
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            double utilization = budget.getTotalAmount().compareTo(BigDecimal.ZERO) > 0
                    ? totalSpent.divide(budget.getTotalAmount(), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0;

            // Days elapsed vs total days
            long totalDays = ChronoUnit.DAYS.between(budget.getStartDate(), budget.getEndDate()) + 1;
            long daysElapsed = ChronoUnit.DAYS.between(budget.getStartDate(), today) + 1;
            double timeProgress = (double) daysElapsed / totalDays * 100;

            if (utilization > 90) {
                insights.add(buildInsight(user, AiInsight.InsightType.WARNING,
                        "Budget Almost Exhausted",
                        String.format("Your '%s' budget is %.0f%% used with %d days remaining. Consider reducing spending.",
                                budget.getName(), utilization, totalDays - daysElapsed)));
            } else if (utilization > timeProgress + 15) {
                insights.add(buildInsight(user, AiInsight.InsightType.WARNING,
                        "Spending Ahead of Schedule",
                        String.format("You've spent %.0f%% of your '%s' budget but only %.0f%% of the period has passed.",
                                utilization, budget.getName(), timeProgress)));
            } else if (utilization < timeProgress - 20 && utilization > 0) {
                insights.add(buildInsight(user, AiInsight.InsightType.ACHIEVEMENT,
                        "Great Budget Discipline",
                        String.format("You're under budget on '%s'. Only %.0f%% spent with %.0f%% of the period elapsed.",
                                budget.getName(), utilization, timeProgress)));
            }
        }

        return insights;
    }

    private List<AiInsight> analyzeGoalProgress(User user) {
        List<AiInsight> insights = new ArrayList<>();

        List<SavingsGoal> activeGoals = goalRepository
                .findByUserIdAndStatus(user.getId(), SavingsGoal.GoalStatus.ACTIVE);

        for (SavingsGoal goal : activeGoals) {
            if (goal.getTargetDate() == null) continue;

            long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), goal.getTargetDate());
            BigDecimal remaining = goal.getTargetAmount().subtract(goal.getCurrentAmount());

            if (daysRemaining <= 0 && remaining.compareTo(BigDecimal.ZERO) > 0) {
                insights.add(buildInsight(user, AiInsight.InsightType.WARNING,
                        "Goal Deadline Passed",
                        String.format("Your goal '%s' has passed its deadline. You still need %s to reach your target.",
                                goal.getName(), formatCurrency(remaining))));
            } else if (daysRemaining > 0 && daysRemaining <= 30) {
                BigDecimal dailyNeeded = remaining.divide(BigDecimal.valueOf(daysRemaining), 2, RoundingMode.HALF_UP);
                insights.add(buildInsight(user, AiInsight.InsightType.SUGGESTION,
                        "Goal Deadline Approaching",
                        String.format("You need to save %s/day to reach your '%s' goal in %d days.",
                                formatCurrency(dailyNeeded), goal.getName(), daysRemaining)));
            }

            // Progress milestone
            double progress = goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
                    ? goal.getCurrentAmount().divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0;

            if (progress >= 75 && progress < 100) {
                insights.add(buildInsight(user, AiInsight.InsightType.ACHIEVEMENT,
                        "Almost There!",
                        String.format("You're %.0f%% of the way to your '%s' goal. Keep it up!",
                                progress, goal.getName())));
            }
        }

        return insights;
    }

    private List<AiInsight> analyzeSpendingPatterns(User user) {
        List<AiInsight> insights = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Compare current month vs previous month
        LocalDate thisMonthStart = today.withDayOfMonth(1);
        LocalDate lastMonthStart = thisMonthStart.minusMonths(1);
        LocalDate lastMonthEnd = thisMonthStart.minusDays(1);

        Map<String, BigDecimal> thisMonth = getCategoryMap(user.getId(), thisMonthStart, today);
        Map<String, BigDecimal> lastMonth = getCategoryMap(user.getId(), lastMonthStart, lastMonthEnd);

        for (Map.Entry<String, BigDecimal> entry : thisMonth.entrySet()) {
            String category = entry.getKey();
            BigDecimal currentAmount = entry.getValue();
            BigDecimal previousAmount = lastMonth.getOrDefault(category, BigDecimal.ZERO);

            if (previousAmount.compareTo(BigDecimal.ZERO) > 0) {
                double changePercent = currentAmount.subtract(previousAmount)
                        .divide(previousAmount, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100)).doubleValue();

                if (changePercent > 50) {
                    insights.add(buildInsight(user, AiInsight.InsightType.WARNING,
                            "Spending Spike: " + category,
                            String.format("Your %s spending is up %.0f%% compared to last month (%s → %s).",
                                    category, changePercent, formatCurrency(previousAmount), formatCurrency(currentAmount))));
                } else if (changePercent < -30) {
                    insights.add(buildInsight(user, AiInsight.InsightType.ACHIEVEMENT,
                            "Spending Reduced: " + category,
                            String.format("Great job! Your %s spending decreased by %.0f%% compared to last month.",
                                    category, Math.abs(changePercent))));
                }
            }
        }

        return insights;
    }

    private Map<String, BigDecimal> getCategoryMap(String userId, LocalDate start, LocalDate end) {
        return expenseRepository.getCategoryTotals(userId, start, end).stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (BigDecimal) row[1]
                ));
    }

    private AiInsight buildInsight(User user, AiInsight.InsightType type, String title, String message) {
        return AiInsight.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
    }

    private String formatCurrency(BigDecimal amount) {
        return "$" + amount.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }
}
