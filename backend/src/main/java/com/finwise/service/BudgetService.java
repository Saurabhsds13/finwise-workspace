package com.finwise.service;

import com.finwise.dto.budget.BudgetRequest;
import com.finwise.dto.budget.BudgetResponse;
import java.util.List;

public interface BudgetService {
    List<BudgetResponse> getAllByUser(String userId);
    BudgetResponse getById(String id);
    BudgetResponse create(String userId, BudgetRequest request);
    BudgetResponse update(String id, BudgetRequest request);
    void delete(String id);
    List<BudgetResponse> getActiveBudgets(String userId);
}
