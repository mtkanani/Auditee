import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import FirmForm from '../../components/FirmManagement/FirmForm';
import { useFirm } from '../../hooks/useFirm';

const EditFirm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getFirmById, updateFirm, loading, currentFirm } = useFirm();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const loadFirmDetails = async () => {
      try {
        const data = await getFirmById(id);
        if (data) {
          // Map backend response structure to the format required by the Form component
          setFormData({
            firm: {
              firmName: data.firmName || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              country: data.country || 'India',
              pincode: data.pincode || '',
            },
            firmAdmin: {
              firstName: data.firmAdmin?.firstName || '',
              lastName: data.firmAdmin?.lastName || '',
              email: data.firmAdmin?.email || '',
              phone: data.firmAdmin?.phone || '',
            },
          });
        }
      } catch (err) {
        console.error('Failed to load firm details:', err);
      }
    };

    if (id) {
      loadFirmDetails();
    }
  }, [id, getFirmById]);

  const handleFormSubmit = async (firmData, adminData) => {
    try {
      const success = await updateFirm(id, firmData, adminData);
      if (success) {
        navigate('/admin/firms');
      }
    } catch (e) {
      console.error('Failed to update firm:', e);
    }
  };

  return (
    <DashboardLayout title="Edit Firm">
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 font-semibold tracking-wide">
          <span className="hover:text-slate-350 cursor-pointer" onClick={() => navigate('/profile')}>Dashboard</span>
          <span className="mx-2 text-slate-700">/</span>
          <span className="hover:text-slate-350 cursor-pointer" onClick={() => navigate('/admin/firms')}>Firm Management</span>
          <span className="mx-2 text-slate-700">/</span>
          <span className="text-slate-300">Edit Firm</span>
        </nav>

        {/* Heading */}
        <div className="pb-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Edit Firm Details</h2>
          <p className="text-xs text-slate-400 mt-1">
            Update general details or change administrative credentials for{' '}
            <strong className="text-brand-400 font-bold">{currentFirm?.firmName}</strong>.
          </p>
        </div>

        {/* Loader or Form */}
        {loading || !formData ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-slate-800 rounded-2xl">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs text-slate-400 font-medium">Fetching details...</span>
          </div>
        ) : (
          <FirmForm
            onSubmit={handleFormSubmit}
            onCancel={() => navigate('/admin/firms')}
            defaultValues={formData}
            isEdit={true}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditFirm;
