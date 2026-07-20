import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUserCheck, FiPlus, FiTrash2, FiUser, FiBriefcase, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { StatusBadge } from '../common/StatusBadge';

export const DualPanelAssignment = ({
  clients = [],
  users = [],
  assignments = [],
  onAssign,
  onUnassign,
  isLoading = false,
}) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchClient, setSearchClient] = useState('');
  const [searchUser, setSearchUser] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      c.clientName?.toLowerCase().includes(searchClient.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(searchClient.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleAssignClick = async () => {
    if (!selectedClient || !selectedUser) return;
    await onAssign(selectedUser.id, selectedClient.id);
    setSelectedClient(null);
    setSelectedUser(null);
  };

  // Find assignments for currently selected client
  const clientAssignedUsers = selectedClient
    ? assignments.filter((a) => a.clientId === selectedClient.id)
    : [];

  return (
    <div className="space-y-8">
      {/* Dual Panel Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Left Panel: Clients List (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <FiBriefcase className="text-indigo-400" />
              <span>Select Client</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
              {filteredClients.length}
            </span>
          </div>

          <input
            type="text"
            placeholder="Filter clients..."
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            className="my-3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;
              const assignedCount = assignments.filter((a) => a.clientId === client.id).length;

              return (
                <motion.div
                  key={client.id}
                  whileHover={{ x: 3 }}
                  onClick={() => setSelectedClient(client)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{client.clientName}</h4>
                    <p className="text-xs text-slate-400">{client.companyName || client.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {assignedCount} Users
                    </span>
                    {isSelected && <FiCheckCircle className="w-4 h-4 text-indigo-400" />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Employee Users List (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <FiUser className="text-purple-400" />
              <span>Select Employee User</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
              {filteredUsers.length}
            </span>
          </div>

          <input
            type="text"
            placeholder="Filter employee users..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="my-3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredUsers.map((user) => {
              const isSelected = selectedUser?.id === user.id;

              return (
                <motion.div
                  key={user.id}
                  whileHover={{ x: 3 }}
                  onClick={() => setSelectedUser(user)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-600/15 border-purple-500 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-xs text-slate-400">{user.designation || user.email}</p>
                  </div>
                  {isSelected && <FiCheckCircle className="w-4 h-4 text-purple-400" />}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Column (1 Col) */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-center items-center text-center space-y-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FiUserCheck className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-200">Assignment Action</h4>
            <p className="text-xs text-slate-400 mt-1">Select 1 Client & 1 User to pair them up.</p>
          </div>

          <button
            onClick={handleAssignClick}
            disabled={!selectedClient || !selectedUser || isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Assign Pair</span>
          </button>
        </div>
      </div>

      {/* Active Assignments Live Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <span>Active Client-User Assignments</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            {assignments.length} Active
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Assigned Employee</th>
                <th className="py-3 px-4">Role / Designation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {assignments.map((item) => (
                <tr key={`${item.clientId}-${item.userId}`} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {item.client?.clientName || item.clientId}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {item.user ? `${item.user.firstName} ${item.user.lastName}` : item.userId}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {item.user?.designation || 'CA Staff'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onUnassign(item.userId, item.clientId)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
                      title="Remove Assignment"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {assignments.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
                    No client-user assignments created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
