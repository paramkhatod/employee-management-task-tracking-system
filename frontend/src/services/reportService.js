import api from './api';

export const reportService = {
  downloadAllTasksPdf: async () => {
    const response = await api.get('/reports/tasks/pdf', {
      responseType: 'blob'
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tasks_report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  downloadEmployeeSummaryPdf: async (employeeId) => {
    const response = await api.get(`/reports/employee/${employeeId}/pdf`, {
      responseType: 'blob'
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `employee_${employeeId}_summary.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
