import api from './api';

export const goalService = {
  getAll: () => api.get('/goals'),
  getById: (id: string) => api.get(`/goals/${id}`),
  create: (data: Record<string, unknown>) => api.post('/goals', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/goals/${id}`, data),
  delete: (id: string) => api.delete(`/goals/${id}`),
  addContribution: (id: string, amount: number) => api.post(`/goals/${id}/contribute`, { amount }),
};
