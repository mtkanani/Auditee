import React from 'react';
import { Drawer } from '../../../components/common/Drawer';
import { Avatar } from '../../../components/common/Avatar';
import { StatusTag } from '../../../components/ui';
import { InfoItem } from '../../../components/clients/ClientDetailModal/parts';

export const UserDetailsDrawer = ({ isDetailDrawerOpen, setIsDetailDrawerOpen, selectedUser }) => (
  <Drawer isOpen={isDetailDrawerOpen} onClose={() => setIsDetailDrawerOpen(false)} title="Team member">
    {selectedUser && (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar firstName={selectedUser.firstName} lastName={selectedUser.lastName} size="xl" className="shrink-0" />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-fg truncate">
              {selectedUser.firstName} {selectedUser.lastName}
            </h3>
            <p className="text-sm text-muted truncate">{selectedUser.email}</p>
            <div className="mt-2">
              <StatusTag status={selectedUser.status || 'ACTIVE'} />
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl border border-line p-5">
          <InfoItem label="Designation" value={selectedUser.designation || 'Staff Accountant'} className="col-span-2" />
          <InfoItem label="Mobile" value={selectedUser.mobileNumber || selectedUser.phone} />
          <InfoItem label="City" value={selectedUser.city} />
        </dl>
      </div>
    )}
  </Drawer>
);
