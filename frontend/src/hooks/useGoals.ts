import { useState, useEffect, useCallback } from 'react';
import { goalService } from '../services/goalService';
import { SavingsGoal } from '../types';

export function useGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await goalService.getAll();
      setGoals(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to load goals');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = async (data: Record<string, unknown>) => {
    const response = await goalService.create(data);
    setGoals((prev) => [response.data, ...prev]);
  };

  const updateGoal = async (id: string, data: Record<string, unknown>) => {
    const response = await goalService.update(id, data);
    setGoals((prev) => prev.map((g) => (g.id === id ? response.data : g)));
  };

  const deleteGoal = async (id: string) => {
    await goalService.delete(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addContribution = async (id: string, amount: number) => {
    const response = await goalService.addContribution(id, amount);
    setGoals((prev) => prev.map((g) => (g.id === id ? response.data : g)));
  };

  return { goals, isLoading, error, createGoal, updateGoal, deleteGoal, addContribution, refetch: fetchGoals };
}
