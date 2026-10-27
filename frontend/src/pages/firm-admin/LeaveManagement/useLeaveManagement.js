import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useMyLeaveData,
  usePendingLeaveRequests,
  useAllFirmLeaveRequests,
  useLeaveCalendar,
  useAllEmployeeBalances,
  useReviewLeave,
} from '../../../queries/useLeave';
import { useAuth } from '../../../context/AuthContext';

export const useLeaveManagement = () => {
  const { user } = useAuth();
  const location = useLocation();

  const userRole = (user?.role || '').toUpperCase();
  const isAdmin = userRole === 'FIRM_ADMIN' || userRole === 'ADMIN';

  // Tab State: 'pending' | 'all_firm' | 'my_leaves' | 'calendar'
  const [activeTab, setActiveTab] = useState(isAdmin ? 'pending' : 'my_leaves');

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(Boolean(location.state?.openApplyModal));
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [displayQuotaMode, setDisplayQuotaMode] = useState('YEARLY'); // 'YEARLY' | 'MONTHLY'
  const [adminRemarks, setAdminRemarks] = useState({});

  const {
    data: myLeaveData = { balance: null, requests: [], policy: null },
    isLoading: isLoadingMy,
    error: myError,
  } = useMyLeaveData();

  const {
    data: pendingData,
    isLoading: isLoadingPending,
    error: pendError,
  } = usePendingLeaveRequests({ enabled: isAdmin });
  const pendingRequests = pendingData?.pendingRequests || [];

  const {
    data: allFirmRequests = [],
    isLoading: isLoadingFirm,
    error: firmError,
  } = useAllFirmLeaveRequests({ enabled: isAdmin });

  const {
    data: calendarEvents = [],
    isLoading: isLoadingCal,
    error: calError,
  } = useLeaveCalendar({ month: selectedMonth, year: selectedYear });

  const {
    data: employeeBalances = [],
    isLoading: isLoadingBalances,
    error: balError,
  } = useAllEmployeeBalances({ enabled: isAdmin });

  const isLoading = isAdmin
    ? (isLoadingMy || isLoadingPending || isLoadingFirm || isLoadingCal || isLoadingBalances)
    : (isLoadingMy || isLoadingCal);

  useEffect(() => {
    const error = myError || pendError || firmError || calError || balError;
    if (error) {
      toast.error('Failed to load leave management data');
    }
  }, [myError, pendError, firmError, calError, balError]);

  const reviewLeaveMutation = useReviewLeave();

  const handleAdminReview = (id, status) => {
    const remarks = adminRemarks[id] || '';
    reviewLeaveMutation.mutate({ id, status, adminRemarks: remarks });
  };

  const balance = myLeaveData.balance;

  return {
    isAdmin,
    activeTab,
    setActiveTab,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    isApplyModalOpen,
    setIsApplyModalOpen,
    isPolicyModalOpen,
    setIsPolicyModalOpen,
    isAdjustModalOpen,
    setIsAdjustModalOpen,
    displayQuotaMode,
    setDisplayQuotaMode,
    adminRemarks,
    setAdminRemarks,
    myLeaveData,
    pendingRequests,
    allFirmRequests,
    calendarEvents,
    employeeBalances,
    isLoading,
    handleAdminReview,
    balance,
  };
};
