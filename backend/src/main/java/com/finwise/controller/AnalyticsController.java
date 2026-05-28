package com.finwise.controller;

import com.finwise.dto.analytics.AiInsightResponse;
import com.finwise.dto.analytics.SpendingOverview;
import com.finwise.dto.analytics.CategoryBreakdown;
import com.finwise.dto.analytics.SpendingTrend;
import com.finwise.security.SecurityUtils;
import com.finwise.service.AnalyticsService;
import com.finwise.service.AiAdvisorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AiAdvisorService aiAdvisorService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService, AiAdvisorService aiAdvisorService) {
        this.analyticsService = analyticsService;
        this.aiAdvisorService = aiAdvisorService;
    }

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
    public ResponseEntity<List<AiInsightResponse>> getAiInsights() {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(aiAdvisorService.getInsights(userId));
    }

    @GetMapping("/ai-suggestions")
    public ResponseEntity<List<AiInsightResponse>> getAiSuggestions() {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(aiAdvisorService.generateInsights(userId));
    }
}
