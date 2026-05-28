import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import { SpendingOverview, CategoryBreakdown, SpendingTrend, AiInsight } from '../types';

interface AnalyticsData {
  overview: SpendingOverview | null;
  categories: CategoryBreakdown[];
  trends: SpendingTrend[];
  insights: AiInsight[];
  isLoading: boolean;
  error: string | null;
}

export function useAnalytics(period: string) {
  const [data, setData] = useState<AnalyticsData>({
    overview: null,
    categories: [],
    trends: [],
    insights: [],
    isLoading: true,
    error: null,
  });

  const fetchAnalytics = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [overviewRes, categoriesRes, trendsRes, insightsRes] = await Promise.all([
        analyticsService.getSpendingOverview(period),
        analyticsService.getCategoryBreakdown(period),
        analyticsService.getTrends(6),
        analyticsService.getAiInsights(),
      ]);

      setData({
        overview: overviewRes.data,
        categories: categoriesRes.data,
        trends: trendsRes.data,
        insights: insightsRes.data,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to load analytics',
      }));
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { ...data, refetch: fetchAnalytics };
}
