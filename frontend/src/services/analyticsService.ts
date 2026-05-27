import api from './api';

export const analyticsService = {
  getSpendingOverview: (period: string) => api.get(`/analytics/spending?period=${period}`),
  getCategoryBreakdown: (period: string) => api.get(`/analytics/categories?period=${period}`),
  getTrends: (months: number) => api.get(`/analytics/trends?months=${months}`),
  getAiInsights: () => api.get('/analytics/ai-insights'),
  getAiSuggestions: () => api.get('/analytics/ai-suggestions'),
};
