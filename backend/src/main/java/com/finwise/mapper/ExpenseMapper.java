package com.finwise.mapper;

import com.finwise.dto.expense.ExpenseRequest;
import com.finwise.dto.expense.ExpenseResponse;
import com.finwise.entity.Expense;
import com.finwise.entity.User;
import org.springframework.stereotype.Component;

/**
 * Maps between Expense entity and DTOs.
 * Single Responsibility: Only handles Expense object transformations.
 */
@Component
public class ExpenseMapper {

    public ExpenseResponse toResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .description(expense.getDescription())
                .date(expense.getExpenseDate())
                .isRecurring(expense.isRecurring())
                .createdAt(expense.getCreatedAt())
                .build();
    }

    public Expense toEntity(ExpenseRequest request, User user) {
        return Expense.builder()
                .user(user)
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .expenseDate(request.getDate())
                .isRecurring(request.isRecurring())
                .recurringFrequency(request.getRecurringFrequency())
                .build();
    }

    public void updateEntity(Expense expense, ExpenseRequest request) {
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getDate());
        expense.setRecurring(request.isRecurring());
        expense.setRecurringFrequency(request.getRecurringFrequency());
    }
}
