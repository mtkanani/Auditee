import React from 'react';
import { Briefcase, Clock, Folder, IndianRupee, Layers } from 'lucide-react';
import { Tabs } from '../../ui';

export const DetailTabs = ({ activeTab, setActiveTab, client }) => (
  <Tabs
    variant="underline"
    aria-label="Client sections"
    value={activeTab}
    onChange={setActiveTab}
    className="px-6"
    items={[
      { value: 'profile', label: 'Profile', icon: Briefcase },
      { value: 'services', label: 'Services', icon: Layers, count: client?.services?.length || 0 },
      { value: 'billing', label: 'Billing', icon: IndianRupee },
      { value: 'documents', label: 'Documents', icon: Folder, count: client?.documents?.length || 0 },
      { value: 'history', label: 'History', icon: Clock, count: client?.activityLogs?.length || 0 },
    ]}
  />
);
