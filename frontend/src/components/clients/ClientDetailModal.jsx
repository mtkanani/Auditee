import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiBriefcase,
  FiFileText,
  FiDollarSign,
  FiFolder,
  FiClock,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiShield,
  FiLayers,
  FiExternalLink,
  FiAlertCircle,
} from 'react-icons/fi';
import { firmAdminService } from '../../services/firmAdminService';
import toast from 'react-hot-toast';

export const ClientDetailModal = ({ clientId, isOpen, onClose, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'services' | 'billing' | 'documents' | 'history'
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // New Service Form State
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    serviceName: '',
    serviceCategory: 'TAXATION',
    billingFrequency: 'MONTHLY',
    feeAmount: '',
  });

  // New Document Form State
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [docForm, setDocForm] = useState({
    documentName: '',
    documentType: 'GST_CERTIFICATE',
    fileUrl: '',
  });

  const fetchClientDetails = async () => {
    if (!clientId) return;
    setIsLoading(true);
    try {
      const res = await firmAdminService.getClientById(clientId);
      setClient(res.data || res);
    } catch (err) {
      toast.error('Failed to load client master details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientDetails();
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!serviceForm.serviceName.trim()) {
      toast.error('Please enter a service name');
      return;
    }
    try {
      await firmAdminService.addClientService(clientId, serviceForm);
      toast.success('Service added to client subscription!');
      setIsAddingService(false);
      setServiceForm({ serviceName: '', serviceCategory: 'TAXATION', billingFrequency: 'MONTHLY', feeAmount: '' });
      fetchClientDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to add service');
    }
  };

  const handleRemoveService = async (serviceId) => {
    if (!window.confirm('Remove this subscribed service from client?')) return;
    try {
      await firmAdminService.removeClientService(clientId, serviceId);
      toast.success('Subscribed service removed');
      fetchClientDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to remove service');
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!docForm.documentName.trim() || !docForm.fileUrl.trim()) {
      toast.error('Document name and file URL are required');
      return;
    }
    try {
      await firmAdminService.addClientDocument(clientId, docForm);
      toast.success('Master document added!');
      setIsAddingDoc(false);
      setDocForm({ documentName: '', documentType: 'GST_CERTIFICATE', fileUrl: '' });
      fetchClientDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to add document');
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Delete this master document?')) return;
    try {
      await firmAdminService.deleteClientDocument(clientId, docId);
      toast.success('Document deleted');
      fetchClientDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to delete document');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Header Bar */}
          <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/20">
                {client?.companyName?.[0] || client?.clientName?.[0] || 'C'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
                    {client?.companyName || client?.clientName}
                  </h2>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                    {client?.clientType || 'CLIENT'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      client?.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {client?.status || 'ACTIVE'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                  <span>Client ID: #{client?.id}</span>
                  <span>•</span>
                  <span>{client?.email}</span>
                  {client?.phone && (
                    <>
                      <span>•</span>
                      <span>{client?.phone}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Tab Navigation Header */}
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiBriefcase className="w-4 h-4" />
              <span>Profile & Tax Info</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'services'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiLayers className="w-4 h-4" />
              <span>Services Subscribed ({client?.services?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'billing'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiDollarSign className="w-4 h-4" />
              <span>Billing & Financials</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'documents'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiFolder className="w-4 h-4" />
              <span>Master Documents ({client?.documents?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiClock className="w-4 h-4" />
              <span>Activity History ({client?.activityLogs?.length || 0})</span>
            </button>
          </div>

          {/* Modal Tab Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-500">Loading master details...</div>
            ) : !client ? (
              <div className="p-12 text-center text-sm text-rose-400">Client details not found</div>
            ) : (
              <>
                {/* TAB 1: Profile & Tax Info */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Tax Registration Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          GST Number (GSTIN)
                        </span>
                        <p className="text-sm font-extrabold text-indigo-400 tracking-wider">
                          {client.gstNumber || 'Not Registered'}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          PAN Number
                        </span>
                        <p className="text-sm font-extrabold text-purple-400 tracking-wider">
                          {client.panNumber || 'N/A'}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          TAN Number (TDS)
                        </span>
                        <p className="text-sm font-extrabold text-emerald-400 tracking-wider">
                          {client.tanNumber || 'N/A'}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          CIN Number (ROC)
                        </span>
                        <p className="text-sm font-extrabold text-amber-400 tracking-wider">
                          {client.cinNumber || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Company & Primary Contact Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: Company Details */}
                      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                        <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                          <FiBriefcase className="text-indigo-400" />
                          <span>Company & Organization Details</span>
                        </h4>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400">Client Name:</span>
                            <p className="font-semibold text-slate-200">{client.clientName}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Company Legal Name:</span>
                            <p className="font-semibold text-slate-200">{client.companyName || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Business / Constitution:</span>
                            <p className="font-semibold text-slate-200">{client.businessType || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Industry Category:</span>
                            <p className="font-semibold text-slate-200">{client.industryCategory || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Phone:</span>
                            <p className="font-semibold text-slate-200">{client.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Alternate Phone:</span>
                            <p className="font-semibold text-slate-200">{client.alternatePhone || 'N/A'}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400">Website:</span>
                            <p className="font-semibold text-indigo-400 truncate">
                              {client.website ? (
                                <a href={client.website} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                                  {client.website} <FiExternalLink />
                                </a>
                              ) : (
                                'N/A'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Primary Contact Person */}
                      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                        <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                          <FiUser className="text-purple-400" />
                          <span>Primary Contact Person</span>
                        </h4>

                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="text-slate-400">Full Name:</span>
                            <p className="font-bold text-slate-100 text-sm">{client.contactPersonName || 'Not specified'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-slate-400">Designation:</span>
                              <p className="font-semibold text-slate-200">{client.contactPersonDesignation || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">Mobile / Phone:</span>
                              <p className="font-semibold text-slate-200">{client.contactPersonPhone || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400">Email Address:</span>
                            <p className="font-semibold text-purple-300">{client.contactPersonEmail || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Registered Address */}
                        <div className="pt-3 border-t border-slate-800 space-y-1 text-xs">
                          <span className="text-slate-400 flex items-center gap-1">
                            <FiMapPin className="text-rose-400" />
                            <span>Registered Office Address:</span>
                          </span>
                          <p className="font-semibold text-slate-200">
                            {client.address || 'No address specified'}
                            {client.city ? `, ${client.city}` : ''}
                            {client.state ? `, ${client.state}` : ''}
                            {client.pincode ? ` - ${client.pincode}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Auditors Card */}
                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <FiShield className="text-emerald-400" />
                        <span>Dedicated Staff Accountants & Auditors</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {client.assignments?.map((a) => (
                          <div key={a.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                              {a.user?.firstName?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-100">{a.user?.firstName} {a.user?.lastName}</p>
                              <span className="text-[10px] text-slate-400">{a.user?.designation || 'CA Staff'}</span>
                            </div>
                          </div>
                        ))}

                        {(!client.assignments || client.assignments.length === 0) && (
                          <p className="text-xs text-slate-500 col-span-3">No staff members currently paired with this client.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Services Subscribed */}
                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-200">Enrolled CA Services & Engagement Terms</h4>
                      <button
                        onClick={() => setIsAddingService(true)}
                        className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <FiPlus />
                        <span>Add Subscribed Service</span>
                      </button>
                    </div>

                    {/* Add Service Form */}
                    {isAddingService && (
                      <form onSubmit={handleAddService} className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-4">
                        <h5 className="text-xs font-bold text-purple-300 uppercase tracking-wider">New Client Service Details</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="Service Name (e.g. Monthly GST Filing)"
                            value={serviceForm.serviceName}
                            onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
                            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          />

                          <select
                            value={serviceForm.serviceCategory}
                            onChange={(e) => setServiceForm({ ...serviceForm, serviceCategory: e.target.value })}
                            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          >
                            <option value="TAXATION">TAXATION (GST / IT)</option>
                            <option value="AUDIT">STATUTORY AUDIT</option>
                            <option value="COMPLIANCE">ROC / SECRETARIAL</option>
                            <option value="BOOKKEEPING">BOOKKEEPING / PAYROLL</option>
                            <option value="CONSULTING">CONSULTING</option>
                          </select>

                          <select
                            value={serviceForm.billingFrequency}
                            onChange={(e) => setServiceForm({ ...serviceForm, billingFrequency: e.target.value })}
                            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          >
                            <option value="MONTHLY">MONTHLY</option>
                            <option value="QUARTERLY">QUARTERLY</option>
                            <option value="ANNUALLY">ANNUALLY</option>
                            <option value="ONE_TIME">ONE-TIME</option>
                          </select>

                          <input
                            type="number"
                            placeholder="Fee Amount (₹)"
                            value={serviceForm.feeAmount}
                            onChange={(e) => setServiceForm({ ...serviceForm, feeAmount: e.target.value })}
                            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingService(false)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                          >
                            Save Service
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Services Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-800">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                          <tr>
                            <th className="py-3 px-4">Service Name</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Billing Cycle</th>
                            <th className="py-3 px-4">Fee Amount</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {client.services?.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-800/30">
                              <td className="py-3.5 px-4 font-bold text-slate-100">{s.serviceName}</td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-400 font-semibold">
                                  {s.serviceCategory}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-300">{s.billingFrequency}</td>
                              <td className="py-3.5 px-4 font-bold text-emerald-400">₹{s.feeAmount?.toLocaleString()}</td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                                  {s.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => handleRemoveService(s.id)}
                                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                                >
                                  <FiTrash2 />
                                </button>
                              </td>
                            </tr>
                          ))}

                          {(!client.services || client.services.length === 0) && (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-500">
                                No subscribed CA services added yet. Click "Add Subscribed Service" above.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: Billing & Financials */}
                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Outstanding Balance
                        </span>
                        <p className="text-2xl font-extrabold text-rose-400">
                          ₹{client.outstandingBalance?.toLocaleString() || 0}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Payment Terms
                        </span>
                        <p className="text-lg font-bold text-slate-200">{client.paymentTerms || 'NET_30'}</p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Tax Registration Type
                        </span>
                        <p className="text-lg font-bold text-indigo-400">{client.taxRegistrationType || 'REGULAR'}</p>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <h4 className="text-sm font-bold text-slate-200">Billing Address & Notes</h4>
                      <div className="text-xs space-y-2">
                        <div>
                          <span className="text-slate-400">Billing Address:</span>
                          <p className="font-semibold text-slate-200">{client.billingAddress || client.address || 'Same as registered address'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Billing Notes / Fee Agreements:</span>
                          <p className="font-semibold text-slate-300">{client.billingNotes || 'No specific notes recorded'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: Master Documents */}
                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-200">Client Master Legal & Tax Documents Repository</h4>
                      <button
                        onClick={() => setIsAddingDoc(true)}
                        className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <FiPlus />
                        <span>Add Document Record</span>
                      </button>
                    </div>

                    {/* Add Document Form */}
                    {isAddingDoc && (
                      <form onSubmit={handleAddDocument} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
                        <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">New Master Document</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="Document Name (e.g. GST Registration Certificate)"
                            value={docForm.documentName}
                            onChange={(e) => setDocForm({ ...docForm, documentName: e.target.value })}
                            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                          />

                          <select
                            value={docForm.documentType}
                            onChange={(e) => setDocForm({ ...docForm, documentType: e.target.value })}
                            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                          >
                            <option value="GST_CERTIFICATE">GST CERTIFICATE</option>
                            <option value="PAN_CARD">PAN CARD</option>
                            <option value="INCORPORATION_DEED">INCORPORATION DEED / MOA</option>
                            <option value="BANK_STATEMENT">BANK STATEMENT</option>
                            <option value="AUDIT_REPORT">PAST AUDIT REPORT</option>
                            <option value="OTHER">OTHER</option>
                          </select>

                          <input
                            type="text"
                            required
                            placeholder="File URL / Cloud Drive Link"
                            value={docForm.fileUrl}
                            onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
                            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingDoc(false)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                          >
                            Upload Metadata
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Documents List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {client.documents?.map((doc) => (
                        <div key={doc.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <FiFolder className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-100">{doc.documentName}</h5>
                              <span className="text-[10px] text-amber-400 font-semibold uppercase">{doc.documentType}</span>
                              <p className="text-[10px] text-slate-500 mt-0.5">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-slate-900 text-indigo-400 hover:text-indigo-300"
                              title="View Document"
                            >
                              <FiExternalLink />
                            </a>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 rounded-xl bg-slate-900 text-rose-400 hover:text-rose-300"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      ))}

                      {(!client.documents || client.documents.length === 0) && (
                        <p className="text-xs text-slate-500 col-span-2">No master documents uploaded for this client yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: Client History */}
                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-200">Chronological Client Audit & Activity Timeline</h4>

                    <div className="space-y-3 relative border-l border-slate-800 ml-4 pl-6">
                      {client.activityLogs?.map((log) => (
                        <div key={log.id} className="relative group">
                          <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900" />
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-400">{log.action}</span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(log.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-300">{log.description}</p>
                            <p className="text-[10px] text-slate-500">By {log.performedName || 'System'}</p>
                          </div>
                        </div>
                      ))}

                      {(!client.activityLogs || client.activityLogs.length === 0) && (
                        <p className="text-xs text-slate-500">No historical activity recorded yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
