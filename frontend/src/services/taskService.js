import api from './api';

export const taskService = {
  getTasks: async (params) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getMyTasks: async (params) => {
    const response = await api.get('/tasks/my', { params });
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
