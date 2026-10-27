import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  useClientDetail,
  useAddClientService,
  useRemoveClientService,
  useAddClientDocument,
  useDeleteClientDocument,
} from '../../../queries/useClients';
import { useConfirm } from '../../common/ConfirmProvider';

export const useClientDetailModal = ({ clientId, isOpen, onRefresh }) => {
  const confirm = useConfirm();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'services' | 'billing' | 'documents' | 'history'

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

  const { client, isLoading, error } = useClientDetail(clientId, { enabled: isOpen });

  const addServiceMutation = useAddClientService();
  const removeServiceMutation = useRemoveClientService();
  const addDocMutation = useAddClientDocument();
  const deleteDocMutation = useDeleteClientDocument();

  useEffect(() => {
    if (error) {
      toast.error('Failed to load client master details');
    }
  }, [error]);

  const handleAddService = (e) => {
    e.preventDefault();
    if (!serviceForm.serviceName.trim()) {
      toast.error('Please enter a service name');
      return;
    }
    addServiceMutation.mutate(
      { clientId, serviceData: serviceForm },
      {
        onSuccess: () => {
          setIsAddingService(false);
          setServiceForm({ serviceName: '', serviceCategory: 'TAXATION', billingFrequency: 'MONTHLY', feeAmount: '' });
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  const handleRemoveService = async (serviceId) => {
    const ok = await confirm({
      title: 'Remove Service',
      message: 'Remove this subscribed service from client?',
      confirmText: 'Remove',
      isDanger: true,
    });
    if (!ok) return;
    removeServiceMutation.mutate(
      { clientId, serviceId },
      {
        onSuccess: () => {
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!docForm.documentName.trim() || !docForm.fileUrl.trim()) {
      toast.error('Document name and file URL are required');
      return;
    }
    addDocMutation.mutate(
      { clientId, docData: docForm },
      {
        onSuccess: () => {
          setIsAddingDoc(false);
          setDocForm({ documentName: '', documentType: 'GST_CERTIFICATE', fileUrl: '' });
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  const handleDeleteDocument = async (docId) => {
    const ok = await confirm({
      title: 'Delete Document',
      message: 'Delete this master document?',
      confirmText: 'Delete',
      isDanger: true,
    });
    if (!ok) return;
    deleteDocMutation.mutate(
      { clientId, documentId: docId },
      {
        onSuccess: () => {
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  return {
    activeTab,
    setActiveTab,
    isAddingService,
    setIsAddingService,
    serviceForm,
    setServiceForm,
    isAddingDoc,
    setIsAddingDoc,
    docForm,
    setDocForm,
    client,
    isLoading,
    handleAddService,
    handleRemoveService,
    handleAddDocument,
    handleDeleteDocument,
  };
};
