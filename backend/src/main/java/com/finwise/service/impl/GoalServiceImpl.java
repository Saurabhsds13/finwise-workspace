package com.finwise.service.impl;

import com.finwise.dto.goal.GoalRequest;
import com.finwise.dto.goal.GoalResponse;
import com.finwise.entity.GoalContribution;
import com.finwise.entity.SavingsGoal;
import com.finwise.entity.User;
import com.finwise.exception.BusinessException;
import com.finwise.exception.ErrorCodes;
import com.finwise.exception.ResourceNotFoundException;
import com.finwise.mapper.GoalMapper;
import com.finwise.repository.GoalContributionRepository;
import com.finwise.repository.SavingsGoalRepository;
import com.finwise.repository.UserRepository;
import com.finwise.service.GoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Savings goal service implementation.
 *
 * Handles goal lifecycle: creation, contribution tracking, status transitions.
 * Automatically marks goals as COMPLETED when target is reached.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final SavingsGoalRepository goalRepository;
    private final GoalContributionRepository contributionRepository;
    private final UserRepository userRepository;
    private final GoalMapper goalMapper;

    @Override
    @Transactional(readOnly = true)
    public List<GoalResponse> getAllByUser(String userId) {
        log.debug("Fetching all goals for user: {}", userId);
        return goalRepository.findByUserId(userId)
                .stream()
                .map(goalMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public GoalResponse getById(String id) {
        log.debug("Fetching goal: {}", id);
        SavingsGoal goal = findGoalOrThrow(id);
        return goalMapper.toResponse(goal);
    }

    @Override
    @Transactional
    public GoalResponse create(String userId, GoalRequest request) {
        log.info("Creating savings goal for user: {} | name: {} | target: {}", userId, request.getName(), request.getTargetAmount());

        User user = findUserOrThrow(userId);
        SavingsGoal goal = goalMapper.toEntity(request, user);
        goal = goalRepository.save(goal);

        log.info("Goal created: {}", goal.getId());
        return goalMapper.toResponse(goal);
    }

    @Override
    @Transactional
    public GoalResponse update(String id, GoalRequest request) {
        log.info("Updating goal: {}", id);

        SavingsGoal goal = findGoalOrThrow(id);
        validateGoalModifiable(goal);

        goalMapper.updateEntity(goal, request);
        goal = goalRepository.save(goal);

        log.info("Goal updated: {}", id);
        return goalMapper.toResponse(goal);
    }

    @Override
    @Transactional
    public void delete(String id) {
        log.info("Deleting goal: {}", id);

        if (!goalRepository.existsById(id)) {
            throw new ResourceNotFoundException("SavingsGoal", id);
        }
        goalRepository.deleteById(id);

        log.info("Goal deleted: {}", id);
    }

    @Override
    @Transactional
    public GoalResponse addContribution(String id, BigDecimal amount) {
        log.info("Adding contribution to goal: {} | amount: {}", id, amount);

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Contribution amount must be positive", ErrorCodes.INSUFFICIENT_AMOUNT);
        }

        SavingsGoal goal = findGoalOrThrow(id);
        validateGoalModifiable(goal);

        // Record the contribution
        GoalContribution contribution = GoalContribution.builder()
                .goal(goal)
                .amount(amount)
                .build();
        contributionRepository.save(contribution);

        // Update current amount
        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));

        // Auto-complete if target reached
        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(SavingsGoal.GoalStatus.COMPLETED);
            log.info("Goal completed: {} | target: {} | current: {}", id, goal.getTargetAmount(), goal.getCurrentAmount());
        }

        goal = goalRepository.save(goal);
        return goalMapper.toResponse(goal);
    }

    private void validateGoalModifiable(SavingsGoal goal) {
        if (goal.getStatus() == SavingsGoal.GoalStatus.COMPLETED) {
            throw new BusinessException(
                    "Cannot modify a completed goal",
                    ErrorCodes.GOAL_ALREADY_COMPLETED
            );
        }
    }

    private SavingsGoal findGoalOrThrow(String id) {
        return goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SavingsGoal", id));
    }

    private User findUserOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }
}
