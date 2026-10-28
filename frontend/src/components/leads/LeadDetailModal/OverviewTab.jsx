import React from 'react';
import { Contact, NotebookPen } from 'lucide-react';
import { InfoItem, Section } from '../../clients/ClientDetailModal/parts';

export const OverviewTab = ({ lead }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Section title="Contact and business" icon={Contact}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
        <InfoItem label="Name" value={lead.leadName} />
        <InfoItem label="Company" value={lead.companyName} />
        <InfoItem label="Business type" value={lead.businessType} />
        <InfoItem label="Phone" value={lead.phone} />
        <InfoItem label="Email" value={lead.email} className="col-span-2" />
        <InfoItem label="GSTIN / PAN" value={lead.gstNumber || lead.panNumber} mono className="col-span-2" />
      </dl>
    </Section>

    <Section title="What they need" icon={NotebookPen}>
      <dl className="space-y-4">
        <div>
          <dt className="text-xs text-subtle">Interested in</dt>
          <dd className="mt-1 text-sm text-fg">{lead.interestedServices || 'General Audit & Compliance Services'}</dd>
        </div>
        <div>
          <dt className="text-xs text-subtle">Notes</dt>
          <dd className="mt-1 text-sm text-muted whitespace-pre-line">{lead.notes || 'No specific notes recorded for this lead.'}</dd>
        </div>
      </dl>
    </Section>
  </div>
);
