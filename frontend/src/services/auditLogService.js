import api from './api';

export const auditLogService = {
  getAuditLogs: async (page = 0, size = 15) => {
    const response = await api.get('/audit-logs', {
      params: { page, size }
    });
    return response.data;
  }
};
