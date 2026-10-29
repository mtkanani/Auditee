import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useFirmClients } from '../../../queries/useLookups';
import { useCreateInvoice } from '../../../queries/useInvoices';

export const useInvoiceForm = ({ isOpen, onClose, onSuccess }) => {
  const [clientId, setClientId] = useState('');
  const [invoiceType, setInvoiceType] = useState('TAX_INVOICE');
  const [dueDate, setDueDate] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('24-GUJARAT');
  const [isInterState, setIsInterState] = useState(false);
  const [notes, setNotes] = useState('Thank you for your business.');
  const [terms, setTerms] = useState('Payment due within 15 days of invoice issue.');

  const { data: clients = [] } = useFirmClients({ limit: 100 }, { enabled: isOpen });
  const createInvoiceMutation = useCreateInvoice();

  // Line items state
  const [items, setItems] = useState([
    { description: 'Statutory Tax Audit & Form 3CD Filing Services', sacCode: '998231', quantity: 1, unitPrice: '15000', gstRate: 18 },
  ]);

  useEffect(() => {
    if (isOpen) {
      // Default due date: 15 days from today
      const target = new Date();
      target.setDate(target.getDate() + 15);
      setDueDate(target.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'GST Return Filing (GSTR-3B & GSTR-1)', sacCode: '998222', quantity: 1, unitPrice: '2500', gstRate: 18 },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Live Math Calculations
  const subTotal = items.reduce((acc, curr) => acc + (Number(curr.quantity || 1) * Number(curr.unitPrice || 0)), 0);
  const cgstAmount = isInterState ? 0 : subTotal * 0.09;
  const sgstAmount = isInterState ? 0 : subTotal * 0.09;
  const igstAmount = isInterState ? subTotal * 0.18 : 0;
  const totalAmount = subTotal + cgstAmount + sgstAmount + igstAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientId) {
      toast.error('Please select a client');
      return;
    }
    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    const payload = {
      clientId: parseInt(clientId, 10),
      invoiceType,
      dueDate,
      placeOfSupply,
      isInterState,
      items,
      notes,
      terms,
    };

    createInvoiceMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
        if (onSuccess) onSuccess();
      },
    });
  };

  return {
    clients,
    clientId, setClientId,
    invoiceType, setInvoiceType,
    dueDate, setDueDate,
    placeOfSupply, setPlaceOfSupply,
    isInterState, setIsInterState,
    notes, setNotes,
    terms, setTerms,
    items, handleAddItem, handleRemoveItem, handleItemChange,
    subTotal, cgstAmount, sgstAmount, igstAmount, totalAmount,
    handleSubmit,
    createInvoiceMutation,
  };
};
