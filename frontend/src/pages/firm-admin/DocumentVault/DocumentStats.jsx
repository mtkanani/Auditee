import React from 'react';
import { FolderOpen, Landmark, Lock, Receipt } from 'lucide-react';
import { StatCard } from '../../../components/ui';

/** Server-side counts. GST and income tax cards filter the list to that category. */
export const DocumentStats = ({ stats, setCategory }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
    <StatCard label="All documents" value={stats.total} icon={FolderOpen} onClick={() => setCategory('ALL')} />
    <StatCard label="GST filings" value={stats.gst} icon={Receipt} tone="success" onClick={() => setCategory('GST_FILINGS')} />
    <StatCard label="Income tax" value={stats.tax} icon={Landmark} tone="warning" onClick={() => setCategory('INCOME_TAX')} />
    <StatCard label="Confidential" value={stats.confidential} icon={Lock} tone="danger" />
  </div>
);
