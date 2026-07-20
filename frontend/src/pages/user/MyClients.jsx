import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FiBriefcase, FiMail, FiPhone, FiMapPin, FiFileText } from 'react-icons/fi';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export const MyClients = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await userService.getClients();
        setClients(res.data || res.clients || []);
      } catch (error) {
        toast.error('Failed to load assigned clients');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter(
    (c) =>
      c.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assigned Clients"
        subtitle="View contact details and company profiles for your assigned CA clients"
      />

      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <SearchBar value={search} onChange={setSearch} placeholder="Search assigned clients..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-indigo-500/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FiBriefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">{client.clientName}</h4>
                  <p className="text-xs text-slate-400">{client.companyName || 'Corporate Client'}</p>
                </div>
              </div>
              <StatusBadge status={client.status || 'ACTIVE'} />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <FiMail className="text-slate-500" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-slate-500" />
                <span>{client.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiFileText className="text-slate-500" />
                <span>GST: {client.gstNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-slate-500" />
                <span>{client.city || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
