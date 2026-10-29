import React from 'react';
import { Calendar, FileText, Phone, User } from 'lucide-react';
import { Tabs } from '../../ui';

export const LeadTabs = ({ lead, activeTab, setActiveTab }) => (
  <Tabs
    variant="underline"
    aria-label="Lead sections"
    value={activeTab}
    onChange={setActiveTab}
    className="px-6"
    items={[
      { value: 'overview', label: 'Overview', icon: User },
      { value: 'calls', label: 'Calls', icon: Phone, count: lead?.callLogs?.length || 0 },
      { value: 'meetings', label: 'Meetings', icon: Calendar, count: lead?.meetingNotes?.length || 0 },
      { value: 'proposals', label: 'Proposals', icon: FileText, count: lead?.proposals?.length || 0 },
    ]}
  />
);
