import api from './api';

export const employeeService = {
  getEmployees: async (params) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  getCurrentEmployee: async () => {
    const response = await api.get('/employees/me');
    return response.data;
  },

  createEmployee: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  updateEmployee: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  deactivateEmployee: async (id) => {
    const response = await api.patch(`/employees/${id}/deactivate`);
    return response.data;
  },
};
