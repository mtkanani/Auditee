import { useState, useCallback } from 'react';
import { firmService } from '../services/firmService';
import { toast } from 'react-toastify';

export const useFirm = () => {
  const [firms, setFirms] = useState([]);
  const [currentFirm, setCurrentFirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  const getFirms = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await firmService.getFirms(filters);
      if (res.success) {
        setFirms(res.data || []);
        setPagination(res.pagination || {
          currentPage: filters.page || 1,
          limit: filters.limit || 10,
          totalRecords: 0,
          totalPages: 0,
        });
      } else {
        throw new Error(res.message || 'Failed to fetch firms');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch firms');
      setFirms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFirmById = useCallback(async (firmId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await firmService.getFirmById(firmId);
      if (res.success) {
        setCurrentFirm(res.data);
        return res.data;
      } else {
        throw new Error(res.message || 'Failed to fetch firm details');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch firm details');
      setCurrentFirm(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFirm = async (firmData, adminData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await firmService.createFirm({ firm: firmData, firmAdmin: adminData });
      if (res.success) {
        toast.success('Firm and Firm Admin created successfully!', { theme: 'dark' });
        return res.data;
      } else {
        throw new Error(res.message || 'Failed to create firm');
      }
    } catch (err) {
      setError(err.message || 'Failed to create firm');
      toast.error(err.message || 'Failed to create firm', { theme: 'dark' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFirm = async (firmId, firmData, adminData) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Update general firm data
      await firmService.updateFirm(firmId, firmData);
      
      // 2. Update admin details
      await firmService.updateFirmAdmin(firmId, adminData);

      toast.success('Firm details updated successfully!', { theme: 'dark' });
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update firm details');
      toast.error(err.message || 'Failed to update firm details', { theme: 'dark' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeFirmStatus = async (firmId, status) => {
    setLoading(true);
    setError(null);
    try {
      const res = await firmService.changeFirmStatus(firmId, status);
      if (res.success) {
        toast.success(`Firm status changed to ${status} successfully!`, { theme: 'dark' });
        return true;
      } else {
        throw new Error(res.message || 'Failed to update status');
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
      toast.error(err.message || 'Failed to update status', { theme: 'dark' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetFirmAdminPassword = async (firmId, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const res = await firmService.resetFirmAdminPassword(firmId, newPassword);
      if (res.success) {
        toast.success('Admin password reset successfully!', { theme: 'dark' });
        return true;
      } else {
        throw new Error(res.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      toast.error(err.message || 'Failed to reset password', { theme: 'dark' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFirm = async (firmId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await firmService.deleteFirm(firmId);
      if (res.success) {
        toast.success('Firm deleted successfully!', { theme: 'dark' });
        return true;
      } else {
        throw new Error(res.message || 'Failed to delete firm');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete firm');
      toast.error(err.message || 'Failed to delete firm', { theme: 'dark' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    firms,
    currentFirm,
    loading,
    error,
    pagination,
    getFirms,
    getFirmById,
    createFirm,
    updateFirm,
    changeFirmStatus,
    resetFirmAdminPassword,
    deleteFirm,
  };
};
