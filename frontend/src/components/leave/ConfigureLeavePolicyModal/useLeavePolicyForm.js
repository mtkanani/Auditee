import { useState, useEffect } from 'react';
import { useUpdateLeavePolicy } from '../../../queries/useLeave';

export const useLeavePolicyForm = ({ currentPolicy, onClose, onPolicyUpdated }) => {
  const [accrualMode, setAccrualMode] = useState('YEARLY');
  const [casualLeaveQuota, setCasualLeaveQuota] = useState(12);
  const [sickLeaveQuota, setSickLeaveQuota] = useState(10);
  const [earnedLeaveQuota, setEarnedLeaveQuota] = useState(15);
  const [perMonthCasual, setPerMonthCasual] = useState(1.0);
  const [perMonthSick, setPerMonthSick] = useState(0.83);
  const [perMonthEarned, setPerMonthEarned] = useState(1.25);
  const [updateAllBalances, setUpdateAllBalances] = useState(true);

  const updatePolicyMutation = useUpdateLeavePolicy();

  useEffect(() => {
    if (currentPolicy) {
      setAccrualMode(currentPolicy.accrualMode || 'YEARLY');
      setCasualLeaveQuota(currentPolicy.casualLeaveQuota ?? 12);
      setSickLeaveQuota(currentPolicy.sickLeaveQuota ?? 10);
      setEarnedLeaveQuota(currentPolicy.earnedLeaveQuota ?? 15);
      setPerMonthCasual(currentPolicy.perMonthCasual ?? 1.0);
      setPerMonthSick(currentPolicy.perMonthSick ?? 0.83);
      setPerMonthEarned(currentPolicy.perMonthEarned ?? 1.25);
    }
  }, [currentPolicy]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      accrualMode,
      casualLeaveQuota: parseFloat(casualLeaveQuota),
      sickLeaveQuota: parseFloat(sickLeaveQuota),
      earnedLeaveQuota: parseFloat(earnedLeaveQuota),
      perMonthCasual: parseFloat(perMonthCasual),
      perMonthSick: parseFloat(perMonthSick),
      perMonthEarned: parseFloat(perMonthEarned),
      updateAllBalances,
    };

    updatePolicyMutation.mutate(payload, {
      onSuccess: () => {
        if (onPolicyUpdated) onPolicyUpdated();
        onClose();
      },
    });
  };

  // Auto-calculation handlers (Per Month <-> Per Year)
  const handleCasualQuotaChange = (val) => {
    setCasualLeaveQuota(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPerMonthCasual(parseFloat((num / 12).toFixed(2)));
    }
  };

  const handlePerMonthCasualChange = (val) => {
    setPerMonthCasual(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCasualLeaveQuota(parseFloat((num * 12).toFixed(1)));
    }
  };

  const handleSickQuotaChange = (val) => {
    setSickLeaveQuota(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPerMonthSick(parseFloat((num / 12).toFixed(2)));
    }
  };

  const handlePerMonthSickChange = (val) => {
    setPerMonthSick(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setSickLeaveQuota(parseFloat((num * 12).toFixed(1)));
    }
  };

  const handleEarnedQuotaChange = (val) => {
    setEarnedLeaveQuota(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPerMonthEarned(parseFloat((num / 12).toFixed(2)));
    }
  };

  const handlePerMonthEarnedChange = (val) => {
    setPerMonthEarned(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setEarnedLeaveQuota(parseFloat((num * 12).toFixed(1)));
    }
  };

  // One entry per leave type, for the quota cards.
  const quotas = [
    { key: 'casual', title: 'Casual leave', year: casualLeaveQuota, month: perMonthCasual, onYear: handleCasualQuotaChange, onMonth: handlePerMonthCasualChange },
    { key: 'sick', title: 'Sick leave', year: sickLeaveQuota, month: perMonthSick, onYear: handleSickQuotaChange, onMonth: handlePerMonthSickChange },
    { key: 'earned', title: 'Earned leave', year: earnedLeaveQuota, month: perMonthEarned, onYear: handleEarnedQuotaChange, onMonth: handlePerMonthEarnedChange },
  ];

  return { accrualMode, setAccrualMode, quotas, updateAllBalances, setUpdateAllBalances, handleSubmit, updatePolicyMutation };
};
