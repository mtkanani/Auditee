import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';
import { Button, Field, Input, Select } from '../ui';
import { useUpdateEmployeeLeaveBalance } from '../../queries/useLeave';

export const AdjustEmployeeLeaveModal = ({ isOpen, onClose, employeeBalances, onBalanceAdjusted }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [casualLeave, setCasualLeave] = useState(12);
  const [sickLeave, setSickLeave] = useState(10);
  const [earnedLeave, setEarnedLeave] = useState(15);

  const updateBalanceMutation = useUpdateEmployeeLeaveBalance();

  const selectedBalance = employeeBalances.find((b) => b.userId === parseInt(selectedUserId, 10));

  useEffect(() => {
    if (selectedBalance) {
      setCasualLeave(selectedBalance.casualLeave);
      setSickLeave(selectedBalance.sickLeave);
      setEarnedLeave(selectedBalance.earnedLeave);
    }
  }, [selectedUserId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Please select an employee');
      return;
    }

    const payload = {
      casualLeave: parseFloat(casualLeave),
      sickLeave: parseFloat(sickLeave),
      earnedLeave: parseFloat(earnedLeave),
    };

    updateBalanceMutation.mutate(
      { userId: selectedUserId, balanceData: payload },
      {
        onSuccess: () => {
          if (onBalanceAdjusted) onBalanceAdjusted();
          onClose();
        },
      }
    );
  };

  const fields = selectedBalance
    ? [
        { key: 'casual', label: 'Casual leave', value: casualLeave, set: setCasualLeave, used: selectedBalance.casualLeaveUsed },
        { key: 'sick', label: 'Sick leave', value: sickLeave, set: setSickLeave, used: selectedBalance.sickLeaveUsed },
        { key: 'earned', label: 'Earned leave', value: earnedLeave, set: setEarnedLeave, used: selectedBalance.earnedLeaveUsed },
      ]
    : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adjust leave quotas">
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-sm text-muted">
          Give one person more or fewer days than the firm policy, for example senior auditors, interns or a special allowance.
        </p>

        <Field label="Employee" required>
          {(p) => (
            <Select {...p} value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="">Choose an employee</option>
              {employeeBalances.map((b) => (
                <option key={b.userId} value={b.userId}>
                  {b.user?.firstName} {b.user?.lastName} ({b.user?.designation || 'Staff'})
                </option>
              ))}
            </Select>
          )}
        </Field>

        {selectedBalance && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {fields.map((f) => (
              <Field key={f.key} label={`${f.label} (days)`} hint={`${f.used} used so far`}>
                {(p) => <Input {...p} type="number" step="0.5" min="0" value={f.value} onChange={(e) => f.set(e.target.value)} />}
              </Field>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" icon={Save} loading={updateBalanceMutation.isPending} disabled={!selectedUserId}>
            Save quotas
          </Button>
        </div>
      </form>
    </Modal>
  );
};
