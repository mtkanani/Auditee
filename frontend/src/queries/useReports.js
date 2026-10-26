import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { getSummaryOverview, getReport, generateCustomReport, downloadReportCSV } from '../services/reportService';
import { reportKeys } from './keys';
import toast from 'react-hot-toast';

// ----------------------------------------------------
// QUERIES
// ----------------------------------------------------

export const useReportOverview = ({ enabled = true } = {}) => {
  const query = useQuery({
    queryKey: reportKeys.overview(),
    queryFn: async () => {
      const res = await getSummaryOverview();
      return res?.data || res;
    },
    enabled,
  });

  return {
    summary: query.data,
    ...query,
  };
};

export const useReportData = (reportType, params = {}, { enabled = true } = {}) => {
  const query = useQuery({
    queryKey: reportKeys.type(reportType, params),
    queryFn: async () => {
      const res = await getReport(reportType, params);
      return res?.data || [];
    },
    enabled: Boolean(reportType && reportType !== 'overview' && reportType !== 'custom' && enabled),
    placeholderData: keepPreviousData,
  });

  return {
    reportData: Array.isArray(query.data) ? query.data : [],
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export const useGenerateCustomReport = () => {
  return useMutation({
    mutationFn: (config) => generateCustomReport(config),
    onSuccess: () => {
      toast.success('Custom report generated successfully');
    },
    onError: () => {
      toast.error('Failed to generate custom report');
    },
  });
};

export const useDownloadReportCSV = () => {
  return useMutation({
    mutationFn: ({ reportType, params, customConfig }) =>
      downloadReportCSV(reportType, params, customConfig),
    onSuccess: () => {
      toast.success('Report CSV downloaded');
    },
    onError: () => {
      toast.error('Failed to export CSV');
    },
  });
};
