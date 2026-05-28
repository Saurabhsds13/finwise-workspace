package com.finwise.service;

import com.finwise.dto.expense.ExpenseRequest;
import com.finwise.dto.expense.ExpenseResponse;
import java.util.List;

public interface ExpenseService {
    List<ExpenseResponse> getAllByUser(String userId);
    ExpenseResponse getById(String id);
    ExpenseResponse create(String userId, ExpenseRequest request);
    ExpenseResponse update(String id, ExpenseRequest request);
    void delete(String id);
    List<ExpenseResponse> getByCategory(String userId, String category);
    List<ExpenseResponse> getByMonth(String userId, int year, int month);
}
