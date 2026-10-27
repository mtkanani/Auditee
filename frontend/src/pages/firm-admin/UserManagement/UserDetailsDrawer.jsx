import React from 'react';
import { Drawer } from '../../../components/common/Drawer';
import { Avatar } from '../../../components/common/Avatar';
import { StatusBadge } from '../../../components/common/StatusBadge';

export const UserDetailsDrawer = ({ isDetailDrawerOpen, setIsDetailDrawerOpen, selectedUser }) => (
  <Drawer
    isOpen={isDetailDrawerOpen}
    onClose={() => setIsDetailDrawerOpen(false)}
    title="Employee User Profile"
  >
    {selectedUser && (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <Avatar firstName={selectedUser.firstName} lastName={selectedUser.lastName} size="lg" />
          <div>
            <h3 className="font-bold text-slate-100">{selectedUser.firstName} {selectedUser.lastName}</h3>
            <p className="text-xs text-slate-400">{selectedUser.email}</p>
            <div className="mt-2">
              <StatusBadge status={selectedUser.status || 'ACTIVE'} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Mobile Number</span>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedUser.mobileNumber || selectedUser.phone || 'N/A'}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Designation</span>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedUser.designation || 'Staff Accountant'}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold">City</span>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedUser.city || 'N/A'}</p>
          </div>
        </div>
      </div>
    )}
  </Drawer>
);
