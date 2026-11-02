import React from 'react';
import { Briefcase, ExternalLink, MapPin, ShieldCheck, User } from 'lucide-react';
import { InfoItem, Section } from './parts';

const TaxId = ({ label, value }) => (
  <div className="rounded-xl border border-line bg-sunken px-4 py-3">
    <p className="text-xs text-subtle">{label}</p>
    <p className={value ? 'mt-1 font-mono text-sm font-medium text-fg tracking-wide break-all' : 'mt-1 text-sm text-subtle'}>{value || 'Not registered'}</p>
  </div>
);

export const ProfileTab = ({ client }) => {
  const address = [client.address, client.city, client.state].filter(Boolean).join(', ') + (client.pincode ? ` - ${client.pincode}` : '');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <TaxId label="GSTIN" value={client.gstNumber} />
        <TaxId label="PAN" value={client.panNumber} />
        <TaxId label="TAN" value={client.tanNumber} />
        <TaxId label="CIN" value={client.cinNumber} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Company" icon={Briefcase}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <InfoItem label="Client name" value={client.clientName} />
            <InfoItem label="Legal name" value={client.companyName} />
            <InfoItem label="Business type" value={client.businessType} />
            <InfoItem label="Industry" value={client.industryCategory} />
            <InfoItem label="Phone" value={client.phone} />
            <InfoItem label="Alternate phone" value={client.alternatePhone} />
            <div className="col-span-2">
              <dt className="text-xs text-subtle">Website</dt>
              <dd className="mt-0.5 text-sm">
                {client.website ? (
                  <a href={client.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent-fg hover:underline break-all">
                    {client.website} <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-subtle">Not added</span>
                )}
              </dd>
            </div>
          </dl>
        </Section>

        <Section title="Primary contact" icon={User}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <InfoItem label="Name" value={client.contactPersonName} className="col-span-2" />
            <InfoItem label="Designation" value={client.contactPersonDesignation} />
            <InfoItem label="Phone" value={client.contactPersonPhone} />
            <InfoItem label="Email" value={client.contactPersonEmail} className="col-span-2" />
          </dl>
          <div className="mt-4 pt-4 border-t border-line flex gap-2 text-sm">
            <MapPin className="w-4 h-4 text-subtle shrink-0 mt-0.5" aria-hidden="true" />
            <span className={client.address ? 'text-fg' : 'text-subtle'}>{client.address ? address : 'No registered address'}</span>
          </div>
        </Section>
      </div>

      <Section title="Assigned team" icon={ShieldCheck}>
        {client.assignments?.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {client.assignments.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-success-soft text-success text-xs font-semibold">
                  {a.user?.firstName?.[0] || 'U'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-fg truncate">{a.user?.firstName} {a.user?.lastName}</p>
                  <p className="text-xs text-subtle truncate">{a.user?.designation || 'Staff'}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No one is assigned to this client yet.</p>
        )}
      </Section>
    </div>
  );
};
