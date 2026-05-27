package com.finwise.repository;

import com.finwise.entity.GoalContribution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalContributionRepository extends JpaRepository<GoalContribution, String> {
    List<GoalContribution> findByGoalIdOrderByContributedAtDesc(String goalId);
}
