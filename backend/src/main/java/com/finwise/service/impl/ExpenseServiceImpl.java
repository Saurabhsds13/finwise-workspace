package com.finwise.service.impl;

import com.finwise.dto.expense.ExpenseRequest;
import com.finwise.dto.expense.ExpenseResponse;
import com.finwise.entity.Expense;
import com.finwise.entity.User;
import com.finwise.exception.ResourceNotFoundException;
import com.finwise.repository.ExpenseRepository;
import com.finwise.repository.UserRepository;
import com.finwise.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Override
    public List<ExpenseResponse> getAllByUser(String userId) {
        return expenseRepository.findByUserIdOrderByExpenseDateDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ExpenseResponse getById(String id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", id));
        return toResponse(expense);
    }

    @Override
    @Transactional
    public ExpenseResponse create(String userId, ExpenseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Expense expense = Expense.builder()
                .user(user)
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .expenseDate(request.getDate())
                .isRecurring(request.isRecurring())
                .recurringFrequency(request.getRecurringFrequency())
                .build();

        expense = expenseRepository.save(expense);
        return toResponse(expense);
    }

    @Override
    @Transactional
    public ExpenseResponse update(String id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", id));

        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getDate());
        expense.setRecurring(request.isRecurring());
        expense.setRecurringFrequency(request.getRecurringFrequency());

        expense = expenseRepository.save(expense);
        return toResponse(expense);
    }

    @Override
    @Transactional
    public void delete(String id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense", id);
        }
        expenseRepository.deleteById(id);
    }

    @Override
    public List<ExpenseResponse> getByCategory(String userId, String category) {
        return expenseRepository.findByUserIdAndCategory(userId, category)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExpenseResponse> getByMonth(String userId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return expenseRepository.findByUserIdAndExpenseDateBetween(userId, start, end)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ExpenseResponse toResponse(Expense expense) {
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
}
