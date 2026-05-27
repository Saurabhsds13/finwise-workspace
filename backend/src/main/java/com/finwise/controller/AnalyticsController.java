package com.finwise.controller;

import com.finwise.dto.analytics.SpendingOverview;
import com.finwise.dto.analytics.CategoryBreakdown;
import com.finwise.dto.analytics.SpendingTrend;
import com.finwise.entity.AiInsight;
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
        return ResponseEntity.ok(analyticsService.getSpendingOverview("currentUserId", period));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryBreakdown>> getCategoryBreakdown(@RequestParam String period) {
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown("currentUserId", period));
    }

    @GetMapping("/trends")
    public ResponseEntity<List<SpendingTrend>> getTrends(@RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(analyticsService.getSpendingTrends("currentUserId", months));
    }

    @GetMapping("/ai-insights")
    public ResponseEntity<List<AiInsight>> getAiInsights() {
        return ResponseEntity.ok(aiAdvisorService.getInsights("currentUserId"));
    }

    @GetMapping("/ai-suggestions")
    public ResponseEntity<List<AiInsight>> getAiSuggestions() {
        return ResponseEntity.ok(aiAdvisorService.generateInsights("currentUserId"));
    }
}
