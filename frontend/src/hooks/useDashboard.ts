import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import { budgetService } from '../services/budgetService';
import { goalService } from '../services/goalService';
import { SpendingOverview, CategoryBreakdown, Budget, SavingsGoal } from '../types';

interface DashboardData {
  overview: SpendingOverview | null;
  categories: CategoryBreakdown[];
  activeBudgets: Budget[];
  goals: SavingsGoal[];
  isLoading: boolean;
  error: string | null;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData>({
    overview: null,
    categories: [],
    activeBudgets: [],
    goals: [],
    isLoading: true,
    error: null,
  });

  const fetchDashboard = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [overviewRes, categoriesRes, budgetsRes, goalsRes] = await Promise.all([
        analyticsService.getSpendingOverview('month'),
        analyticsService.getCategoryBreakdown('month'),
        budgetService.getActive(),
        goalService.getAll(),
      ]);

      setData({
        overview: overviewRes.data,
        categories: categoriesRes.data,
        activeBudgets: budgetsRes.data,
        goals: goalsRes.data,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to load dashboard data',
      }));
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { ...data, refetch: fetchDashboard };
}
