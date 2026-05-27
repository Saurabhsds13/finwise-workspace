package com.finwise.service;

import com.finwise.dto.goal.GoalRequest;
import com.finwise.dto.goal.GoalResponse;
import java.math.BigDecimal;
import java.util.List;

public interface GoalService {
    List<GoalResponse> getAllByUser(String userId);
    GoalResponse getById(String id);
    GoalResponse create(String userId, GoalRequest request);
    GoalResponse update(String id, GoalRequest request);
    void delete(String id);
    GoalResponse addContribution(String id, BigDecimal amount);
}
