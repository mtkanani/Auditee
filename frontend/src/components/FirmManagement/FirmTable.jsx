import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, ShieldAlert, KeyRound, CheckCircle2, MoreVertical } from 'lucide-react';

const FirmTable = ({ firms = [], onStatusChange, onResetPassword, onDelete }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        );
      case 'INACTIVE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Inactive
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 rounded-md">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleDropdown = (id) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  return (
    <div className="w-full">
      {/* ── Desktop and Laptop Table View (Hidden on mobile/tablet) ── */}
      <div className="hidden md:block overflow-x-auto bg-slate-900/30 border border-slate-800 rounded-2xl backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/40">
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Firm Name</th>
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Firm Admin</th>
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Email</th>
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Phone</th>
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Created Date</th>
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {firms.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500 text-sm">
                  No firms found matching the criteria.
                </td>
              </tr>
            ) : (
              firms.map((firm) => (
                <tr 
                  key={firm.id}
                  className="group hover:bg-slate-900/20 transition-all duration-150"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">
                      {firm.firmName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">
                      {firm.firmAdmin ? `${firm.firmAdmin.firstName} ${firm.firmAdmin.lastName}` : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400 font-mono text-[13px]">{firm.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">{firm.phone}</span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(firm.status)}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">{formatDate(firm.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => navigate(`/admin/firms/${firm.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/firms/${firm.id}/edit`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        title="Edit Firm"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Dropdown Menu for Extra Operations */}
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(firm.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all focus:outline-none"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {activeDropdown === firm.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setActiveDropdown(null)} 
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-850 rounded-xl shadow-2xl p-1 z-20 text-left animate-fade-in">
                              <button
                                onClick={() => {
                                  onStatusChange(firm);
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                              >
                                <CheckCircle2 size={14} className="text-brand-400" />
                                Change Status
                              </button>
                              <button
                                onClick={() => {
                                  onResetPassword(firm);
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                              >
                                <KeyRound size={14} className="text-amber-400" />
                                Reset Admin Pwd
                              </button>
                              <div className="border-t border-slate-800 my-1" />
                              <button
                                onClick={() => {
                                  onDelete(firm);
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={14} />
                                Delete Firm
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile and Tablet Card View (Collapses under 768px) ── */}
      <div className="block md:hidden space-y-4">
        {firms.length === 0 ? (
          <div className="text-center text-slate-500 py-10 bg-slate-900/30 border border-slate-800 rounded-2xl">
            No firms found matching the criteria.
          </div>
        ) : (
          firms.map((firm) => (
            <div
              key={firm.id}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-200"
            >
              {/* Firm Name & Status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {firm.firmName}
                  </h4>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Created {formatDate(firm.createdAt)}
                  </span>
                </div>
                {getStatusBadge(firm.status)}
              </div>

              {/* Data Fields */}
              <div className="space-y-2 border-t border-b border-slate-800/60 py-3 my-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Admin:</span>
                  <span className="text-slate-300 font-semibold">
                    {firm.firmAdmin ? `${firm.firmAdmin.firstName} ${firm.firmAdmin.lastName}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="text-slate-300 font-semibold truncate max-w-[180px]">
                    {firm.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="text-slate-300 font-semibold">{firm.phone}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between gap-2.5 pt-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/firms/${firm.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold text-slate-300 transition-all"
                  >
                    <Eye size={12} />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/admin/firms/${firm.id}/edit`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold text-slate-300 transition-all"
                  >
                    <Edit size={12} />
                    Edit
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(firm.id)}
                    className="p-1.5 rounded-lg text-slate-400 bg-slate-850 border border-slate-800 hover:text-white transition-all"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {activeDropdown === firm.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setActiveDropdown(null)} 
                      />
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-20 text-left animate-fade-in">
                        <button
                          onClick={() => {
                            onStatusChange(firm);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                        >
                          <CheckCircle2 size={14} className="text-brand-400" />
                          Change Status
                        </button>
                        <button
                          onClick={() => {
                            onResetPassword(firm);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                        >
                          <KeyRound size={14} className="text-amber-400" />
                          Reset Admin Pwd
                        </button>
                        <div className="border-t border-slate-800 my-1" />
                        <button
                          onClick={() => {
                            onDelete(firm);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                          Delete Firm
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FirmTable;
