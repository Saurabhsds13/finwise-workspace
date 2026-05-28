package com.finwise.service.impl;

import com.finwise.dto.expense.ExpenseRequest;
import com.finwise.dto.expense.ExpenseResponse;
import com.finwise.entity.Expense;
import com.finwise.entity.User;
import com.finwise.exception.ResourceNotFoundException;
import com.finwise.mapper.ExpenseMapper;
import com.finwise.repository.ExpenseRepository;
import com.finwise.repository.UserRepository;
import com.finwise.service.ExpenseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private static final Logger log = LoggerFactory.getLogger(ExpenseServiceImpl.class);

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final ExpenseMapper expenseMapper;

    @Autowired
    public ExpenseServiceImpl(ExpenseRepository expenseRepository,
                              UserRepository userRepository,
                              ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.expenseMapper = expenseMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllByUser(String userId) {
        log.debug("Fetching all expenses for user: {}", userId);
        return expenseRepository.findByUserIdOrderByExpenseDateDesc(userId)
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse getById(String id) {
        log.debug("Fetching expense: {}", id);
        Expense expense = findExpenseOrThrow(id);
        return expenseMapper.toResponse(expense);
    }

    @Override
    @Transactional
    public ExpenseResponse create(String userId, ExpenseRequest request) {
        log.info("Creating expense for user: {} | category: {} | amount: {}", userId, request.getCategory(), request.getAmount());

        User user = findUserOrThrow(userId);
        Expense expense = expenseMapper.toEntity(request, user);
        expense = expenseRepository.save(expense);

        log.info("Expense created: {}", expense.getId());
        return expenseMapper.toResponse(expense);
    }

    @Override
    @Transactional
    public ExpenseResponse update(String id, ExpenseRequest request) {
        log.info("Updating expense: {}", id);

        Expense expense = findExpenseOrThrow(id);
        expenseMapper.updateEntity(expense, request);
        expense = expenseRepository.save(expense);

        log.info("Expense updated: {}", id);
        return expenseMapper.toResponse(expense);
    }

    @Override
    @Transactional
    public void delete(String id) {
        log.info("Deleting expense: {}", id);

        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense", id);
        }
        expenseRepository.deleteById(id);

        log.info("Expense deleted: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getByCategory(String userId, String category) {
        log.debug("Fetching expenses for user: {} | category: {}", userId, category);
        return expenseRepository.findByUserIdAndCategory(userId, category)
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getByMonth(String userId, int year, int month) {
        log.debug("Fetching expenses for user: {} | period: {}-{}", userId, year, month);

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return expenseRepository.findByUserIdAndExpenseDateBetween(userId, start, end)
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    private Expense findExpenseOrThrow(String id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", id));
    }

    private User findUserOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }
}
