import axiosInstance from './axiosInstance';

export const getSummaryOverview = async () => {
  const response = await axiosInstance.get('/reports/overview');
  return response.data;
};

export const getReport = async (reportType, params = {}) => {
  const response = await axiosInstance.get(`/reports/${reportType}`, { params });
  return response.data;
};

export const generateCustomReport = async (config) => {
  const response = await axiosInstance.post('/reports/custom', config);
  return response.data;
};

export const downloadReportCSV = async (reportType, params = {}, customConfig = null) => {
  let response;
  if (reportType === 'custom') {
    response = await axiosInstance.post('/reports/custom/export', customConfig || {}, {
      responseType: 'blob',
    });
  } else {
    response = await axiosInstance.get(`/reports/${reportType}/export`, {
      params,
      responseType: 'blob',
    });
  }

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${reportType}-report-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
