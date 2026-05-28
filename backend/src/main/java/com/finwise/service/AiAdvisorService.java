package com.finwise.service;

import com.finwise.dto.analytics.AiInsightResponse;

import java.util.List;

public interface AiAdvisorService {
    List<AiInsightResponse> getInsights(String userId);
    List<AiInsightResponse> generateInsights(String userId);
    void analyzeSpendingBehavior(String userId);
}
