package com.finwise.controller;

import com.finwise.dto.analytics.SpendingOverview;
import com.finwise.dto.analytics.CategoryBreakdown;
import com.finwise.dto.analytics.SpendingTrend;
import com.finwise.entity.AiInsight;
import com.finwise.security.SecurityUtils;
import com.finwise.service.AnalyticsService;
import com.finwise.service.AiAdvisorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AiAdvisorService aiAdvisorService;

    @GetMapping("/spending")
    public ResponseEntity<SpendingOverview> getSpendingOverview(@RequestParam String period) {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(analyticsService.getSpendingOverview(userId, period));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryBreakdown>> getCategoryBreakdown(@RequestParam String period) {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(userId, period));
    }

    @GetMapping("/trends")
    public ResponseEntity<List<SpendingTrend>> getTrends(@RequestParam(defaultValue = "6") int months) {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(analyticsService.getSpendingTrends(userId, months));
    }

    @GetMapping("/ai-insights")
    public ResponseEntity<List<AiInsight>> getAiInsights() {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(aiAdvisorService.getInsights(userId));
    }

    @GetMapping("/ai-suggestions")
    public ResponseEntity<List<AiInsight>> getAiSuggestions() {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(aiAdvisorService.generateInsights(userId));
    }
}
