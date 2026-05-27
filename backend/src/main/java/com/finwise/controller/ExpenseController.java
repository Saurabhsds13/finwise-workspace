package com.finwise.controller;

import com.finwise.dto.expense.ExpenseRequest;
import com.finwise.dto.expense.ExpenseResponse;
import com.finwise.security.CurrentUser;
import com.finwise.security.UserPrincipal;
import com.finwise.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAll(@CurrentUser UserPrincipal user) {
        return ResponseEntity.ok(expenseService.getAllByUser(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(expenseService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@CurrentUser UserPrincipal user,
                                                   @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(expenseService.create(user.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(@PathVariable String id,
                                                   @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ExpenseResponse>> getByCategory(@CurrentUser UserPrincipal user,
                                                                @PathVariable String category) {
        return ResponseEntity.ok(expenseService.getByCategory(user.getId(), category));
    }

    @GetMapping("/monthly/{year}/{month}")
    public ResponseEntity<List<ExpenseResponse>> getByMonth(@CurrentUser UserPrincipal user,
                                                             @PathVariable int year,
                                                             @PathVariable int month) {
        return ResponseEntity.ok(expenseService.getByMonth(user.getId(), year, month));
    }
}
