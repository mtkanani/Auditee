import React, { useState, useEffect } from 'react';
import { CalendarDays, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';
import { Button, Field, Input, Select, Textarea } from '../ui';
import { cn } from '../../lib/cn';
import { useMyLeaveData, useApplyLeave } from '../../queries/useLeave';

const TYPE_OPTIONS = [
  { value: 'CASUAL_LEAVE', label: 'Casual leave' },
  { value: 'SICK_LEAVE', label: 'Sick leave' },
  { value: 'EARNED_LEAVE', label: 'Earned leave' },
  { value: 'UNPAID_LEAVE', label: 'Unpaid leave (LWP)' },
];

export const ApplyLeaveModal = ({ isOpen, onClose, onSuccess }) => {
  const [leaveType, setLeaveType] = useState('CASUAL_LEAVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const { data: myLeaveData } = useMyLeaveData({ enabled: isOpen });
  const balance = myLeaveData?.balance;
  const applyLeaveMutation = useApplyLeave();

  useEffect(() => {
    if (isOpen) {
      // Default start/end date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isoTomorrow = tomorrow.toISOString().split('T')[0];
      setStartDate(isoTomorrow);
      setEndDate(isoTomorrow);
    }
  }, [isOpen]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e < s) return 0;
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const daysCount = calculateDays();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      toast.error('Start date, end date, and reason are required');
      return;
    }

    if (daysCount <= 0) {
      toast.error('End date cannot be before start date');
      return;
    }

    applyLeaveMutation.mutate(
      {
        leaveType,
        startDate,
        endDate,
        totalDays: daysCount,
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          toast.success('🌴 Leave application submitted successfully!');
          onClose();
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  if (!isOpen) return null;

  const balances = balance
    ? [
        { key: 'CASUAL_LEAVE', label: 'Casual', left: balance.casualLeave - balance.casualLeaveUsed, total: balance.casualLeave },
        { key: 'SICK_LEAVE', label: 'Sick', left: balance.sickLeave - balance.sickLeaveUsed, total: balance.sickLeave },
        { key: 'EARNED_LEAVE', label: 'Earned', left: balance.earnedLeave - balance.earnedLeaveUsed, total: balance.earnedLeave },
      ]
    : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for leave">
      <form onSubmit={handleSubmit} className="space-y-5">
        {balances.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {balances.map((b) => (
              <div
                key={b.key}
                className={cn(
                  'rounded-xl border p-3 transition-colors',
                  leaveType === b.key ? 'border-accent bg-accent-soft/50' : 'border-line bg-sunken/40'
                )}
              >
                <p className="text-xs text-subtle">{b.label}</p>
                <p className="text-lg font-semibold text-fg tabular-nums leading-7">{b.left.toFixed(1)}</p>
                <p className="text-xs text-subtle">of {b.total} left</p>
              </div>
            ))}
          </div>
        )}

        <Field label="Leave type" required>
          {(p) => <Select {...p} value={leaveType} onChange={(e) => setLeaveType(e.target.value)} options={TYPE_OPTIONS} />}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="From" required>
            {(p) => <Input {...p} type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />}
          </Field>
          <Field label="To" required>
            {(p) => <Input {...p} type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />}
          </Field>
        </div>

        <p
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl text-sm',
            daysCount > 0 ? 'bg-sunken/60 text-fg' : 'bg-danger-soft text-danger'
          )}
          aria-live="polite"
        >
          <CalendarDays className="w-4 h-4 shrink-0" aria-hidden="true" />
          {daysCount > 0 ? (
            <span>
              <span className="font-semibold tabular-nums">{daysCount}</span> day{daysCount === 1 ? '' : 's'} requested
            </span>
          ) : (
            'The end date is before the start date'
          )}
        </p>

        <Field label="Reason" required>
          {(p) => <Textarea {...p} required rows={3} placeholder="Why you need the time off" value={reason} onChange={(e) => setReason(e.target.value)} />}
        </Field>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" icon={Send} loading={applyLeaveMutation.isPending}>Send request</Button>
        </div>
      </form>
    </Modal>
  );
};
