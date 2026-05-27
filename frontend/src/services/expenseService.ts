import api from './api';

export const expenseService = {
  getAll: (params?: Record<string, string>) => api.get('/expenses', { params }),
  getById: (id: string) => api.get(`/expenses/${id}`),
  create: (data: Record<string, unknown>) => api.post('/expenses', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
  getByCategory: (category: string) => api.get(`/expenses/category/${category}`),
  getMonthly: (year: number, month: number) => api.get(`/expenses/monthly/${year}/${month}`),
};
