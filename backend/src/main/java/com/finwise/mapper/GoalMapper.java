package com.finwise.mapper;

import com.finwise.dto.goal.GoalRequest;
import com.finwise.dto.goal.GoalResponse;
import com.finwise.entity.SavingsGoal;
import com.finwise.entity.User;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Maps between SavingsGoal entity and DTOs.
 */
@Component
public class GoalMapper {

    public GoalResponse toResponse(SavingsGoal goal) {
        double progressPercentage = goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
                ? goal.getCurrentAmount()
                    .divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue()
                : 0.0;

        return GoalResponse.builder()
                .id(goal.getId())
                .name(goal.getName())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .targetDate(goal.getTargetDate())
                .status(goal.getStatus().name())
                .progressPercentage(Math.min(progressPercentage, 100.0))
                .createdAt(goal.getCreatedAt())
                .build();
    }

    public SavingsGoal toEntity(GoalRequest request, User user) {
        return SavingsGoal.builder()
                .user(user)
                .name(request.getName())
                .targetAmount(request.getTargetAmount())
                .currentAmount(BigDecimal.ZERO)
                .targetDate(request.getTargetDate())
                .status(SavingsGoal.GoalStatus.ACTIVE)
                .build();
    }

    public void updateEntity(SavingsGoal goal, GoalRequest request) {
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(request.getTargetDate());
    }
}
