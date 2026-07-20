import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { FiBriefcase, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { clientService } from '../../services/clientService';

export const ClientProfile = () => {
  const { user, updateUserState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        clientName: user.clientName || user.name || '',
        companyName: user.companyName || '',
        phone: user.phone || '',
        city: user.city || '',
        gstNumber: user.gstNumber || '',
        businessType: user.businessType || '',
      });
    }
  }, [user, reset]);

  const onUpdateProfile = async (data) => {
    setIsLoading(true);
    try {
      await clientService.updateProfile(data);
      updateUserState(data);
      toast.success('Client profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Client Profile & Settings"
        subtitle="Manage company GST information, business registration details, and contact numbers"
      />

      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
          <FiBriefcase className="text-indigo-400" />
          <span>Company Profile Details</span>
        </h3>

        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name</label>
              <input
                type="text"
                {...register('clientName', { required: true })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                {...register('companyName')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GST Number</label>
              <input
                type="text"
                {...register('gstNumber')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type</label>
              <input
                type="text"
                {...register('businessType')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                {...register('phone')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                {...register('city')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
