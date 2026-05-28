import { useState, useEffect, useCallback } from 'react';
import { budgetService } from '../services/budgetService';
import { Budget } from '../types';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await budgetService.getAll();
      setBudgets(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const createBudget = async (data: Record<string, unknown>) => {
    const response = await budgetService.create(data);
    setBudgets((prev) => [response.data, ...prev]);
  };

  const updateBudget = async (id: string, data: Record<string, unknown>) => {
    const response = await budgetService.update(id, data);
    setBudgets((prev) => prev.map((b) => (b.id === id ? response.data : b)));
  };

  const deleteBudget = async (id: string) => {
    await budgetService.delete(id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  return { budgets, isLoading, error, createBudget, updateBudget, deleteBudget, refetch: fetchBudgets };
}
