import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';
import { Expense } from '../types';

interface ExpenseFilters {
  category: string;
  month: string;
}

export function useExpenses(filters: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (filters.category) params.category = filters.category;
      if (filters.month) params.month = filters.month;

      const response = await expenseService.getAll(params);
      setExpenses(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, [filters.category, filters.month]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = async (data: Record<string, unknown>) => {
    const response = await expenseService.create(data);
    setExpenses((prev) => [response.data, ...prev]);
  };

  const updateExpense = async (id: string, data: Record<string, unknown>) => {
    const response = await expenseService.update(id, data);
    setExpenses((prev) => prev.map((e) => (e.id === id ? response.data : e)));
  };

  const deleteExpense = async (id: string) => {
    await expenseService.delete(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return { expenses, isLoading, error, createExpense, updateExpense, deleteExpense, refetch: fetchExpenses };
}
