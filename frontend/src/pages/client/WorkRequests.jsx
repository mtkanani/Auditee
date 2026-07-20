import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { FileUpload } from '../../components/common/FileUpload';
import { useForm } from 'react-hook-form';
import { FiSend, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { clientService } from '../../services/clientService';
import { useNavigate } from 'react-router-dom';

export const WorkRequests = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        attachment: selectedFile ? selectedFile.name : undefined,
      };
      await clientService.createTask(payload);
      toast.success('Work request submitted successfully to your CA firm!');
      reset();
      setSelectedFile(null);
      navigate('/client/tasks');
    } catch (error) {
      toast.error(error.message || 'Failed to submit work request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Create Work Request"
        subtitle="Submit audit, GST filing, TDS, or tax consulting requests to your CA firm staff"
      />

      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Request Title / Service Name</label>
            <input
              type="text"
              {...register('title', { required: 'Request title is required' })}
              placeholder="e.g., GST Return Filing for Q2 / Income Tax Audit Document Review"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Detailed Description</label>
            <textarea
              rows={4}
              {...register('description', { required: 'Description is required' })}
              placeholder="Provide context, invoice numbers, or specific requirements for your CA team..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">Priority Level</label>
              <select
                {...register('priority')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">Desired Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Attach Invoices / Financial Records</label>
            <FileUpload onFileSelect={setSelectedFile} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            <FiSend className="w-4 h-4" />
            <span>{isLoading ? 'Submitting Request...' : 'Submit Work Request'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
