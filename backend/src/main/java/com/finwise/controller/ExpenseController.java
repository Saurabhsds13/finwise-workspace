package com.finwise.controller;

import com.finwise.dto.expense.ExpenseRequest;
import com.finwise.dto.expense.ExpenseResponse;
import com.finwise.security.SecurityUtils;
import com.finwise.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAll() {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(expenseService.getAllByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(expenseService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@Valid @RequestBody ExpenseRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.create(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(@PathVariable String id, @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ExpenseResponse>> getByCategory(@PathVariable String category) {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(expenseService.getByCategory(userId, category));
    }

    @GetMapping("/monthly/{year}/{month}")
    public ResponseEntity<List<ExpenseResponse>> getByMonth(@PathVariable int year, @PathVariable int month) {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(expenseService.getByMonth(userId, year, month));
    }
}
