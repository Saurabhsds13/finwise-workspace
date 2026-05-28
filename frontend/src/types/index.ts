export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring: boolean;
  recurringFrequency?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  name: string;
  totalAmount: number;
  spentAmount: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  progressPercentage: number;
  createdAt: string;
}

export interface AiInsight {
  id: string;
  type: 'WARNING' | 'SUGGESTION' | 'ACHIEVEMENT';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SpendingOverview {
  totalSpent: number;
  totalBudget: number;
  remainingBudget: number;
  budgetUtilizationPercentage: number;
  averageDailySpending: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface SpendingTrend {
  month: string;
  totalSpent: number;
  budgetAmount: number;
}
