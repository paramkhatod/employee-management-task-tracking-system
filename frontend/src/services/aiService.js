import api from './api';

export const aiService = {
  generateTaskBreakdown: async (title, description) => {
    const response = await api.post('/ai/task-breakdown', { title, description });
    return response.data;
  },

  getWorkloadSummary: async () => {
    const response = await api.get('/ai/workload-summary');
    return response.data;
  }
};
