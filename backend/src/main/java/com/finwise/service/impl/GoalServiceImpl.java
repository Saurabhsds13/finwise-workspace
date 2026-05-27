package com.finwise.service.impl;

import com.finwise.dto.goal.GoalRequest;
import com.finwise.dto.goal.GoalResponse;
import com.finwise.entity.SavingsGoal;
import com.finwise.entity.User;
import com.finwise.exception.ResourceNotFoundException;
import com.finwise.repository.SavingsGoalRepository;
import com.finwise.repository.UserRepository;
import com.finwise.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final SavingsGoalRepository goalRepository;
    private final UserRepository userRepository;

    @Override
    public List<GoalResponse> getAllByUser(String userId) {
        return goalRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public GoalResponse getById(String id) {
        SavingsGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal", id));
        return toResponse(goal);
    }

    @Override
    @Transactional
    public GoalResponse create(String userId, GoalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        SavingsGoal goal = SavingsGoal.builder()
                .user(user)
                .name(request.getName())
                .targetAmount(request.getTargetAmount())
                .targetDate(request.getTargetDate())
                .build();

        goal = goalRepository.save(goal);
        return toResponse(goal);
    }

    @Override
    @Transactional
    public GoalResponse update(String id, GoalRequest request) {
        SavingsGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal", id));

        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(request.getTargetDate());

        goal = goalRepository.save(goal);
        return toResponse(goal);
    }

    @Override
    @Transactional
    public void delete(String id) {
        if (!goalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Goal", id);
        }
        goalRepository.deleteById(id);
    }

    @Override
    @Transactional
    public GoalResponse addContribution(String id, BigDecimal amount) {
        SavingsGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal", id));

        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));

        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(SavingsGoal.GoalStatus.COMPLETED);
        }

        goal = goalRepository.save(goal);
        return toResponse(goal);
    }

    private GoalResponse toResponse(SavingsGoal goal) {
        double progress = goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
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
                .progressPercentage(progress)
                .createdAt(goal.getCreatedAt())
                .build();
    }
}
