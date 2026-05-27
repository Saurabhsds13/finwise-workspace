package com.finwise.service;

import com.finwise.dto.analytics.SpendingOverview;
import com.finwise.dto.analytics.CategoryBreakdown;
import com.finwise.dto.analytics.SpendingTrend;
import java.util.List;

public interface AnalyticsService {
    SpendingOverview getSpendingOverview(String userId, String period);
    List<CategoryBreakdown> getCategoryBreakdown(String userId, String period);
    List<SpendingTrend> getSpendingTrends(String userId, int months);
}
