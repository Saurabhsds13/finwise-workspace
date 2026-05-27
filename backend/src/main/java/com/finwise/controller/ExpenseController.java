package com.finwise.controller;

import com.finwise.dto.expense.ExpenseRequest;
import com.finwise.dto.expense.ExpenseResponse;
import com.finwise.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAll() {
        // userId extracted from security context
        return ResponseEntity.ok(expenseService.getAllByUser("currentUserId"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(expenseService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.create("currentUserId", request));
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
        return ResponseEntity.ok(expenseService.getByCategory("currentUserId", category));
    }

    @GetMapping("/monthly/{year}/{month}")
    public ResponseEntity<List<ExpenseResponse>> getByMonth(@PathVariable int year, @PathVariable int month) {
        return ResponseEntity.ok(expenseService.getByMonth("currentUserId", year, month));
    }
}
