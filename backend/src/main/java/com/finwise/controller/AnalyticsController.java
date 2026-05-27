package com.finwise.controller;

import com.finwise.dto.analytics.SpendingOverview;
import com.finwise.dto.analytics.CategoryBreakdown;
import com.finwise.dto.analytics.SpendingTrend;
import com.finwise.entity.AiInsight;
import com.finwise.security.CurrentUser;
import com.finwise.security.UserPrincipal;
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
    public ResponseEntity<SpendingOverview> getSpendingOverview(@CurrentUser UserPrincipal user,
                                                                @RequestParam String period) {
        return ResponseEntity.ok(analyticsService.getSpendingOverview(user.getId(), period));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryBreakdown>> getCategoryBreakdown(@CurrentUser UserPrincipal user,
                                                                         @RequestParam String period) {
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(user.getId(), period));
    }

    @GetMapping("/trends")
    public ResponseEntity<List<SpendingTrend>> getTrends(@CurrentUser UserPrincipal user,
                                                          @RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(analyticsService.getSpendingTrends(user.getId(), months));
    }

    @GetMapping("/ai-insights")
    public ResponseEntity<List<AiInsight>> getAiInsights(@CurrentUser UserPrincipal user) {
        return ResponseEntity.ok(aiAdvisorService.getInsights(user.getId()));
    }

    @GetMapping("/ai-suggestions")
    public ResponseEntity<List<AiInsight>> getAiSuggestions(@CurrentUser UserPrincipal user) {
        return ResponseEntity.ok(aiAdvisorService.generateInsights(user.getId()));
    }
}
