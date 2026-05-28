import api from './api';

export const budgetService = {
  getAll: () => api.get('/budgets'),
  getById: (id: string) => api.get(`/budgets/${id}`),
  create: (data: Record<string, unknown>) => api.post('/budgets', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/budgets/${id}`, data),
  delete: (id: string) => api.delete(`/budgets/${id}`),
  getActive: () => api.get('/budgets/active'),
};
