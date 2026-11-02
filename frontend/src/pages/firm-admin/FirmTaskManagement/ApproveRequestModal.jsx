import React from 'react';
import { Users, User, UsersRound } from 'lucide-react';
import { Modal } from '../../../components/common/Modal';
import { Button, Field, Select, Tabs } from '../../../components/ui';

/** Accept a client work request and assign it to one employee, a group, or everyone. */
export const ApproveRequestModal = ({
  isApproveModalOpen,
  setIsApproveModalOpen,
  selectedRequest,
  handleApproveRequestSubmit,
  requestAssignmentScope,
  setRequestAssignmentScope,
  requestSelectedUserIds,
  setRequestSelectedUserIds,
  users,
  approveRequestMutation,
}) => {
  const toggleUser = (id) =>
    setRequestSelectedUserIds(
      requestSelectedUserIds.includes(id) ? requestSelectedUserIds.filter((x) => x !== id) : [...requestSelectedUserIds, id]
    );

  return (
    <Modal
      isOpen={isApproveModalOpen}
      onClose={() => setIsApproveModalOpen(false)}
      title={`Accept: ${selectedRequest?.title || ''}`}
    >
      <form onSubmit={handleApproveRequestSubmit} className="space-y-5">
        <p className="text-sm text-muted">
          For <span className="font-medium text-fg">{selectedRequest?.client?.companyName || selectedRequest?.client?.clientName}</span>
        </p>

        <div className="space-y-2">
          <p className="text-sm font-medium text-fg">Assign to</p>
          <Tabs
            aria-label="Assignment mode"
            value={requestAssignmentScope}
            onChange={setRequestAssignmentScope}
            items={[
              { value: 'SINGLE', label: 'One person', icon: User },
              { value: 'MULTIPLE', label: 'A team', icon: Users },
              { value: 'ALL', label: 'Everyone', icon: UsersRound },
            ]}
          />
        </div>

        {requestAssignmentScope === 'SINGLE' && (
          <Field label="Employee">
            {(p) => (
              <Select
                {...p}
                value={requestSelectedUserIds[0] || ''}
                onChange={(e) => setRequestSelectedUserIds(e.target.value ? [parseInt(e.target.value, 10)] : [])}
              >
                <option value="">Choose an employee</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.designation || 'Staff'})
                  </option>
                ))}
              </Select>
            )}
          </Field>
        )}

        {requestAssignmentScope === 'MULTIPLE' && (
          <fieldset className="space-y-1.5">
            <legend className="text-sm font-medium text-fg mb-1.5">
              Team members <span className="text-subtle font-normal">({requestSelectedUserIds.length} selected)</span>
            </legend>
            <div className="max-h-48 overflow-y-auto rounded-xl border border-line divide-y divide-line">
              {users.map((u) => (
                <label key={u.id} className="flex items-center gap-3 px-3 h-10 text-sm text-fg cursor-pointer hover:bg-hover">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-[var(--accent)]"
                    checked={requestSelectedUserIds.includes(u.id)}
                    onChange={() => toggleUser(u.id)}
                  />
                  {u.firstName} {u.lastName}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {requestAssignmentScope === 'ALL' && (
          <p className="text-sm text-muted p-3 rounded-xl bg-accent-soft">Every employee in the firm will be assigned this task.</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
          <Button type="submit" variant="primary" loading={approveRequestMutation.isPending}>
            Accept and assign
          </Button>
        </div>
      </form>
    </Modal>
  );
};
