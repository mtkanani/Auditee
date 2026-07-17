import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import FirmForm from '../../components/FirmManagement/FirmForm';
import { useFirm } from '../../hooks/useFirm';

const CreateFirm = () => {
  const navigate = useNavigate();
  const { createFirm } = useFirm();

  const handleFormSubmit = async (firmData, adminData) => {
    try {
      await createFirm(firmData, adminData);
      navigate('/admin/firms');
    } catch (e) {
      console.error('Failed to create firm:', e);
    }
  };

  return (
    <DashboardLayout title="Create Firm">
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 font-semibold tracking-wide">
          <span className="hover:text-slate-350 cursor-pointer" onClick={() => navigate('/profile')}>Dashboard</span>
          <span className="mx-2 text-slate-700">/</span>
          <span className="hover:text-slate-350 cursor-pointer" onClick={() => navigate('/admin/firms')}>Firm Management</span>
          <span className="mx-2 text-slate-700">/</span>
          <span className="text-slate-300">Add Firm</span>
        </nav>

        {/* Heading */}
        <div className="pb-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create New Firm</h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in the details below to provision a new Firm workspace and configure its primary Administrator user.
          </p>
        </div>

        {/* Form */}
        <FirmForm
          onSubmit={handleFormSubmit}
          onCancel={() => navigate('/admin/firms')}
          isEdit={false}
        />
      </div>
    </DashboardLayout>
  );
};

export default CreateFirm;
