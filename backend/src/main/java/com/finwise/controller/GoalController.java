package com.finwise.controller;

import com.finwise.dto.goal.GoalRequest;
import com.finwise.dto.goal.GoalResponse;
import com.finwise.security.SecurityUtils;
import com.finwise.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    @Autowired
    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getAll() {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(goalService.getAllByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(goalService.getById(id));
    }

    @PostMapping
    public ResponseEntity<GoalResponse> create(@Valid @RequestBody GoalRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.create(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> update(@PathVariable String id, @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        goalService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<GoalResponse> contribute(@PathVariable String id, @RequestBody Map<String, BigDecimal> body) {
        return ResponseEntity.ok(goalService.addContribution(id, body.get("amount")));
    }
}
