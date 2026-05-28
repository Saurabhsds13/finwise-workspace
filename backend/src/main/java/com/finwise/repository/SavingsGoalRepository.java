package com.finwise.repository;

import com.finwise.entity.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, String> {
    List<SavingsGoal> findByUserId(String userId);
    List<SavingsGoal> findByUserIdAndStatus(String userId, SavingsGoal.GoalStatus status);
}
