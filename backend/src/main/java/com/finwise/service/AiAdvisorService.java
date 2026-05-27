package com.finwise.service;

import com.finwise.entity.AiInsight;
import java.util.List;

public interface AiAdvisorService {
    List<AiInsight> getInsights(String userId);
    List<AiInsight> generateInsights(String userId);
    void analyzeSpendingBehavior(String userId);
}
